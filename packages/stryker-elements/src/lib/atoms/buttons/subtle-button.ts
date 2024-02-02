import { Button, buttonTypes } from './button.js';

export class SubtleButton extends Button {
  constructor() {
    super();

    this.type = buttonTypes.subtle;
  }
}
