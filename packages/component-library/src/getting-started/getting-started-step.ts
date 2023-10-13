import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('getting-started-step')
export class GettingStartedStep extends LitElement {
  @property({ type: String })
  title = '🔒 Sign in throught Github';
  @property({ type: String })
  description = 'You should see a list of all your public applications';

  render() {
    return html`
      <div class="getting-started-step">
        <div class="title ">${this.title}</div>
        <div class="description bg-black">
          <p>${this.description}</p>
        </div>
      </div>
    `;
  }

  createRenderRoot() {
    return this;
  }
}
