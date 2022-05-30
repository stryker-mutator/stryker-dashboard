import { PageObject } from '../shared/page-object.js';

export class MutationTestingReportAppPageObject extends PageObject {
  private totals = this.host.locator('mte-mutant-view >> mte-metrics-table');

  public title = this.host.locator('h1');

  public async mutationScore(): Promise<number> {
    const percentageData = this.totals.locator(
      'tbody tr:nth-child(1) td:nth-child(4)'
    );
    const percentage = await percentageData.innerText();
    return Number.parseFloat(percentage);
  }

  public async fileNames(): Promise<string[]> {
    const files = await this.totals.locator('tbody td a').elementHandles();
    return Promise.all(files.map((a) => a.innerText()));
  }
}
