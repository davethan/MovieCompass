<template>
  <div class="row g-3">
    <div v-if="!state.length" class="col-lg-12 text-center">
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
    <div v-else class="col-lg-3" v-for="movie in state" :key="movie.id">
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
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted, inject } from 'vue';
import { formatDuration } from '@/tools/tools';
import { useMoviesStore } from '@/stores/movies';

const moviesStore = useMoviesStore();
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
  moviesStore.setSelectedMovieAction(id);
  router.push({ name: 'IndividualMovie', params: { filmId: id } });
};

onMounted(() => {
  sortByPopularity()
});
</script>
