import { Component, Input, ElementRef, OnInit } from '@angular/core';
import '@github/clipboard-copy-element';
import { copy } from '@primer/octicons';

@Component({
  selector: 'stryker-clipboard-copy',
  template: `<clipboard-copy [attr.for]="for"> </clipboard-copy>`,
  host: {
    class: 'btn btn-sm pt-0',
  },
})
export class ClipboardCopyComponent implements OnInit {
  @Input()
  public for: string | undefined;

  constructor(private readonly elementRef: ElementRef) {}

  public ngOnInit(): void {
    const el: HTMLElement = this.elementRef.nativeElement;
    const svg = copy.toSVG();
    el.querySelector('clipboard-copy')!.innerHTML = svg;
  }
}
