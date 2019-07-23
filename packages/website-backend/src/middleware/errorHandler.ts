import debug from 'debug';
import express from 'express';

const log = debug('app');

const errorHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  log(`Handling ${err.name} with message "${err.message}"`);
  if (err.name === 'UnauthorizedError') {
    res.status(401).end();
  } else {
    log(`Error detected: ${err.message} - ${err.stack}`);
    res.status(500).send({ error: 'Internal error. Please try again later.' });
  }
};

export default errorHandler;
