import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.css']
})
export class RepositoryComponent implements OnInit {

  @Input() private fullName:String;
  @Input() private id:number;

  public constructor() {}

  public ngOnInit() {}

}
