import { historyService, HistoryService } from '../../../src/services/history.service';

describe(HistoryService.name, () => {
  it('should return an instance of Location', () => {
    expect(historyService.getHistory()).to.be.instanceOf(History);
  });
});
