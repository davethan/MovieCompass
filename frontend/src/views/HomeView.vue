<template>
  <div class="row g-3">
    <div v-if="!filteredMovies.length" class="col-sm-6 col-md-6 col-lg-3">
      <div class="card film-item-no-hover">
        <div class="card-header">
          <h2 class="text-primary m-0">Δεν βρέθηκαν ταινίες</h2>
        </div>
        <div class="card-body">
          Δοκιμάστε να ξαναφορτώσετε τη σελίδα!
        </div>
      </div>
    </div>
    <div v-else class="col-sm-6 col-md-6 col-lg-3" v-for="movie in filteredMovies" :key="movie.id">
      <div class="card film-item cursor-pointer" @click="goToMoviePage(movie.id)">
        <div class="card-header">
          <i v-if="isGem(movie)" class="bi bi-gem text-danger float-end" />
          <i v-if="isFlame(movie)" class="bi bi-fire text-warning float-end" />
          <h2 class="text-primary m-0">{{ movie.greekTitle }}</h2>
          <div class="row g-2">
            <div class="col-12">{{ movie.originalTitle }} </div>
            <div class="col-12 d-flex justify-content-start flex-wrap gap-1 align-items-center">
              <div class="tag-outlined">Σε {{ movie.cinemas.length }} σινεμά
              </div>
              <div class="tag-outlined"> {{ formatDuration(movie.duration) }} </div>
              <div class="tag-outlined">{{ movie.year }} </div>
              <div class="tag-outlined" v-if="movie.imdbRating">
                {{ movie.imdbRating === "None" ? '?/10' : `${movie.imdbRating}/10` }}
              </div>
              <div v-else class="rating-placeholder placeholder-glow"> <span
                  class="placeholder rounded-3 col-12"></span>
              </div>
            </div>
            <div class="col-12 d-flex justify-content-start flex-wrap gap-1 align-items-center">
              <div v-for="(tag, i) in movie.tags" :key="i" class="tag-square">{{ tag }}</div>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="d-flex gap-3">
            <div>
              <b>Σκηνοθεσία:</b> <template v-for="(director, index) in movie.directors">
                {{ director }}<span :key="index" v-if="index < movie.directors.length - 1">, </span>
              </template>
            </div>
          </div>
          <div class="my-4">
            {{ movie.summary }}
          </div>
          <div v-if="movie.actors.length" class="mb-2">
            <b>Παίζουν:</b> <template v-for="(actor, index) in movie.actors">
              {{ actor }}<span :key="index" v-if="index < movie.actors.length - 1">, </span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
  <scroll-to-top-button />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { computed, unref } from 'vue';
import { formatDuration } from '@/tools/tools';
import ScrollToTopButton from '@/shared/ScrollToTopButton.vue';
import { useMoviesStore } from '@/stores/movies';

const moviesStore = useMoviesStore();
const router = useRouter();

const TODAY = 2, TOMORROW = 3, WEEKEND = 4;
const SUMMER_CINEMAS = 2, WINTER_CINEMAS = 3;
const POPULARITY = 1, RATING = 2;
const REGULAR = 2, ANIMATION = 3;

const filteredMovies = computed(() => {
  let filtered = [...unref(moviesStore).MOVIES];

  const filterDay = moviesStore.filters.filteredByDay;
  const filterCinemaType = moviesStore.filters.filteredByCinema;
  const filterLocation = moviesStore.filters.filteredByLocation;

  filtered = filtered.filter((film) => {
    const validCinemas = film.cinemas.filter((cinema) => {
      const locationMatch = filterLocation === 'ALL' || cinema.cinemaLocation === filterLocation;
      const typeMatch = filterCinemaType === SUMMER_CINEMAS
        ? cinema.isOutdoor === true
        : filterCinemaType === WINTER_CINEMAS
          ? cinema.isOutdoor === false
          : true;

      const date = new Date();
      let dayMatch = false;
      if (filterDay === TODAY) {
        const today = date.toLocaleDateString('en-US', { weekday: 'long' });
        dayMatch = cinema.cinemaSchedule[today] && cinema.cinemaSchedule[today].length > 0;
      } else if (filterDay === TOMORROW) {
        date.setDate(date.getDate() + 1);
        const tomorrow = date.toLocaleDateString('en-US', { weekday: 'long' });
        dayMatch = cinema.cinemaSchedule[tomorrow] && cinema.cinemaSchedule[tomorrow].length > 0;
      } else if (filterDay === WEEKEND) {
        dayMatch =
          (cinema.cinemaSchedule['Saturday'] && cinema.cinemaSchedule['Saturday'].length > 0) ||
          (cinema.cinemaSchedule['Sunday'] && cinema.cinemaSchedule['Sunday'].length > 0);
      } else {
        dayMatch = true;
      }
      return locationMatch && typeMatch && dayMatch;
    });
    return validCinemas.length > 0;
  });

  if (moviesStore.filters.filteredByType === REGULAR) {
    filtered = filterByType(filtered, false);
  } else if (moviesStore.filters.filteredByType === ANIMATION) {
    filtered = filterByType(filtered, true);
  }

  if (moviesStore.filters.sortedBy === POPULARITY) {
    filtered = sortByPopularity(filtered);
  } else if (moviesStore.filters.sortedBy === RATING) {
    filtered = sortByRating(filtered);
  }

  return filtered;
});

const sortByPopularity = (filteredMovies) => {
  return filteredMovies.sort((a, b) => {
    if (a.cinemas.length !== b.cinemas.length) {
      return b.cinemas.length - a.cinemas.length;
    }
    if (a.imdbRating && b.imdbRating) {
      return b.imdbRating - a.imdbRating;
    }
    if (!a.imdbRating && b.imdbRating) {
      return 1;
    }
    if (a.imdbRating && !b.imdbRating) {
      return -1;
    }
    return 0;
  });
};

const sortByRating = (filteredMovies) => {
  return filteredMovies.sort((a, b) => {
    if (a.imdbRating !== 'None' && b.imdbRating !== 'None') {
      if (b.imdbRating !== a.imdbRating) {
        return b.imdbRating - a.imdbRating;
      }
    }
    if (a.imdbRating === 'None' && b.imdbRating !== 'None') {
      return 1;
    }
    if (a.imdbRating !== 'None' && b.imdbRating === 'None') {
      return -1;
    }
    return b.cinemas.length - a.cinemas.length;
  });
};

const filterByType = (filteredMovies, isAnimation) => {
  return filteredMovies.filter((film) => {
    const hasAnimationTag = film.tags.some((tag) => tag === 'Animation');
    return isAnimation ? hasAnimationTag : !hasAnimationTag;
  });
};

const isGem = (film) => {
  if (moviesStore.filters.sortedBy !== POPULARITY) return false
  if (film.year >= 1965) {
    return film.imdbRating >= 7.9 &&
      film.popularity >= 2000 &&
      (!film.tags.includes('Animation') && !film.tags.includes('Μιούζικαλ'))
  } else {
    return film.imdbRating >= 8.5 &&
      film.popularity >= 6000
  }
}

const isFlame = (film) => moviesStore.filters.sortedBy === RATING && film.cinemas.length >= 10

const goToMoviePage = (id) => {
  moviesStore.setSelectedMovieAction(id);
  router.push({ name: 'IndividualMovie', params: { filmId: id } });
};
</script>
