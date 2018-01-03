import * as https from 'https';
import * as fs from 'mz/fs';
import * as path from 'path';

export function getContent(url: string): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
        let request = https.get(url, (response) => {
            let body: string[] = [];
            response.on('data', (chunk: string) => body.push(chunk));
            response.on('end', () => resolve(body.join('')));
        });

        request.on('error', (err) => reject(err))
    })
};

export function logError(error: Error) {
    console.error(error);
}

let unknownBadge: string;
export function retrieveUnknownBadge(): Promise<string> {
    if (unknownBadge) {
        return Promise.resolve(unknownBadge);
    } else {
        return fs.readFile(path.resolve(__dirname, '..', 'mutation-score-unknown-lightgrey.svg'), 'utf8')
            .then(badge => unknownBadge = badge);
    }
}