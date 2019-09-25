import { AuthService } from './auth.service';
import { JasmineMock, mock } from '../testHelpers/mock.spec';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { SessionStorage } from '../shared/services/session-storage.service';
import { first, take, toArray } from 'rxjs/operators';

const AUTH_TOKEN_KEY = 'authToken';
describe(AuthService.name, () => {

  let httpMock: JasmineMock<HttpClient>;
  let sessionMock: SessionStorage;
  let sut: AuthService;

  beforeEach(() => {
    httpMock = mock(HttpClient);
    const store: { [key: string]: string | null } = {};
    sessionMock = {
      getItem: jasmine.createSpy().and.callFake((item: string) => store[item]),
      setItem: jasmine.createSpy().and.callFake((item: string, value: string) => store[item] = value),
      removeItem: jasmine.createSpy().and.callFake((item: string) => store[item] = null),
    };
    sut = new AuthService(httpMock, sessionMock);
  });

  describe('currentUser$', () => {

    it('should return null if there is no bearer token in session storage', async () => {
      // Act
      const actualUser = await sut.currentUser$.pipe(first()).toPromise();

      // Assert
      expect(actualUser).toBe(null);
      expect(httpMock.get).toHaveBeenCalledTimes(0);
    });

    it('should be shared across multiple consumers', async () => {
      // Arrange
      sessionMock.setItem(AUTH_TOKEN_KEY, 'jwt');
      httpMock.get.and.returnValue(of({
        name: 'stryker-mutator'
      }));

      // Act
      const actualUser = await sut.currentUser$.pipe(first()).toPromise();
      const actualSecond = await sut.currentUser$.pipe(first()).toPromise();

      // Assert
      expect(actualUser).toBe(actualSecond);
      expect(httpMock.get).toHaveBeenCalledTimes(1);
    });

    it('should provide `null` when the server responds with a 401', async () => {
      // Arrange
      sessionMock.setItem(AUTH_TOKEN_KEY, 'jwt');
      httpMock.get.and.callFake(() => { throw new HttpErrorResponse({ status: 401 }); });

      // Act
      const actualUser = await sut.currentUser$.pipe(first()).toPromise();

      // Assert
      expect(actualUser).toBe(null);
    });
  });

  describe(AuthService.prototype.authenticate.name, () => {
    const expectedLogin = Object.freeze({
      name: 'stryker-mutator',
      avatarUrl: 'https://avatars0.githubusercontent.com/u/18347996'
    });
    const expectedJwt = 'expectedJwtValue';

    beforeEach(() => {
      httpMock.get.and.returnValue(of(expectedLogin));
      httpMock.post.and.returnValue(of({ jwt: expectedJwt }));
    });

    it('should authorize the user', async () => {
      // Act
      await sut.authenticate('fooProvider', 'barCode');

      // Assert
      expect(httpMock.post).toHaveBeenCalledWith('/api/auth/fooProvider?code=barCode', undefined);
    });

    it('should set the jwt in session storage', async () => {
      // Act
      await sut.authenticate('fooProvider', 'barCode');

      // Assert
      expect(sessionMock.setItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY, expectedJwt);
    });

    it('should retrieve the login', async () => {
      // Act
      const actualLogin = await sut.authenticate('provider', 'code');

      // Assert
      expect(actualLogin).toBe(expectedLogin);
      expect(httpMock.get).toHaveBeenCalledWith('api/user');
    });
  });

  describe(AuthService.prototype.logOut.name, () => {
    it('should clear session and provide a `null` as currentUser', async () => {
      // Arrange
      const actualUsersAsPromised = sut.currentUser$.pipe(take(2), toArray()).toPromise();

      // Act
      sut.logOut();
      const actualUsers = await actualUsersAsPromised;

      // Assert
      expect(sessionMock.removeItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY);
      expect(actualUsers).toEqual([null, null]);
    });
  });
});

