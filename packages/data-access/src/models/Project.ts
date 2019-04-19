
export default class Project {
  public owner: string;
  public name: string;
  public enabled: boolean;
  public apiKeyHash: string;
  public static tableName = 'Project';
}
