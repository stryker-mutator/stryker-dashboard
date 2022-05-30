import { Component, Input } from '@angular/core';

@Component({
  selector: 'stryker-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  @Input()
  public kind!: 'big' | 'small';

  public loginUrl = '/api/auth/github';
}
