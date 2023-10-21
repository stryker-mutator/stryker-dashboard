export function defineElement(name: string, element: CustomElementConstructor) {
  if (customElements.get(name)) {
    return;
  }

  customElements.define(name, element);
}
