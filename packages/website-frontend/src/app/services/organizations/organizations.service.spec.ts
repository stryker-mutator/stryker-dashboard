import { TestBed, inject } from '@angular/core/testing';

import { OrganizationsService } from './organizations.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('OrganizationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [OrganizationsService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
  });

  it('should be created', inject([OrganizationsService], (service: OrganizationsService) => {
    expect(service).toBeTruthy();
  }));
});
