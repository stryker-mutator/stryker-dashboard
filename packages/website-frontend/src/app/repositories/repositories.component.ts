import { Component, OnInit } from '@angular/core';

import { Repository } from 'stryker-dashboard-website-contract';
import { UserService } from '../user/user.service';
import { Login } from '../../../../website-contract/src/Login';
import { Router, ActivatedRoute } from '@angular/router';
import { OrganizationsService } from '../organizations/organizations.service';
import { DashboardTitleService } from '../services/DashboardTitleService';

@Component({
  selector: 'stryker-repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.css']
})
export class RepositoriesComponent implements OnInit {

  organizations: Login[];
  user: Login | null;
  selectedLogin: string;

  public repositories: Repository[] | null;

  public constructor(
    private organizationsService: OrganizationsService,
    private userService: UserService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private titleService: DashboardTitleService) {
  }

  public ngOnInit() {
    this.selectedLogin = this.activeRoute.snapshot.params.login;
    this.loadRepositories();
    this.loadUser();
    this.loadOrganizations();
  }

  private loadOrganizations() {
    this.userService.organizations().subscribe(organizations => this.organizations = organizations);
  }

  private loadUser() {
    this.userService.currentUser.subscribe(user => {
      if (!user) {
        this.router.navigate(['']);
      }
      this.user = user;
    });
  }

  public loadRepositories() {
    this.userService.currentUser.subscribe(user => {
      this.activeRoute.params.subscribe(params => {
        this.repositories = null;
        this.titleService.setTitlePrefix(params.login);
        if (user && params.login === user.name) {
          this.userService.getRepositories().subscribe(repositories => {
            this.repositories = repositories;
          });
        } else {
          this.organizationsService.getRepositories(params.login).subscribe(repositories => {
            this.repositories = repositories;
          });
        }
      });
    });
  }

  public selectedLoginChanged(event: UIEvent) {
    this.selectedLogin = (event.target as HTMLSelectElement).value;
    this.router.navigate([this.selectedLogin, 'repositories']);
  }
}
