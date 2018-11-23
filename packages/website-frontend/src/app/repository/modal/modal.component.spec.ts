import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';

import { RepositoryModalComponent } from './modal.component';
import { RepositoryComponent } from '../repository.component';
import { RepositoryService } from '../repository.service';
import { EnableRepositoryResponse } from 'stryker-dashboard-website-contract';

class RepositoryServiceStub {
  public enableRepository(): Observable<EnableRepositoryResponse> {
    return of();
  }
}

describe('RepositoryModalComponent', () => {

  let fixture: ComponentFixture<RepositoryModalComponent>;
  let component: RepositoryModalComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RepositoryModalComponent,
        RepositoryComponent
      ],
      imports: [NgbModule],
      providers: [
        { provide: RepositoryService, useClass: RepositoryServiceStub }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(RepositoryModalComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
