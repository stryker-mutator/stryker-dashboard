import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthComponent } from './auth.component';
import { Subject } from 'rxjs';
import { ParamMap, Params, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { JasmineMock, mock } from '../testHelpers/mock.spec';
import { AuthService } from './auth.service';
import { SharedModule } from '../shared/shared.module';
import { Login } from 'stryker-dashboard-website-contract';

describe(AuthComponent.name, () => {
  let fixture: ComponentFixture<AuthComponent>;
  let element: HTMLElement;
  let param$: Subject<Params>;
  let queryParamMap$: Subject<ParamMap>;
  let routerMock: JasmineMock<Router>;
  let authServiceMock: JasmineMock<AuthService>;

  beforeEach(async () => {
    param$ = new Subject();
    queryParamMap$ = new Subject();
    routerMock = mock(Router);
    authServiceMock = mock(AuthService);

    await TestBed.configureTestingModule({
      declarations: [AuthComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { params: param$, queryParamMap: queryParamMap$ } },
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
      imports: [SharedModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    fixture.detectChanges();
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('should authenticate the user using "provider" and "code"', async () => {
    // Arrange
    const expectedUser: Login = {
      avatarUrl: 'baz-user',
      name: 'baz-user'
    };
    authServiceMock.authenticate.and.returnValue(Promise.resolve(expectedUser));
    param$.next({ provider: 'foo-hub' });
    queryParamMap$.next(convertToParamMap({ code: 'bar-code' }));

    // Act
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    expect(routerMock.navigate).toHaveBeenCalledWith(['repos', expectedUser.name]);
    expect(authServiceMock.authenticate).toHaveBeenCalledWith('foo-hub', 'bar-code');
  });

  it('should set an error message when authentication was not successful', async () => {
    // Arrange
    const error = new Error('Expected error for testing');
    authServiceMock.authenticate.and.returnValue(Promise.reject(error));
    param$.next({ provider: 'foo-hub' });
    queryParamMap$.next(convertToParamMap({ code: 'bar-code' }));

    // Act
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    const alert = element.querySelector('.alert');
    expect(alert).toBeTruthy();
    expect(alert.textContent).toBe('An error occurred during logon. Please try again.');
  });
});
