import 'reflect-metadata';
import App from '@/app';
import IndexRoute from '@routes/index.route';
import validateEnv from '@utils/validateEnv';
import IngestRoute from '@routes/ingest.route';
import QueryRoute from './routes/query.route';
validateEnv();

const app = new App([new IndexRoute(), new IngestRoute(), new QueryRoute()]);

app.listen();
