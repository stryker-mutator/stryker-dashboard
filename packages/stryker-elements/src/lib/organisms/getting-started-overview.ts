import { TemplateResult, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

import { BaseElement } from '../base-element.js';
import TrailOne from '../../assets/trail-1.svg?raw';
import TrailTwo from '../../assets/trail-2.svg?raw';
import TrailThree from '../../assets/trail-3.svg?raw';

@customElement('sme-getting-started-overview')
export class GettingStartedOverview extends BaseElement {
  static styles = [
    ...BaseElement.styles,
    css`
      .grid-template {
        grid-template-rows: 250px 250px 390px;
        grid-template-columns: 1fr 1fr 200px 1fr 1fr;
      }

      .trail-one {
        margin: 0 0 -140px 20px;
      }

      .trail-two {
        margin: 0 20px -15px 0;
      }

      .trail-three {
        margin: 0 0 -110px -80px;
      }
    `,
  ];

  steps: { title: string; description: TemplateResult }[] = [
    {
      title: '🔒 Sign in through Github',
      description: html`
        <p class="mb-4">
          First, you should
          <a class="text-red-600 underline" href="/api/auth/github">sign in</a>
          through GitHub.
        </p>
        <p>After signing in, you should see a list of all your public repositories.</p>
      `,
    },
    {
      title: '✅ Enable your repository',
      description: html`
        <p class="mb-4">
          Click enable next to the repository you want to use with
          <i>Stryker Dashboard</i>.
        </p>
        <p>
          A token is shown that will be used to upload your report later. Don't worry if you lose it though, you can
          always regenerate it.
        </p>
      `,
    },
    {
      title: '📊 Upload your report',
      description: html`
        <p class="mb-4">
          When using Stryker you can follow
          <a
            class="text-red-600 underline"
            href="https://stryker-mutator.io/docs/General/dashboard/#send-your-first-report"
            >these</a
          >
          steps to be able to upload to <i>Stryker Dashboard</i>.
        </p>
        <p>
          Not using Stryker? No problem! Instead, use your favourite supported mutation testing framework to generate a
          report and to automatically upload it to <i>Stryker Dashboard</i>.
        </p>
      `,
    },
  ];

  render() {
    return html`
      <div class="p-8">
        <sme-spatious-layout>
          <h2 class="text-center text-2xl font-bold text-white">Getting started with Stryker dashboard</h2>
          <div class="grid-template grid">
            <sme-getting-started-step class="col-span-2 self-center" title="${this.steps[0].title}">
              ${this.steps[0].description}
            </sme-getting-started-step>
            <div class="trail-one col-span-3 self-center">${unsafeSVG(TrailOne)}</div>

            <div class="trail-two col-span-3 place-self-end self-center">${unsafeSVG(TrailTwo)}</div>
            <sme-getting-started-step class="col-span-2 self-center" title="${this.steps[1].title}">
              ${this.steps[1].description}
            </sme-getting-started-step>

            <sme-getting-started-step class="col-span-2" title="${this.steps[2].title}">
              ${this.steps[2].description}
            </sme-getting-started-step>
            <div class="trail-three col-span-3 self-center">${unsafeSVG(TrailThree)}</div>
          </div>
          <h2 class="mb-3 text-xl font-bold text-white">🔍 View your results</h2>
          <sme-repository name="Stryker.NET" slug="github.com/stryker-mutator/stryker-net/master"></sme-repository>
        </sme-spatious-layout>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sme-getting-started-overview': GettingStartedOverview;
  }
}
