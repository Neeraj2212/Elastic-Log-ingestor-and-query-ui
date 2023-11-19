export type QueryFilterObject = {
  level?: string;
  message?: string;
  resourceId?: string;
  traceId?: string;
  spanId?: string;
  commit?: string;
  parentResourceId?: string;
  timestamp?: string;
  timeRange?: {
    timestampGte?: string;
    timestampLte?: string;
  };
};

export type TableRowData = {
  level: string;
  message: string;
  resourceId: string;
  traceId: string;
  spanId: string;
  commit: string;
  metadata: {
    parentResourceId: string;
  };
  "@timestamp": string;
};
