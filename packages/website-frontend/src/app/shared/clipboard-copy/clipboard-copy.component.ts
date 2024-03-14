import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import '@github/clipboard-copy-element';
import { copy as copySvg, check as checkSvg } from '@primer/octicons';

@Component({
  selector: 'stryker-clipboard-copy',
  template: `<clipboard-copy
    [attr.for]="for"
    [innerHtml]="inner"
    (clipboard-copy)="setCheck()"
  ></clipboard-copy>`,
  host: {
    class: 'btn btn-sm pt-0',
  },
})
export class ClipboardCopyComponent {
  @Input()
  public for: string | undefined;
  public copy: SafeHtml;
  public check: SafeHtml;
  public inner: SafeHtml;

  constructor(sanitizer: DomSanitizer) {
    this.copy = sanitizer.bypassSecurityTrustHtml(copySvg.toSVG());
    this.check = sanitizer.bypassSecurityTrustHtml(checkSvg.toSVG());
    this.inner = this.copy;
  }

  setCheck() {
    this.inner = this.check;
    setTimeout(() => {
      this.inner = this.copy;
    }, 2000);
  }
}
