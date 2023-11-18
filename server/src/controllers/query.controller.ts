import { QueryLogDto } from '@/dtos/query.dto';
import QueryService from '@/services/query.service';
import { Request, Response, NextFunction } from 'express';

class QueryController {
  public queryService = new QueryService();

  public getRecentLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recentLogs = await this.queryService.getRecentLogs();

      res.status(200).json({ data: recentLogs, message: 'Successfully retrieved recent logs' });
    } catch (error) {
      next(error);
    }
  };

  public filterLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filterQuery: QueryLogDto = req.body;
      const filteredLogs = await this.queryService.filterLogs(filterQuery);

      res.status(200).json({ data: filteredLogs, message: 'Successfully filtered logs' });
    } catch (error) {
      next(error);
    }
  };
}

export default QueryController;
