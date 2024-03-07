import { Component, OnInit } from '@angular/core';
import { Login, Repository } from '@stryker-mutator/dashboard-contract';
import { OrganizationsService } from 'src/app/services/organizations/organizations.service';
import { UserService } from 'src/app/user/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { AutoUnsubscribe } from 'src/app/utils/auto-unsubscribe';
import { combineLatest, Observable } from 'rxjs';
import { map, flatMap, filter, tap } from 'rxjs/operators';
import { notEmpty } from 'src/app/utils/filter';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'stryker-repository-page',
  templateUrl: './repository-page.component.html',
  styleUrls: ['./repository-page.component.scss'],
})
export class RepositoryPageComponent extends AutoUnsubscribe implements OnInit {
  public organizations: Login[] = [];
  public user: Login | null = null;
  public selectedLogin: string | undefined;

  public repositories: Repository[] | null = null;

  public constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly activeRoute: ActivatedRoute,
    private readonly dashboardService: DashboardService
  ) {
    super();
  }

  public ngOnInit() {
    this.loadUser();
    this.loadOrganizations();
    this.loadRepositories();
  }

  private loadOrganizations() {
    this.subscriptions.push(
      this.userService
        .organizations()
        .subscribe((organizations) => (this.organizations = organizations))
    );
  }

  private loadUser() {
    this.subscriptions.push(
      this.authService.currentUser$.subscribe((user) => (this.user = user))
    );
  }

  public changeSelectedOwner(owner: string) {
    this.router.navigate(['repos', owner]);
  }

  public loadRepositories() {
    const selectedOwner$: Observable<string> = this.activeRoute.params.pipe(
      map((params) => params.owner),
      filter(notEmpty)
    );
    const currentUser$ = this.authService.currentUser$.pipe(filter(notEmpty));
    const repositorySubscription = combineLatest(currentUser$, selectedOwner$)
      .pipe(
        tap(() => (this.repositories = null)),
        tap(([, selectedOwner]) =>
          this.dashboardService.setTitlePrefix(selectedOwner)
        ),
        flatMap(([user, selectedOwner]) => {
          if (selectedOwner === user.name) {
            return this.userService.getRepositories();
          } else {
            return this.organizationsService.getRepositories(selectedOwner);
          }
        })
      )
      .subscribe((repositories) => (this.repositories = repositories));
    this.subscriptions.push(repositorySubscription);
  }
}
