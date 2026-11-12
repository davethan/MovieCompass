<template>
  <div class="row justify-content-center g-3 mb-3">
    <div class="col-xl-6">
      <div class="card border-0">
        <div class="card-header">

          <!-- bigger than small -->
          <div class="d-none d-sm-block">
            <div class="d-flex justify-content-between gap-2">
              <img :src="state.imageUrl" :alt="state.greekTitle" class="img-fluid">
              <div class="d-flex flex-grow-1 flex-column">
                <h2 class="text-primary m-0">{{ state.greekTitle }}</h2>
                <div class="col-12 mb-2">{{ state.originalTitle }} </div>
                <div class="row g-2">
                  <div class="col-12 d-flex justify-content-start flex-wrap gap-1 align-items-center">
                    <div class="tag-outlined">Σε {{ state.cinemas.length }} σινεμά</div>
                    <div class="tag-outlined"> {{ formatDuration(state.duration) }} </div>
                    <div class="tag-outlined">{{ state.year }} </div>
                    <div class="tag-outlined d-inline-flex align-items-center gap-1" v-if="state.imdbRating"
                      title="Βαθμολογία IMDb">
                      {{ state.imdbRating === "None" ? '?' : `${state.imdbRating}` }}
                      <span class="imdb-badge">IMDb</span>
                    </div>
                    <div v-else class="rating-placeholder placeholder-glow"> <span
                        class="placeholder rounded-3 col-12"></span>
                    </div>
                    <div v-if="state.rated" class="tag-outlined">{{ state.rated }}</div>
                  </div>
                  <div class="col-12 d-flex justify-content-start flex-wrap gap-1 align-items-center">
                    <div v-for="(tag, i) in state.tags" :key="i" class="tag-square">{{ tag }}</div>
                  </div>
                </div>
              </div>
              <i class="height-fit-content bi bi-list fs-3 cursor-pointer" @click="openMovieDrawer" />
            </div>
          </div>

          <!-- small -->
          <div class="d-block d-sm-none">
            <div class="row g-2 mb-2">
              <img :src="state.imageUrl" :alt="state.greekTitle" class="col-3 img-fluid">
              <div class="col-8 d-flex flex-column">
                <h2 class="text-primary m-0">{{ state.greekTitle }}</h2>
                <div class="col-12">{{ state.originalTitle }} </div>
              </div>
              <i class="height-fit-content col-1 bi bi-list fs-3 cursor-pointer" @click="openMovieDrawer" />
            </div>
            <div class="row g-2">
              <div class="col-12 d-flex justify-content-start flex-wrap gap-1 align-items-center">
                <div class="tag-outlined">Σε {{ state.cinemas.length }} σινεμά</div>
                <div class="tag-outlined"> {{ formatDuration(state.duration) }} </div>
                <div class="tag-outlined">{{ state.year }} </div>
                <div class="tag-outlined d-inline-flex align-items-center gap-1" v-if="state.imdbRating"
                  title="Βαθμολογία IMDb">
                  <span class="imdb-badge">IMDb</span>
                  {{ state.imdbRating === "None" ? '?/10' : `${state.imdbRating}/10` }}
                </div>
                <div v-else class="rating-placeholder placeholder-glow"> <span
                    class="placeholder rounded-3 col-12"></span>
                </div>
                <div v-if="state.rated" class="tag-outlined">{{ state.rated }}</div>
              </div>
              <div class="col-12 d-flex justify-content-start flex-wrap gap-1 align-items-center">
                <div v-for="(tag, i) in state.tags" :key="i" class="tag-square">{{ tag }}</div>
              </div>
            </div>
          </div>

        </div>
        <div class="card-body">
          <div class="d-flex gap-3">
            <div>
              <b>Σκηνοθεσία: </b><template v-for="(director, index) in state.directors">
                {{ director }}<span :key="index" v-if="index < state.directors.length - 1">, </span>
              </template>
            </div>
          </div>
          <div class="my-4">
            {{ state.summary }}
          </div>
          <div v-if="state.actors.length" class="mb-2">
            <b>Παίζουν: </b> <template v-for="(actor, index) in state.actors">
              {{ actor }}<span :key="index" v-if="index < state.actors.length - 1">, </span>
            </template>
          </div>
          <div v-if="state.awards" class="mb-2">
            <b>Βραβεία: </b><span> {{ state.awards }}</span>
          </div>
          <!--
          <div v-if="state.note" class="text-truncate mb-2">
            <b>Σημείωση: </b><span> {{ state.note }}</span>
          </div>
          -->
          <div class="d-flex justify-content-between align-items-end gap-2">
            <div>
              <div class="position-relative">
                <i class="height-fit-content bi bi-share fs-3 cursor-pointer" @click="copyUrl" />
                <div v-if="isToastShown" class="share-tooltip bg-dark text-white rounded small">
                  URL copied!
                </div>
              </div>
            </div>
            <div class="d-flex gap-1">
              <a :href="athinoramaUrl" target="_blank" rel="noopener noreferrer">
                <img src="@/assets/images/athinorama.jpg" alt="Athinorama" width="30" height="30"
                  class="cursor-pointer" />
              </a>
              <a v-if="state.imdbLink" :href="state.imdbLink" target="_blank" rel="noopener noreferrer">
                <img src="@/assets/images/imdb.png" alt="IMDb" width="30" height="30" class="cursor-pointer" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="state.trailer" class="col-xl-6">
      <div class="card film-item-no-hover">
        <div class="card-body" style="min-height: 350px">
          <iframe :src="state.trailer" style="width: 100%; height:100%" />
        </div>
      </div>
    </div>
  </div>
  <thursday-notice class="mb-3" />
  <div v-if="activeFilterLabels.length"class="card border-0 fit-content mx-auto mb-3">
    <div class="card-body d-flex flex-wrap align-items-center gap-2">
      <div>
        <template v-if="filteredCinemas.length">
          Εμφανίζονται <b>{{ filteredCinemas.length }}</b> από {{ state.cinemas.length }} σινεμά
        </template>
        <template v-else>Κανένα σινεμά δεν ταιριάζει</template>
        με τα φίλτρα: <b>{{ activeFilterLabels.join(' · ') }}</b>
      </div>
      <div class="d-flex gap-1">
        <button class="btn btn-sm btn-outline-primary" @click="openMovieDrawer">Αλλαγή</button>
        <button class="btn btn-sm btn-outline-primary" @click="clearFilters">Καθαρισμός</button>
      </div>
    </div>
  </div>
  <div class="d-flex flex-column justify-content-center flex-md-row gap-3 flex-md-wrap">
    <card-transition>
      <expanding-circle-background v-for="(cinema, i) in filteredCinemas" :key="i"
        cssClass="card border-0 cinema-item cursor-pointer" @clicked="goToCinemaPage(cinema)">
        <div class="card-header">
          <h2 class="text-secondary">{{ cinema.cinema }}</h2>
          <div class="d-flex justify-content-between flex-wrap ">
            <div>{{ cinema.cinemaLocation }}</div>
            <div v-if="cinema.isOutdoor"><i class="bi bi-brightness-high-fill is-outdoor" /></div>
          </div>
        </div>
        <div class="card-body">
          <template v-if="typeof cinema.cinemaSchedule === 'string' || cinema.cinemaSchedule instanceof String">
            {{ cinema.cinemaSchedule }}
          </template>
          <div v-else>
            <template v-for="[dayName, hours] in Object.entries(cinema.cinemaSchedule)">
              <div v-if="hours.length" class="row my-2" :key="dayName">
                <div class="col-5 text-truncate">
                  {{ mapDayName(dayName) }}
                </div>
                <div class="col-7 d-flex flex-wrap column-gap-2">
                  <span v-for="(hour, i) in hours" :key="i"
                    :class="{ 'fw-bold': isHighlighted(dayName, hour) }">
                    {{ hour }}
                  </span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </expanding-circle-background>
    </card-transition>
  </div>
  <individual-movie-drawer v-model="isMovieDrawerOpen" @filter-changed="filterCinemas" :state="state"
    :initialFilters="initialFilters" />
  <scroll-to-top-button />
