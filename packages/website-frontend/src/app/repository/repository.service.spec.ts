import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RepositoryService } from './repository.service';

describe('RepositoryService', () => {
  let repositoryService: RepositoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ RepositoryService ]
    });
    repositoryService = TestBed.get(RepositoryService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(repositoryService).toBeTruthy();
  });

  describe('getRepositories()', () => {

    it('should return an Observable<Repository[]>', () => {
      const mockedRepositories = [
        {
          slug: 'stryker-mutator/stryker-badge',
          origin: 'https://www.github.com',
          owner: 'stryker-mutator',
          name: 'stryker-badge',
          enabled: true
        }, {
          slug: 'stryker-mutator/stryker',
          origin: 'https://www.github.com',
          owner: 'stryker-mutator',
          name: 'stryker',
          enabled: true
        }, {
          slug: 'stryker-mutator/stryker-jest-runner',
          origin: 'https://www.github.com',
          owner: 'stryker-mutator',
          name: 'stryker-jest-runner',
          enabled: false
        }
      ];
      
      repositoryService.getRepositories().subscribe((repositories) => {
        expect(repositories.length).toBeGreaterThan(0);
      });

      let repositoriesRequest = httpMock.expectOne('api/user/repositories');
      repositoriesRequest.flush(JSON.stringify(mockedRepositories));
      httpMock.verify();
    });

  });
  
});
