<template>
  <div class="d-flex flex-column gap-3">
    <div class="d-flex gap-2 align-items-center flex-wrap">
      <button :class="`btn btn-outline-light ${sortedBy === 1 ? 'text-primary' : ''}`"
        @click="sortByPopularity()">Popularity</button>
      <button v-if="!moviesStore.loadingRating" :class="`btn btn-outline-light ${sortedBy === 2 ? 'text-primary' : ''}`"
        @click="sortByRating()">Rating</button>
      <div v-else class="btn btn-outline-light placeholder-glow" disabled>
        <span class="placeholder col-6"></span>
      </div>
      <button class="btn btn-outline-light" @click="filterByToday()">Today</button>
      <button class="btn btn-outline-light" @click="resetDayFilter()">reset Day filter</button>
      {{ state.length }}/{{ moviesStore.MOVIES.length }}
    </div>
    <div class="card bg-dark text-light" v-for="movie in state" :key="movie.id">
      <div class="card-header">
        <h1>{{ movie.greekTitle }}</h1>
        <div class="d-flex justify-content-between flex-wrap column-gap-3">
          <div>{{ movie.originalTitle }} </div>
          <div class="d-flex justify-content-end gap-3 align-items-center">
            <div>Σε {{ movie.cinemas.length }} σινεμά</div>
            <div> {{ formatDuration(movie.duration) }} </div>
            <div>{{ movie.year }} </div>
            <div v-if="movie.imdbRating">{{ `${movie.imdbRating}/10` }} </div>
            <div v-else class="rating-placeholder placeholder-glow"> <span class="placeholder rounded-3 col-12"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="d-flex gap-3">
          <div>
            Σκηνοθεσία: <template v-for="(director, index) in movie.directors">
              {{ director }}<span :key="index" v-if="index < movie.directors.length - 1">, </span>
            </template>
          </div>
        </div>
        <div class="my-4">
          {{ movie.summary }}
        </div>
        <div class="d-flex gap-3">
          <div v-if="movie.actors.length">
            Παίζουν: <template v-for="(actor, index) in movie.actors">
              {{ actor }}<span :key="index" v-if="index < movie.actors.length - 1">, </span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMoviesStore } from '@/stores/movies';

const moviesStore = useMoviesStore();
const state = ref(moviesStore.MOVIES);
const sortedBy = ref(1)

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;

  if (hours === 0) {
    return `${restMinutes}'`;
  } else if (restMinutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${restMinutes}'`;
  }
};

const sortByPopularity = () => {
  sortedBy.value = 1;
  state.value = state.value.sort((a, b) => {
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

const sortByRating = () => {
  sortedBy.value = 2;
  state.value = state.value.sort((a, b) => {
    if (a.imdbRating && b.imdbRating) {
      if (b.imdbRating !== a.imdbRating) {
        return b.imdbRating - a.imdbRating;
      }
    }
    if (!a.imdbRating && b.imdbRating) {
      return 1;
    }
    if (a.imdbRating && !b.imdbRating) {
      return -1;
    }
    return b.cinemas.length - a.cinemas.length;
  });
};

const filterByToday = () => {
  const date = new Date();
  const today = date.toLocaleDateString('en-US', { weekday: 'long' });
  state.value = state.value.filter((film) => {
    return film.cinemas.some((cinema) => {
      return cinema.cinemaSchedule[today] && cinema.cinemaSchedule[today].length > 0;
    });
  });
};

const resetDayFilter = () => {
  state.value = moviesStore.MOVIES
}

const filterBySelectedDays = (days) => {
  days = ['Wednesday', 'Monday']
  state.value = state.value.filter((film) => {
    return film.cinemas.some((cinema) => {
      return days.some((day) => {
        return cinema.cinemaSchedule[day] && cinema.cinemaSchedule[day].length > 0;
      })
    });
  });
};

onMounted(() => {
  state.value = moviesStore.MOVIES;
  sortByPopularity()
});
</script>

<style scoped>
.rating-placeholder {
  height: 1.7rem;
  width: 30px;
}
</style>
