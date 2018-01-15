import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';

import { LoginComponent } from './login.component';
import { UserService } from '../user/user.service';
import { Login, Repository } from 'stryker-dashboard-website-contract';
import { RepositoriesComponent } from '../repositories/repositories.component';
import { RepositoryComponent } from './../repository/repository.component';
import { RepositoryModalComponent } from '../repository/modal/modal.component';
import { RepositoryService } from '../repository/repository.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  class UserServiceStub {  
    public login(): Observable<Login> {
      return Observable.of({
        name: 'stryker-mutator',
        avatarUrl: 'https://avatars0.githubusercontent.com/u/18347996'
      });
    }
  }
  class RepositoryServiceStub {  
    public getRepositories(): Observable<Repository[]> {
      return Observable.of([]);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginComponent,
        RepositoriesComponent,
        RepositoryComponent,
        RepositoryModalComponent
      ],
      providers: [
        { provide: UserService, useClass: UserServiceStub },
        { provide: RepositoryService, useClass: RepositoryServiceStub }
      ],
      imports: [ NgbModule.forRoot() ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
