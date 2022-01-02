import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Repository } from '@stryker-mutator/dashboard-contract';

@Component({
  selector: 'stryker-repository',
  templateUrl: './repository-switch.component.html',
  styleUrls: ['./repository-switch.component.css']
})
export class RepositorySwitchComponent {

  @Input() public repo!: Repository;
  @Output() public display = new EventEmitter<RepositorySwitchComponent>();
  @Output() public enable = new EventEmitter<RepositorySwitchComponent>();
  @Output() public disable = new EventEmitter<RepositorySwitchComponent>();

  public constructor() {
  }

  public displayClicked() {
    this.display.emit(this);
  }

  public switchClicked() {
    this.flipSwitch();
    if (this.repo.enabled) {
      this.enable.emit(this);
    } else {
      this.disable.emit(this);
    }
  }

  public flipSwitch() {
    this.repo.enabled = !this.repo.enabled;
  }

}
