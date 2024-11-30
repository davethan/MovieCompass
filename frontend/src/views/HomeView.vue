<template>
  <div class="row g-3">
    <div v-if="!filteredMovies.length" class="col-lg-12 text-center">
      <div class="card border-0 film-item">
        <div class="card-header">
          <h2>Ουψ!</h2>
        </div>
        <div class="card-body">
          <div class="my-2">
            Δεν βρέθηκε κάποια ταινία με αυτά τα κριτήρια. Δοκιμάστε να αφαιρέσετε κάποια απ' αυτά.
          </div>
        </div>
      </div>
    </div>
    <div v-else class="col-lg-3" v-for="movie in filteredMovies" :key="movie.id">
      <div class="card film-item cursor-pointer" @click="goToMoviePage(movie.id)">
        <div class="card-header">
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
          <div class="d-flex gap-3">
            <div v-if="movie.actors.length">
              <b>Παίζουν:</b> <template v-for="(actor, index) in movie.actors">
                {{ actor }}<span :key="index" v-if="index < movie.actors.length - 1">, </span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <TheDrawer :noOfFilteredFilms="filteredMovies.length" />
  <ScrollToTopButton />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { computed, unref } from 'vue';
import { formatDuration } from '@/tools/tools';
import TheDrawer from '@/components/TheDrawer.vue';
import ScrollToTopButton from '@/shared/ScrollToTopButton.vue';
import { useMoviesStore } from '@/stores/movies';

const moviesStore = useMoviesStore();
const router = useRouter();

const TODAY = 2, TOMORROW = 3, WEEKEND = 4;
const SUMMER_CINEMAS = 2, WINTER_CINEMAS = 3;
const POPULARITY = 1, RATING = 2;

const filteredMovies = computed(() => {
  let filtered = [...unref(moviesStore).MOVIES];
  if (moviesStore.filters.filteredByDay === TODAY) {
    const date = new Date();
    const today = date.toLocaleDateString('en-US', { weekday: 'long' });
    filtered = filterByDays(filtered, [today]);
  } else if (moviesStore.filters.filteredByDay === TOMORROW) {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const tomorrow = date.toLocaleDateString('en-US', { weekday: 'long' });
    filtered = filterByDays(filtered, [tomorrow]);
  } else if (moviesStore.filters.filteredByDay === WEEKEND) {
    filtered = filterByDays(filtered, ['Saturday', 'Sunday']);
  }

  if (moviesStore.filters.filteredByCinema === SUMMER_CINEMAS) {
    filtered = filterByCinemas(filtered, true);
  } else if (moviesStore.filters.filteredByCinema === WINTER_CINEMAS) {
    filtered = filterByCinemas(filtered, false);
  }

  if (moviesStore.filters.sortedBy === POPULARITY) {
    filtered = sortByPopularity(filtered);
  } else if (moviesStore.filters.sortedBy === RATING) {
    filtered = sortByRating(filtered);
  }
  return filtered;
})

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

const filterByDays = (filteredMovies, days) => {
  return filteredMovies.filter((film) => {
    return film.cinemas.some((cinema) => {
      return days.some((day) => {
        return cinema.cinemaSchedule[day] && cinema.cinemaSchedule[day].length > 0;
      })
    });
  });
};

const filterByCinemas = (filteredMovies, isOutdoor) => {
  return filteredMovies.filter((film) => film.cinemas.some((cinema) => cinema.isOutdoor === isOutdoor));
};

const goToMoviePage = (id) => {
  moviesStore.setSelectedMovieAction(id);
  router.push({ name: 'IndividualMovie', params: { filmId: id } });
};
</script>
