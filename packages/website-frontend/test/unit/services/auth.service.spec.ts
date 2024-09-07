import createFetchMock, { FetchMock } from 'vitest-fetch-mock';

import { AuthenticateResponse } from '@stryker-mutator/dashboard-contract';

import { AuthService } from '../../../src/services/auth.service';
import { SessionStorageService } from '../../../src/services/session-storage.service';

describe(AuthService.name, () => {
  let authService: AuthService;
  const sessionStorage = new SessionStorageService();
  let fetchMock: FetchMock;

  beforeEach(() => {
    authService = new AuthService(sessionStorage);

    fetchMock = createFetchMock(vi);
    fetchMock.enableMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should sign out correctly', () => {
    // Arrange
    window.sessionStorage.setItem('authToken', 'token');

    // Act
    authService.signOut();

    // Assert
    expect(authService.currentUser).toBeNull();
    expect(window.sessionStorage.getItem('authToken')).to.eq(null);
  });

  it('should return null for currentBearerToken if no token is stored', () => {
    // Act
    const actual = authService.currentBearerToken;

    // Assert
    expect(actual).toBeNull();
  });

  it('should return the correct token for currentBearerToken if a token is stored', () => {
    // Arrange
    const token = 'test-token';
    sessionStorage.setItem('authToken', token);

    // Act
    const actual = authService.currentBearerToken;

    // Assert
    expect(actual).toBe(token);
  });

  it('should return null for currentUser if no user is stored', () => {
    // Act
    const actual = authService.currentUser;

    // Assert
    expect(actual).toBeNull();
  });

  it('should authenticate and store the token correctly', async () => {
    // Arrange
    const provider = 'test-provider';
    const code = 'test-code';

    const mockJwtResponse: AuthenticateResponse = {
      jwt: 'foo',
    };
    const mockUserResponse = {
      name: 'foo',
      avatarUrl: 'bar',
    };

    fetchMock.once(JSON.stringify(mockJwtResponse)).once(JSON.stringify(mockUserResponse));

    // Act
    await authService.authenticate(provider, code);

    // Assert
    expect(sessionStorage.getItem('authToken')).to.eq('foo');
    expect(authService.currentUser).toEqual(mockUserResponse);
  });
});
