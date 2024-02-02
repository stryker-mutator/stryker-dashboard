import { css, html } from 'lit';
import { map } from 'lit/directives/map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { BaseElement } from '../base-element.js';

import '../../exports/lib/atoms/buttons/button.js';
import '../../exports/lib/atoms/link.js';

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
  darkest: 'bg-cyan-900',
  darker: 'bg-cyan-800',
  dark: 'bg-cyan-700',
  light: 'bg-cyan-600',
};

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

      .cloud {
        height: 50px;
        width: 50px;
      }

      .cloud-pill {
        height: 30px;
        width: 100px;
      }

      .cloud-small {
        height: 30px;
        width: 30px;
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
        <div
          class="hero flex w-full content-center justify-center bg-gradient-to-b from-cyan-950 to-sky-950"
        >
          <div class="z-20 my-auto">
            <h1 class="mb-2 text-6xl font-bold text-yellow-400">Stryker Dashboard</h1>
            <p class="text-center text-xl font-bold text-gray-50">
              See your mutation testing reports from anywhere
            </p>
            <div class="my-8 flex justify-center space-x-4">
              <sme-link primary href="#getting-started">Get started</sme-link>
              <sme-link href="https://stryker-mutator.io/docs/" secondary
                >What is Stryker?</sme-link
              >
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
      transform: `scale(${config.duration})`,
      'animation-delay': `${config.delay}s`,
      'animation-duration': `${config.duration}s`,
    });

    return html`
      <div style="${style}" class="cloud-container absolute animate-flow opacity-0">
        <div style="transform: scale(${config.scale})" class="absolute">
          <div
            class="cloud ${config.color} h-25 w-25 absolute rounded-full"
            style="left: 35px; top: 2px;"
          ></div>
          <div
            class="cloud-small ${config.color} h-25 w-25 absolute rounded-full"
            style="left: 15px; top: 10px;"
          ></div>
          <div
            class="cloud-pill ${config.color} h-25 w-25 absolute rounded-full"
            style="top: 25px;"
          ></div>
        </div>
      </div>
    `;
  }
}
