import { Component, OnInit } from '@angular/core';

import { RepositoryService } from './../../services/repository/repository.service';
import { Repository } from '../../../../../website-backend/src/model';

@Component({
  selector: 'repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.css']
})
export class RepositoriesComponent implements OnInit {

  private repositories: Repository[];

  public constructor(private repositoryService: RepositoryService) {
    this.repositories = [];
   }

  public ngOnInit() {
    this.loadRepositories();
  }

  public loadRepositories(): void {
    this.repositoryService.getRepositories().subscribe(repository => {
      this.repositories.push(repository);
    });
  }

}
