import IngestService from '@/services/ingest.service';
import { NextFunction, Request, Response } from 'express';

class IngestController {
  public ingestService = new IngestService();

  public ingest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ingestDataInput = req.body;
      await this.ingestService.ingestData(ingestDataInput);

      res.status(201).json({ message: 'Successfully ingested' });
    } catch (error) {
      next(error);
    }
  };

  public ingestBulk = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ingestDataInput = req.body;
      const ingestedData = await this.ingestService.ingestBulkData(ingestDataInput);

      res.status(201).json({ data: ingestedData, message: `successfully ingested logs` });
    } catch (error) {
      next(error);
    }
  };
}

export default IngestController;
