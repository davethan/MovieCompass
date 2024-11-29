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
          <h2 class="text-primary">{{ movie.greekTitle }}</h2>
          <div class="d-flex justify-content-between flex-wrap column-gap-3 row-gap-1">
            <div>{{ movie.originalTitle }} </div>
            <div class="d-flex justify-content-end flex-wrap gap-1 align-items-center">
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
  <TheDrawer @filter-changed="applyFiltersAndSort" :noOfFilteredFilms="filteredMovies.length" />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted, ref, unref } from 'vue';
import { formatDuration } from '@/tools/tools';
import TheDrawer from '@/components/TheDrawer.vue';
import { useMoviesStore } from '@/stores/movies';

const moviesStore = useMoviesStore();
const router = useRouter();
const filteredMovies = ref(moviesStore.MOVIES);

const EVERY_DAY = 1, TODAY = 2, TOMORROW = 3, WEEKEND = 4;
const ALL_CINEMAS = 1, SUMMER_CINEMAS = 2, WINTER_CINEMAS = 3;
const POPULARITY = 1, RATING = 2;

const applyFiltersAndSort = ({ day, cinemaType, sort }) => {
  filteredMovies.value = [...unref(moviesStore).MOVIES];

  if (day === TODAY) {
    const date = new Date();
    const today = date.toLocaleDateString('en-US', { weekday: 'long' });
    filteredMovies.value = filterByDays(filteredMovies.value, [today]);
  } else if (day === TOMORROW) {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const tomorrow = date.toLocaleDateString('en-US', { weekday: 'long' });
    filteredMovies.value = filterByDays(filteredMovies.value, [tomorrow]);
  } else if (day === WEEKEND) {
    filteredMovies.value = filterByDays(filteredMovies.value, ['Saturday', 'Sunday']);
  }

  if (cinemaType === SUMMER_CINEMAS) {
    filteredMovies.value = filterByCinemas(filteredMovies.value, true);
  } else if (cinemaType === WINTER_CINEMAS) {
    filteredMovies.value = filterByCinemas(filteredMovies.value, false);
  }

  if (sort === POPULARITY) {
    filteredMovies.value = sortByPopularity(filteredMovies.value);
  } else if (sort === RATING) {
    filteredMovies.value = sortByRating(filteredMovies.value);
  }
};

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

onMounted(() => {
  filteredMovies.value = moviesStore.MOVIES;
  applyFiltersAndSort({ day: EVERY_DAY, cinemaType: ALL_CINEMAS, sort: POPULARITY });
});
</script>
