"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const camelCase = require("camelcase");
const pascalCase = require("pascal-case");
const azure = require("azure-storage");
const https = require("https");
function pascalToCamelCase(obj) {
    Object.keys(obj).forEach(key => {
        obj[camelCase(key)] = obj[key];
        delete obj[key];
    });
}
exports.pascalToCamelCase = pascalToCamelCase;
function camelCaseToPascalCase(obj) {
    Object.keys(obj).forEach(key => {
        obj[pascalCase(key)] = obj[key];
        delete obj[key];
    });
}
exports.camelCaseToPascalCase = camelCaseToPascalCase;
function retrieveSingleEntity(tableService, table, column, searchString) {
    return new Promise((res, rej) => {
        const query = new azure.TableQuery()
            .top(1)
            .where(column + ' eq ?', searchString);
        tableService.queryEntities(table, query, null, function (error, result, response) {
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
exports.retrieveSingleEntity = retrieveSingleEntity;
function retrieveHash(tableService, slug) {
    return retrieveSingleEntity(tableService, 'keys', 'RepoSlug', slug).then(result => {
        if (result.repoSlug._ == slug) {
            return result.rowKey._;
        }
        else {
            return 'invalid';
        }
    });
}
exports.retrieveHash = retrieveHash;
function retrieveBadge(color, score) {
    const url = `https://img.shields.io/badge/mutation%20score-${score}-${color}.svg`;
    // get
    return getContent(url).then(content => {
        return content;
    });
}
exports.retrieveBadge = retrieveBadge;
function getContent(url) {
    // return new pending promise
    return new Promise((resolve, reject) => {
        // select http or https module, depending on reqested url
        let request = https.get(url, (response) => {
            // temporary data holder
            let body = [];
            // on every content chunk, push it to the data array
            response.on('data', (chunk) => body.push(chunk));
            // we are done, resolve promise with those joined chunks
            response.on('end', () => resolve(body.join('')));
        });
        // handle connection errors of the request
        request.on('error', (err) => reject(err));
    });
}
exports.getContent = getContent;
;
function retrieveMutationScore(tableService, hash) {
    return retrieveSingleEntity(tableService, 'strykerscore', 'PartitionKey', hash).then(result => {
        return result.mutationScore._;
    });
}
exports.retrieveMutationScore = retrieveMutationScore;
function insertEntity(tableService, mutationScore) {
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
exports.insertEntity = insertEntity;
//# sourceMappingURL=common.js.map