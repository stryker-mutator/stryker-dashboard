import { NextFunction, Response, Request } from 'express';
import fs from 'fs';

const blacklist = ['/api'];

export function spa(indexFileName: string) {
  return (
    req: Pick<Request, 'url' | 'method'>,
    res: Pick<Response, 'send'>,
    next: NextFunction
  ) => {
    if (
      req.method === 'GET' &&
      !blacklist.some((item) => req.url.startsWith(item))
    ) {
      fs.readFile(indexFileName, 'utf-8', (err, indexHtml) => {
        if (err) {
          next(err);
        } else {
          res.send(indexHtml);
        }
      });
    } else {
      next();
    }
  };
}
