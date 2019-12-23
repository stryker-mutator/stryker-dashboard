import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';

import { RepositoryModalComponent } from './repository-modal.component';
import { RepositorySwitchComponent } from '../repository-switch/repository-switch.component';
import { RepositoryService } from '../repository.service';
import { EnableRepositoryResponse, Repository } from '@stryker-mutator/dashboard-contract';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { ClipboardCopyComponent } from 'src/app/shared/clipboard-copy/clipboard-copy.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { JasmineMock, mock, createRepository } from 'src/app/testHelpers/mock.spec';

class RepositoryServiceStub {
  public enableRepository(): Observable<EnableRepositoryResponse> {
    return of();
  }
}

describe(RepositoryModalComponent.name, () => {

  let fixture: ComponentFixture<RepositoryModalComponent>;
  let sut: RepositoryModalComponent;
  let element: HTMLElement;
  let repositoryServiceStub: JasmineMock<RepositoryService>;

  beforeEach(async(() => {
    repositoryServiceStub = mock(RepositoryService);
    TestBed.configureTestingModule({
      declarations: [
        RepositoryModalComponent,
        RepositorySwitchComponent,
        ClipboardCopyComponent
      ],
      imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: RepositoryService, useValue: repositoryServiceStub }
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
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

  describe(RepositoryModalComponent.prototype.openToEnableRepository.name, () => {

    let modal: HTMLElement;
    let repository: Repository;

    beforeEach(async () => {
      repository = createRepository({
        name: 'barRepo',
        slug: 'github.com/fooOrg/barRepo',
      });
      const response: EnableRepositoryResponse = { apiKey: 'apiKey' };
      repositoryServiceStub.enableRepository.and.returnValue(of(response));
      sut.openToEnableRepository(repository);
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
