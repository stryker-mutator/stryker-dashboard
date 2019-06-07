import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RepositoryService } from './repository.service';
import { EnableRepositoryResponse } from 'stryker-dashboard-website-contract';
import { Type } from '@angular/core';

describe('RepositoryService', () => {
  let repositoryService: RepositoryService;
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
      providers: [RepositoryService]
    });
    repositoryService = TestBed.get(RepositoryService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(repositoryService).toBeTruthy();
  });

  describe('enableRepositories()', () => {

    it('should send a PATCH request with enabled = false', () => {
      repositoryService.enableRepository(mockedRepositories[0].slug, false)
        .subscribe(response => expect(response).toBeNull());
      const request = httpMock.expectOne('api/repositories/github/stryker-mutator/stryker-badge');
      expect(request.request.method).toBe('PATCH');
      request.flush(null);
      httpMock.verify();
    });

    it('should send a PATCH request with enabled = true', () => {
      repositoryService.enableRepository(mockedRepositories[0].slug, true)
        .subscribe((response: EnableRepositoryResponse) => {
          expect(response).toBeTruthy();
          expect(response.apiKey).toBe('my-super-secret-api-key');
        });
      const request = httpMock.expectOne('api/repositories/github/stryker-mutator/stryker-badge');
      expect(request.request.method).toBe('PATCH');
      request.flush({ apiKey: 'my-super-secret-api-key' });
      httpMock.verify();
    });

  });

});
