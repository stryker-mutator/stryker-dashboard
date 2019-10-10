import { PageObject } from '../shared/page-object';
import { ElementFinder } from 'protractor';
import { AccordionCardPageObject } from './accordion-card.po';

export class AccordionPageObject extends PageObject {

  public async cards(): Promise<AccordionCardPageObject[]> {
    const cards: ElementFinder[] = await this.host.$$('.card');
    return Promise.all(cards.map(el => new AccordionCardPageObject(el)));
  }

  public async activateCard(cardHeader: string): Promise<AccordionCardPageObject> {
    const card = await this.getCard(cardHeader);
    await card.activate();
    return card;
  }

  public async getCard(cardHeader: string): Promise<AccordionCardPageObject> {
    const cards = await this.cards();
    const cardHeaders = await Promise.all(cards.map(card => card.headerText));
    const index = cardHeaders.indexOf(cardHeader);
    if (index < 0) {
      throw new Error(`Cannot find "${cardHeader}" in ${JSON.stringify(cardHeaders)}`);
    } else {
      return cards[index];
    }
  }
}
