import { Component, Input } from '@angular/core';
import { Repository } from '@stryker-mutator/dashboard-contract';
import { RepositoryModalComponent } from '../repository-modal/repository-modal.component';
import { RepositorySwitchComponent } from '../repository-switch/repository-switch.component';
import { reportError } from '../util';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'stryker-repository-list',
  templateUrl: './repository-list.component.html',
  styleUrls: ['./repository-list.component.css'],
})
export class RepositoryListComponent {
  @Input()
  public repositories!: Repository[];

  public display(
    repositoryComponent: RepositorySwitchComponent,
    modal: RepositoryModalComponent
  ) {
    dismissError(modal.openToDisplayRepository(repositoryComponent.repo));
  }

  public enable(
    repositoryComponent: RepositorySwitchComponent,
    modal: RepositoryModalComponent
  ) {
    dismissError(modal.openToEnableRepository(repositoryComponent.repo)).catch(
      (err) => {
        repositoryComponent.flipSwitch();
        reportError({ error: err });
      }
    );
  }

  public disable(
    repositoryComponent: RepositorySwitchComponent,
    modal: RepositoryModalComponent
  ) {
    modal
      .openToDisableRepository(repositoryComponent.repo)
      .catch((err) => repositoryComponent.flipSwitch());
  }
}

function dismissError<T>(promise: Promise<T>): Promise<T | void> {
  return promise.catch((err) => {
    if (err instanceof Error || err instanceof HttpErrorResponse) {
      throw err;
    }
  });
}
