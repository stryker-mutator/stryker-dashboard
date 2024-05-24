import { Component, OnInit } from '@angular/core';
import { Login, Repository } from '@stryker-mutator/dashboard-contract';
import { OrganizationsService } from 'src/app/services/organizations/organizations.service';
import { UserService } from 'src/app/user/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { AutoUnsubscribe } from 'src/app/utils/auto-unsubscribe';
import { combineLatest, lastValueFrom, Observable } from 'rxjs';
import { map, flatMap, filter, tap } from 'rxjs/operators';
import { notEmpty } from 'src/app/utils/filter';
import { AuthService } from 'src/app/auth/auth.service';
import { RepositoryService } from 'src/app/repository/repository.service'

@Component({
  selector: 'stryker-repository-page',
  templateUrl: './repository-page.component.html',
  styleUrls: ['./repository-page.component.scss'],
})
export class RepositoryPageComponent extends AutoUnsubscribe implements OnInit {
  public organizations: { name: string, value: string}[] = [];
  public user: Login | null = null;
  public selectedLogin: string | undefined;

  public repositories: Repository[] | null = null;
  public repositorySlug: string | undefined;

  public constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly repositoryService: RepositoryService,
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
        .subscribe((organizations) => {
          this.organizations = [...this.organizations, ...organizations.map(org => ({ name: org.name, value: org.name}))];
        })
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
        tap(([, selectedOwner]) => {
          this.dashboardService.setTitlePrefix(selectedOwner);
          this.organizations.unshift({ name: selectedOwner, value: selectedOwner });
        }),
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

  public hasEnabledRepositories() {
    return this.repositories?.some(r => r.enabled)
  }

  public openModal() {
    document.dispatchEvent(new Event('toggleRepositoriesModal'))
  }

  public openConfigureBadgeModal(event: Repository) {
    this.repositorySlug = `${event.slug}/${event.defaultBranch}`;
    document.dispatchEvent(new Event('configureMutationBadgeModal'))
  }

  public async toggleRepository(event: CustomEvent) {
    const response = await lastValueFrom(this.repositoryService.enableRepository(event.detail.slug, event.detail.checked));
    const element = event.target as HTMLElement;
    if (event.detail.checked) {
      element.setAttribute('apiKey', response?.apiKey);
    }
    element.setAttribute('loading', 'false');
    element.removeAttribute('loading');

    const repository = this.repositories!.find(r => r.slug === event.detail.slug)!;
    repository.enabled = event.detail.checked;
    this.repositories = [...this.repositories!];
  }

  public async changeOrganization(event: CustomEvent) {
    this.changeSelectedOwner(event.detail.value);
  }
}
