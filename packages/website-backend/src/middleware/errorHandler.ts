import debug from 'debug';
import express from 'express';

const log = debug('app');

const errorHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  log(`Handling ${err.name} with message "${err.message}"`);
  switch (err.name) {
    case 'UnauthorizedError':
      res.status(401).end();
      break;
    case 'PayloadTooLargeError':
      const { length, limit } = err as any;
      res.status(413).send({ error: `Payload too large (${length}/${limit})` }).end();
      break;
    default:
      log(`Error detected: ${err.message} - ${err.stack}`);
      res.status(500).send({ error: 'Internal error. Please try again later.' }).end();
      break;
  }
};

export default errorHandler;
