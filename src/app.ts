import '@controllers';

import bodyParser from 'body-parser';
import compress from 'compression';
import cors from 'cors';
import { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import httpStatus from 'http-status';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import { v4 } from 'uuid';

import { loadConfiguration } from './config/load-configuration';
import { containerBind } from './container';
import errorHandler from './controllers/middlewares/errorHandler';
import { typeormDataSource } from './db/typeorm/data-source';
import LoggerManager from './utils/logger-manager';
import { logError, logInit } from './utils/logs';

export async function createAppInstance(): Promise<Application> {
  await loadConfiguration();

  await typeormDataSource
    .initialize()
    .then(() => {
      logInit('Database initialized');
    })
    .catch((err) => {
      logError('Database initialization failed', err);
    });

  const container = new Container();
  containerBind(container);

  const server = new InversifyExpressServer(container as never);

  server.setConfig((app: Application): void => {
    // add body parser
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: '15mb' }));
    app.use(compress());
    // secure apps by setting various HTTP headers
    app.use(helmet());
    // enable CORS - Cross Origin Resource Sharing
    app.use(cors());
    app.use((req: Request, res: Response, next: NextFunction): void => {
      req.headers['X-Request-ID'] = v4();
      next();
    });
  });

  server.setErrorConfig((app: Application): void => {
    // catch 404 and forward to error handler
    app.use((_req: Request, res: Response): void => {
      LoggerManager.log('application', {
        ipAddress: _req.headers['x-real-ip'] || _req.headers['x-forwarded-for'],
        session: _req.session
          ? {
              userId: _req.session.userId,
            }
          : null,
        headers: {
          'device-id': _req.headers['device-id'],
          'user-agent': _req.headers['user-agent'],
          'request-id': _req.headers['X-Request-ID'],
        },
        request: {
          urlPath: _req.originalUrl,
          method: _req.method,
          params: _req.params,
          query: _req.query,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          body: _req.body,
        },
        response: {
          status: httpStatus.NOT_FOUND,
        },
      });
      res.status(httpStatus.NOT_FOUND).json();
    });
    // Handle 500
    // do not remove next from line bellow, error handle will not work
    app.use((err: Error, req: Request, res: Response, _next: NextFunction): void => errorHandler(err, req, res));
  });

  const app: Application = server.build();

  return app;
}
