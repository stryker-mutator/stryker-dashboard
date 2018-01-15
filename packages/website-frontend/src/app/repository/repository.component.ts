import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

import { Repository, EnableRepositoryResponse } from 'stryker-dashboard-website-contract';
import { RepositoryService } from './repository.service';

@Component({
  selector: 'stryker-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.css']
})
export class RepositoryComponent implements OnInit {

  @Input() public repo: Repository;
  public apiKey: String;
  public enabling: boolean;

  private modalOptions: NgbModalOptions;

  public constructor(private modalService: NgbModal, private repositoryService: RepositoryService) {
    this.modalOptions = { size: 'lg' };
    this.apiKey = '';
    this.enabling = false;
  }

  public ngOnInit() { }

  public switchClicked(content: NgbActiveModal) {
    if (!this.repo.enabled) {
      this.enableRepository();
    }
    this.modalService.open(content, this.modalOptions).result.then(() => {
      if (!this.enabling) {
        this.disableRepository();
      }
      this.modalClosed();
    }, () => {
      this.modalClosed();
    });
  }

  private enableRepository() {
    this.enabling = true;
    this.flipSwitch();
    this.repositoryService.enableRepository(this.repo.slug, true)
      .subscribe((response: EnableRepositoryResponse) => {
        this.apiKey = response.apiKey;
      });
  }

  private flipSwitch() {
    this.repo.enabled = !this.repo.enabled;
  }

  private disableRepository() {
    this.flipSwitch();
    this.repositoryService.enableRepository(this.repo.slug, false)
      .subscribe({
        error: (error) => {
          this.flipSwitch();
          console.error(error);
          alert('Something went wrong while disabling this repository. Please check your internet connection');
        }
      });
    }

  private modalClosed() {
    this.enabling = false;
    this.apiKey = '';
  }

}
