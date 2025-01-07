<template>
  <drawer id="homeViewDrawer" :modelValue="modelValue" @update:modelValue="closeDrawer">
    <template #drawerHeader>
      <!-- <b>{{ noOfFilteredFilms }}/{{ moviesStore.MOVIES.length }}</b> -->
      <h5 class="text-secondary m-0 d-none d-sm-block"><b>Athens Cinemas</b></h5>
      <div class="d-flex gap-1 d-sm-none">
        <button class="btn w-100 btn-outline-secondary" @click="router.push({ name: 'Specials' })">
          <div class="d-flex gap-1">
            <div>Specials</div>
            <i class="bi-arrow-right-short" />
          </div>
        </button>
        <button class="btn w-100 btn-outline-secondary" @click="router.push({ name: 'Upcoming' })">
          <div class="d-flex gap-1">
            <div>Προσεχώς</div>
            <i class="bi-arrow-right-short" />
          </div>
        </button>
      </div>
    </template>
    <template #drawerBody>
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
        <div class="col-12 mb-2" />
        <div class="col-12">
          <button
            :class="`btn w-100 h-100 ${moviesStore.filters.filteredByLocation === 'ALL' ? ' btn-primary' : 'btn-outline-primary'}`"
            @click="handleFilterChange({ filteredByLocation: 'ALL' })">
            <i class="bi bi-geo-alt-fill me-1" />Όλες
          </button>
        </div>
        <div class="col-6" v-for="(uniqueLocation, i) in uniqueCinemaLocations" :key="i">
          <button
            :class="`btn w-100 h-100 ${moviesStore.filters.filteredByLocation === uniqueLocation ? ' btn-primary' : 'btn-outline-primary'}`"
            @click="handleFilterChange({ filteredByLocation: uniqueLocation })">
            {{ toPascalCase(uniqueLocation) }}
          </button>
        </div>
      </div>
    </template>
  </drawer>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { useMoviesStore } from '@/stores/movies';
import { isEqual } from 'lodash';
import { toPascalCase } from '@/tools/tools';

const router = useRouter();
const moviesStore = useMoviesStore();
let temporaryFilters = {};

const emit = defineEmits(['update:modelValue'])

defineProps({
  noOfFilteredFilms: {
    type: Number,
    default: 0
  },
  modelValue: {
    type: Boolean,
    default: false
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
    filteredByLocation: temporaryFilters.filteredByLocation,
  })
  window.scrollTo(0, 0);
};

const closeDrawer = () => {
  emit('update:modelValue', false);
};

const uniqueCinemaLocations = computed(() => {
  const cinemaLocations = moviesStore.MOVIES.flatMap((film) =>
    film.cinemas.map((cinema) => cinema.cinemaLocation)
  );
  return [...new Set(cinemaLocations)];
});
</script>
