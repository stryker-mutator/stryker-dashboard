import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';

import { RepositoriesComponent } from './repositories.component';
import { RepositoryComponent } from '../repository/repository.component';
import { RepositoryService } from '../repository/repository.service';
import { Repository } from '../../../../website-backend/src/model';

describe('RepositoriesComponent', () => {
  let component: RepositoriesComponent;
  let fixture: ComponentFixture<RepositoriesComponent>;

  const mockRepo1 = { id: 1, fullName: 'My first amazing repo' };
  const mockRepo2 = { id: 2, fullName: 'Another great repo' };
  const mockRepo3 = { id: 3, fullName: 'Repo repo repo' };
  const mockRepo4 = { id: 4, fullName: 'Yet another repo' };
  const mockRepo5 = { id: 5, fullName: 'The last of the repos' };

  class RepositoryServiceStub {  
    public getRepositories(): Observable<Repository> {
      return Observable.of(
        mockRepo1,
        mockRepo2,
        mockRepo3,
        mockRepo4,
        mockRepo5
      );
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        RepositoriesComponent, 
        RepositoryComponent
      ],
      providers: [
        { provide: RepositoryService, useClass: RepositoryServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render each of the repository components', async(() => {
    const fixture = TestBed.createComponent(RepositoriesComponent);
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    expect(compiled.textContent).toContain(mockRepo1.fullName);
    expect(compiled.textContent).toContain(mockRepo2.fullName);
    expect(compiled.textContent).toContain(mockRepo3.fullName);
    expect(compiled.textContent).toContain(mockRepo4.fullName);
    expect(compiled.textContent).toContain(mockRepo5.fullName);
  }));

});