</template>

<script setup>
import { ref, defineProps, onBeforeMount, computed, unref, watch, defineAsyncComponent, onUnmounted } from 'vue';
import {
  formatDuration, mapDayName, toPascalCase, formatHour, HOUR_RANGE, isFullHourRange, isShowtimeInRange,
  getFilterDays, cinemaPlaysAt
} from '@/tools/tools';
import { useRouter } from 'vue-router';
import { useMoviesStore } from '@/stores/movies';
import CardTransition from '@/components/CardTransition.vue';

const props = defineProps({
  filmId: {
    type: String,
    default: ''
  }
});

const IndividualMovieDrawer = defineAsyncComponent(() => import('./IndividualMovieDrawer.vue'))
const moviesStore = useMoviesStore();
const router = useRouter();

const state = ref('');
const isMovieDrawerOpen = ref(false);
const filteredCinemas = ref([]);
const isToastShown = ref(false)

const TODAY = 2, TOMORROW = 3, WEEKEND = 4;
const SUMMER_CINEMAS = 2, WINTER_CINEMAS = 3;
const EVERY_DAY = 1;
const noFilters = () => ({ day: EVERY_DAY, cinemaType: 1, locations: [], hours: [...HOUR_RANGE] });
const initialFilters = ref(noFilters());
const activeFilters = ref(noFilters());

