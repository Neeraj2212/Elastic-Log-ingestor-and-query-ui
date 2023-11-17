import { ELASTIC_PASSWORD } from '@/config';
import { Client } from '@elastic/elasticsearch';
export const db = new Client({
  node: 'http://127.0.0.1:9200',
  auth: {
    username: 'elastic',
    password: ELASTIC_PASSWORD,
  },
});
