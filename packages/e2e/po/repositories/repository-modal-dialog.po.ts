import type { Locator } from '@playwright/test';
import { PageObject } from '../shared/page-object.js';
import { AccordionPageObject } from './accordion.po.js';
import { ApiKeyGeneratorPageObject } from './api-key-generator.po.js';

export class RepositoryModalDialogPageObject extends PageObject {
  private readonly closeButton = this.host.locator('button.btn-close');
  public readonly title: Locator = this.host.locator('h2');
  public readonly accordion = new AccordionPageObject(
    this.host.locator('ngb-accordion')
  );
  public readonly apiKeyGenerator = new ApiKeyGeneratorPageObject(
    this.host.locator('stryker-api-key-generator')
  );

  public close(): Promise<void> {
    return this.closeButton.click();
  }
}
