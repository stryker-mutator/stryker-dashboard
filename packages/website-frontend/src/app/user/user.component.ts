import { Component, OnInit } from '@angular/core';
import { Login } from 'stryker-dashboard-website-contract';
import { UserService } from './user.service';

@Component({
  selector: 'stryker-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: Login | null;
  expanded = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  logOut() {
    this.userService.logout().subscribe(() => window.location.href = '/');
  }
}
