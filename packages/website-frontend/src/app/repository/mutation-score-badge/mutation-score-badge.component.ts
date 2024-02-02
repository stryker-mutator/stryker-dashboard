import { Component, Input } from '@angular/core';
import { Repository } from '@stryker-mutator/dashboard-contract';
import { badgeSrc, BadgeStyle } from '../util';

@Component({
  selector: 'stryker-mutation-score-badge',
  templateUrl: './mutation-score-badge.component.html',
})
export class MutationScoreBadgeComponent {
  @Input()
  public repo!: Repository;

  @Input()
  public style: BadgeStyle = 'flat';

  @Input()
  public enableLink = false;

  public get src() {
    return badgeSrc(this.repo, this.style);
  }

  public get alt() {
    return `Badge for ${this.repo.name} on the ${this.repo.defaultBranch} branch.`;
  }
}
