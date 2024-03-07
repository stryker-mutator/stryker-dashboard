import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import '@github/clipboard-copy-element';
import { copy as copySvg } from '@primer/octicons';

@Component({
  selector: 'stryker-clipboard-copy',
  template: `<clipboard-copy
    [attr.for]="for"
    [innerHtml]="copy"
  ></clipboard-copy>`,
  host: {
    class: 'btn btn-sm pt-0',
  },
})
export class ClipboardCopyComponent {
  @Input()
  public for: string | undefined;
  public copy: SafeHtml;
  constructor(sanitizer: DomSanitizer) {
    this.copy = sanitizer.bypassSecurityTrustHtml(copySvg.toSVG());
  }
}
