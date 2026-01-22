import {
    extractDataFromIMDB,
    parseAthinoramaMovies,
    extractAthinoramaMovieDetails,
    parseAthinoramaSpecials,
    parseUpcomingLinks,
    parseUpcomingMovies,
    parseUpcomingFilmDetails,
} from './transformations.js';
import { request } from './request.js';

const getImdbMovieRating = async (movieURL: string) => {
    try {
        const mobileUrl = movieURL.replace('www.imdb.com', 'm.imdb.com');
        const imdbFindSpecificMovie = await request(mobileUrl);
        const response = extractDataFromIMDB(imdbFindSpecificMovie.data);
        return response;
    } catch (error) {
        console.error('Error fetching IMDB data', movieURL);
        return '';
    }
};

const getAthinoramaMovieDetails = async (url: string, id: string) => {
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

const getUpcomingFilmDetails = async (url: string) => {
    try {
        const response = await request(url);
        return parseUpcomingFilmDetails(response.data);
    } catch (error) {
        console.error("Error fetching flix's upcoming film details")
        throw error;
    }
};

export {
    getImdbMovieRating,
    getAthinoramaMovieDetails,
    getAthinoramaCurrentMovies,
    getAthinoramaSpecials,
    getUpcomingLinks,
    getUpcomingFilmDetails
};