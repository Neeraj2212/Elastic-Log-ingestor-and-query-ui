import {
  ELASTIC_PASSWORD,
  ELASTIC_URL,
  ELASTIC_USERNAME,
  LOG_ALIAS,
  LOG_INDEX_PATTERN,
  LOG_POLICY_NAME,
  LOG_TEMPLATE_NAME,
  TIMESTAMP_RENAME_PIPELINE,
  TIMESTAMP_RENAME_PIPELINE_DESCRIPTION,
} from '@/config';
import { Client } from '@elastic/elasticsearch';
export const db = new Client({
  node: ELASTIC_URL,
  auth: {
    username: ELASTIC_USERNAME,
    password: ELASTIC_PASSWORD,
  },
});

export const setupLifeCyclePolicy = async () => {
  try {
    const policyExists = await db.ilm.getLifecycle({
      name: LOG_POLICY_NAME,
    });
    if (policyExists) {
      console.log(`Found ${LOG_POLICY_NAME}!`);
    }
  } catch (error) {
    if (error.statusCode === 404) {
      console.log(`${LOG_POLICY_NAME} does not exist, creating...`);
      await db.ilm.putLifecycle({
        name: LOG_POLICY_NAME,
        body: {
          policy: {
            phases: {
              hot: {
                actions: {
                  rollover: {
                    max_age: '1d',
                  },
                  set_priority: {
                    priority: 100,
                  },
                },
                min_age: '0ms',
              },
              warm: {
                min_age: '1d',
                actions: {
                  set_priority: {
                    priority: 50,
                  },
                  shrink: {
                    number_of_shards: 1,
                  },
                  forcemerge: {
                    max_num_segments: 1,
                  },
                  readonly: {},
                },
              },
            },
          },
        },
      });
      console.log(`${LOG_POLICY_NAME} created!`);
    }
  }
};

export const setupLogIndexTemplate = async () => {
  const templateExists = await db.indices.existsIndexTemplate({
    name: LOG_TEMPLATE_NAME,
  });
  if (templateExists) {
    console.log('Found', LOG_TEMPLATE_NAME);
  } else {
    console.log(`${LOG_TEMPLATE_NAME} does not exist, creating...`);
    await db.indices.putIndexTemplate({
      name: LOG_TEMPLATE_NAME,
      index_patterns: [LOG_INDEX_PATTERN],
      data_stream: {},
      template: {
        settings: {
          number_of_shards: 5,
          lifecycle: {
            name: LOG_POLICY_NAME,
            rollover_alias: LOG_ALIAS,
          },
        },
        mappings: {
          properties: {
            level: {
              type: 'keyword',
            },
            message: {
              type: 'text',
            },
            '@timestamp': {
              type: 'date',
            },
            resourceId: {
              type: 'keyword',
            },
            traceId: {
              type: 'keyword',
            },
            spanId: {
              type: 'keyword',
            },
            commit: {
              type: 'keyword',
            },
            metadata: {
              type: 'nested',
              properties: {
                parentResourceId: {
                  type: 'keyword',
                },
              },
            },
          },
        },
      },
    });

    console.log(`${LOG_TEMPLATE_NAME} created! `);
  }
};

export const setupIngestRenamePipeline = async () => {
  try {
    const pipelineExists = await db.ingest.getPipeline({
      id: TIMESTAMP_RENAME_PIPELINE,
    });
    if (pipelineExists) console.log('Found', TIMESTAMP_RENAME_PIPELINE);
  } catch (error) {
    if (error.statusCode === 404) {
      console.log(`${TIMESTAMP_RENAME_PIPELINE} does not exist, creating...`);
      await db.ingest.putPipeline({
        id: TIMESTAMP_RENAME_PIPELINE,
        description: TIMESTAMP_RENAME_PIPELINE_DESCRIPTION,
        processors: [
          {
            rename: {
              field: 'timestamp',
              target_field: '@timestamp',
            },
          },
        ],
      });
      console.log(`${TIMESTAMP_RENAME_PIPELINE} created!`);
    } else {
      console.log(JSON.stringify(error, null, 2));
    }
  }
};
