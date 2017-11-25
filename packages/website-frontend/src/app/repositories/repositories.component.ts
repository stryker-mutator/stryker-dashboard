import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.css']
})
export class RepositoriesComponent implements OnInit {

  repositories: any[];

  constructor() {
    this.loadRepositories();
   }

  ngOnInit() {
    this.loadRepositories();
  }

  public loadRepositories(): void {
    this.repositories = [
      { id: 1, fullName: 'My first amazing repo' },
      { id: 2, fullName: 'Another great repo' },
      { id: 3, fullName: 'Repo repo repo' },
      { id: 4, fullName: 'Yet another repo' },
      { id: 5, fullName: 'The last of the repos' }
    ];
  }

}
