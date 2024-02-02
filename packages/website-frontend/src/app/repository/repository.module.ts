import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepositoryPageComponent } from './repository-page/repository-page.component';
import { NgbAccordionModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MutationScoreBadgeComponent } from './mutation-score-badge/mutation-score-badge.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    RepositoryPageComponent,
    MutationScoreBadgeComponent,
  ],
  imports: [CommonModule, RouterModule, NgbModule, SharedModule, FormsModule, NgbAccordionModule],
  exports: [RepositoryPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RepositoryModule {}
