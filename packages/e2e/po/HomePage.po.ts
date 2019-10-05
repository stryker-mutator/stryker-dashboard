import { $, browser } from 'protractor';

export class HomePage {

  get slogan() {
    return $('h1').getText();
  }

  public async navigate() {
    return browser.get('/');
  }

  get title() {
    return browser.getTitle();
  }
}
