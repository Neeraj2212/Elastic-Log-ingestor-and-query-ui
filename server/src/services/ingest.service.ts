import { LOG_ALIAS, TIMESTAMP_RENAME_PIPELINE } from '@/config';
import { db } from '@/databases';
import { IngestLogDto } from '@/dtos/ingestor.dto';

class IngestService {
  public async ingestData(logData: IngestLogDto) {
    await db.index({
      index: LOG_ALIAS,
      body: logData,
      pipeline: TIMESTAMP_RENAME_PIPELINE,
    });
  }

  public async ingestBulkData(logData: IngestLogDto[]) {
    const ingestData = await db.helpers.bulk({
      datasource: logData,
      onDocument() {
        return {
          index: {
            _index: LOG_ALIAS,
          },
        };
      },
      pipeline: TIMESTAMP_RENAME_PIPELINE,
    });

    return ingestData;
  }
}

export default IngestService;
