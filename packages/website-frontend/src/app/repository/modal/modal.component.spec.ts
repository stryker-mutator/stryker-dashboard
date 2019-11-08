import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';

import { RepositoryModalComponent } from './modal.component';
import { RepositorySwitchComponent } from '../repository-switch/repository-switch.component';
import { RepositoryService } from '../repository.service';
import { EnableRepositoryResponse } from '@stryker-mutator/dashboard-contract';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { mock } from 'src/app/testHelpers/mock.spec';

class RepositoryServiceStub {
  public enableRepository(): Observable<EnableRepositoryResponse> {
    return of();
  }
}

describe(RepositoryModalComponent.name, () => {

  let fixture: ComponentFixture<RepositoryModalComponent>;
  let sut: RepositoryModalComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RepositoryModalComponent,
        RepositorySwitchComponent
      ],
      imports: [
        CommonModule,
        NgbModule,
        FormsModule
      ],
      providers: [
        { provide: RepositoryService, useClass: RepositoryServiceStub }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(RepositoryModalComponent);
    sut = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement;
  }));

  afterEach(() => {
    sut.close();
  });

  it('should be hidden by default', () => {
    expect(findModal()).toBe(null);
  });

  describe(RepositoryModalComponent.prototype.repoEnabled.name, () => {

    let modal: HTMLElement;
    let repository: RepositorySwitchComponent;

    beforeEach(async () => {
      repository = mock(RepositorySwitchComponent);
      repository.repo = {
        name: 'barRepo',
        enabled: true,
        origin: 'github.com',
        owner: 'fooOrg',
        slug: 'github.com/fooOrg/barRepo'
      };
      sut.repoEnabled(repository);
      fixture.detectChanges();
      await fixture.whenStable();
      modal = findModal();
    });

    it('should show the modal', () => {
      expect(modal.hidden).toBe(false);
    });

    describe('badge section', () => {

      beforeEach(async () => {
        const buttons = Array.from(modal.querySelectorAll('.card-header button'));
        const badgeButton = buttons.find(button => button.textContent.trim() === 'Badge') as HTMLButtonElement;
        badgeButton.click();
        fixture.detectChanges();
        await fixture.whenStable();
      });

      it('it should show the url in the readme description', () => {
        // tslint:disable-next-line: max-line-length
        const expectedUrl = 'https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2FfooOrg%2FbarRepo%2Fmaster';
        expect(modal.querySelector('code').textContent)
        .toContain(expectedUrl);
      });
    });
  });

  function findModal() {
    let next = element;
    let modal: HTMLElement = null;
    while (!modal && next) {
      next = next.nextSibling as HTMLElement;
      if (next && next.tagName.toLowerCase() === 'ngb-modal-window') {
        modal = next;
      }
    }
    return modal;
  }
});
