import { Component, OnInit } from '@angular/core';

import { RepositoryService } from './../repository/repository.service';
import { Repository } from 'stryker-dashboard-website-contract';

@Component({
  selector: 'repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.css']
})
export class RepositoriesComponent implements OnInit {

  public repositories: Repository[];

  public constructor(private repositoryService: RepositoryService) {
    this.repositories = [];
   }

  public ngOnInit() {
    this.loadRepositories();
  }

  public loadRepositories(): void {
    this.repositoryService.getRepositories().subscribe(repositories => {
      this.repositories = repositories;
    });
  }

}
