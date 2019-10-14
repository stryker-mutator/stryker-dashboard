import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { RepositorySwitchComponent } from '../repository-switch/repository-switch.component';


@Component({
  selector: 'stryker-repository-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class RepositoryModalComponent {

  public constructor(private modalService: NgbModal) { }

  public get badgeUrl() {
    const badgeApiUrl = `https://badge-api.stryker-mutator.io/api/${this.repoComponent.repo.slug}/master`;
    return `https://img.shields.io/endpoint?style=${this.badgeStyle}&url=${encodeURIComponent(badgeApiUrl)}`;
  }

  @ViewChild('modal', { static: false }) private modal!: ElementRef;
  private repoComponent!: RepositorySwitchComponent;
  public enabling = false;

  public badgeStyle = 'flat';
  public badgeStyles = ['flat', 'flat-square', 'plastic', 'for-the-badge'];
  private currentModal: NgbModalRef | undefined;

  public formatExampleBadgeUrl(color: string, score: number) {
    return `https://img.shields.io/badge/mutation%20score-${score}%25-${color}?style=${this.badgeStyle}`;
  }

  public repoEnabled(repoComponent: RepositorySwitchComponent) {
    this.repoComponent = repoComponent;
    this.enabling = true;
    this.open().result.then(() => {
      this.modalClosed();
    }, () => {
      this.modalClosed();
    });
  }

  public repoAboutToBeDisabled(repoComponent: RepositorySwitchComponent) {
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
    this.currentModal = this.modalService.open(this.modal, modalOptions);
    return this.currentModal;
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

  public close() {
    if (this.currentModal) {
      this.currentModal.close();
    }
  }

}
