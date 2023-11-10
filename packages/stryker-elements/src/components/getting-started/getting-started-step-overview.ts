import { BaseElement } from '../../base';
import { TemplateResult, css, html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import TrailOne from '../../assets/trail-1.svg?raw';
import TrailTwo from '../../assets/trail-2.svg?raw';
import TrailThree from '../../assets/trail-3.svg?raw';

export class GettingStartedStepOverview extends BaseElement {
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
        You should see a list of all your public repositories.
      `,
    },
    {
      title: '✅ Enable your repository',
      description: html`
        <p>
          Click enable next to the repository you want to use with
          <i>Stryker Dashboard</i>.
        </p>
        <p class="mt-4">
          A token is shown that will be used to upload your report later. Don't
          worry if you lose it though, you can always regenerate it.
        </p>
      `,
    },
    {
      title: '📊 Upload your report',
      description: html`
        Follow
        <a
          class="text-red-600 underline"
          href="https://stryker-mutator.io/docs/General/dashboard/#send-your-first-report"
          >these</a
        >
        steps to create a new token that you can use to authenticate to
        <i>Stryker Dashboard</i>. Use your favourite supported mutation testing
        framework to generate a report and to automatically upload it to
        <i>Stryker Dashboard</i>.
      `,
    },
  ];

  render() {
    return html`
      <h2
        class="text-center text-2xl font-bold text-white"
        id="getting-started"
      >
        Getting started with Stryker dashboard
      </h2>
      <div class="grid-template grid">
        <getting-started-step
          class="col-span-2 self-center"
          title="${this.steps[0].title}"
        >
          ${this.steps[0].description}
        </getting-started-step>
        <div class="trail-one col-span-3 self-center">
          ${unsafeSVG(TrailOne)}
        </div>

        <div class="trail-two col-span-3 place-self-end self-center">
          ${unsafeSVG(TrailTwo)}
        </div>
        <getting-started-step
          class="col-span-2 self-center"
          title="${this.steps[1].title}"
        >
          ${this.steps[1].description}
        </getting-started-step>

        <getting-started-step class="col-span-2" title="${this.steps[2].title}">
          ${this.steps[2].description}
        </getting-started-step>
        <div class="trail-three col-span-3 self-center">
          ${unsafeSVG(TrailThree)}
        </div>
      </div>
      <h2 class="mb-3 text-xl font-bold text-white">🔍 View your results</h2>
      <result-item resultName="your-repository"></result-item>
    `;
  }
}
