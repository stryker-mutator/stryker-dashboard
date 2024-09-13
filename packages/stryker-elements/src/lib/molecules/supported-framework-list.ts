import { property } from "lit/decorators.js";
import { BaseElement } from "../base-element";
import { SupportedFrameworkProperties } from "../atoms/supported-framework";
import { html } from "lit";
import '../../exports/lib/atoms/supported-framework';
import { classMap } from "lit/directives/class-map.js";

export class SupportedFrameworkList extends BaseElement {
  @property()
  supportedFrameworks: SupportedFrameworkProperties[] = [];

  @property()
  spacing: 'around' | 'between' = 'around';

  
  render() {
    const classes = classMap({
      'justify-around': this.spacing == 'around',
      'justify-between': this.spacing == 'between',
    });
    return html`
      <div class="flex ${classes}">
        ${this.supportedFrameworks.map(
          (framework) => html`
            <sme-supported-framework
              name="${framework.name}"
              logo="${framework.logo}"
              url="${framework.url}"
            ></sme-supported-framework>
          `
        )}
      </div>
    `;
  }
}
