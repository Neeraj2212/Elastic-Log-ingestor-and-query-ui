import { CREDENTIALS, LOG_FORMAT, NODE_ENV, PORT } from '@config';
import { db, setupIngestRenamePipeline, setupLifeCyclePolicy, setupLogIndexTemplate } from '@databases';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.connectToDatabaseAndInitialSetup();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`=================================`);
      console.log(`======= ENV: ${this.env} =======`);
      console.log(`🚀 App listening on the port ${this.port}`);
      console.log(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabaseAndInitialSetup() {
    try {
      const resp = await db.ping();
      if (resp) {
        console.log('Elasticsearch cluster is up!');
        this.setupInitialIndexes();
      } else console.log('Elasticsearch cluster is down!');
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    }
  }

  private async setupInitialIndexes() {
    await setupLifeCyclePolicy();
    await setupLogIndexTemplate();
    await setupIngestRenamePipeline();
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT));
    this.app.use(cors({ origin: '*', credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/api/', route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
