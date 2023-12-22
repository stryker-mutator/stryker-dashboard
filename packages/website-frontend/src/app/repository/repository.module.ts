import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepositoryListComponent } from './repository-list/repository-list.component';
import { RepositoryModalComponent } from './repository-modal/repository-modal.component';
import { RepositoryPageComponent } from './repository-page/repository-page.component';
import { RepositorySwitchComponent } from './repository-switch/repository-switch.component';
import { NgbAccordionModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OwnerSelectorComponent } from './owner-selector/owner-selector.component';
import { ShortExplanationComponent } from './short-explanation/short-explanation.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MutationScoreBadgeComponent } from './mutation-score-badge/mutation-score-badge.component';
import { RouterModule } from '@angular/router';
import { ApiKeyGeneratorComponent } from './api-key-generator/api-key-generator.component';

@NgModule({
  declarations: [
    RepositoryListComponent,
    RepositoryModalComponent,
    RepositoryPageComponent,
    RepositorySwitchComponent,
    OwnerSelectorComponent,
    ShortExplanationComponent,
    MutationScoreBadgeComponent,
    ApiKeyGeneratorComponent,
  ],
  imports: [CommonModule, RouterModule, NgbModule, SharedModule, FormsModule, NgbAccordionModule],
  exports: [RepositoryPageComponent],
})
export class RepositoryModule {}
