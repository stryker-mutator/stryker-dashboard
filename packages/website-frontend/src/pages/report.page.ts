import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';

import { MutationTestResult } from 'mutation-testing-report-schema';
import 'mutation-testing-elements';

import { reportService } from '../services/report.service';
import { locationService } from '../services/location.service';
import { isMutationTestResult, isPendingReport, MutationScoreOnlyResult } from '@stryker-mutator/dashboard-common';

@customElement('stryker-dashboard-report-page')
export class ReportPage extends LitElement {
  @state()
  didNotFindReport = false;

  @state()
  scoreOnlyReport: MutationScoreOnlyResult | undefined;

  @state()
  report: MutationTestResult | undefined;

  @state()
  sse: string | undefined;

  override connectedCallback(): void {
    super.connectedCallback();

    void reportService.getReport(this.#slug).then((report) => {
      if (report == undefined) {
        this.didNotFindReport = true;
        return;
      }

        if (isMutationTestResult(report)) {
          this.#prepareStyling();

        if (isPendingReport(report)) {
          this.sse = `/api/real-time/${this.#sseSlug}`;
        }

        this.report = report;
        return;
      }

      this.scoreOnlyReport = report;
    });
  }

  #prepareStyling() {
    this.style.display = 'flex';
    this.style.flexDirection = 'column';
    this.style.height = '100%';
  }

  override render() {
    if (this.didNotFindReport) {
      return html`
        <sme-spatious-layout>
          <sme-notify>Report could not be found...</sme-notify>
        </sme-spatious-layout>
      `;
    }

    if (this.scoreOnlyReport) {
      return html`
        <sme-spatious-layout>
          <sme-notify type="info">No html report stored for ${this.#slug}</sme-notify>
          <sme-text>Mutation score: ${this.scoreOnlyReport.mutationScore}</sme-text>
        </sme-spatious-layout>
      `;
    }

    return html`
      <sme-loader ?doneWithLoading="${!!this.report}">
        ${when(this.report, () => html`
          <mutation-test-report-app
            @theme-changed=${this.#handleThemeChange}
            .titlePostfix="${this.#title}"
            .report="${this.report}"
            sse="${ifDefined(this.sse)}"
          ></mutation-test-report-app>
        `)}
        ${when(
          this.report,
          () =>
            html`<mutation-test-report-app
              @theme-changed=${this.#handleThemeChange}
              .titlePostfix="${this.#title}"
              .report="${this.report}"
              sse="${ifDefined(this.sse)}"
            ></mutation-test-report-app>`,
        )}
      </sme-loader>
    `;
  }

  get #baseSlug() {
    return locationService.getLocation().pathname.split('/reports/').join('');
  }

  get #slug() {
    const location = locationService.getLocation();
    return location.search
      ? this.#baseSlug + location.search
      : this.#baseSlug;
    return location.search ? this.#baseSlug + location.search : this.#baseSlug;
  }

  get #sseSlug() {
    const location = locationService.getLocation();
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('realTime');

    return searchParams.has('module')
      ? `${this.#baseSlug}?${searchParams}`
      : this.#baseSlug;

    return searchParams.has('module') ? `${this.#baseSlug}?${searchParams.toString()}` : this.#baseSlug;
  }

  get #title(): string {
    const location = locationService.getLocation();
    const searchParams = new URLSearchParams(location.search);
    const module = searchParams.get('module');

    const slugWithoutProviderAndOrganization = this.#baseSlug.split('/').slice(2).join('/');
    const baseTitle = ' - Stryker Dashboard';
    if (module) {
      return `${slugWithoutProviderAndOrganization}/${module}${baseTitle}`;
    }

    return `${slugWithoutProviderAndOrganization}${baseTitle}`

    return `${slugWithoutProviderAndOrganization}${baseTitle}`;
  }

  #handleThemeChange(event: CustomEvent<{ themeBackgroundColor: string }>): void {
    this.style.backgroundColor = event.detail.themeBackgroundColor;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'stryker-dashboard-report-page': ReportPage;
  }
}
