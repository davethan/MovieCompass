<template>
  <div class="navbar sticky-top navbar-dark bg-dark px-3">
    <div class="d-flex gap-3 justify-content-between align-items-center">
      <i v-if="route.name === 'Home'" class="bi bi-list fs-3 cursor-pointer" @click="openTheDrawer" />
      <i v-else class="bi bi-arrow-left fs-3 cursor-pointer" @click="router.back" />
      <h4 class="m-0 cursor-pointer text-gradient" @click="router.push({ name: 'Home' })">Athens Cinemas
      </h4>
    </div>
    <div class="d-flex gap-3 align-items-center">
      <div class="d-none d-md-block">
        <icon-button :cssClass="`btn w-100 ${route.name === 'Home' ? 'btn-secondary' : 'btn-outline-secondary'}`"
          title="Home" @click="router.push({ name: 'Home' })" icon="bi bi-house-door-fill" />
      </div>
      <div class="d-none d-md-block">
        <icon-button :disabled="specialsStore.loadingSpecials"
          :cssClass="`btn w-100 ${route.name === 'Specials' ? 'btn-secondary' : 'btn-outline-secondary'}`"
          @click="router.push({ name: 'Specials' })" title="Specials" icon="bi bi-gift-fill" />
      </div>
      <div class="d-none d-md-block">
        <icon-button :disabled="upcomingStore.loadingUpcoming && !upcomingStore.UPCOMING.length"
          :cssClass="`btn w-100 ${route.name === 'Upcoming' ? 'btn-secondary' : 'btn-outline-secondary'}`"
          @click="router.push({ name: 'Upcoming' })" title="Προσεχώς" icon="bi bi-fast-forward-fill" />
      </div>
      <i class="d-lg-none bi bi-search fs-6 cursor-pointer" @click="openSearchDrawer" />
      <search-autocomplete :dataset="moviesStore.MOVIES" :showInside="true" cssClass="d-none d-lg-block"
        :reset-search="resetSearch" @reset-value-changed="resetSearch = false" @film-selected="handleMovieSelection" />
      <button class="btn btn-sm btn-primary" @click="changeTheme">
        <i :class="theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon'" />
      </button>
    </div>
  </div>
  <search-drawer v-model="isSearchDrawerOpen" />
  <the-drawer v-model="isTheDrawerOpen" />
</template>

<script setup>
import { defineAsyncComponent, ref, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import TheDrawer from './TheDrawer.vue';
import { useMoviesStore } from '@/stores/movies';
import { useSpecialsStore } from '@/stores/specials';
import { useUpcomingStore } from '@/stores/upcoming';

const SearchAutocomplete = defineAsyncComponent(() => import('@/shared/SearchAutocomplete.vue'))
const SearchDrawer = defineAsyncComponent(() => import('./SearchDrawer.vue'))
const IconButton = defineAsyncComponent(() => import('@/shared/IconButton.vue'))

const router = useRouter();
const route = useRoute();

const moviesStore = useMoviesStore();
const specialsStore = useSpecialsStore();
const upcomingStore = useUpcomingStore();

const isSearchDrawerOpen = ref(false);
const isTheDrawerOpen = ref(false);
const resetSearch = ref(false);
const theme = inject('theme');

const changeTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const toggledTheme = savedTheme === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', toggledTheme);

  theme.value = localStorage.getItem('theme');
  document.body.setAttribute('data-bs-theme', localStorage.getItem('theme'));
}

const openSearchDrawer = () => {
  isSearchDrawerOpen.value = true;
}

const openTheDrawer = () => {
  isTheDrawerOpen.value = true;
}

const handleMovieSelection = (id) => {
  moviesStore.setSelectedMovieAction(id);
  router.push({ name: 'IndividualMovie', params: { filmId: id } });
  resetSearch.value = true
};
</script>
