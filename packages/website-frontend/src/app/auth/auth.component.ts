import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { zip } from 'rxjs';
import { map, filter, flatMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { notEmpty } from '../utils/filter';
import { AutoUnsubscribe } from '../utils/auto-unsubscribe';

@Component({
  selector: 'stryker-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent extends AutoUnsubscribe implements OnInit {

  public errorMessage: string | undefined;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private authService: AuthService) {
    super();
  }

  get provider$() {
    return this.activatedRoute.params.pipe(
      map(params => params.provider as string | undefined),
      filter(notEmpty)
    );
  }

  get code$() {
    return this.activatedRoute.queryParamMap.pipe(
      map(queryParams => queryParams.get('code')),
      filter(notEmpty)
    );
  }

  public ngOnInit() {
    const sub = zip(this.provider$, this.code$).pipe(
      flatMap(([provider, code]) => this.authService.authenticate(provider, code))
    ).subscribe(user => {
      this.router.navigate(['repos', user.name]);
    }, error => {
      console.error('An error occurred during authentication', error);
      this.errorMessage = 'An error occurred during logon. Please try again.';
    });
    this.subscriptions.push(sub);
  }

}
