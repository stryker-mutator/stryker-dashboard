import { PageObject } from "../shared/page-object";
import { AccordionCardPageObject } from "../repositories/accordion-card.po";

export class AccordionPageObject extends PageObject {
  public getCard(cardHeader: string): AccordionCardPageObject {
    const cardHost = this.host.locator(
      `:has(.card-header:has-text("${cardHeader}"))`
    );
    return new AccordionCardPageObject(cardHost);
  }
}
