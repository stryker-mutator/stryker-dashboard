import { TestBed, inject } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { RepositoryService } from './repository.service';

describe('RepositoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        { provide: XHRBackend, useClass: MockBackend },
        RepositoryService
      ]
    });
  });

  it('should be created', inject([RepositoryService], (service) => {
    expect(service).toBeTruthy();
  }));

  describe('getRepositories()', () => {

    it('should return an Observable<Array<Repository>>', 
      inject([RepositoryService, XHRBackend], (service, mockBackend) => {
        const mockedRepositories = [
          { id: 1, fullName: 'My first amazing repo' },
          { id: 2, fullName: 'Another great repo' },
          { id: 3, fullName: 'Repo repo repo' },
          { id: 4, fullName: 'Yet another repo' },
          { id: 5, fullName: 'The last of the repos' }
        ];

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockedRepositories)
          })));
        });

        service.getRepositories().subscribe((repositories) => {
          expect(repositories.length).toBeGreaterThan(0);
        });
      })
    );

  });

});
