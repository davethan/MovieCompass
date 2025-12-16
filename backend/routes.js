const express = require('express');
const router = express.Router();
const {
    getImdbMovieRating,
    getAthinoramaSpecials,
    getUpcomingLinks,
    getUpcomingFilmDetails
} = require('./scraping/scrapingActions');
const { getMoviesDataFromCronJob } = require('./scraping/cron')

// Serves the vue application
router.get("/", async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    } catch (error) {
        console.log(error)
        res.status(500).send("Server failure");
    }
});

// Edits note
router.post("/takeNote", async (req, res) => {
    try {
        const request = req.body
        const movieDataFromCronJob = getMoviesDataFromCronJob();
        let flag = false
        movieDataFromCronJob.forEach(film => {
          if (film.id == request.id) {
            film.note = request.note;
            flag = true
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
router.post("/imdbMovieRating", async (req, res) => {
    try {
        const response = await getImdbMovieRating(req.body.imdbLink);
        res.status(200).send(response);
    } catch {
        res.status(500).send("Failed");
    }
});

// Fetches all films that are currently on cinemas
router.get("/athinoramaMoviesDetails", async (req, res) => {
    try {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        const movieDataFromCronJob = getMoviesDataFromCronJob();
        res.status(200).send(movieDataFromCronJob);
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed");
    }
});

// Fetches special films
router.get("/athinoramaSpecials", async (req, res) => {
    try {
        const specialData = await getAthinoramaSpecials();
        res.status(200).send(specialData);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Fetches all upcoming film links
router.get("/filmyUpcomingLinksAndBriefFilms", async (req, res) => {
    try {
        const { links, briefMovies } = await getUpcomingLinks();
        res.status(200).send({ links, briefMovies });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Fetches upcoming film details
router.post("/filmyUpcomingFilmDetails", async (req, res) => {
    try {
        const upcomingDetails = await getUpcomingFilmDetails(req.body.url);
        res.status(200).send(upcomingDetails);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Catch-all route to default to the Vue application
router.get('*', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    } catch (error) {
        console.error(error);
        res.status(500).send('Server failure');
    }
});

module.exports = router;