import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Repository } from '../../../../../website-backend/src/model'

@Injectable()
export class RepositoryService {

  public constructor(private http: Http) {}

  public getRepositories(): Observable<Repository> {
    return this.http.get('api/repositories')
      .map(response => response.json());
  }

}