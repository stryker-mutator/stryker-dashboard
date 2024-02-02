import { Button, buttonTypes } from './button.js';

export class PrimaryButton extends Button {
  constructor() {
    super();

    this.type = buttonTypes.primary;
  }
}
