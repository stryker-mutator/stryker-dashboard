import { Component, OnInit } from '@angular/core';
import { UserService } from './user/user.service';
import { Login } from 'stryker-dashboard-website-contract';

@Component({
  selector: 'stryker-dashboard',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  user: Login | null;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(user => this.user = user);
  }

}
