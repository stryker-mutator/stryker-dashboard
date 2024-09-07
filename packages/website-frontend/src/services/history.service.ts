export class HistoryService {
  public getHistory(): History {
    return window.history;
  }
}

export const historyService = new HistoryService();
