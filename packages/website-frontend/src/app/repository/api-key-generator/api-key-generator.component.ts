import { Component, Input, Output, EventEmitter } from '@angular/core';

export type ApiKeyDisplayMode = 'show' | 'hide' | 'loading';

@Component({
  selector: 'stryker-api-key-generator',
  templateUrl: './api-key-generator.component.html',
})
export class ApiKeyGeneratorComponent {
  @Input()
  public apiKey: string | undefined;

  @Input()
  public slug: string | undefined;

  @Input()
  public mode: ApiKeyDisplayMode = 'hide';

  @Output()
  public generate = new EventEmitter<void>();

  constructor() {}

  public get displayKey() {
    switch (this.mode) {
      case 'hide':
        return '••••••••••••••••••••••••••••••••••••';
      case 'loading':
        return 'Generating...';
      default:
        return this.apiKey;
    }
  }

  public generateApiKeyClicked() {
    this.generate.emit();
  }
}
