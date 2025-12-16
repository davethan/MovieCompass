const cron = require('node-cron');
const {
    getAthinoramaMovieDetails,
    getAthinoramaCurrentMovies,
} = require('./scrapingActions');

let movieDataFromCronJob = [];

const cronJob = async (slice) => {
  movieDataFromCronJob = [];
  let athinoramaCurrentMovieURLs = [];

  try {
    athinoramaCurrentMovieURLs = await getAthinoramaCurrentMovies();
    if (!athinoramaCurrentMovieURLs || athinoramaCurrentMovieURLs.length === 0) {
      console.log("Athinorama request success. But movies are empty...");
      return;
    }
  } catch(error) {
    console.log("Failed fething athinorama movies", error);
    return; 
  }

  try {
    const requests = [];
    athinoramaCurrentMovieURLs.slice(0, slice).forEach(film => requests.push(getAthinoramaMovieDetails(film.url, film.id)))
    const moviesDetails = await Promise.allSettled(requests);
    movieDataFromCronJob = moviesDetails.map(film => film.value);
    console.log("Success fetching movies' details")
  } catch(error) {
    console.log("Failed fetching movies' details", error)
    return; 
  }
}

// Every Thursday at 08:00
cron.schedule('0 8 * * 4', async () => {
  console.log('Running Thursday task at 08:00');
  await cronJob();
}, { timezone: "Europe/Athens" });
  
// Every Friday at 04:00
cron.schedule('0 4 * * 5', async () => {
  console.log('Running Friday task at 04:00');
  await cronJob();
}, { timezone: "Europe/Athens" });

const getMoviesDataFromCronJob = () => movieDataFromCronJob

module.exports = { cronJob, getMoviesDataFromCronJob };