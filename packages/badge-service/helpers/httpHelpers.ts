import * as https from 'https';

export function getContent(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let request = https.get(url, (response) => {
            let body: string[] = [];
            response.on('data', (chunk: string) => body.push(chunk));
            response.on('end', () => resolve(body.join('')));
        });

        request.on('error', (err) => reject(err))
    })
};
