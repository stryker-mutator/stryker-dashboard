import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { LoginComponent } from './login.component';
import { UserService } from '../user/user.service';
import { Login, Repository } from '@stryker-mutator/dashboard-contract';
import { RepositoryService } from '../repository/repository.service';
import { AppModule } from '../app.module';
import { APP_BASE_HREF } from '@angular/common';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  class UserServiceStub {
    public login(): Observable<Login> {
      return of({
        name: 'stryker-mutator',
        avatarUrl: 'https://avatars0.githubusercontent.com/u/18347996',
      });
    }
  }
  class RepositoryServiceStub {
    public getRepositories(): Observable<Repository[]> {
      return of([]);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useClass: UserServiceStub },
        { provide: RepositoryService, useClass: RepositoryServiceStub },
        { provide: APP_BASE_HREF, useValue: '/' },
      ],
      imports: [AppModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
