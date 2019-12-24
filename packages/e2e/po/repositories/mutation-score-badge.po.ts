import { PageObject } from '../shared/page-object';
import { promise } from 'protractor';

export class MutationScoreBadgePageObject extends PageObject {

  public hasLink(): promise.Promise<boolean> {
    return this.host.$('a').isPresent();
  }

  public linkHref(): promise.Promise<string> {
    return this.host.$('a').getAttribute('href');
  }

  public imgSrc(): promise.Promise<string> {
    return this.host.$('img').getAttribute('src');
  }
}
