<template>
  <div class="navbar sticky-top navbar-dark bg-dark px-3">
    <div class="d-flex gap-3 justify-content-between align-items-center">
      <i v-if="route.name === 'home'" class="bi bi-list fs-3 cursor-pointer" @click="openTheDrawer" />
      <i v-else class="bi bi-arrow-left fs-3 cursor-pointer" @click="router.back" />
      <h4 class="m-0 cursor-pointer text-gradient" @click="router.push({ name: 'home' })">Athens Cinemas
      </h4>
    </div>
    <div class="d-flex gap-3">
      <i v-if="!movieStore.loadingRating" class="bi bi-megaphone fs-6 cursor-pointer" @click="goToSpecialsPage" />
      <div v-else class="specials-placeholder placeholder-glow"> <span class="placeholder rounded-3 col-12"></span>
      </div>
      <i class="bi bi-search fs-6 cursor-pointer" @click="openSearchDrawer" />
    </div>
  </div>
  <search-drawer v-model="isSearchDrawerOpen" />
  <the-drawer v-model="isTheDrawerOpen" />
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import TheDrawer from './TheDrawer.vue';
import { useMoviesStore } from '@/stores/movies';

const SearchDrawer = defineAsyncComponent(() => import('./SearchDrawer.vue'))

const router = useRouter();
const route = useRoute();

const movieStore = useMoviesStore();

const isSearchDrawerOpen = ref(false);
const isTheDrawerOpen = ref(false);

const openSearchDrawer = () => {
  isSearchDrawerOpen.value = true;
}

const openTheDrawer = () => {
  isTheDrawerOpen.value = true;
}

const goToSpecialsPage = () => {
  const response = movieStore.getSpecialsAthinoramaAction();
  if (response) router.push({ name: 'Specials' });
}
</script>
