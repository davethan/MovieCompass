<template>
  <div class="d-flex flex-column flex-lg-row gap-3 flex-wrap">
    <div class="text-center mt-5" v-if="!state.length">
      Δεν βρέθηκαν ταινίες με αυτά τα κριτήρια.
    </div>
    <div class="card border-0 film-item" v-for="movie in state" :key="movie.id" @click="goToMoviePage(movie.id)">
      <div class="card-header">
        <h2 class="text-primary">{{ movie.greekTitle }}</h2>
        <div class="d-flex justify-content-between flex-wrap column-gap-3">
          <div>{{ movie.originalTitle }} </div>
          <div class="d-flex justify-content-end flex-wrap gap-3 align-items-center">
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
import { useRouter } from 'vue-router';
import { onMounted, inject } from 'vue';
import { formatDuration } from '@/tools/tools';
// import { useMoviesStore } from '@/stores/movies';

// const moviesStore = useMoviesStore();
const router = useRouter();
const state = inject("state");

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

const goToMoviePage = (id) => {
  router.push({ name: 'IndividualMovie', params: { filmId: id } });
};

onMounted(() => {
  sortByPopularity()
});
</script>
