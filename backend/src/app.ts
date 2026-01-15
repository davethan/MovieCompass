import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(
  express.static(path.join(__dirname, '../dist'), {
    setHeaders(res, path) {
      if (path.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    }
  })
);

import routes from './routes.js';
app.use('/', routes);

import { cronJob } from './scraping/cron.js';
cronJob();

export default app;