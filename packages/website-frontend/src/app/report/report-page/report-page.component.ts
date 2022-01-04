import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, flatMap } from 'rxjs/operators';
import { Subscription, combineLatest } from 'rxjs';
import { ReportsService } from '../ReportsService';
import { MutationScoreOnlyResult, Report, ReportIdentifier, isMutationTestResult } from '@stryker-mutator/dashboard-common';
import { AutoUnsubscribe } from 'src/app/utils/auto-unsubscribe';
import { MutationTestResult } from 'mutation-testing-report-schema';

interface ThemeDetail {
  theme: string;
  themeBackgroundColor: string;
}

@Component({
  selector: 'stryker-report',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.scss']
})
export class ReportPageComponent extends AutoUnsubscribe implements OnInit, OnDestroy {

  public src!: string;
  public id: ReportIdentifier | undefined;
  public mutationTestResult: MutationTestResult | undefined;
  public mutationScoreOnlyResult: MutationScoreOnlyResult | undefined;
  public errorMessage: string | undefined;

  public backgroundColor: string | undefined;

  public get reportTitle() {
    const reportParts: string[] = [];
    if (this.id) {
      reportParts.push(this.id.projectName.substr(this.id.projectName.lastIndexOf('/') + 1));
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

  constructor(private readonly route: ActivatedRoute, private readonly reportService: ReportsService) {
    super();
  }

  public ngOnInit() {

    const moduleName$ = this.route.queryParams.pipe(
      map(queryParams => queryParams.module as string | undefined)
    );

    const slug$ = this.route.url.pipe(
      map(pathSegments => pathSegments.map(pathSegment => pathSegment.path).join('/'))
    );

    this.subscriptions.push(combineLatest(slug$, moduleName$).pipe(
      flatMap(([slug, moduleName]) => this.reportService.get(slug, moduleName))
    ).subscribe(report => {
      if (report) {
        this.id = report;
        if (isMutationTestResult(report)) {
          this.mutationTestResult = report;
        } else {
          this.mutationScoreOnlyResult = report;
        }
      } else {
        this.errorMessage = 'Report does not exist';
      }
    }, error => {
      console.error(error);
      this.errorMessage = 'A technical error occurred.';
    }));
  }

  public themeChanged = (event: Event) => {
    const themeChangedEvent = event as CustomEvent<ThemeDetail>;
    this.backgroundColor = themeChangedEvent.detail.themeBackgroundColor;
  }

}
