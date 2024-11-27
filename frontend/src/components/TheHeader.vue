<template>
  <div class="navbar sticky-top navbar-dark bg-dark px-3">
    <div class="d-flex gap-3 justify-content-between align-items-center">
      <i v-if="route.name === 'home'" class="bi bi-list fs-3 text-secondary cursor-pointer" data-bs-toggle="offcanvas"
        data-bs-target="#homeViewDrawer" />
      <i v-else-if="route.name === 'IndividualMovie'" class="bi bi-film fs-3 text-secondary cursor-pointer"
        data-bs-toggle="offcanvas" data-bs-target="#individualMovieDrawer" />
      <i v-else class="bi bi-arrow-left fs-3 cursor-pointer" @click="router.back" />
      <h4 class="m-0 cursor-pointer" @click="router.push({ name: 'home' })">Athens Cinemas</h4>
    </div>
    <div class="ml-auto">{{ state.length }}/{{ moviesStore.MOVIES.length }}</div>
  </div>
  <TheDrawer />
  <IndividualMovieDrawer />
</template>

<script setup>
import { inject } from 'vue'
import TheDrawer from './TheDrawer.vue';
import IndividualMovieDrawer from './IndividualMovieDrawer.vue';
import { useRouter, useRoute } from 'vue-router';
import { useMoviesStore } from '@/stores/movies';

const router = useRouter();
const route = useRoute();

const moviesStore = useMoviesStore();
const state = inject("state");
</script>
