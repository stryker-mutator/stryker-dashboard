
/**
 * The slug is in this form: github.com/username/repositoryName[/label]
 * The identifier is in this form: label/branch
 */
export default class MutationScore {
    static tableName = 'MutationScore';
    slug: string;
    branch: string;
    score: number;
}