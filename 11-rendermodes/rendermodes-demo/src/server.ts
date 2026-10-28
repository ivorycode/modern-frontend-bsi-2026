import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Simulierte Unwetterlage: ändert sich bei jedem Aufruf.
 */
const REGIONEN = ['Bern', 'Zürich', 'Luzern', 'Basel', 'Wallis'];
const GEFAHREN = ['Hagel', 'Sturm', 'Starkregen', 'Gewitter'];

app.get('/api/unwetterwarnungen', (req, res) => {
  const region = typeof req.query['region'] === 'string' ? req.query['region'] : undefined;
  const warnungen = REGIONEN.filter((r) => !region || r === region).map((r) => ({
    region: r,
    gefahr: GEFAHREN[Math.floor(Math.random() * GEFAHREN.length)],
    stufe: 1 + Math.floor(Math.random() * 4),
  }));
  res.json({ stand: new Date().toISOString(), warnungen });
});

/**
 * Policen der angemeldeten Person. Das «Token» ist der Name (nur Demo).
 */
app.get('/api/meine-policen', (req, res) => {
  const token = req.headers.authorization?.replace(/^Bearer /, '');
  if (!token) {
    res.sendStatus(401);
    return;
  }
  const nummer = (n: number) => `${token.slice(0, 3).toUpperCase()}-${1000 + n}`;
  res.json([
    { nummer: nummer(1), produkt: 'Hausratversicherung', praemie: 312 },
    { nummer: nummer(2), produkt: 'Privathaftpflicht', praemie: 128 },
    { nummer: nummer(3), produkt: 'Motorfahrzeugversicherung', praemie: 1240 },
  ]);
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
