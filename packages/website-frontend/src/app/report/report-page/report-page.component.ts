import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  Directive,
  EventEmitter,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap, distinctUntilChanged } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { ReportsService } from '../ReportsService';
import {
  MutationScoreOnlyResult,
  ReportIdentifier,
  isMutationTestResult,
  isPendingReport,
} from '@stryker-mutator/dashboard-common';
import { AutoUnsubscribe } from 'src/app/utils/auto-unsubscribe';
import { MutationTestResult } from 'mutation-testing-report-schema';

import 'mutation-testing-elements';

interface ThemeDetail {
  theme: string;
  themeBackgroundColor: string;
}

// Wrap the native custom event in a directive so angular can attach an eventListener
@Directive({ selector: 'mutation-test-report-app', outputs: ['themeChange'] })
export class MutationTestReportAppTheme {
  private themeChange = new EventEmitter();
  @HostListener('theme-changed', ['$event'])
  themeChanged(event: CustomEvent<ThemeDetail>) {
    this.themeChange.emit(event);
  }
}

@Component({
  selector: 'stryker-report',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.scss'],
})
export class ReportPageComponent
  extends AutoUnsubscribe
  implements OnInit, OnDestroy
{
  public src!: string;
  public sse: string | undefined;
  public id: ReportIdentifier | undefined;
  public mutationTestResult: MutationTestResult | undefined;
  public mutationScoreOnlyResult: MutationScoreOnlyResult | undefined;
  public errorMessage: string | undefined;

  public backgroundColor: string | undefined;

  public get reportTitle() {
    const reportParts: string[] = [];
    if (this.id) {
      reportParts.push(
        this.id.projectName.substring(this.id.projectName.lastIndexOf('/') + 1)
      );
      reportParts.push(this.id.version);
      if (this.id.moduleName) {
        reportParts.push(this.id.moduleName);
      }
    }
    return `${reportParts.join('/')} - Stryker Dashboard`;
  }

  public get doneLoading() {
    return this.errorMessage || this.id;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly reportService: ReportsService
  ) {
    super();
  }

  public ngOnInit() {
    const queryParams$: Observable<[string | undefined, string | undefined]> =
      this.route.queryParams.pipe(
        map((queryParams) => [
          queryParams.module as string | undefined,
          queryParams.realTime as string | undefined,
        ])
      );

    const slug$ = this.route.url.pipe(
      map((pathSegments) =>
        pathSegments.map((pathSegment) => pathSegment.path).join('/')
      )
    );

    this.subscriptions.push(
      combineLatest<[string, [string | undefined, string | undefined]]>([
        slug$,
        queryParams$,
      ])
        .pipe(
          distinctUntilChanged(
            (previous, current) => previous[0] === current[0]
          )
        )
        .pipe(
          mergeMap(([slug, [moduleName, realTime]]) =>
            this.reportService.get(slug, moduleName, realTime)
          )
        )
        .subscribe({
          next: (object) => {
            if (!object?.report) {
              this.errorMessage = 'Report does not exist';
              return;
            }

            this.id = object.report;
            if (isMutationTestResult(object.report)) {
              this.mutationTestResult = object.report;
              if (isPendingReport(object.report)) {
                // We grab everything behind the /api/reports/ url, the first index is empty so skip it.
                this.sse = `/api/real-time/${object.slug.split("/api/reports/")[1]}`;
              }
            } else {
              this.mutationScoreOnlyResult = object.report;
            }
          },
          error: (error) => {
            console.error(error);
            this.errorMessage = 'A technical error occurred.';
          },
        })
    );
  }

  public themeChanged = (event: Event) => {
    const themeChangedEvent = event as CustomEvent<ThemeDetail>;
    this.backgroundColor = themeChangedEvent.detail.themeBackgroundColor;
  };
}
