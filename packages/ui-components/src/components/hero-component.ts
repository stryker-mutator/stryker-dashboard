import '../exports/hero-button'
import { css, html } from 'lit';
import { BaseElement } from '../base';

interface CloudColors {
  darkest: string,
  darker: string,
  dark: string,
  light: string,
}

type CloudKey = CloudColors[keyof CloudColors];

interface CloudConfig {
  color: CloudKey,
  delay: number;
  scale: number,
  duration: number,
  position: { x: number, y: number }
}

const cloudColors : CloudColors = {
  darkest: 'bg-cyan-900',
  darker: 'bg-cyan-800',
  dark: 'bg-cyan-700',
  light: 'bg-cyan-600'
}

export class HeroComponent extends BaseElement {
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
    `
  ];

  #generateMyRandomClouds(): CloudConfig[] {
    let array: CloudConfig[] = [];
    for (let index = 0; index < 25; index++) {
      array[index] = {
        color: this.#getRandomCloudColor(),
        delay: this.#getRandomFloat(25, 1),
        scale: this.#getRandomFloat(3, 1.25),
        duration: this.#getRandomFloat(100, 35),
        position: { x: 0, y: this.#getRandomInt(450, 25) }
      }
    }

    return array;
  }

  #getRandomCloudColor(): CloudKey {
    switch (this.#getRandomInt(3)) {
      case 0: return cloudColors.darkest;
      case 1: return cloudColors.darker;
      case 2: return cloudColors.dark;
      case 3: return cloudColors.light;
    }

    return cloudColors.darkest;
  }

  #getRandomInt(max: number, min = 1): number {
    return Math.floor(this.#getRandomFloat(max, min));
  }

  #getRandomFloat(max: number, min = 1): number {
    return Math.random() * max
  }

  #clamp(num: number, min: number, max: number) {
    return num <= min 
      ? min 
      : num >= max 
        ? max 
        : num
  }

  render() {
    return html`
      <div class="relative overflow-hidden">
        <div class="hero absolute w-full top-0">
          ${this.#myClouds.map(this.#renderCloud)}
        </div>
        <div class="hero flex justify-center content-center w-full bg-cyan-950">
          <div class="my-auto z-20">
            <h1 class="font-bold text-6xl text-yellow-400 mb-1">Stryker Dashboard</h1>
            <p class="text-center font-bold text-xl text-gray-50">See your reports from anywhere</p>
            <div class="flex justify-center space-x-4 my-8">
              <hero-button text="Get started"></hero-button>
              <hero-button text="What is Stryker?" priority="secondary"></hero-button>  
            </div>
          </div>
        </div>
      </div>
    `;
  }
   
  #renderCloud(config: CloudConfig) {
    return html`
      <div class="opacity-75" style="transform: scale(${config.scale})">
        <div 
          class="cloud-container animate-move relative" 	
          style="
            top: ${config.position.y}px;
            left: ${config.position.x}px;
            transform: scale(${config.delay}); 
            animation-delay: ${config.delay}s; 
            animation-duration: ${config.duration}s"
        >
          <div 
            class="cloud absolute rounded-full ${config.color} h-25 w-25" 
            style="left: 35px; top: 2px;"
          ></div>
          <div 
            class="cloud-small absolute rounded-full ${config.color} h-25 w-25" 
            style="left: 15px; top: 10px;"
          ></div>
          <div class="cloud-pill absolute rounded-full ${config.color} h-25 w-25" style="top: 25px;"></div>
        </div>
      </div>
    `;
  }
}
