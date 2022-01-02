import { test } from '@playwright/test';
import { Homepage } from '../po/home/homepage.po';
import { expect } from 'chai';

test.describe('Homepage', () => {

  let page: Homepage;

  test.beforeEach(async ({ page: p }) => {
    page = new Homepage(p);
    await page.navigate();
  });

  test('should have title "Stryker Dashboard"', async () => {
    expect(await page.title()).eq('Stryker Dashboard');
  });

  test('should show slogan', async () => {
    expect(await page.slogan()).eq('Measure test effectiveness');
  });
});
