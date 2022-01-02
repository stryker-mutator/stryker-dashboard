import { Component, Input } from '@angular/core';

@Component({
  selector: 'stryker-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {

  @Input()
  public showContent: any;

}
