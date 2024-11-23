<template>
  <div class="d-flex flex-column gap-3">
    <div class="card border-0" v-for="movie in state" :key="movie.id">
      <div class="card-header border-0">
        <h2 class="text-primary">{{ movie.greekTitle }}</h2>
        <div class="d-flex justify-content-between flex-wrap column-gap-3">
          <div>{{ movie.originalTitle }} </div>
          <div class="d-flex justify-content-end gap-3 align-items-center">
            <div>Σε {{ movie.cinemas.length }} σινεμά</div>
            <div> {{ formatDuration(movie.duration) }} </div>
            <div>{{ movie.year }} </div>
            <div v-if="movie.imdbRating">
              {{ movie.imdbRating === "None" ? 'Η βαθμολογία δεν βρέθηκε' : `${movie.imdbRating}/10` }}
            </div>
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
import { onMounted, inject } from 'vue';
// import { useMoviesStore } from '@/stores/movies';

// const moviesStore = useMoviesStore();
const state = inject("state");

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

onMounted(() => {
  sortByPopularity()
});
</script>

<style scoped>
.rating-placeholder {
  height: 1.7rem;
  width: 40px;
}
</style>
