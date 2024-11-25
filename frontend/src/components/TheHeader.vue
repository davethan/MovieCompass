<template>
  <div class="navbar sticky-top navbar-dark bg-dark px-3">
    <div class="d-flex gap-3 justify-content-between align-items-center">
      <i v-if="route.name === 'home'" class="bi bi-list fs-1" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" />
      <i v-else class="bi bi-arrow-left fs-1" @click="router.back"/>
      <div>Movie Compass </div>
    </div>
    <div class="ml-auto">{{ state.length }}/{{ moviesStore.MOVIES.length }}</div>
  </div>
  <TheDrawer />
</template>

<script setup>
import { inject } from 'vue'
import TheDrawer from './TheDrawer.vue';
import { useRouter, useRoute } from 'vue-router';
import { useMoviesStore } from '@/stores/movies';

const router = useRouter();
const route = useRoute();

const moviesStore = useMoviesStore();
const state = inject("state");
</script>

<style scoped>
.navbar {
  background-color: rgb(52, 58, 64) !important;
}
</style>
