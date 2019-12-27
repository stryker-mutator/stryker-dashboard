import { NextFunction, Response, Request } from 'express';

const blacklist = ['/api'];

export function spa(indexHtml: string) {
  return (req: Pick<Request, 'url' | 'method'>, res: Pick<Response, 'send'>, next: NextFunction) => {
    if (req.method === 'GET' && !blacklist.some(item => req.url.startsWith(item))) {
      res.send(indexHtml);
    } else {
      next();
    }
  };
}
