import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

import routes from './routes.js';
app.use('/', routes);

import { cronJob } from './scraping/cron.js';
cronJob();

export default app;