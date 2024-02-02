import { Button, buttonTypes } from './button.js';

export class SecondaryButton extends Button {
  constructor() {
    super();

    this.type = buttonTypes.secondary;
  }
}
