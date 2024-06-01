import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { Repository } from '@stryker-mutator/dashboard-contract';
import { Type } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe(UserService.name, () => {
  let userService: UserService;
  let httpMock: HttpTestingController;

  const mockedRepositories = [
    {
      slug: 'github/stryker-mutator/stryker-badge',
      origin: 'https://www.github.com',
      owner: 'stryker-mutator',
      name: 'stryker-badge',
      enabled: true,
    },
    {
      slug: 'github/stryker-mutator/stryker',
      origin: 'https://www.github.com',
      owner: 'stryker-mutator',
      name: 'stryker',
      enabled: true,
    },
    {
      slug: 'github/stryker-mutator/stryker-jest-runner',
      origin: 'https://www.github.com',
      owner: 'stryker-mutator',
      name: 'stryker-jest-runner',
      enabled: false,
    },
  ];
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [UserService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    userService = TestBed.inject(UserService as Type<UserService>);
    httpMock = TestBed.inject(
      HttpTestingController as Type<HttpTestingController>
    );
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
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
