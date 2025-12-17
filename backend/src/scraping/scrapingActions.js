const {
    extractDataFromIMDB,
    parseAthinoramaMovies,
    extractAthinoramaMovieDetails,
    parseAthinoramaSpecials,
    parseUpcomingLinks,
    parseUpcomingMovies,
    parseUpcomingFilmDetails,
} = require('./transformations');
const request = require('./request');

const getImdbMovieRating = async (movieURL) => {
    try {
        const imdbFindSpecificMovie = await request(movieURL);
        const response = extractDataFromIMDB(imdbFindSpecificMovie.data);
        return response;
    } catch (error) {
        console.error('Error fetching IMDB data', movieURL);
        return '';
    }
};

const getAthinoramaMovieDetails = async (url, id) => {
    try {
        const response = await request(`https://www.athinorama.gr${url}`);
        return extractAthinoramaMovieDetails(response.data, id, url);
    } catch (error) {
        console.log(`Failed to fetch ${url} details`);
        throw (error);
    }
};

const getAthinoramaCurrentMovies = async () => {
    try {
        const response = await request("https://www.athinorama.gr/cinema");
        return parseAthinoramaMovies(response.data);
    } catch (error) {
        console.error("Error fetching athinorama data");
        throw false;
    }
};

const getAthinoramaSpecials = async () => {
    try {
        const response = await request("https://www.athinorama.gr/cinema/eidikes-provoles");
        return parseAthinoramaSpecials(response.data);
    } catch (error) {
        console.error("Error fetching athinorama special data");
        throw error;
    }
};

const getUpcomingLinks = async () => {
    try {
        const response = await request("https://www.filmy.gr/to-be-released-in-greece/");
        const links = parseUpcomingLinks(response.data);
        const briefMovies = parseUpcomingMovies(response.data);
        return { links, briefMovies }
    } catch (error) {
        console.error("Error fetching flix's upcoming data");
        throw error;
    }
};

const getUpcomingFilmDetails = async (url) => {
    try {
        const response = await request(url);
        return parseUpcomingFilmDetails(response.data);
    } catch (error) {
        console.error("Error fetching flix's upcoming film details")
        throw error;
    }
};

module.exports = {
    getImdbMovieRating,
    getAthinoramaMovieDetails,
    getAthinoramaCurrentMovies,
    getAthinoramaSpecials,
    getUpcomingLinks,
    getUpcomingFilmDetails
};