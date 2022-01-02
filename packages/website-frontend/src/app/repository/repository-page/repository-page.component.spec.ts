
import { RepositoryPageComponent } from './repository-page.component';
import { JasmineMock, mock, createRepository } from 'src/app/testHelpers/mock.spec';
import { OrganizationsService } from 'src/app/services/organizations/organizations.service';
import { UserService } from 'src/app/user/user.service';
import { AuthService } from 'src/app/auth/auth.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';
import { Login, Repository } from '@stryker-mutator/dashboard-contract';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe(RepositoryPageComponent.name, () => {

  let sut: RepositoryPageComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<RepositoryPageComponent>;
  let organizationServiceMock: JasmineMock<OrganizationsService>;
  let userServiceMock: JasmineMock<UserService>;
  let authServiceMock: Pick<AuthService, 'currentUser$'>;
  let dashboardServiceMock: JasmineMock<DashboardService>;
  let routeParam$: Subject<{ owner: string | undefined }>;
  let routerMock: JasmineMock<Router>;
  let organization$: Subject<Login[]>;
  let currentUser$: Subject<Login>;
  let repo$: Subject<Repository[]>;

  beforeEach(() => {
    organizationServiceMock = mock(OrganizationsService);
    userServiceMock = mock(UserService);
    routeParam$ = new Subject();
    const activatedRoute = mock(ActivatedRoute);
    activatedRoute.params = routeParam$;
    routerMock = mock(Router);
    currentUser$ = new Subject();
    repo$ = new Subject();
    organization$ = new Subject();
    authServiceMock = { currentUser$ };
    dashboardServiceMock = mock(DashboardService);
    organizationServiceMock.getRepositories.and.returnValue(repo$);
    userServiceMock.getRepositories.and.returnValue(repo$);
    userServiceMock.organizations.and.returnValue(organization$);
    TestBed.configureTestingModule({
      declarations: [RepositoryPageComponent],
      providers: [
        { provide: OrganizationsService, useValue: organizationServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: DashboardService, useValue: dashboardServiceMock },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    TestBed.compileComponents();
    fixture = TestBed.createComponent(RepositoryPageComponent);
    sut = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  describe(RepositoryPageComponent.prototype.ngOnInit.name, () => {
    it('should loadUser', async () => {
      // Arrange
      const expectedUser = { avatarUrl: 'fooUser', name: 'fooUser' };

      // Act
      sut.ngOnInit();
      currentUser$.next(expectedUser);
      await fixture.whenStable();

      // Assert
      expect(sut.user).toBe(expectedUser);
    });

    it('should load organizations', async () => {
      // Arrange
      const expectedOrgs = [{ avatarUrl: 'org1', name: 'org1' }, { avatarUrl: 'org2', name: 'org2' }];

      // Act
      sut.ngOnInit();
      await fixture.whenStable();
      organization$.next(expectedOrgs);

      // Assert
      expect(sut.organizations).toEqual(expectedOrgs);
    });

    it('should load repositories for current user if that owner is provided in the path', async () => {
      // Arrange
      const expectedOrganization: Login = { name: 'fooOrg', avatarUrl: 'fooOrg' };
      const expectedRepos = [createRepository()];

      // Act
      sut.ngOnInit();
      routeParam$.next({ owner: 'bar' });
      currentUser$.next({ name: 'bar', avatarUrl: 'bar' });
      organization$.next([expectedOrganization]);
      repo$.next(expectedRepos);
      await fixture.whenStable();

      // Assert
      expect(sut.repositories).toEqual(expectedRepos);
      expect(organizationServiceMock.getRepositories).toHaveBeenCalledTimes(0);
      expect(userServiceMock.getRepositories).toHaveBeenCalled();
    });

    it('should load repositories for organization if that owner is provided in the path', async () => {
      // Arrange
      const expectedOrganization: Login = { name: 'fooOrg', avatarUrl: 'fooOrg' };
      const expectedRepos = [createRepository()];

      // Act
      sut.ngOnInit();
      routeParam$.next({ owner: 'fooOrg' });
      currentUser$.next({ name: 'bar', avatarUrl: 'bar' });
      organization$.next([expectedOrganization]);
      repo$.next(expectedRepos);
      await fixture.whenStable();

      // Assert
      expect(sut.repositories).toEqual(expectedRepos);
      expect(organizationServiceMock.getRepositories).toHaveBeenCalledWith('fooOrg');
    });

    it('should set the titlePrefix', async () => {
      // Act
      sut.ngOnInit();
      routeParam$.next({ owner: 'bazOwner' });
      currentUser$.next({ name: 'baz', avatarUrl: 'baz' });
      await fixture.whenStable();

      // Assert
      expect(dashboardServiceMock.setTitlePrefix).toHaveBeenCalledWith('bazOwner');
    });
  });

  describe('after initialized', () => {

    beforeEach(async () => {
      sut.ngOnInit();
      routeParam$.next({ owner: 'fooOrg' });
      currentUser$.next({ name: 'bar', avatarUrl: 'bar' });
      organization$.next([{ name: 'fooOrg', avatarUrl: 'fooOrg' }, { name: 'barOrg', avatarUrl: 'barOrg' }]);
      repo$.next([createRepository()]);
      await fixture.whenStable();
    });

    it('should change the repos if the owner in the routeParams changed', async () => {
      // Act
      routeParam$.next({ owner: 'barOrg' });
      const expectedRepositories = [createRepository({ name: 'expectedRepository' })];
      repo$.next(expectedRepositories);
      await fixture.whenStable();

      // Assert
      expect(organizationServiceMock.getRepositories).toHaveBeenCalledWith('barOrg');
      expect(sut.repositories).toBe(expectedRepositories);
    });

    it('should change the routeParams if owner changed in the selector', async () => {
      // Arrange
      const ownerSelector = fixture.debugElement.query(By.css('stryker-owner-selector'));
      ownerSelector.triggerEventHandler('ownerSelected', 'quxOwner' );

      // Act
      await fixture.whenStable();

      // Assert
      expect(routerMock.navigate).toHaveBeenCalledWith(['repos', 'quxOwner']);
    });
  });
});
