<template>
  <drawer id="homeViewDrawer" :modelValue="modelValue" @update:modelValue="closeDrawer">
    <template #drawerHeader>
      <!-- <b>{{ noOfFilteredFilms }}/{{ moviesStore.MOVIES.length }}</b> -->
      <h5 class="text-secondary m-0 d-none d-md-block"><b>Athens Cinemas</b></h5>
      <div class="d-flex gap-1 d-md-none">
        <button class="btn w-100 btn-outline-secondary" @click="goToSpecials">
          <div class="d-flex gap-1">
            <div>Specials</div>
            <i class="bi-arrow-right-short" />
          </div>
        </button>
        <button class="btn w-100 btn-outline-secondary" @click="goToUpcoming">
          <div class="d-flex gap-1">
            <div>Προσεχώς</div>
            <i class="bi-arrow-right-short" />
          </div>
        </button>
      </div>
    </template>
    <template #drawerBody>
      <div class="row g-2">
        <div class="col-12"><strong>Ταξινόμηση</strong></div>
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
        <div class="col-6 mt-4"><strong>Φίλτρα</strong></div>
        <div class="col-6 mt-4">
          <div @click="resetFilters" class="text-secondary cursor-pointer float-end">
            <i class="bi bi-arrow-clockwise" style="font-size:large" />
          </div>
        </div>
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
            :class="`btn w-100 h-100 ${!moviesStore.filters.filteredByLocation.length ? ' btn-primary' : 'btn-outline-primary'}`"
            @click="handleLocationFilterChange(false)">
            <i class="bi bi-geo-alt-fill me-1" />Όλες
          </button>
        </div>
        <div class="col-12 primary-text-hover" v-for="(uniqueLocation, i) in uniqueCinemaLocations" :key="i">
          <div class="form-check">
            <input type="checkbox" class="form-check-input" :id="'location-checkbox-' + i"
              :checked="moviesStore.filters.filteredByLocation.includes(uniqueLocation)"
              @change="handleLocationFilterChange(uniqueLocation)">
            <label class="form-check-label w-100 cursor-pointer" :for="'location-checkbox-' + i">
              {{ toPascalCase(uniqueLocation) }}
            </label>
          </div>
        </div>
        <div class="col-12 mb-1" />
        <div class="col-12">
          <div class="mb-0">Διάρκεια</div>
          <range :min="1" :max="3" :step="0.25" :modelValue="duration" @changed="handleDurationChange" :show-step="true"
            :editStepString="floatToHour" />
          <div class="d-flex justify-content-between mb-2">
            <span>{{ `1h` }}</span>
            <span>{{ `1.5h` }}</span>
            <span>{{ `2h` }}</span>
            <span>{{ `2.5h` }}</span>
            <span>{{ `3h+` }}</span>
          </div>
        </div>
        <div class="col-12 mb-1" />
        <div class="col-12">
          <div class="mb-0">Χρονολογία</div>
          <range :left-to-right="false" :min="moviesStore.getMinReleaseDate" :max="currentYear" :step="1"
            :show-step="true" :modelValue="releaseYear" @changed="handleReleaseYearChange" />
          <div class="d-flex justify-content-between mb-2">
            <span> {{ moviesStore.getMinReleaseDate }} </span>
            <span v-for="i in [2, 3, 4, 5]" :key="i">
              {{ moviesStore.getMinReleaseDate + (i - 1) * yearsApartRounded }}
            </span>
            <span>Φέτος</span>
          </div>
        </div>
      </div>
    </template>
  </drawer>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useMoviesStore } from '@/stores/movies';
import { isEqual } from 'lodash';
import { toPascalCase } from '@/tools/tools';
import { formatDuration } from '@/tools/tools';

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
const currentYear = new Date().getFullYear();
const yearsApartRounded = Math.round((currentYear - moviesStore.getMinReleaseDate) / 5);
const duration = ref(3)
const releaseYear = ref(moviesStore.getMinReleaseDate)

const floatToHour = (v) => formatDuration(Number(v) * 60);
const handleFilterChange = (value) => {
  temporaryFilters = moviesStore.filters;
  temporaryFilters = { ...temporaryFilters, ...value }
  if (isEqual(temporaryFilters, moviesStore.filters)) return
  moviesStore.setFiltersAction({
    sortedBy: temporaryFilters.sortedBy,
    filteredByDay: temporaryFilters.filteredByDay,
    filteredByCinema: temporaryFilters.filteredByCinema,
    filteredByType: temporaryFilters.filteredByType,
    filteredByDuration: temporaryFilters.filteredByDuration,
    filteredByReleaseYear: temporaryFilters.filteredByReleaseYear,
  })
  window.scrollTo(0, 0);
};
const resetFilters = () => {
  moviesStore.setFiltersAction({
    filteredByDay: 1,
    filteredByCinema: 1,
    filteredByType: 1,
    filteredByDuration: 3,
    filteredByReleaseYear: moviesStore.getMinReleaseDate,
    filteredByLocation: [],
  })
  duration.value = 3;
  releaseYear.value = moviesStore.getMinReleaseDate;
}

const handleLocationFilterChange = (value) => {
  let updatedLocations = []
  if (value) {
    const existingLocations = [...moviesStore.filters.filteredByLocation];
    updatedLocations = existingLocations.includes(value) ? existingLocations.filter(item => item !== value) : [...existingLocations, value]
  }
  moviesStore.setFiltersAction({ filteredByLocation: updatedLocations })
  window.scrollTo(0, 0);
}

const handleDurationChange = (e) => {
  duration.value = e
  handleFilterChange({ filteredByDuration: duration.value })
}

const handleReleaseYearChange = (e) => {
  releaseYear.value = e
  handleFilterChange({ filteredByReleaseYear: releaseYear.value })
}

const closeDrawer = () => {
  emit('update:modelValue', false);
};

const goToSpecials = () => {
  router.push({ name: 'Specials' });
  closeDrawer();
}

const goToUpcoming = () => {
  router.push({ name: 'Upcoming' });
  closeDrawer();
}

const uniqueCinemaLocations = computed(() => {
  const cinemaLocations = moviesStore.MOVIES.flatMap((film) =>
    film.cinemas.map((cinema) => cinema.cinemaLocation)
  );
  return [...new Set(cinemaLocations)];
});
</script>
