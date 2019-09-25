import { Component, Input } from '@angular/core';
import { Repository } from 'stryker-dashboard-website-contract';

@Component({
  selector: 'stryker-repository-list',
  templateUrl: './repository-list.component.html',
  styleUrls: ['./repository-list.component.css']
})
export class RepositoryListComponent {

  @Input()
  public repositories!: Repository[];
}
