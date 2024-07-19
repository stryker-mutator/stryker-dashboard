import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import { MutationTestResult } from 'mutation-testing-report-schema';
import 'mutation-testing-elements';

import { reportService } from '../services/report.service';
import { locationService } from '../services/location.service';

@customElement('stryker-dashboard-report-page')
export class ReportPage extends LitElement {
  @state()
  didNotFindReport = false;

  @state()
  report: MutationTestResult | undefined;

  @state()
  sse: string | undefined;

  override connectedCallback(): void {
    super.connectedCallback();

    // get slug from url
    const slug = locationService.getLocation().pathname.split('/reports/').join('');
    reportService.getReport(slug)
      .then((report) => {
        if (report) {
          document.body.style.backgroundColor = 'rgb(24, 24, 27)';
          this.report = report;
        } else {
          this.didNotFindReport = true;
        }
      });
  }

  override render() {
    if (this.didNotFindReport) {
      return html `
        <sme-spatious-layout>
          <sme-notify>Report could not be found...</sme-notify>
        </sme-spatious-layout>
      `;
    }

    return html `
      <mutation-test-report-app .report="${this.report}" @theme-changed=${this.#handleThemeChange}></mutation-test-report-app>
    `;
  }

  #handleThemeChange(event: CustomEvent): void {
    document.body.style.backgroundColor = event.detail.themeBackgroundColor;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'stryker-dashboard-report-page': ReportPage
  }
}
