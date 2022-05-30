import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  public async canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Promise<boolean> {
    const signedIn = !!(await this.authService.currentUser$
      .pipe(first())
      .toPromise());
    if (!signedIn) {
      this.router.navigate(['/']);
    }
    return signedIn;
  }
}
