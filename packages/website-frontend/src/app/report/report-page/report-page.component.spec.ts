import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPageComponent } from './report-page.component';
import { CUSTOM_ELEMENTS_SCHEMA, Type } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Params, UrlSegment, convertToParamMap } from '@angular/router';
import { Subject } from 'rxjs';
import { Report } from '@stryker-mutator/dashboard-common';

function createUrlSegment(overrides: Partial<UrlSegment>): UrlSegment {
  return {
    parameterMap: convertToParamMap({}),
    parameters: {},
    path: '',
    toString() { return 'urlSegmentStub'; },
    ...overrides
  };
}

function createFullReport(overrides?: Partial<Report>): Report {
  return {
    moduleName: 'core',
    mutationScore: 42,
    projectName: 'github/stryker-mutator/stryker',
    version: '1',
    files: {},
    schemaVersion: '1',
    thresholds: { high: 80, low: 60 },
    ...overrides
  };
}
function createMutationScoreOnlyReport(mutationScore = 42): Report {
  return {
    moduleName: 'core',
    mutationScore,
    projectName: 'github/stryker-mutator/stryker',
    version: '1'
  };
}

describe(ReportPageComponent.name, () => {
  let element: HTMLElement;
  let fixture: ComponentFixture<ReportPageComponent>;
  let http: HttpTestingController;
  let queryParam$: Subject<Params>;
  let url$: Subject<UrlSegment[]>;

  beforeEach(async () => {
    queryParam$ = new Subject();
    url$ = new Subject();
    const routeMock = {
      queryParams: queryParam$,
      url: url$
    };
    await TestBed.configureTestingModule({
      declarations: [ReportPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ActivatedRoute, useValue: routeMock }
      ],
      imports: [
        HttpClientTestingModule
      ]
    }).compileComponents();
    http = TestBed.get(HttpTestingController as Type<HttpTestingController>);
    fixture = TestBed.createComponent(ReportPageComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('ngOnInit', () => {

    it('should show loading animation', () => {
      const loading = element.querySelector('stryker-loading') as HTMLElement & { showContent: boolean };
      expect(loading.showContent).toBeFalsy();
    });

    it('should show the report once it is loaded', async () => {
      // Arrange
      url$.next([createUrlSegment({ path: 'someRepo' })]);
      queryParam$.next({ module: null });
      http.expectOne('/api/reports/someRepo').flush(createFullReport());

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      const loading = element.querySelector('stryker-loading') as HTMLElement & { showContent: boolean };
      expect(loading.showContent).toBeTruthy();
      expect(loading.querySelector('mutation-test-report-app')).toBeTruthy();
    });

    it('should retrieve the correct report and bind it on the correct component', async () => {
      // Arrange
      const expectedReport = createFullReport();
      url$.next([
        createUrlSegment({ path: 'github' }),
        createUrlSegment({ path: 'stryker-mutator' }),
        createUrlSegment({ path: 'stryker' }),
        createUrlSegment({ path: 'master' }),
      ]);
      queryParam$.next({ module: 'core' });
      http.expectOne('/api/reports/github/stryker-mutator/stryker/master?module=core').flush(expectedReport);

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      const mutationTestingReportApp = element.querySelector('mutation-test-report-app') as
        HTMLElement & { report: typeof expectedReport };
      expect(mutationTestingReportApp.report).toBe(expectedReport);
    });

    it('should show an error message if the report does not exist', async () => {
      // Arrange
      url$.next([createUrlSegment({ path: 'someRepo' })]);
      queryParam$.next({ module: null });
      http.expectOne('/api/reports/someRepo').flush(null, { statusText: 'Not found', status: 404 });

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      const loading = element.querySelector('stryker-loading') as HTMLElement & { showContent: boolean };
      const alert = loading.querySelector('.alert');
      expect(loading.showContent).toBeTruthy();
      expect(alert).toBeTruthy();
      expect(alert.textContent).toEqual('Report does not exist');
    });

    it('should show an alternative report if the html report result was empty', async () => {
      // Arrange
      url$.next([createUrlSegment({ path: 'someRepo' })]);
      queryParam$.next({ module: null });
      http.expectOne('/api/reports/someRepo').flush(createMutationScoreOnlyReport(83));

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      const loading = element.querySelector('stryker-loading') as HTMLElement & { showContent: boolean };
      const alert = loading.querySelector('.alert');
      expect(loading.showContent).toBeTruthy();
      expect(alert).toBeTruthy();
      expect(alert.textContent).toEqual('No html report stored for github/stryker-mutator/stryker/1/core');
      expect(element.textContent).toContain('Mutation score: 83');
    });

    it('should show a technical error if the report retrieval resulted in a technical error', async () => {
      // Arrange
      url$.next([createUrlSegment({ path: 'someRepo' })]);
      queryParam$.next({ module: null });
      http.expectOne('/api/reports/someRepo').flush(null, { status: 500, statusText: 'Internal Server Error' });

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      const alert = element.querySelector('.alert');
      expect(alert).toBeTruthy();
      expect(alert.textContent).toEqual('A technical error occurred.');
    });
  });
});
