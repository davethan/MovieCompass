import cron from 'node-cron';
import { getAthinoramaMovieDetails, getAthinoramaCurrentMovies } from './scrapingActions.js';
import type { Movie, AthinoramaUrl } from '../types.js';

let movieDataFromCronJob = [] as Movie[];
let lastCronJobRun: Date | null = null;

const cronJob = async (slice?: number): Promise<void> => {
  console.log("cron job started")
  lastCronJobRun = new Date(Date.now() + (2 * 60 * 60 * 1000));
  movieDataFromCronJob = [];
  let athinoramaCurrentMovieURLs = [] as AthinoramaUrl[];

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
    
    movieDataFromCronJob = moviesDetails
      .filter((result): result is PromiseFulfilledResult<Movie> => result.status === 'fulfilled')
      .map(result => result.value);
    
    console.log(`Success fetching ${movieDataFromCronJob.length} movies' details`);
    
    const rejected = moviesDetails.filter(result => result.status === 'rejected');
    if (rejected.length > 0) console.log(`${rejected.length} requests failed`);
    return;
  } catch(error) {
    console.log("Failed fetching movies' details", error)
    return; 
  }
}

// Every Thursday at 17:00
cron.schedule('0 17 * * 4', async () => {
  console.log('Running Thursday task at 17:00');
  await cronJob();
}, { timezone: "Europe/Athens" });

// Every Thursday at 21:00
cron.schedule('0 21 * * 4', async () => {
  console.log('Running Thursday task at 21:00');
  await cronJob();
}, { timezone: "Europe/Athens" });

// Every Friday at 18:00
cron.schedule('0 18 * * 5', async () => {
  console.log('Running Friday task at 18:00');
  await cronJob();
}, { timezone: "Europe/Athens" });

const getMoviesDataFromCronJob = () => movieDataFromCronJob
const getLastCronJobRun = () => lastCronJobRun

export { cronJob, getMoviesDataFromCronJob, getLastCronJobRun };