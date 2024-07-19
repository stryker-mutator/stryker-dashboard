import type { LitElement } from 'lit';

interface CustomElementFixtureOptions {
  autoConnect: boolean;
}

const defaultOptions: Readonly<CustomElementFixtureOptions> = Object.freeze({
  autoConnect: true,
});

export class CustomElementFixture<TCustomElement extends LitElement> {
  public readonly element: TCustomElement;
  private isConnected = false;

  constructor(
    private customElementName: string,
    options?: Partial<CustomElementFixtureOptions>,
  ) {
    if (!customElements.get(customElementName)) {
      throw new Error(`Custom element "${customElementName}" is not defined. Is it a typo on your end?`);
    }
    options = { ...defaultOptions, ...options };
    this.element = document.createElement(customElementName) as TCustomElement;
    if (options.autoConnect) {
      this.connect();
    }
  }

  /**
   * Connects the custom element to the DOM.
   * Only call this manually if you construct the fixture with `{ autoConnect: false }`
   */
  public connect() {
    if (this.isConnected) {
      throw new Error(`Element ${this.customElementName} is already connected to the DOM. Cannot connect a second time.`);
    }
    document.body.appendChild(this.element);
    this.isConnected = true;
  }

  public async whenStable(): Promise<void> {
    while (!(await this.element.updateComplete));
  }

  public waitFor(action: () => boolean, timeout = 500): Promise<void> {
    const step = 50;
    return new Promise<void>((res, rej) => {
      function tick(timeLeft: number) {
        if (action()) {
          res();
        } else if (timeLeft <= 0) {
          rej(new Error(`Condition not met in ${timeout} ms: ${action.toString()}`));
        } else {
          setTimeout(() => tick(timeLeft - step), step);
        }
      }
      tick(timeout);
    });
  }

  public $<TElement extends Element = HTMLElement>(selector: string, inShadow = true): TElement {
    if (inShadow) {
      return this.element.shadowRoot!.querySelector(selector)!;
    } else {
      return this.element.querySelector(selector)!;
    }
  }

  public get style(): CSSStyleDeclaration {
    return getComputedStyle(this.element);
  }

  public dispose() {
    return this.element.remove();
  }


  public async catchNativeEvent(eventType: string, act: () => Promise<void> | void): Promise<Event | undefined> {
    return this.catchEvent(eventType, act);
  }

  private async catchEvent<TEvent extends Event = Event>(eventType: string, act: () => Promise<void> | void): Promise<TEvent | undefined> {
    let actual: Event | undefined;
    const eventListener = (evt: Event) => (actual = evt);
    this.element.addEventListener(eventType, eventListener);
    try {
      await act();
      await this.whenStable();
    } finally {
      this.element.removeEventListener(eventType, eventListener);
    }
    return actual as TEvent;
  }
}