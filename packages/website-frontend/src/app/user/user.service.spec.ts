import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { Repository } from 'stryker-dashboard-website-contract';

describe('RepositoryService', () => {
  let userService: UserService;
  let httpMock: HttpTestingController;

  const mockedRepositories = [
    {
      slug: 'github/stryker-mutator/stryker-badge',
      origin: 'https://www.github.com',
      owner: 'stryker-mutator',
      name: 'stryker-badge',
      enabled: true
    }, {
      slug: 'github/stryker-mutator/stryker',
      origin: 'https://www.github.com',
      owner: 'stryker-mutator',
      name: 'stryker',
      enabled: true
    }, {
      slug: 'github/stryker-mutator/stryker-jest-runner',
      origin: 'https://www.github.com',
      owner: 'stryker-mutator',
      name: 'stryker-jest-runner',
      enabled: false
    }
  ];
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

      userService.currentUser.subscribe((login) => {
        expect(login).toBeTruthy();
      });

      const userRequest = httpMock.expectOne('api/user');
      userRequest.flush(JSON.stringify(mockedLogin));
      httpMock.verify();
    });

  });

  describe('getRepositories()', () => {

    it('should send a GET request to /api/user/repositories and return an Observable<Repository[]>', () => {
      userService.getRepositories().subscribe((repositories: Repository[]) => {
        expect(repositories.length).toBe(3);
      });
      const request = httpMock.expectOne('api/user/repositories');
      expect(request.request.method).toBe('GET');
      request.flush(mockedRepositories);
      httpMock.verify();
    });

  });

});
