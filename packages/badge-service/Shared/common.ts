import camelCase = require('camelcase');
import pascalCase = require('pascal-case');
import { MutationScoreEntity, ApiKeyEntity, Color } from './models';
import azure = require('azure-storage');
import https = require('https');

export function pascalToCamelCase(obj: any){
    Object.keys(obj).forEach(key => {
        obj[camelCase(key)] = obj[key];
        delete obj[key];
    });
}

export function camelCaseToPascalCase(obj: any) {
    Object.keys(obj).forEach(key => {
        obj[pascalCase(key)] = obj[key];
        delete obj[key];
    });
}

export function retrieveSingleEntity<T>(tableService: azure.TableService, table: string, column: string, searchString: string ) {
    return new Promise<T>((res, rej) => {

        const query = new azure.TableQuery()
            .top(1)
            .where(column + ' eq ?', searchString);
      
        tableService.queryEntities(table, query, null, function (error: any, result: any, response: any) {
            if (error) {
                rej(error);
            }
            else {
                pascalToCamelCase(result.entries[0]);
                res(result.entries[0]);
            }
        });
    });
}

export function retrieveHash(tableService: azure.TableService, slug: string): Promise<string> {
    return retrieveSingleEntity<ApiKeyEntity>(tableService, 'keys', 'RepoSlug', slug).then(
        result => {
            if (result.repoSlug._ == slug) {
                return result.rowKey._;
            }
            else {
                return 'invalid';
            }
        });
}

export function retrieveBadge(color: Color, score: number) {
    const url = `https://img.shields.io/badge/mutation%20score-${score}-${color}.svg`;

    // get
    return getContent(url).then(content => {
        return content;
      });     
}

export function getContent(url: string): Promise<string> {
    // return new pending promise
    return new Promise((resolve, reject) => {
      // select http or https module, depending on reqested url
      let request = https.get(url, (response) => {
        // temporary data holder
        let body: string[] = [];
        // on every content chunk, push it to the data array
        response.on('data', (chunk: string) => body.push(chunk));
        // we are done, resolve promise with those joined chunks
        response.on('end', () => resolve(body.join('')));
      });

      // handle connection errors of the request
      request.on('error', (err) => reject(err))
      })
  };

export function retrieveMutationScore(tableService: azure.TableService, hash: string): Promise<number> {
    return retrieveSingleEntity<MutationScoreEntity>(tableService, 'strykerscore', 'PartitionKey', hash).then(
        result => {
            return result.mutationScore._;
        }
    );
}

export function insertEntity(tableService: azure.TableService, mutationScore: MutationScoreEntity): Promise<azure.TableService.EntityMetadata> {
    return new Promise((res, rej) => {
        camelCaseToPascalCase(mutationScore);
        tableService.insertEntity('strykerscore', mutationScore, function (error, result, response) {
            if (error) {
                rej(error);
            }
            else {
                res(result);
            }
        });
    });
}