import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MutationScoreBadgeComponent } from './mutation-score-badge.component';
import { RouterTestingModule } from '@angular/router/testing';
import { createRepository } from 'src/app/testHelpers/mock.spec';
import { badgeSrc } from '../util';

describe('MutationScoreBadgeComponent', () => {
  let component: MutationScoreBadgeComponent;
  let fixture: ComponentFixture<MutationScoreBadgeComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MutationScoreBadgeComponent],
      imports: [RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MutationScoreBadgeComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
  });

  it('should show the correct image', async () => {
    // Arrange
    const repo = createRepository({
      slug: 'github.com/fooOrg/barName',
      defaultBranch: 'dev',
      name: 'barName'
    });
    component.repo = repo;

    // Act
    fixture.detectChanges();
    await fixture.whenStable();
    const img = el.querySelector('img')!;

    // Assert
    expect(img).not.toBeNull();
    expect(img.src).toBe(badgeSrc(repo, 'flat'));
    expect(img.alt).toBe('Badge for barName on the dev branch.');
  });

  it('should show different styles based on the "style" attribute', async () => {
    // Arrange
    component.repo = createRepository();
    component.style = 'for-the-badge';

    // Act
    fixture.detectChanges();
    await fixture.whenStable();
    const img = el.querySelector('img')!;

    // Assert
    const url = new URL(img.src);
    expect(url.searchParams.get('style')).toBe('for-the-badge');
  });

  it('should not show a link by default', async () => {
    // Arrange
    component.repo = createRepository();

    // Act
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    expect(el.querySelector('a')).toBeNull();
  });

  it('should show a link when linkEnabled is true', async () => {
    // Arrange
    component.repo = createRepository({ slug: 'fooOwner/fooRepo', defaultBranch: 'dev' });
    component.enableLink = true;

    // Act
    fixture.detectChanges();
    await fixture.whenStable();
    const anchor = el.querySelector('a');

    // Assert
    expect(anchor).not.toBeNull();
    expect(anchor!.href.endsWith('reports/fooOwner/fooRepo/dev')).toBeTruthy('Not end with reports/fooOwner/fooRepo/dev');
  });
});
