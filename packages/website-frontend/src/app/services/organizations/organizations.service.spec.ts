import { TestBed, inject } from '@angular/core/testing';

import { OrganizationsService } from './organizations.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OrganizationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrganizationsService]
    });
  });

  it('should be created', inject([OrganizationsService], (service: OrganizationsService) => {
    expect(service).toBeTruthy();
  }));
});
