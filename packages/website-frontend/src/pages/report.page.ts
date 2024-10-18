import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';

import { isMutationTestResult, isPendingReport, MutationScoreOnlyResult } from '@stryker-mutator/dashboard-common';
import type { ThemeChangedEvent } from 'mutation-testing-elements';
import 'mutation-testing-elements';
import { MutationTestResult } from 'mutation-testing-report-schema';
import { reportService } from '../services/report.service';
import { locationService } from '../services/location.service';
import { versionService } from '../services/version.service';

type Reports = { 
  main: MutationTestResult | undefined, 
  left: MutationTestResult | undefined, 
  right: MutationTestResult | undefined 
};

@customElement('stryker-dashboard-report-page')
export class ReportPage extends LitElement {
  @state()
  didNotFindReport = false;

  @state()
  loaded = { left: true, right: true }

  @state()
  reports: Reports = {
    main: undefined,
    left: undefined,
    right: undefined
  };

  @state()
  scoreOnlyReport: MutationScoreOnlyResult | undefined;

  @state()
  selection = { left: '', right: '' };

  @state()
  sse: string | undefined;

  @state()
  versions: { name: string, value: string }[] = [];

  override connectedCallback(): void {
    super.connectedCallback();

    void reportService.getReport(this.#slug).then((report) => {
      if (!report) {
        this.didNotFindReport = true;
        return;
      }

      if (isMutationTestResult(report)) {
        this.#prepareStyling();

        if (isPendingReport(report)) {
          this.sse = `/api/real-time/${this.#sseSlug}`;
        }

        this.reports.main = report;
        // For comparing, initialize the left side with the main report
        this.reports = { ...this.reports, left: report };
        this.selection.left = this.#version;
        return;
      }

      this.scoreOnlyReport = report;
    });

    void versionService.versions(this.#baseSlug).then((versions) => {
      this.versions = versions.map(version => ({ name: version, value: version }));
    });
  }

  #prepareStyling() {
    this.style.cssText = `
      display: flex;
      flex-direction: column;
      height: 100%;
    `;
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
      <sme-loader useSpinner .loading="${!this.reports.main}">
        ${when(this.reports.main, () => { 
          return html`
            <sme-tab-panels 
              .tabs="${["Report", "Compare"]}" 
              .panels="${[this.#renderReport(), this.#renderCompareView()]}"
            ></sme-tab-panels>
          `;
        })}
      </sme-loader>
    `;
  }

  #renderReport() {
    return html`
      <mutation-test-report-app
        @theme-changed=${this.#handleThemeChange}
        .titlePostfix="${this.#title}"
        .report="${this.reports.main}"
        sse="${ifDefined(this.sse)}"
      ></mutation-test-report-app>`;
  }

  #renderCompareView() {
    return html`
      <sme-split-layout withBackground>
        <div slot="left">
          <sme-dropdown 
            @dropdownChanged="${(e: CustomEvent) => this.#handleLeftVersionChange(e)}" 
            .options="${this.versions}"
            .selectedOption="${this.selection.left}"
          ></sme-dropdown>
          <sme-loader useSpinner .loading="${this.loaded.left}">
            <mutation-test-report-app
              .report="${this.reports.left}"
              sse="${ifDefined(this.sse)}"
            ></mutation-test-report-app>
          </sme-loader>
        </div>
        <div slot="right">
          <sme-dropdown 
            @dropdownChanged="${(e: CustomEvent) => this.#handleRightVersionChange(e)}" 
            .options="${this.versions}"
            .selectedOption="${this.selection.right}"
            ?withDisabledEmtpyOption="${this.selection.right !== undefined}"
          ></sme-dropdown>
          <sme-loader ?doneWithLoading="${this.loaded.right}">
            <mutation-test-report-app
              .report="${this.reports.right}"
              sse="${ifDefined(this.sse)}"
            ></mutation-test-report-app>
          </sme-loader>
        </div>
      </sme-split-layout>
    `;
  }

  async #handleLeftVersionChange(event: CustomEvent<{ value: string }>) {
    this.selection = { ...this.selection, left: event.detail.value };
    await this.#handleVersionChange(event, 'left');
  }

  async #handleRightVersionChange(event: CustomEvent<{ value: string }>) {
    this.selection = { ...this.selection, right: event.detail.value };
    await this.#handleVersionChange(event, 'right');
  }

  async #handleVersionChange(event: CustomEvent<{ value: string }>, direction: 'left' | 'right') {
    this.loaded = { ...this.loaded, [direction]: false };

    const report = await reportService.getReport(this.#configureSlugWithVersion(event.detail.value))
    if (report == undefined) {
      return;
    }

    if (!isMutationTestResult(report)) {
      return;
    }

    setTimeout(() => {
      this.reports = { ...this.reports, [direction]: report };
      this.loaded = { ...this.loaded, [direction]: true };  
    }, 250);
  }

  get #baseSlug() {
    return locationService.getLocation().pathname.split('/reports/').join('');
  }

  get #slug() {
    const location = locationService.getLocation();
    return location.search ? this.#baseSlug + location.search : this.#baseSlug;
  }

  get #sseSlug() {
    const location = locationService.getLocation();
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('realTime');

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

    return `${slugWithoutProviderAndOrganization}${baseTitle}`;
  }

  get #version(): string {
    return this.#slug.split('/').pop() ?? '';
  }

  get #slugWithoutVersion() {
    return this.#slug.split('/').slice(0, -1).join('/');
  }

  #configureSlugWithVersion(version: string) {
    return `${this.#slugWithoutVersion}/${version}`;
  }

  #handleThemeChange(event: ThemeChangedEvent): void {
    this.style.backgroundColor = event.detail.themeBackgroundColor;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'stryker-dashboard-report-page': ReportPage;
  }
}
