<template>
  <div class="navbar sticky-top navbar-dark bg-dark px-3">
    <div class="d-flex gap-3 justify-content-between align-items-center">
      <i v-if="route.name === 'home'" class="bi bi-list fs-1 cursor-pointer" data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasExample" />
      <i v-else class="bi bi-arrow-left fs-1 cursor-pointer" @click="router.back" />
      <h2 class="m-0">Athens Cinemas</h2>
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
