import express from 'express';
import path from 'path';
import {
    getImdbMovieRating,
    getAthinoramaSpecials,
    getUpcomingLinks,
    getUpcomingFilmDetails
} from './scraping/scrapingActions.js';
import { getMoviesDataFromCronJob, getLastCronJobRun } from './scraping/cron.js'
import type { Request, Response } from 'express';

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

// Edits note
router.post("/takeNote", async (req: Request, res: Response) => {
    try {
        const request = req.body
        const movieDataFromCronJob = getMoviesDataFromCronJob();
        let flag = false
        movieDataFromCronJob.forEach(film => {
          if (film.id == request.id) {
            film.note = request.note;
            flag = true;
            return;
          }
        })
        if (flag) res.status(200).send({ id: request.id, note: request.note });
        else res.status(404).send("Movie not found")
    } catch (error) {
        console.log(error)
        res.status(500).send("Failed");
    }
});

// Fetches the imdb data of a specific film
router.post("/imdbMovieRating", async (req: Request, res: Response) => {
    try {
        const response = await getImdbMovieRating(req.body.imdbLink);
        res.status(200).send(response);
    } catch {
        res.status(500).send("Failed");
    }
});

// Fetches all films that are currently on cinemas
router.get("/athinoramaMoviesDetails", async (req: Request, res: Response) => {
    try {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.status(200).send({ films: getMoviesDataFromCronJob(), lastCronJobRun: getLastCronJobRun() });
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
        res.status(500).send(error);
    }
});

// Fetches all upcoming film links
router.get("/filmyUpcomingLinksAndBriefFilms", async (req: Request, res: Response) => {
    try {
        const { links, briefMovies } = await getUpcomingLinks();
        res.status(200).send({ links, briefMovies });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Fetches upcoming film details
router.post("/filmyUpcomingFilmDetails", async (req: Request, res: Response) => {
    try {
        const upcomingDetails = await getUpcomingFilmDetails(req.body.url);
        res.status(200).send(upcomingDetails);
    } catch (error) {
        res.status(500).send(error);
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
    
//       res.write(`data: ${message}\n\n`);
      
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