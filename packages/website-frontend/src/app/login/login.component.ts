import 'rxjs/add/operator/map';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  authenticated:Boolean = false;

  constructor(private http:Http) { }

  ngOnInit() { 
    this.http.get('/api/me').map(r => r.json()).subscribe((res) => {
      this.authenticated = true;
    });

  }
}
