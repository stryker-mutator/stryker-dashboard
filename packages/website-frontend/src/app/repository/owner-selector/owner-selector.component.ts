import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Login } from '@stryker-mutator/dashboard-contract';
import { Router } from '@angular/router';

@Component({
  selector: 'stryker-owner-selector',
  templateUrl: './owner-selector.component.html',
  styleUrls: ['./owner-selector.component.scss']
})
export class OwnerSelectorComponent {

  @Input()
  public user: Login | undefined;

  @Input()
  public organizations: Login[] = [];

  @Output()
  public ownerSelected = new EventEmitter<string>();


  public selectedOwnerChanged(event: UIEvent) {
    const val = (event.target as HTMLSelectElement).value;
    this.ownerSelected.emit(val);
  }
}
