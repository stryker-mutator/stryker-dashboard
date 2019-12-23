import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { badgeExampleSrc, BadgeStyle, allBadgeStyles, badgeSrc, reportUrl } from '../util';
import { RepositoryService } from '../repository.service';
import { Repository } from '@stryker-mutator/dashboard-contract';


@Component({
  selector: 'stryker-repository-modal',
  templateUrl: './repository-modal.component.html',
  styleUrls: ['./repository-modal.component.css']
})
export class RepositoryModalComponent {

  public apiKey = '';
  public apiKeyMode: 'show' | 'hide' | 'loading' = 'hide';
  private repository!: Repository;

  public constructor(private modalService: NgbModal, private repositoryService: RepositoryService) { }

  public get apiKeyToDisplay() {
    switch (this.apiKeyMode) {
      case 'hide':
        return '••••••••••••••••••••••••••••••••••••';
      case 'loading':
        return 'Retrieving...';
      default:
        return this.apiKey;
    }
  }

  public get name() {
    return this.repository.name;
  }

  public get badgeSrc() {
    return badgeSrc(this.repository, this.badgeStyle);
  }

  @ViewChild('modal', { static: false })
  private modal!: ElementRef;
  public enabled = false;

  public badgeStyle: BadgeStyle = 'flat';
  public badgeStyles = allBadgeStyles;
  private currentModal: NgbModalRef | undefined;


  public formatExampleBadgeUrl(color: string, score: number) {
    return badgeExampleSrc(score, color, this.badgeStyle);
  }

  public get badgeUrl() {
    return badgeSrc(this.repository, this.badgeStyle);
  }

  public get reportUrl() {
    return reportUrl(this.repository);
  }

  public async openToDisplayRepository(repo: Repository): Promise<void> {
    this.repository = repo;
    this.enabled = true;
    this.apiKeyMode = 'hide';
    await this.open().result;
  }

  public async openToEnableRepository(repo: Repository): Promise<void> {
    this.repository = repo;
    this.enabled = true;
    const result = this.open().result;
    await this.enableRepository()
      .catch(err => {
        this.close();
        throw err;
      });
    await result;
  }

  public async openToDisableRepository(repository: Repository): Promise<void> {
    this.repository = repository;
    this.enabled = false;
    const result: string = await this.open().result;
    if (result === 'disable') {
      await this.disableRepository().toPromise();
    }
  }

  private async enableRepository() {
    this.apiKeyMode = 'loading';
    const response = await this.repositoryService.enableRepository(this.repository.slug, true).toPromise();
    this.apiKey = response.apiKey;
    this.apiKeyMode = 'show';
  }

  private disableRepository() {
    return this.repositoryService.enableRepository(this.repository.slug, false);
  }

  public generateApiKeyClicked() {
    this.enableRepository();
  }

  private open(): NgbModalRef {
    const modalOptions: NgbModalOptions = { size: 'lg' };
    this.currentModal = this.modalService.open(this.modal, modalOptions);
    return this.currentModal;
  }

  public close() {
    if (this.currentModal) {
      this.currentModal.close();
    }
  }

}
