import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { styleMap } from 'lit/directives/style-map.js';

import { BaseElement } from '../base-element.js';

interface CloudColors {
  darkest: string;
  darker: string;
  dark: string;
  light: string;
}

type CloudKey = CloudColors[keyof CloudColors];

interface CloudConfig {
  color: CloudKey;
  delay: number;
  scale: number;
  duration: number;
  position: { x: number; y: number };
}

const cloudColors: CloudColors = {
  darkest: 'fill-cyan-900',
  darker: 'fill-cyan-800',
  dark: 'fill-cyan-700',
  light: 'fill-cyan-600',
};

@customElement('sme-hero')
export class Hero extends BaseElement {
  #myClouds: CloudConfig[];

  constructor() {
    super();

    this.#myClouds = this.#generateMyRandomClouds();
  }

  static styles = [
    ...super.styles,
    css`
      .hero {
        height: 500px;
      }
    `,
  ];

  #generateMyRandomClouds(): CloudConfig[] {
    const array: CloudConfig[] = [];
    for (let index = 0; index < 25; index++) {
      array[index] = {
        color: this.#getRandomCloudColor(),
        delay: this.#getRandomNumber(0, 5),
        scale: this.#getRandomNumber(1, 2),
        duration: this.#getRandomNumber(20, 40),
        position: {
          x: this.#getRandomNumber(-100, 100),
          y: this.#getRandomNumber(-20, 100),
        },
      };
    }

    return array;
  }

  #getRandomCloudColor(): CloudKey {
    switch (Math.floor(this.#getRandomNumber(0, 4))) {
      case 0:
        return cloudColors.darkest;
      case 1:
        return cloudColors.darker;
      case 2:
        return cloudColors.dark;
      case 3:
        return cloudColors.light;
    }

    return cloudColors.darkest;
  }

  #getRandomNumber(min: number, max: number): number {
    return Math.random() * (min - max) + max;
  }

  render() {
    return html`
      <div class="relative overflow-hidden">
        <div class="hero absolute top-0 w-full">${map(this.#myClouds, this.#renderCloud)}</div>
        <div class="hero flex w-full content-center justify-center bg-linear-165 from-cyan-950 to-sky-950">
          <div class="z-20 my-auto drop-shadow-lg">
            <h1 class="mb-2 text-6xl font-bold text-yellow-400">Stryker Dashboard</h1>
            <p class="text-center text-xl font-bold text-gray-50">See your mutation testing reports from anywhere</p>
            <div class="my-8 flex justify-center space-x-4">
              <sme-link primary href="#getting-started">Get started</sme-link>
              <sme-link href="https://stryker-mutator.io/docs/" secondary>What is Stryker?</sme-link>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  #renderCloud(config: CloudConfig) {
    const style = styleMap({
      top: `${config.position.y}%`,
      left: `${config.position.x}%`,
      'animation-delay': `${config.delay}s`,
      'animation-duration': `${config.duration}s`,
    });

    return html`
      <div style="${style}" class="absolute animate-flow opacity-0">
        <svg
          viewBox="0 0 100 52"
          class="${config.color} drop-shadow-md"
          width="100"
          height="52"
          style="transform: scale(${config.scale})"
        >
          <circle cx="60" cy="25" r="25" />
          <circle cx="30" cy="22" r="15" />
          <rect x="0" y="22" width="100" height="30" rx="15" ry="15" />
        </svg>
      </div>
    `;
  }
}
