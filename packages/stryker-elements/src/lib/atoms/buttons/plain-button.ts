import { Button, buttonTypes } from './button.js';

export class PlainButton extends Button {
  constructor() {
    super();

    this.type = buttonTypes.plain;
  }
}
