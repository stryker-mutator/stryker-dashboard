import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Report } from '@stryker-mutator/dashboard-common';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(private readonly http: HttpClient) {}

  public get(
    slug: string,
    moduleName?: string
  ): Observable<{ report: Report | null; slug: string } | null> {
    return this.http
      .get<Report>(
        `/api/reports/${slug}${moduleName ? `?module=${moduleName}` : ''}`
      )
      .pipe(
        catchError((err) => {
          if (err.status === 404) {
            return of(null);
          } else {
            return throwError(err);
          }
        }),
        map((report) => ({ report, slug }))
      );
  }
}
