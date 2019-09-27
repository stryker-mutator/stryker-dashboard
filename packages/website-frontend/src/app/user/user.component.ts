import { Component, OnInit } from '@angular/core';
import { Login } from '@stryker-mutator/dashboard-contract';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from '../utils/auto-unsubscribe';

@Component({
  selector: 'stryker-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent extends AutoUnsubscribe implements OnInit {
  user: Login | null = null;
  expanded = false;

  constructor(private authService: AuthService, private router: Router) {
    super();
  }

  ngOnInit() {
    this.subscriptions.push(this.authService.currentUser$.subscribe(user => {
      this.user = user;
    }));
  }

  logOut() {
    this.authService.logOut();
    this.user = null;
    this.router.navigate(['/']);
  }
}
