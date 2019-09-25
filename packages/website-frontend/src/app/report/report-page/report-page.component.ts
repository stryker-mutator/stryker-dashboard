import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, flatMap } from 'rxjs/operators';
import { Subscription, combineLatest } from 'rxjs';
import { ReportsService } from '../ReportsService';
import { Report } from 'stryker-dashboard-website-contract';
import { AutoUnsubscribe } from 'src/app/utils/auto-unsubscribe';

@Component({
  selector: 'stryker-report',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.scss']
})
export class ReportPageComponent extends AutoUnsubscribe implements OnInit, OnDestroy {

  public src!: string;
  private sub!: Subscription;
  public report: Report | undefined;
  public errorMessage: string | undefined;

  constructor(private route: ActivatedRoute, private reportService: ReportsService) {
    super();
  }

  ngOnInit() {

    const moduleName$ = this.route.queryParams.pipe(
      map(queryParams => queryParams.module as string | undefined)
    );

    const slug$ = this.route.url.pipe(
      map(pathSegments => pathSegments.map(pathSegment => pathSegment.path).join('/'))
    );

    this.subscriptions.push(combineLatest(slug$, moduleName$).pipe(
      flatMap(([slug, moduleName]) => this.reportService.get(slug, moduleName))
    ).subscribe(report => {
      if (report && report.result) {
        this.report = report;
      } else {
        this.errorMessage = 'Report does not exist';
      }
    }, error => {
        console.error(error);
        this.errorMessage = 'A technical error occurred.';
    }));
  }

}
