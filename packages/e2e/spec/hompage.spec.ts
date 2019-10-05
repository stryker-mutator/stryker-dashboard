import { HomePage } from '../po/HomePage.po';
import { expect } from 'chai';

describe('Homepage', () => {

  let page: HomePage;

  beforeEach(async () => {
    page = new HomePage();
    await page.navigate();
  });

  it('should have title "Stryker Dashboard"', async () => {
    expect(await page.title).eq('Stryker Dashboard');
  });

  it('should show slogan', async () => {
    expect(await page.slogan).eq('Measure test effectiveness');
  });
});
