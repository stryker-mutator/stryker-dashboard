
/**
 * The slug is in this form: github.com/username/repositoryName[/label]
 * The identifier is in this form: label/branch
 */
export default class MutationScore {
  public static tableName = 'MutationScore';
  public slug: string;
  public branch: string;
  public score: number;
}
