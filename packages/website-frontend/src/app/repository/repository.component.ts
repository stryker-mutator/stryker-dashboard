import { Component, OnInit, Input } from '@angular/core';
import { Repository } from 'stryker-dashboard-website-contract';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

@Component({
  selector: 'stryker-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.css']
})
export class RepositoryComponent implements OnInit {

  @Input() public repo: Repository;
  private modalOptions: NgbModalOptions;

  public constructor(private modalService: NgbModal) {
    this.modalOptions = { size: 'lg' };
  }

  public ngOnInit() { }

  public switchClicked(checkbox: HTMLInputElement, content: NgbActiveModal) {
    this.modalService.open(content, this.modalOptions).result.then(() => {
      this.flipSwitch(checkbox);
    }, () => {
      // modal dismissed, no need to do anything
    });
  }

  private flipSwitch(checkbox: HTMLInputElement) {
    this.repo.enabled = !this.repo.enabled;
    checkbox.checked = this.repo.enabled;
  }

}
