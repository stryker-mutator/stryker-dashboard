import { Component, OnInit } from '@angular/core';
import { Login } from '@stryker-mutator/dashboard-contract';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from '../utils/auto-unsubscribe';

@Component({
  selector: 'stryker-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent extends AutoUnsubscribe implements OnInit {
  public user: Login | null = null;
  public expanded = false;

  constructor(
    private readonly authService: AuthService
  ) {
    super();
  }

  public ngOnInit() {
    this.subscriptions.push(
      this.authService.currentUser$.subscribe((user) => {
        this.user = user;
      })
    );
  }

  public logIn() {
    window.location.href = '/api/auth/github';
  }

  public logOut() {
    this.authService.logOut();
    this.user = null;
    window.location.href = '/';
  }
}
