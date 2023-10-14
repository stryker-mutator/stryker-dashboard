import { html } from 'lit';
import { BaseElement } from '../base';
import { property } from "lit/decorators.js"

export class StatusBoxComponent extends BaseElement {

  @property()
  boxes = [
    { value: "1500+", label: "projects onboarded", color: "text-yellow-400" },
    { value: "78%", label: "average score", color: "text-green-600" },
    { value: "250", label: "GitHub stars", color: "text-yellow-400" },
  ]

  render() {
    return html` 
    <div class="flex justify-center items-center bg-neutral-800 p-6">
    <div class="w-11/12 md:flex md:justify-around md:max-w-4xl grid justify-center content-around md:h-full h-auto py-16">
    ${this.boxes.map(({ value, label, color }) => html`
      <div class="flex flex-col items-center flex-nowrap md:border-[3px]  border-neutral-600 md:px-4 md:py-2 py-8 rounded sm:w-52 px-0 w-48 h-fit">
        <label class="${color} lg:text-4xl md:text-2xl font-bold text-6xl">${value}</label>
        <label class="text-gray-100 font-bold md:text-lg text-2xl whitespace-nowrap">${label}</label>
      </div>
      `)
      }
    </div>
    </div> `;
  }
}
