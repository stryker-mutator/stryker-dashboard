import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Report, constructApiUri } from '@stryker-mutator/dashboard-common';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(private readonly http: HttpClient) {}

  public get(
    slug: string,
    moduleName?: string,
    realTime?: string
  ): Observable<{ report: Report | null; slug: string } | null> {
    const uri = constructApiUri(location.origin, slug, { module: moduleName, realTime: realTime });
    return this.http
      .get<Report>(uri)
      .pipe(
        catchError((err) => {
          if (err.status === 404) {
            return of(null);
          } else {
            return throwError(err);
          }
        }),
        map((report) => ({ report, slug: uri }))
      );
  }
}
