import { ElementHandle } from '@playwright/test';
import { PageObject } from '../shared/page-object';

export class MutationTestingReportAppPageObject extends PageObject {


  private async totals(): Promise<ElementHandle> {
    const totals = await this.host.$('mte-mutant-view >> mte-metrics-table');
    return totals!;
  }

  public async title(): Promise<string> {
    const header = await this.host.$('h1');
    return header!.innerText();
  }

  public async mutationScore(): Promise<number> {
    const totals = await this.totals();
    const percentageData = await totals.$('tbody td:nth-child(4)');
    const percentage = await percentageData!.innerText();
    return Number.parseFloat(percentage);
  }

  public async fileNames(): Promise<string[]> {
    const totals = await this.totals();
    const files = await totals.$$('tbody td a');
    return Promise.all(files.map(a => a.innerText()));
  }
}
