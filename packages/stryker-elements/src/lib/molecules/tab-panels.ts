import { html, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { classMap } from "lit/directives/class-map.js";

import { BaseElement } from "../base-element";

@customElement('sme-tab-panels')
export class TabPanels extends BaseElement {
  @property({ type: Array })
  tabs: string[] = [];

  @property({ type: Array })
  panels: TemplateResult<1>[] = [];

  @state()
  activeTab: number = 0;

  render() {
    return html`
      <div class="w-full h-full">
        <div class="flex bg-red-900 justify-center">
          ${map(this.tabs, (tab, index) => {
            return html` 
              <sme-button
                @click="${this.#handleTabChange}"
                class="${classMap({ 
                  'bg-red-700': index === this.activeTab,
                  'border-red-500': index === this.activeTab, // separate on multiple lines because it cannot contain whitespace
                  'border-transparent': index !== this.activeTab
                })} border-0 border-b-2 px-2 font-bold transition text-md text-white" 
                type="plain" 
              >${tab}</sme-button>
            `; 
          })}
        </div>
        <div class="w-full h-full">
          ${map(this.panels, (panel, index) => {
            return html`
              <div id="panel-${index}" class="${classMap({ 'hidden': index !== this.activeTab })}">
                ${panel}
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  #handleTabChange(e: Event) {
    const target = e.target as HTMLElement;
    const index = this.tabs.indexOf(target.innerText);
    this.activeTab = index;
  }
}


declare global {
  interface HTMLElementTagNameMap {
    'sme-tab-panels': TabPanels;
  }
}

