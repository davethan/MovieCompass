<template>
  <div class="navbar sticky-top navbar-dark bg-dark px-3 shadow-lg">
    <div class="d-flex gap-3 justify-content-between align-items-center">
      <i class="bi bi-list fs-1" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" />
      <div>Movie Compass </div>
    </div>
    <div class="ml-auto">{{ state.length }}/{{ moviesStore.MOVIES.length }}</div>
  </div>
  <TheDrawer />
</template>

<script setup>
import { inject } from 'vue'
import TheDrawer from './TheDrawer.vue';
import { useMoviesStore } from '@/stores/movies';

const moviesStore = useMoviesStore();
const state = inject("state");
</script>
