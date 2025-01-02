<template>
  <div class="navbar sticky-top navbar-dark bg-dark px-3">
    <div class="d-flex gap-3 justify-content-between align-items-center">
      <i v-if="route.name === 'home'" class="bi bi-list fs-3 cursor-pointer" @click="openTheDrawer" />
      <i v-else class="bi bi-arrow-left fs-3 cursor-pointer" @click="router.back" />
      <h4 class="m-0 cursor-pointer text-gradient" @click="router.push({ name: 'home' })">Athens Cinemas
      </h4>
    </div>
    <div class="d-flex gap-3 align-items-center">
      <div class="d-none d-sm-block">
        <button :disabled="specialsStore.loadingSpecials"
          :class="`btn w-100 ${route.name === 'Specials' ? 'btn-secondary' : 'btn-outline-secondary'}`"
          @click="router.push({ name: 'Specials' })">
          Specials
        </button>
      </div>
      <div class="d-none d-sm-block">
        <button :disabled="upcomingStore.loadingUpcoming"
          :class="`btn w-100 ${route.name === 'Upcoming' ? 'btn-secondary' : 'btn-outline-secondary'}`"
          @click="router.push({ name: 'Upcoming' })">
          Προσεχώς
        </button>
      </div>
      <i class="d-md-none bi bi-search fs-6 cursor-pointer" @click="openSearchDrawer" />
      <search-autocomplete :dataset="moviesStore.MOVIES" :showInside="true" cssClass="d-none d-md-block"
        :reset-search="resetSearch" @reset-value-changed="resetSearch = false" @film-selected="handleMovieSelection" />
    </div>
  </div>
  <search-drawer v-model="isSearchDrawerOpen" />
  <the-drawer v-model="isTheDrawerOpen" />
</template>

<script setup>
//:class="`btn w-100 h-100 ${moviesStore.filters.filteredByLocation === 'ALL' ? ' btn-primary' : 'btn-outline-primary'}`"
import { defineAsyncComponent, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import TheDrawer from './TheDrawer.vue';
import { useMoviesStore } from '@/stores/movies';
import { useSpecialsStore } from '@/stores/specials';
import { useUpcomingStore } from '@/stores/upcoming';

const SearchAutocomplete = defineAsyncComponent(() => import('@/shared/SearchAutocomplete.vue'))
const SearchDrawer = defineAsyncComponent(() => import('./SearchDrawer.vue'))

const router = useRouter();
const route = useRoute();

const moviesStore = useMoviesStore();
const specialsStore = useSpecialsStore();
const upcomingStore = useUpcomingStore();

const isSearchDrawerOpen = ref(false);
const isTheDrawerOpen = ref(false);
const resetSearch = ref(false);

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
