import { Component, Input, ElementRef, OnInit } from '@angular/core';
import '@github/clipboard-copy-element';
import { clippy } from '@primer/octicons';

@Component({
  selector: 'stryker-clipboard-copy',
  template: `<clipboard-copy [attr.for]="for">
  </clipboard-copy>`,
  host: {
    class: 'btn btn-sm pt-0'
  }
})
export class ClipboardCopyComponent implements OnInit {

  @Input()
  public for: string | undefined;

  constructor(private readonly elementRef: ElementRef) { }

  public ngOnInit(): void {
    const el: HTMLElement = this.elementRef.nativeElement;
    el.querySelector('clipboard-copy')!.innerHTML = clippy.toSVG();
  }
}
