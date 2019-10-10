import { Homepage } from '../po/home/homepage.po';
import { expect } from 'chai';

describe('Homepage', () => {

  let page: Homepage;

  beforeEach(async () => {
    page = new Homepage();
    await page.navigate();
  });

  it('should have title "Stryker Dashboard"', async () => {
    expect(await page.title).eq('Stryker Dashboard');
  });

  it('should show slogan', async () => {
    expect(await page.slogan).eq('Measure test effectiveness');
  });
});
