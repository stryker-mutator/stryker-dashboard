import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RepositoryComponent } from './repository.component';

describe('RepositoryComponent', () => {
  const mockRepo = {
    slug: 'stryker-mutator/stryker-badge',
    origin: 'https://www.github.com',
    owner: 'stryker-mutator',
    name: 'stryker-badge',
    enabled: true
  }
  let component: RepositoryComponent;
  let fixture: ComponentFixture<RepositoryComponent>;
  let compiledComponent: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepositoryComponent ],
      imports: [ NgbModule.forRoot() ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositoryComponent);
    component = fixture.debugElement.componentInstance;
    component.repo = mockRepo;
    fixture.detectChanges();
    compiledComponent = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should display the repository's slug`, () => {
    expect(compiledComponent.querySelector('div').textContent).toContain(mockRepo.slug);
  });
});
