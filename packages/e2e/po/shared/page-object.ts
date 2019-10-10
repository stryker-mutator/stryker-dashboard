import { ElementFinder } from 'protractor';

export abstract class PageObject {
  constructor(protected host: ElementFinder) { }
}
