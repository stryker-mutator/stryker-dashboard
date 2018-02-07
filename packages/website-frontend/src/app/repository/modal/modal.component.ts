import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { RepositoryComponent } from '../repository.component';

@Component({
  selector: 'stryker-repository-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class RepositoryModalComponent {

  @ViewChild('modal') private modal: ElementRef;
  private repoComponent: RepositoryComponent;
  public enabling: boolean;

  public constructor(private modalService: NgbModal) { }

  public repoEnabled(repoComponent: RepositoryComponent) {
    this.repoComponent = repoComponent;
    this.enabling = true;
    this.open().result.then(() => {
      this.modalClosed();
    }, () => {
      this.modalClosed();
    });
  }

  public repoAboutToBeDisabled(repoComponent: RepositoryComponent) {
    this.repoComponent = repoComponent;
    this.enabling = false;
    this.open().result.then((result: string) => {
      if (result === 'disable') {
        this.repoComponent.disableRepository();
      }
      this.modalClosed();
    }, () => {
      this.modalClosed();
    });
  }

  private open(): NgbModalRef {
    const modalOptions: NgbModalOptions = { size: 'lg' };
    return this.modalService.open(this.modal, modalOptions);
  }

  private modalClosed() {
    this.repoComponent.apiKey = '';
  }

  public getName(): string {
    return this.repoComponent.repo.name;
  }

  public apiKey(): string {
    return this.repoComponent.apiKey;
  }

  public get badgeUrl() {
    return 'https://badge.stryker-mutator.io/' + this.repoComponent.repo.slug + '/master';
  }

}