const DAY_LABELS = { [TODAY]: 'Σήμερα', [TOMORROW]: 'Αύριο', [WEEKEND]: 'Το ΣΚ' };
const CINEMA_LABELS = { [SUMMER_CINEMAS]: 'Θερινοί', [WINTER_CINEMAS]: 'Χειμερινοί' };

// Greek labels of the filters that are on, for the notice above the cinemas
const activeFilterLabels = computed(() => {
  const { day, cinemaType, locations, hours } = activeFilters.value;
  return [
    DAY_LABELS[day],
    isFullHourRange(hours) ? null : `${formatHour(hours[0])}–${formatHour(hours[1])}`,
    CINEMA_LABELS[cinemaType],
    ...locations.map(toPascalCase),
  ].filter(Boolean);
});

// Showtimes that match the day & hour filters stand out (only when one of them is on)
const isHighlighted = (dayName, hour) => {
  const { day, hours } = activeFilters.value;
  if (day === EVERY_DAY && isFullHourRange(hours)) return false;
  return getFilterDays(day).includes(dayName) && isShowtimeInRange(hour, hours);
};

const clearFilters = () => {
  // New object, so the drawer's watch resets its selection too
  initialFilters.value = noFilters();
  filterCinemas(initialFilters.value);
};

const athinoramaUrl = computed(() => {
  let url = state.value.athinoramaLink || '';
  url = `https://www.athinorama.gr${url}`;
  return url;
})

const filterCinemas = ({ day, cinemaType, locations, hours = HOUR_RANGE }) => {
  activeFilters.value = { day, cinemaType, locations: [...unref(locations)], hours: [...hours] };
  filteredCinemas.value = unref(state).cinemas.filter((cinema) => cinemaPlaysAt(cinema, day, hours));

  if (cinemaType === SUMMER_CINEMAS) filteredCinemas.value = filteredCinemas.value.filter((cinema) => cinema.isOutdoor);
  else if (cinemaType === WINTER_CINEMAS) filteredCinemas.value = filteredCinemas.value.filter((cinema) => !cinema.isOutdoor);
  if (unref(locations).length) filteredCinemas.value = filteredCinemas.value.filter((cinema) => unref(locations).includes(cinema.cinemaLocation));
}

const goToCinemaPage = (cinema) => {
  router.push({ name: 'Cinema', params: { id: cinema.id } });
}

const openMovieDrawer = () => {
  isMovieDrawerOpen.value = true;
}

const loadMovieData = (id) => {
  state.value = moviesStore.getIndividualMovie(id);
  if (!state.value) {
    filteredCinemas.value = [];
    return;
  }

  // Start from the home page filters, keeping only locations this movie plays in.
  const movieLocations = state.value.cinemas.map((cinema) => cinema.cinemaLocation);
  let filters = {
    day: moviesStore.filters.filteredByDay,
    cinemaType: moviesStore.filters.filteredByCinema,
    locations: moviesStore.filters.filteredByLocation.filter((location) => movieLocations.includes(location)),
    hours: [...moviesStore.filters.filteredByHour],
  };
  filterCinemas(filters);
  initialFilters.value = filters;
};

let tooltipTimeout = null;

const copyUrl = async () => {
  await navigator.clipboard.writeText(window.location.href);

  isToastShown.value = true;

  tooltipTimeout = setTimeout(() => {
    isToastShown.value = false;
  }, 2000);
};

watch(() => props.filmId, (newFilmId) => {
  loadMovieData(newFilmId);
});

onBeforeMount(() => {
  loadMovieData(props.filmId);
});

onUnmounted(() => clearTimeout(tooltipTimeout))
</script>
