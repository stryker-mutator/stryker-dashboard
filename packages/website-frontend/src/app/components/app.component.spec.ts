import { TestBed, async } from '@angular/core/testing';
import { HttpModule, Http } from '@angular/http'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AppComponent } from './app.component';
import { RepositoriesComponent } from './repositories/repositories.component';
import { RepositoryComponent } from './repository/repository.component';
import { RepositoryService } from '../services/repository/repository.service';
import { Repository } from '../../../../website-backend/src/model';

describe('AppComponent', () => {

  class RepositoryServiceStub {  
    public getRepositories() {
      return Observable.of();
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        RepositoriesComponent,
        RepositoryComponent
      ],
      imports: [
        HttpModule
      ],
      providers: [ 
        { provide: RepositoryService, useClass: RepositoryServiceStub } 
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Stryker Badge');
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
    const repositoriesElement: HTMLElement = compiled.querySelector('repositories');
    expect(repositoriesElement.innerHTML.length).toBeGreaterThan(0);
  }));

});
