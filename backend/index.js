const express = require('express');
const axios = require('axios');
const path = require('path');
const {
    extractImdbMovieCode,
    extractDataFromIMDB,
    parseAthinoramaMovies,
    extractAthinoramaMovieDetails,
    parseAthinoramaSpecials,
} = require('./transformations');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Serves the vue application
app.get("/", async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    } catch (error) {
        console.log(error)
        res.status(500).send("Server failure");
    }
});

// Fetches the imdb data of a specific film
app.post("/imdbMovieRating", async (req, res) => {
    try {
        const response = await getImdbMovieRating(req.body.imdbLink);
        res.status(200).send(response);
    } catch {
        res.status(500).send("Failed");
    }
});

// Fetches the athinorama data of a specific film
app.post("/athinoramaMovieDetails", async (req, res) => {
    try {
        const movieData = await getAthinoramaMovieDetails(req.body.url);
        res.status(200).send(movieData);
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed");
    }
});

// Fetches all films that are currently on cinemas
app.get("/athinoramaCurrentMovies", async (req, res) => {
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
app.get("/athinoramaSpecials", async (req, res) => {
    try {
        const specialData = await getAthinoramaSpecials();
        res.status(200).send(specialData);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Catch-all route to default to the Vue application
app.get('*', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    } catch (error) {
        console.error(error);
        res.status(500).send('Server failure');
    }
});

app.listen(5000, () => {
    console.log('server started @5000');
});

const searchImdbMovieRating = async (movieTitle) => {
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Connection': 'keep-alive'
    }
    try {
        const imdbFindQuery = await axios.get(`https://www.imdb.com/find`, {
            params: { q: movieTitle },
            headers: headers
        });
        const imdbMovieCode = extractImdbMovieCode(imdbFindQuery.data);
        const imdbFindSpecificMovie = await axios.get(`https://www.imdb.com${imdbMovieCode}`, {
            headers: headers
        });
        const movieData = extractDataFromIMDB(imdbFindSpecificMovie.data);
        return movieData;
    } catch (error) {
        console.error('Error fetching IMDB data:', movieTitle);
        return {
            title: movieTitle,
            rating: '',
        };
    }
};

const getImdbMovieRating = async (movieURL) => {
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Connection': 'keep-alive'
    }
    try {
        const imdbFindSpecificMovie = await axios.get(movieURL, {
            headers: headers
        });
        const response = extractDataFromIMDB(imdbFindSpecificMovie.data);
        return response;
    } catch (error) {
        console.error('Error fetching IMDB data', movieURL);
        return '';
    }
};

const getAthinoramaMovieDetails = async (movie) => {
    try {
        const response = await axios(`https://www.athinorama.gr${movie}`);
        return extractAthinoramaMovieDetails(response.data);
    } catch (error) {
        console.log(`Failed to fetch ${movie} details`);
        throw (error);
    }
};

const getAthinoramaCurrentMovies = async () => {
    try {
        const response = await axios("https://www.athinorama.gr/cinema");
        return parseAthinoramaMovies(response.data);
    } catch (error) {
        console.error("Error fetching athinorama data");
        throw false;
    }
};

const getAthinoramaSpecials = async () => {
    try {
        const response = await axios("https://www.athinorama.gr/cinema/eidikes-provoles");
        return parseAthinoramaSpecials(response.data);
    } catch (error) {
        console.error("Error fetching athinorama special data");
        throw error;
    }
};
