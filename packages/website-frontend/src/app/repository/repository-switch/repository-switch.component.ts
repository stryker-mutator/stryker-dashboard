import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Repository, EnableRepositoryResponse } from 'stryker-dashboard-website-contract';
import { RepositoryService } from '../repository.service';

@Component({
  selector: 'stryker-repository',
  templateUrl: './repository-switch.component.html',
  styleUrls: ['./repository-switch.component.css']
})
export class RepositorySwitchComponent {

  @Input() public repo!: Repository;
  @Output() public repoEnabled = new EventEmitter<RepositorySwitchComponent>();
  @Output() public repoAboutToBeDisabled = new EventEmitter<RepositorySwitchComponent>();

  public apiKey: string;

  public constructor(private repositoryService: RepositoryService) {
    this.apiKey = '';
  }

  public switchClicked() {
    if (!this.repo.enabled) {
      this.enableRepository();
      this.repoEnabled.emit(this);
    } else {
      this.repoAboutToBeDisabled.emit(this);
    }
  }

  private enableRepository() {
    this.flipSwitch();
    this.repositoryService.enableRepository(this.repo.slug, true)
      .subscribe((response: EnableRepositoryResponse) => {
        this.apiKey = response.apiKey;
      });
  }

  public disableRepository() {
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

  private flipSwitch() {
    this.repo.enabled = !this.repo.enabled;
  }

}
