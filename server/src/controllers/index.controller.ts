import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send(`<h1>Welcome to the log ingestor!</h1>
      <h2>Endpoints:</h2>    
        <h3>POST /api/ingest</h3>
        <p>To ingest single log</p>
        <h3>POST /api/ingest/bulk</h3>
        <p>To ingest multiple logs</p>
        <h3>GET /api/logs</h3>
        <p>To get recent 100 logs</p>
        <h3>GET /api/logs/filter</h3>
        <p>To get logs with filters</p>
    <strong> Check postman collection for more details </strong>
      `);
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
