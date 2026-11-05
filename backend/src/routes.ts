import express from 'express';
import path from 'path';
import { isFilmyUrl } from './tools.js';
import {
    getAthinoramaSpecials,
    getUpcomingLinks,
    getUpcomingFilmDetails
} from './scraping/scrapingActions.js';
import { waitForCurrentRun } from './scraping/cron.js'
import { getAllMovies, getLastUpdate } from './db/movies.js';
import { getAllCinemas, getCinemaWithMovies } from './db/cinemas.js';
import { formatAthens } from './db/time.js';
import type { Request, Response } from 'express';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Serves the vue application
router.get("/", async (req: Request, res: Response) => {
    try {
        res.sendFile(path.join(__dirname, '../dist', 'index.html'));
    } catch (error) {
        console.log(error)
        res.status(500).send("Server failure");
    }
});

// Fetches all films that are currently on cinemas
router.get("/athinoramaMoviesDetails", async (req: Request, res: Response) => {
    try {
        if (getAllMovies().length === 0) await waitForCurrentRun();
        const lastUpdate = getLastUpdate();
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        // lastCronJobRun is the time the movies were saved (Athens time), or null before the first save.
        res.status(200).send({ films: getAllMovies(), lastCronJobRun: lastUpdate ? formatAthens(lastUpdate) : null });
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed");
    }
});

// Cinemas that currently show movies, with their movie count
router.get("/cinemas", async (req: Request, res: Response) => {
    try {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.status(200).send(getAllCinemas());
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed");
    }
});

// One cinema with its movies and their times there
router.get("/cinemas/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const cinema = Number.isInteger(id) ? getCinemaWithMovies(id) : null;
        if (!cinema) {
            res.status(404).send("Cinema not found");
            return;
        }
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.status(200).send(cinema);
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed");
    }
});

// Fetches special films
router.get("/athinoramaSpecials", async (req: Request, res: Response) => {
    try {
        const specialData = await getAthinoramaSpecials();
        res.status(200).send(specialData);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed");
    }
});

// Fetches all upcoming film links
router.get("/filmyUpcomingLinksAndBriefFilms", async (req: Request, res: Response) => {
    try {
        const { links, briefMovies } = await getUpcomingLinks();
        res.status(200).send({ links, briefMovies });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed");
    }
});

// Fetches upcoming film details
router.post("/filmyUpcomingFilmDetails", async (req: Request, res: Response) => {
    if (!isFilmyUrl(req.body?.url)) {
        res.status(400).send("Invalid url");
        return;
    }
    try {
        const upcomingDetails = await getUpcomingFilmDetails(req.body.url);
        res.status(200).send(upcomingDetails);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed");
    }
});

//--------------------sse--------------------
// router.get('/events', (req: Request, res: Response) => {
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');
//   res.setHeader('Access-Control-Allow-Origin', '*');

//   res.write('data: Connected to SSE server\n\n');

//   const intervalId = setInterval(() => {
//     const timestamp = new Date().toISOString();
//     const message = `Server time: ${timestamp}`;
//     res.write(`data: ${message}\n\n`);
      
//   }, 10000);

//   req.on('close', () => {
//     clearInterval(intervalId);
//     res.end();
//   });

//   req.on('error', (err) => {
//     clearInterval(intervalId);
//     res.end();
//   });
// });
//-------------------------------------------

// Catch-all route to default to the Vue application
router.get('*', (req: Request, res: Response) => {
    try {
        res.sendFile(path.join(__dirname, '../dist', 'index.html'));
    } catch (error) {
        console.error(error);
        res.status(500).send('Server failure');
    }
});

export default router;