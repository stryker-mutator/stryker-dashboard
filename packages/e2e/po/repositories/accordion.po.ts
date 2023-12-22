import { PageObject } from '../shared/page-object.js';
import { AccordionCardPageObject } from '../repositories/accordion-card.po.js';

export class AccordionPageObject extends PageObject {
  public getCard(cardHeader: string): AccordionCardPageObject {
    const cardHost = this.host.locator(
      `:has(.accordion-header button:has-text("${cardHeader}"))`
    );
    return new AccordionCardPageObject(cardHost);
  }
}
