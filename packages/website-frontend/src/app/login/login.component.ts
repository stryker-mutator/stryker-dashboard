import { Component, OnInit } from '@angular/core';

import { UserService } from './../user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  authenticated:boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit() { 
    this.userService.login().subscribe({ next: () => {
      this.authenticated = true;
    }, error: (res: any) => {
      console.error('Failed to login user', res);
    }});
  }

}
