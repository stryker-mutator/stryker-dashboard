import { expect, test } from '@playwright/test';
import { Homepage } from '../po/home/homepage.po';

test.describe('Homepage', () => {

  let sut: Homepage;

  test.beforeEach(async ({ page: p }) => {
    sut = new Homepage(p);
    await sut.navigate();
  });

  test('should have title "Stryker Dashboard"', async () => {
    await expect(sut.page).toHaveTitle('Stryker Dashboard');
  });

  test('should show slogan', async () => {
    await expect(sut.h1).toHaveText('Measure test effectiveness');
  });
});
