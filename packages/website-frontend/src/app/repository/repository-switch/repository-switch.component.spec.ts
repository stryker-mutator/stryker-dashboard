import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RepositorySwitchComponent } from './repository-switch.component';
import { Repository } from '@stryker-mutator/dashboard-contract';
import { MutationScoreBadgeComponent } from '../mutation-score-badge/mutation-score-badge.component';
import { createRepository } from '../../testHelpers/mock.spec';
import { first } from 'rxjs/operators';
import { badgeSrc } from '../util';
import { firstValueFrom } from 'rxjs';

describe(RepositorySwitchComponent.name, () => {
  let repository: Repository;
  let sut: RepositorySwitchComponent;
  let fixture: ComponentFixture<RepositorySwitchComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    repository = createRepository({
      slug: 'github/stryker-mutator/stryker-badge',
      enabled: true,
      defaultBranch: 'master',
    });
    TestBed.configureTestingModule({
      declarations: [RepositorySwitchComponent, MutationScoreBadgeComponent],
      imports: [NgbModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RepositorySwitchComponent);
    sut = fixture.debugElement.componentInstance;
    sut.repo = repository;
    fixture.detectChanges();
    el = fixture.debugElement.nativeElement;
  });

  it(`should display the repository's slug`, () => {
    const div = el.querySelector('div');
    expect(div!.textContent).toContain('github/stryker-mutator/stryker-badge');
  });

  describe('when enabled', () => {
    it('should show a link when enabled', () => {
      const button = el.querySelector('button');
      expect(button).not.toBeNull();
      expect(button!.textContent).toBe('github/stryker-mutator/stryker-badge');
    });

    it('should raise a "display" event when repository is clicked', async () => {
      const event$ = firstValueFrom(sut.display);
      const button = el.querySelector('button')!;
      button.click();
      const event = await event$;
      expect(event).not.toBeNull();
      expect(event).toBe(sut);
    });

    it('should raise a "disable" event when switch is turned off', async () => {
      const event$ = sut.disable.pipe(first()).toPromise();
      const checkbox = el.querySelector('label')!;
      checkbox.click();
      const event = await event$;
      expect(event).not.toBeNull();
      expect(event).toBe(sut);
    });

    it('should show the mutation-score-badge', () => {
      const badge = el.querySelector(
        'stryker-mutation-score-badge img'
      ) as HTMLImageElement;
      console.log(fixture.debugElement.children);
      expect(badge).not.toBeNull();
      expect(badge.src).toEqual(badgeSrc(repository));
    });
  });

  describe('when disabled', () => {
    beforeEach(async () => {
      repository.enabled = false;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should raise an "enable" event when switch is turned on', async () => {
      // Arrange
      const event$ = firstValueFrom(sut.enable);
      const checkbox = el.querySelector('label')!;

      // Act
      checkbox.click();
      const event = await event$;

      // Assert
      expect(event).not.toBeNull();
      expect(event).toBe(sut);
    });

    it('should not show the mutation-score-badge', () => {
      expect(el.querySelector('stryker-mutation-score-badge')).toBeNull();
    });

    it('should not show a link to display', () => {
      expect(el.querySelector('button')).toBeNull();
    });
  });
});
