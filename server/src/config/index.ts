import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, LOG_FORMAT, ELASTIC_PASSWORD, ELASTIC_URL, ELASTIC_USERNAME } = process.env;

export const LOG_TEMPLATE_NAME = 'log-data-template';
export const LOG_INDEX_PATTERN = 'log-data*';
export const LOG_POLICY_NAME = 'log-data-policy';
export const LOG_ALIAS = 'log-data';
export const TIMESTAMP_RENAME_PIPELINE = 'timestamp-rename-pipeline';
export const TIMESTAMP_RENAME_PIPELINE_DESCRIPTION = 'Renames @timestamp to timestamp';
