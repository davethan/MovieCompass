<template>
  <div v-if="loading">
    <div class="spinner-border" role="status" />
  </div>
  <div v-else class="d-flex flex-column gap-3">
    <div class="card bg-dark text-light" v-for="movie in sortedMovies" :key="movie.id">
      <div class="card-header">
        <h1>{{ movie.greekTitle }}</h1>
        <div class="d-flex justify-content-between flex-wrap column-gap-3">
          <div>{{ movie.originalTitle }} </div>
          <div class="d-flex justify-content-end gap-3">
            <div>Σε {{ movie.cinemas.length }} σινεμά</div>
            <div> {{ formatDuration(movie.duration) }} </div>
            <div>{{ movie.year }} </div>
            <div>{{ movie.imdbRating ? `${movie.imdbRating}/10` : '' }} </div>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="d-flex gap-3">
          <div>
            Από: <template v-for="(director, index) in movie.directors">
              {{ director }}<span :key="index" v-if="index < movie.directors.length - 1">, </span>
            </template>
          </div>
        </div>
        <div class="d-flex gap-3">
          <div v-if="movie.actors.length">
            Με τους: <template v-for="(actor, index) in movie.actors">
              {{ actor }}<span :key="index" v-if="index < movie.actors.length - 1">, </span>
            </template>
          </div>
        </div>
        <div class="mt-4">
          {{ movie.summary }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useMoviesStore } from '@/stores/movies';

const moviesStore = useMoviesStore();
const state = ref(moviesStore.MOVIES);
const loading = ref(false);

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

const sortedMovies = computed(() => {
  return [...state.value].sort((a, b) => {
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
});

onMounted(async () => {
  loading.value = true;
  //await moviesStore.getAllCurrentMoviesDetails();
  loading.value = false;
})
</script>
