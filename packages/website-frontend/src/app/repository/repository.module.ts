import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepositoryListComponent } from './repository-list/repository-list.component';
import { RepositoryModalComponent } from './modal/modal.component';
import { RepositoryPageComponent } from './repository-page/repository-page.component';
import { RepositorySwitchComponent } from './repository-switch/repository-switch.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OwnerSelectorComponent } from './owner-selector/owner-selector.component';
import { ShortExplanationComponent } from './short-explanation/short-explanation.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RepositoryListComponent,
    RepositoryModalComponent,
    RepositoryPageComponent,
    RepositorySwitchComponent,
    OwnerSelectorComponent,
    ShortExplanationComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    SharedModule,
    FormsModule
  ],
  exports: [
    RepositoryPageComponent
  ]
})
export class RepositoryModule { }
