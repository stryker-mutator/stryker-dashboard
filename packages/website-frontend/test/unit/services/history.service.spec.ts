import { HistoryService, historyService } from '../../../src/services/history.service.ts';

describe(HistoryService.name, () => {
  it('should return an instance of History', () => {
    expect(historyService.getHistory()).to.be.instanceOf(History);
  });
});
