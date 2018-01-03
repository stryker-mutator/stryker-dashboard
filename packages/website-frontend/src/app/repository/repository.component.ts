import { Component, OnInit, Input } from '@angular/core';
import { Repository } from 'stryker-dashboard-website-contract';

@Component({
  selector: 'repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.css']
})
export class RepositoryComponent implements OnInit {

  @Input() value: Repository;

  public constructor() { }

  public ngOnInit() { }

}
