import IngestController from '@/controllers/ingest.controller';
import { IngestLogDto } from '@/dtos/ingestor.dto';
import { Routes } from '@/interfaces/routes.interface';
import validationMiddleware from '@/middlewares/validation.middleware';
import { Router } from 'express';

class IngestRoute implements Routes {
  public path = '/ingest';
  public router = Router();
  public ingestController = new IngestController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, validationMiddleware(IngestLogDto, 'body'), this.ingestController.ingest);
    this.router.post(`${this.path}/bulk`, validationMiddleware(IngestLogDto, 'body', true), this.ingestController.ingestBulk);
  }
}

export default IngestRoute;
