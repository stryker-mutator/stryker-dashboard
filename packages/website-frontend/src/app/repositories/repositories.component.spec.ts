import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';

import { RepositoriesComponent } from './repositories.component';
import { RepositoryService } from '../repository/repository.service';
import { Repository } from 'stryker-dashboard-website-contract';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OrganizationsService } from '../organizations/organizations.service';
import { UserService } from '../user/user.service';
import { AppModule } from '../app.module';
import { APP_BASE_HREF } from '@angular/common';
import { mock } from '../testHelpers/mock.spec';

describe('RepositoriesComponent', () => {
  let component: RepositoriesComponent;
  let fixture: ComponentFixture<RepositoriesComponent>;
  let mockRepo1: Repository;
  let mockRepo2: Repository;
  let mockRepo3: Repository;

  beforeEach(() => {
    mockRepo1 = {
      slug: 'stryker-mutator/stryker-badge',
      origin: 'https://www.github.com',
      owner: 'stryker-mutator',
      name: 'stryker-badge',
      enabled: true
    };
    mockRepo2 = {
      slug: 'stryker-mutator/stryker',
      origin: 'https://www.github.com',
      owner: 'stryker-mutator',
      name: 'stryker',
      enabled: true
    };
    mockRepo3 = {
      slug: 'stryker-mutator/stryker-jest-runner',
      origin: 'https://www.github.com',
      owner: 'stryker-mutator',
      name: 'stryker-jest-runner',
      enabled: false
    };
  });

  class RepositoryServiceStub {
    public getRepositories(): Observable<Repository[]> {
      return of([
        mockRepo1,
        mockRepo2,
        mockRepo3
      ]);
    }
  }


  beforeEach(() => {
    const organizationsStub = mock(OrganizationsService);
    const userServiceStub = mock(UserService);
    organizationsStub.getRepositories.and.returnValue(of([
      mockRepo1,
      mockRepo2,
      mockRepo3
    ]));
    userServiceStub.currentUser = of({ name: '', avatarUrl: '' });
    userServiceStub.getRepositories.and.returnValue(of([]));
    userServiceStub.organizations.and.returnValue(of([]));
    TestBed.configureTestingModule({
      providers: [
        { provide: OrganizationsService, useValue: organizationsStub },
        { provide: UserService, useValue: userServiceStub },
        { provide: APP_BASE_HREF, useValue: '/' }
      ],
      imports: [NgbModule, AppModule],
      schemas: [NO_ERRORS_SCHEMA]
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
