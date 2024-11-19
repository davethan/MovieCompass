<template>
  <main>
    <div class="d-flex flex-column gap-3">
      <div class="card" v-for="movie in state" :key="movie.id">
        <h2>{{ movie.greekTitle }}</h2>
        <div>{{ movie.duration }}</div>
        <div>{{ movie.imdbRating }}</div>
        <div>{{ movie.summary }}</div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useMoviesStore } from '@/stores/movies';

const moviesStore = useMoviesStore();
const state = ref(moviesStore.MOVIES);

onMounted(async () => {
  // const response = await moviesStore.getAllCurrentMoviesDetails();
  // if (!response) state.value = moviesStore.ATHINORAMA_URLS;
})
</script>
