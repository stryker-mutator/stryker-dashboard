import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserService } from './user.service';

describe('RepositoryService', () => {
  let userService: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    userService = TestBed.get(UserService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });

  describe('login()', () => {

    it('should return an Observable<Login>', () => {
      const mockedLogin = {
        name: 'stryker-mutator',
        avatarUrl: 'https://avatars0.githubusercontent.com/u/18347996'
      };

      userService.login().subscribe((login) => {
        expect(login).toBeTruthy();
      });

      const userRequest = httpMock.expectOne('api/user');
      userRequest.flush(JSON.stringify(mockedLogin));
      httpMock.verify();
    });

  });

});
