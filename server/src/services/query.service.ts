import { LOG_ALIAS } from '@/config';
import { db } from '@/databases';
import { QueryLogDto } from '@/dtos/query.dto';

class QueryService {
  public async getRecentLogs() {
    const recentLogs = await db.search({
      index: LOG_ALIAS,
      body: {
        size: 100,
        sort: [
          {
            timestamp: {
              order: 'desc',
            },
          },
        ],
      },
    });

    return recentLogs;
  }

  public async filterLogs(filterQuery: QueryLogDto) {
    const must: any[] = [];
    if (filterQuery.level) must.push(this.singleMatchQuery('level', filterQuery.level));
    if (filterQuery.message) must.push(this.singleMatchQuery('message', filterQuery.message));
    if (filterQuery.resourceId) must.push(this.singleMatchQuery('resourceId', filterQuery.resourceId));
    if (filterQuery.traceId) must.push(this.singleMatchQuery('traceId', filterQuery.traceId));
    if (filterQuery.spanId) must.push(this.singleMatchQuery('spanId', filterQuery.spanId));
    if (filterQuery.commit) must.push(this.singleMatchQuery('commit', filterQuery.commit));
    if (filterQuery.parentResourceId) must.push(this.singleMatchQuery('parentResourceId', filterQuery.parentResourceId));
    if (filterQuery.timeRange.timestampGte || filterQuery.timeRange.timestampLte) {
      must.push(this.rangeQuery('timestamp', filterQuery.timeRange.timestampGte, filterQuery.timeRange.timestampLte));
    }
    const query = must.length === 1 ? must[0] : this.boolQuery(must);

    const filteredLogs = await db.search({
      index: LOG_ALIAS,
      body: {
        query: query,
      },
    });

    return filteredLogs;
  }

  private singleMatchQuery(field: string, value: string) {
    return {
      match: {
        [field]: value,
      },
    };
  }

  private rangeQuery(field: string, gte: string, lte: string) {
    return {
      range: {
        [field]: {
          gte,
          lte,
        },
      },
    };
  }

  private boolQuery(must: any[]) {
    return {
      bool: {
        must,
      },
    };
  }
}

export default QueryService;
