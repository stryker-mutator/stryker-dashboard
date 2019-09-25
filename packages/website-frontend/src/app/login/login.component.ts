import { Component, Input } from '@angular/core';

@Component({
  selector: 'stryker-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @Input()
  kind!: 'big' | 'small';

  loginUrl = '/api/auth/github';
}
