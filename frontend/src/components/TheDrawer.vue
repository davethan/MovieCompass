<template>
  <div class="offcanvas offcanvas-start" tabindex="-1" id="homeViewDrawer" aria-labelledby="offcanvasExampleLabel">
    <div class="offcanvas-header">
      <button type="button" class="mx-0 py-0 btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      <div class="ms-auto offcanvas-title" id="offcanvasExampleLabel">
        <b>{{ noOfFilteredFilms }}/{{ moviesStore.MOVIES.length }}</b>
      </div>
    </div>
    <div class="offcanvas-body">
      <div class="row g-2">
        <div class="col-6">
          <button
            :class="`btn w-100 ${moviesStore.filters.sortedBy === POPULARITY ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="handleFilterChange({ sortedBy: POPULARITY })">
            <i class="bi bi-fire me-1" />Δημοφιλία
          </button>
        </div>
        <div class="col-6">
          <button v-if="!moviesStore.loadingRating"
            :class="`btn w-100 ${moviesStore.filters.sortedBy === RATING ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="handleFilterChange({ sortedBy: RATING })"><i class="bi bi-star-half me-1" />Βαθμολογία</button>
          <div v-else class="placeholder-glow h-100 w-100">
            <span class="placeholder h-100 rounded-2 col-12"></span>
          </div>
        </div>
        <div class="col-12 mb-2" />
        <div class="col-12">
          <button
            :class="`btn w-100 ${moviesStore.filters.filteredByDay === EVERY_DAY ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="handleFilterChange({ filteredByDay: EVERY_DAY })"><i class="bi bi-calendar-week-fill me-1" />Κάθε
            μέρα</button>
        </div>
        <div class="col-4">
          <button
            :class="`btn w-100 ${moviesStore.filters.filteredByDay === TODAY ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="handleFilterChange({ filteredByDay: TODAY })">Σήμερα</button>
        </div>
        <div class="col-4">
          <button
            :class="`btn w-100 ${moviesStore.filters.filteredByDay === TOMORROW ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="handleFilterChange({ filteredByDay: TOMORROW })">Αύριο</button>
        </div>
        <div class="col-4">
          <button
            :class="`btn w-100 ${moviesStore.filters.filteredByDay === WEEKEND ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="handleFilterChange({ filteredByDay: WEEKEND })">Το ΣΚ</button>
        </div>
        <div class="col-12 mb-2" />
        <div class="col-12">
          <button
            :class="`btn w-100 ${moviesStore.filters.filteredByCinema === ALL_CINEMAS ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="handleFilterChange({ filteredByCinema: ALL_CINEMAS })"><i
              class="bi bi-camera-reels-fill me-1" />Όλοι</button>
        </div>
        <div class="col-6">
          <button
            :class="`btn w-100 ${moviesStore.filters.filteredByCinema === SUMMER_CINEMAS ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="handleFilterChange({ filteredByCinema: SUMMER_CINEMAS })"><i
              class="bi bi-brightness-high-fill me-1" />Θερινοί</button>
        </div>
        <div class="col-6">
          <button
            :class="`btn w-100 ${moviesStore.filters.filteredByCinema === WINTER_CINEMAS ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="handleFilterChange({ filteredByCinema: WINTER_CINEMAS })"><i
              class="bi bi-cloud-fill me-1" />Χειμερινοί</button>
        </div>
        <div class="col-12 mb-2" />
        <div class="col-12">
          <button
            :class="`btn w-100 ${moviesStore.filters.filteredByType === ALL ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="handleFilterChange({ filteredByType: ALL })"><i class="bi bi-film me-1" />Όλες</button>
        </div>
        <div class="col-6">
          <button
            :class="`btn w-100 ${moviesStore.filters.filteredByType === REGULAR ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="handleFilterChange({ filteredByType: REGULAR })">Live
            action</button>
        </div>
        <div class="col-6">
          <button
            :class="`btn w-100 ${moviesStore.filters.filteredByType === ANIMATION ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="handleFilterChange({ filteredByType: ANIMATION })">Animation</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMoviesStore } from '@/stores/movies';
import { isEqual } from 'lodash';

const moviesStore = useMoviesStore();
let temporaryFilters = {};

defineProps({
  noOfFilteredFilms: {
    type: Number,
    default: 0
  }
});

const EVERY_DAY = 1, TODAY = 2, TOMORROW = 3, WEEKEND = 4;
const ALL_CINEMAS = 1, SUMMER_CINEMAS = 2, WINTER_CINEMAS = 3;
const POPULARITY = 1, RATING = 2;
const ALL = 1, REGULAR = 2, ANIMATION = 3;

const handleFilterChange = (value) => {
  temporaryFilters = moviesStore.filters;
  temporaryFilters = { ...temporaryFilters, ...value }
  if (isEqual(temporaryFilters, moviesStore.filters)) return
  moviesStore.setFiltersAction({
    sortedBy: temporaryFilters.sortedBy,
    filteredByDay: temporaryFilters.filteredByDay,
    filteredByCinema: temporaryFilters.filteredByCinema,
    filteredByType: temporaryFilters.filteredByType,
  })
  window.scrollTo(0, 0);
};
</script>
