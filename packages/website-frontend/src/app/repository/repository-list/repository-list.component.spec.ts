import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RepositoryListComponent } from './repository-list.component';
import { createRepository } from 'src/app/testHelpers/mock.spec';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe(RepositoryListComponent.name, () => {

  let sut: RepositoryListComponent;
  let fixture: ComponentFixture<RepositoryListComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [RepositoryListComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RepositoryListComponent);
    element = fixture.nativeElement;
    sut = fixture.componentInstance;
    sut.repositories = [createRepository({ slug: 'foo' }), createRepository({ slug: 'bar' })];
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should render each of the repository components', () => {
    const repoElements = Array.from(element.querySelectorAll('stryker-repository'));
    expect(repoElements.length).toEqual(2);
    expect((repoElements[0] as any).repo).toEqual(sut.repositories[0]);
    expect((repoElements[1] as any).repo).toEqual(sut.repositories[1]);
  });
});
