import { BaseElement } from '../../base';
import { GettingStartedStep } from './getting-started-step';
import { TemplateResult, css, html } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import TrailOne from '../../assets/trail-1.svg?raw';
import TrailTwo from '../../assets/trail-2.svg?raw';
import TrailThree from '../../assets/trail-3.svg?raw';

customElements.define('getting-started-step', GettingStartedStep);
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
      title: '🔒 Sign in throught Github',
      description: html`
        You should see a list of all your <u>public</u> applications.
      `,
    },
    {
      title: '✅ Enable your repository',
      description: html`
        Click <u>enable</u> next to the repository you want to use with
        <i>Stryker Dashboard</i>.<br /><br />
        A token is shown that will be used to upload your report later. Don't
        worry if you lose it though, you
      `,
    },
    {
      title: '📊 Upload your report',
      description: html`
        Use your favourite Stryker distribution to generate a steps to add your
        token to the report. Follow <a href="/some-url">these</a> steps to add
        your token to the report. This will make sure that <i>Dashboard</i> can
        find it!
      `,
    },
  ];

  render() {
    return html`
      <h2 class="text-center text-white font-bold text-2xl">
        Getting started with dashboard
      </h2>
      <div class="grid grid-template">
        <getting-started-step
          class="self-center col-span-2"
          title="${this.steps[0].title}"
        >
          ${this.steps[0].description}
        </getting-started-step>
        <div class="self-center trail-one col-span-3">
          ${unsafeSVG(TrailOne)}
        </div>

        <div class="self-center trail-two col-span-3 place-self-end">
          ${unsafeSVG(TrailTwo)}
        </div>
        <getting-started-step
          class="self-center col-span-2"
          title="${this.steps[1].title}"
        >
          ${this.steps[1].description}
        </getting-started-step>

        <getting-started-step class="col-span-2" title="${this.steps[2].title}">
          ${this.steps[2].description}
        </getting-started-step>
        <div class="self-center trail-three col-span-3">
          ${unsafeSVG(TrailThree)}
        </div>

        <div></div>
      </div>

      <h2 class="font-bold text-xl mb-3 text-white">🔍 View your results</h2>
      <result-item resultName="your-repository"></result-item>
    `;
  }
}
