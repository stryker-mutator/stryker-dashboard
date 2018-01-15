import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';

import { RepositoriesComponent } from './repositories.component';
import { RepositoryComponent } from '../repository/repository.component';
import { RepositoryModalComponent } from "../repository/modal/modal.component";
import { RepositoryService } from '../repository/repository.service';
import { Repository } from 'stryker-dashboard-website-contract';

describe('RepositoriesComponent', () => {
  let component: RepositoriesComponent;
  let fixture: ComponentFixture<RepositoriesComponent>;

  const mockRepo1 = {
    slug: 'stryker-mutator/stryker-badge',
    origin: 'https://www.github.com',
    owner: 'stryker-mutator',
    name: 'stryker-badge',
    enabled: true
  }
  const mockRepo2 = {
    slug: 'stryker-mutator/stryker',
    origin: 'https://www.github.com',
    owner: 'stryker-mutator',
    name: 'stryker',
    enabled: true
  }
  const mockRepo3 = {
    slug: 'stryker-mutator/stryker-jest-runner',
    origin: 'https://www.github.com',
    owner: 'stryker-mutator',
    name: 'stryker-jest-runner',
    enabled: false
  }

  class RepositoryServiceStub {  
    public getRepositories(): Observable<Repository[]> {
      return Observable.of([
        mockRepo1,
        mockRepo2,
        mockRepo3
      ]);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        RepositoriesComponent, 
        RepositoryComponent,
        RepositoryModalComponent
      ],
      providers: [
        { provide: RepositoryService, useClass: RepositoryServiceStub }
      ],
      imports: [ NgbModule.forRoot() ]
    }).compileComponents();

    fixture = TestBed.createComponent(RepositoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render each of the repository components', async(() => {
    const compiled: HTMLElement = fixture.debugElement.nativeElement;
    expect(compiled.textContent).toContain(mockRepo1.name);
    expect(compiled.textContent).toContain(mockRepo2.name);
    expect(compiled.textContent).toContain(mockRepo3.name);
  }));
});
