const express = require('express');
const router = express.Router();
const {
    getImdbMovieRating,
    getAthinoramaMovieDetails,
    getAthinoramaCurrentMovies,
    getAthinoramaSpecials,
    getUpcomingLinks,
    getUpcomingFilmDetails
} = require('./scraping/scrapingActions');

// Serves the vue application
router.get("/", async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    } catch (error) {
        console.log(error)
        res.status(500).send("Server failure");
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

// Fetches the athinorama data of a specific film
router.post("/athinoramaMovieDetails", async (req, res) => {
    try {
        const movieData = await getAthinoramaMovieDetails(req.body.url);
        res.status(200).send(movieData);
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed");
    }
});

// Fetches all films that are currently on cinemas
router.get("/athinoramaCurrentMovies", async (req, res) => {
    try {
        const athinoramaCurrentMovieURLs = await getAthinoramaCurrentMovies();
        if (!athinoramaCurrentMovieURLs || athinoramaCurrentMovieURLs.length === 0) {
            res.status(200).send("Athinorama request success. But movies are empty...");
            return;
        }
        res.status(200).send(athinoramaCurrentMovieURLs);
    } catch {
        res.status(500).send("Failed fething athinorama movies");
    }
});

// Fetches all films that are currently on cinemas
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