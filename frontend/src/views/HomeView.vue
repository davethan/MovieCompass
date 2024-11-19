<template>
  <main>
    <div class="container">
      <div class="movieCard" v-for="movie in state" :key="movie.id">
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

<style scoped>
.movieCard {
  border: 1px;
  padding: 1rem;
  border-style: solid;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
