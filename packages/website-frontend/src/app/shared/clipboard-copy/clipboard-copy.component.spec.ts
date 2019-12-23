import { ClipboardCopyComponent } from './clipboard-copy.component';
import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';

@Component({
  template: `<code id="my-code">foo-bar-code</code><stryker-clipboard-copy for="my-code"></stryker-clipboard-copy>`
})
class CopyHostComponent {}

describe(ClipboardCopyComponent.name, () => {
  let el: HTMLElement;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ClipboardCopyComponent, CopyHostComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(CopyHostComponent);
    await fixture.detectChanges();
    el = (fixture.nativeElement as HTMLElement).querySelector('stryker-clipboard-copy');
  });

  it('should show a clipboard svg', () => {
    expect(el.querySelector('svg')).not.toBeNull();
  });

  it('should copy related code to clipboard when clicked', async () => {
    const writeToClipboardSpy = spyOn(navigator.clipboard, 'writeText');
    const clickEvent = document.createEvent('HTMLEvents');
    clickEvent.initEvent('click', true, true);
    const svg = el.querySelector('svg');
    svg.dispatchEvent(clickEvent);
    expect(writeToClipboardSpy).toHaveBeenCalledWith('foo-bar-code');
  });
});
