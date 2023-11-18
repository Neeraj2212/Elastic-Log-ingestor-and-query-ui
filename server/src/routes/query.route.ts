import QueryController from '@/controllers/query.controller';
import { QueryLogDto } from '@/dtos/query.dto';
import { Routes } from '@/interfaces/routes.interface';
import validationMiddleware from '@/middlewares/validation.middleware';
import { Router } from 'express';

class QueryRoute implements Routes {
  public path = '/logs';
  public router = Router();
  public queryController = new QueryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.queryController.getRecentLogs);
    this.router.get(`${this.path}/filter`, validationMiddleware(QueryLogDto, 'body'), this.queryController.filterLogs);
  }
}

export default QueryRoute;
