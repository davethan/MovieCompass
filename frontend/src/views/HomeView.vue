<template>
  <div v-if="loading">
    <div class="spinner-border" role="status" />
  </div>
  <div v-else class="d-flex flex-column gap-3">
    <div class="card bg-dark text-light" v-for="movie in state" :key="movie.id">
      <div class="card-header">
        <h2>{{ movie.greekTitle }}</h2>
      </div>
      <div class="card-body">
        <div>{{ movie.duration }}</div>
        <div>{{ movie.imdbRating }}</div>
        <div>{{ movie.summary }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useMoviesStore } from '@/stores/movies';

const moviesStore = useMoviesStore();
const state = ref(moviesStore.MOVIES);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  //await moviesStore.getAllCurrentMoviesDetails();
  // loading.value = false;
})
</script>
