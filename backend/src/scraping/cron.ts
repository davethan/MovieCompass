import cron from 'node-cron';
import { getAthinoramaMovieDetails, getAthinoramaCurrentMovies, getMoreTicketLinks } from './scrapingActions.js';
import { applyImdbRatings } from './imdbRatings.js';
import { addTicketLinks } from './transformations.js';
import { replaceAllMovies, clearMovies, getLastUpdate } from '../db/movies.js';
import { athensWeekStart } from '../db/time.js';
import type { Movie, AthinoramaUrl } from '../types.js';

let currentRun: Promise<void> | null = null;

const DEV_MOVIES_LIMIT = process.argv.includes('--dev') ? 5 : undefined;

// A failed run keeps the old movies only if they were saved during the current cinema week
// (since Thursday 00:00 Athens time). Older movies are cleared, so last week's list is never shown.
const handleFailedRun = (): void => {
  const lastUpdate = getLastUpdate();
  if (lastUpdate && lastUpdate >= athensWeekStart()) {
    console.log("Keeping this week's movies");
    return;
  }
  clearMovies();
  console.log("Cleared old movies");
}

const cronJob = async (slice?: number): Promise<void> => {
  console.log("cron job started")
  // The previous list stays visible until the new one (with ratings) is saved.
  let athinoramaCurrentMovieURLs = [] as AthinoramaUrl[];

  try {
    athinoramaCurrentMovieURLs = await getAthinoramaCurrentMovies();
    if (!athinoramaCurrentMovieURLs || athinoramaCurrentMovieURLs.length === 0) {
      console.log("Athinorama request success. But movies are empty...");
      handleFailedRun();
      return;
    }
  } catch(error) {
    console.log("Failed fething athinorama movies", error);
    handleFailedRun();
    return;
  }

  try {
    const requests = [];
    athinoramaCurrentMovieURLs.slice(0, slice).forEach(film => requests.push(getAthinoramaMovieDetails(film.url, film.id)))
    const moviesDetails = await Promise.allSettled(requests);
    
    const movies = moviesDetails
      .filter((result): result is PromiseFulfilledResult<Movie> => result.status === 'fulfilled')
      .map(result => result.value);

    const rejected = moviesDetails.filter(result => result.status === 'rejected');
    if (rejected.length > 0) console.log(`${rejected.length} requests failed`);

    if (movies.length === 0) {
      console.log("Every movie request failed");
      handleFailedRun();
      return;
    }

    // Ratings are added before saving, so the frontend gets rated movies right away.
    // Movies without an IMDb link are matched by title + year first.
    // If this fails, the movies are saved without ratings and the frontend's OMDB fallback fills them in.
    try {
      await applyImdbRatings(movies, { matchTitles: true });
    } catch (error) {
      console.log("Failed applying IMDb ratings", error);
    }

    // Ticket links
    let moreTicketLinks: Record<string, string> = {};
    try {
      moreTicketLinks = await getMoreTicketLinks();
    } catch (error) {}
    addTicketLinks(movies, moreTicketLinks);

    replaceAllMovies(movies);

    console.log(`Success fetching ${movies.length} movies' details`);
    return;
  } catch(error) {
    console.log("Failed fetching movies' details", error)
    handleFailedRun();
    return;
  }
}

// Starts a job, or returns the one already running, so two runs never overlap.
const runCronJob = (slice = DEV_MOVIES_LIMIT): Promise<void> => {
  currentRun ??= cronJob(slice).finally(() => { currentRun = null; });
  return currentRun;
}

// Resolves when the running job (if any) has finished.
const waitForCurrentRun = async (): Promise<void> => {
  if (currentRun) await currentRun;
}

// Every Thursday at 17:00
cron.schedule('0 17 * * 4', async () => {
  console.log('Running Thursday task at 17:00');
  await runCronJob();
}, { timezone: "Europe/Athens" });

// Every Thursday at 21:00
cron.schedule('0 21 * * 4', async () => {
  console.log('Running Thursday task at 21:00');
  await runCronJob();
}, { timezone: "Europe/Athens" });

// Every Friday at 18:00
cron.schedule('0 18 * * 5', async () => {
  console.log('Running Friday task at 18:00');
  await runCronJob();
}, { timezone: "Europe/Athens" });

export { runCronJob, waitForCurrentRun };