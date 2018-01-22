import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RepositoriesComponent } from './repositories/repositories.component';
import { RepositoryComponent } from './repository/repository.component';
import { RepositoryModalComponent } from './repository/modal/modal.component';
import { RepositoryService } from './repository/repository.service';
import { UserService } from './user/user.service';
import { Login } from 'stryker-dashboard-website-contract';

describe('AppComponent', () => {

  class RepositoryServiceStub {
    public getRepositories() {
      return Observable.of();
    }
  }
  class UserServiceStub {
    public login(): Observable<Login> {
      return Observable.of({ name: '', avatarUrl: '' });
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        LoginComponent,
        RepositoriesComponent,
        RepositoryComponent,
        RepositoryModalComponent
      ],
      imports: [
        HttpClientTestingModule,
        NgbModule.forRoot()
      ],
      providers: [
        { provide: RepositoryService, useClass: RepositoryServiceStub },
        { provide: UserService, useClass: UserServiceStub }
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Stryker');
  }));

  it('should render the repositories component', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const repositoriesElement: HTMLElement = compiled.querySelector('stryker-repositories');
    expect(repositoriesElement.innerHTML.length).toBeGreaterThan(0);
  }));

});
