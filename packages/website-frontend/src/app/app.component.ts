import { Component, OnInit } from '@angular/core';
import { Login } from '@stryker-mutator/dashboard-contract';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'stryker-dashboard',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  user: Login | null = null;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => this.user = user);
  }
}
