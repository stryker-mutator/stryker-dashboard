import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiKeyGeneratorComponent } from './api-key-generator.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { first } from 'rxjs/operators';

describe(ApiKeyGeneratorComponent.name, () => {
  let component: ApiKeyGeneratorComponent;
  let fixture: ComponentFixture<ApiKeyGeneratorComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiKeyGeneratorComponent ],
      imports: [ SharedModule ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ApiKeyGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('should hide the key by default', () => {
    const code = el.querySelector('code')!.textContent;
    expect(code).toContain('•••••••••••••••••••');
  });

  describe('when displayMode = hide', () => {
    it('should show the "generate new" button', () => {
      const button = el.querySelector('button');
      expect(button).not.toBeNull();
      expect(button!.textContent!.trim()).toEqual('Generate new');
    });

    it('should emit "generate" when "Generate new" is clicked', async () => {
      const generateEvent = component.generate.pipe(first()).toPromise();
      el.querySelector('button')!.click();
      expect(await generateEvent).not.toBeNull();
    });
  });

  describe('when displayMode = show', () => {

    beforeEach(() => {
      component.mode = 'show';
      component.apiKey = 'foo-api-key';
      fixture.detectChanges();
      return fixture.whenStable;
    });

    it('should show the apiKey', () => {
      expect(el.querySelector('code')!.textContent).toEqual('foo-api-key');
    });
  });

  describe('when displayMode = loading', () => {

    beforeEach(() => {
      component.mode = 'loading';
      fixture.detectChanges();
      return fixture.whenStable;
    });

    it('should show a loading message', () => {
      expect(el.querySelector('code')!.textContent).toEqual('Generating...');
    });
  });
});
