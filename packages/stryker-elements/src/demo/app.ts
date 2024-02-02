import { html } from 'lit';

import '../tailwind-styles/global.css';
import { defineElement } from '../define-element';
import { BaseElement } from '../lib/base-element';

export class DemoApp extends BaseElement {
  render() {
    return html` <sme-top-bar
        logoUrl="https://stryker-mutator.io/images/stryker.svg"
      >
        <sme-profile-button
          slot="right-side"
          avatarUrl="https://avatars.githubusercontent.com/u/34238405?v=4"
        ></sme-profile-button>
      </sme-top-bar>
      <sme-hero></sme-hero>
      <sme-stryker-dashboard-explanation></sme-stryker-dashboard-explanation>
      <sme-spatious-layout>
        <sme-notify
          message="It appears you do not have any enabled repositories, enable by clicking on the add button."
        ></sme-notify>
        <sme-getting-started-overview
          id="getting-started"
        ></sme-getting-started-overview>
      </sme-spatious-layout>
      <sme-dropdown
        label="Your organizations"
        .options="${[
          { name: 'org-1', value: 'test-1' },
          { name: 'org-2', value: 'test-2' },
        ]}"
      ></sme-dropdown>
      <sme-modal title="Enable repositories" eventName="my-modal">
        <sme-toggle-repository
          .enabled="true"
          name="my-repo-1"
        ></sme-toggle-repository>
        <sme-toggle-repository name="my-repo-2"></sme-toggle-repository>
        <sme-toggle-repository name="my-repo-3"></sme-toggle-repository>
        <sme-toggle-repository name="my-repo-4"></sme-toggle-repository>
        <sme-toggle-repository name="my-repo-5"></sme-toggle-repository>
        <sme-toggle-repository name="my-repo-6"></sme-toggle-repository>
        <sme-toggle-repository name="my-repo-7"></sme-toggle-repository>
        <sme-toggle-repository name="my-repo-8"></sme-toggle-repository>
        <sme-toggle-repository name="my-repo-9"></sme-toggle-repository>
        <sme-toggle-repository name="my-repo-10"></sme-toggle-repository>
        <sme-toggle-repository name="my-repo-11"></sme-toggle-repository>
        <sme-toggle-repository name="my-repo-12"></sme-toggle-repository>
        <sme-toggle-repository name="my-repo-13"></sme-toggle-repository>
        <sme-toggle-repository name="my-repo-14"></sme-toggle-repository>
        <sme-toggle-repository name="my-repo-15"></sme-toggle-repository>
      </sme-modal>`;
  }
}

defineElement('sme-app', DemoApp);
