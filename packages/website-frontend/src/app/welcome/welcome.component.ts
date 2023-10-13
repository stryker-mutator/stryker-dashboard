import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { TestElement } from 'ui-components';

@Component({
  selector: 'stryker-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  public ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.router.navigate(['repos', user.name]);
      }
    });
  }
}
