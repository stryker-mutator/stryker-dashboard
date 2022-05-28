import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

import {
  badgeExampleSrc,
  BadgeStyle,
  allBadgeStyles,
  badgeSrc,
  reportUrl,
} from '../util';
import { RepositoryService } from '../repository.service';
import { Repository } from '@stryker-mutator/dashboard-contract';
import { ApiKeyDisplayMode } from '../api-key-generator/api-key-generator.component';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'stryker-repository-modal',
  templateUrl: './repository-modal.component.html',
  styleUrls: ['./repository-modal.component.css'],
})
export class RepositoryModalComponent {
  public apiKey = '';
  public apiKeyMode: ApiKeyDisplayMode = 'hide';
  public repository!: Repository;

  public constructor(
    private readonly modalService: NgbModal,
    private readonly repositoryService: RepositoryService
  ) {}

  public get name() {
    return this.repository.name;
  }

  public get badgeSrc() {
    return badgeSrc(this.repository, this.badgeStyle);
  }

  @ViewChild('modal', { static: false })
  private readonly modal!: ElementRef;
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
    await this.enableRepository().catch((err) => {
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

  public async enableRepository() {
    this.apiKeyMode = 'loading';
    const response = await lastValueFrom(
      this.repositoryService.enableRepository(this.repository.slug, true)
    );
    this.apiKey = response.apiKey;
    this.apiKeyMode = 'show';
  }

  public disableRepository() {
    return this.repositoryService.enableRepository(this.repository.slug, false);
  }

  public open(): NgbModalRef {
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
