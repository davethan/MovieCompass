<template>
  <div>
    <div class="card border-0 mb-3 col-lg-6 mx-auto">
      <div class="card-header">
        <div class="d-flex justify-content-between gap-2">
          <h2 class="text-primary">{{ state.greekTitle }}</h2>
          <i class="bi bi-list fs-3 cursor-pointer" data-bs-toggle="offcanvas"
            data-bs-target="#individualMovieDrawer" />
        </div>
        <div class="d-flex justify-content-between flex-wrap column-gap-3 row-gap-1">
          <div>{{ state.originalTitle }} </div>
          <div class="d-flex justify-content-end flex-wrap gap-1 align-items-center">
            <div class="tag-outlined">Σε {{ state.cinemas.length }} σινεμά</div>
            <div class="tag-outlined"> {{ formatDuration(state.duration) }} </div>
            <div class="tag-outlined">{{ state.year }} </div>
            <div class="tag-outlined" v-if="state.imdbRating">
              {{ state.imdbRating === "None" ? 'Η βαθμολογία δεν βρέθηκε' : `${state.imdbRating}/10` }}
            </div>
            <div v-else class="rating-placeholder placeholder-glow"> <span class="placeholder rounded-3 col-12"></span>
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
        <div class="d-flex gap-3">
          <div v-if="state.actors.length">
            <b>Παίζουν: </b> <template v-for="(actor, index) in state.actors">
              {{ actor }}<span :key="index" v-if="index < state.actors.length - 1">, </span>
            </template>
          </div>
        </div>
        <div class="d-flex justify-content-end align-items-end gap-2">
          <a :href="athinoramaUrl" target="_blank" rel="noopener noreferrer">
            <img src="@/assets/images/athinorama.jpg" alt="Athinorama" width="30" height="30" class="cursor-pointer" />
          </a>
          <a :href="state.imdbLink" target="_blank" rel="noopener noreferrer">
            <svg class="cursor-pointer" width="40" height="40">
              <use xlink:href="@/assets/images/imdbIcon.svg#imdbIcon" />
            </svg>
          </a>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column justify-content-center flex-md-row gap-3 flex-wrap">
      <div v-for="(cinema, i) in filteredCinemas" :key="i" class="card border-0 cinema-item">
        <div class="card-header">
          <h2>{{ cinema.cinema }}</h2>
          <div class="d-flex justify-content-between flex-wrap ">
            <div>{{ cinema.cinemaLocation }}</div>
            <div v-if="cinema.isOutdoor"><i class="bi bi-brightness-high-fill is-outdoor" /></div>
          </div>
        </div>
        <div class="card-body">
          <template v-if="cinema.cinemaSchedule && Object.entries(cinema.cinemaSchedule).length">
            <template v-for="[dayName, hours] in Object.entries(cinema.cinemaSchedule)">
              <div v-if="hours.length" class="row my-2" :key="dayName">
                <div class="col-5 text-truncate">
                  {{ mapDayName(dayName) }}
                </div>
                <div class="col-7">
                  {{ `${hours.join(' ') || ''}` }}
                </div>
              </div>
            </template>
          </template>
          <div v-else>
            Δεν βρέθηκε το πρόγραμμα.
          </div>
        </div>
      </div>
    </div>
    <IndividualMovieDrawer @filter-changed="filterCinemas" :state="state" />
  </div>
</template>

<script setup>
import { ref, defineProps, onBeforeMount, computed, unref } from 'vue';
import { formatDuration } from '@/tools/tools';
import IndividualMovieDrawer from './IndividualMovieDrawer.vue';
import { useMoviesStore } from '@/stores/movies';

const props = defineProps({
  filmId: {
    type: String,
    default: ''
  }
});

const moviesStore = useMoviesStore();
const state = ref('');
const filteredCinemas = ref(state.value.cinemas);

const TODAY = 2, TOMORROW = 3, WEEKEND = 4;
const SUMMER_CINEMAS = 2, WINTER_CINEMAS = 3;

const athinoramaUrl = computed(() => {
  let url = moviesStore.ATHINORAMA_URLS.find((url) => url.id === state.value.id).url;
  url = `https://www.athinorama.gr${url}`;
  return url;
})

const filterCinemas = ({ day, cinemaType, location }) => {
  filteredCinemas.value = [...unref(state).cinemas];

  if (day === TODAY) {
    const date = new Date();
    const today = date.toLocaleDateString('en-US', { weekday: 'long' });
    filteredCinemas.value = filteredCinemas.value.filter((cinema) => {
      return cinema.cinemaSchedule[today] && cinema.cinemaSchedule[today].length > 0;
    })
  } else if (day === TOMORROW) {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const tomorrow = date.toLocaleDateString('en-US', { weekday: 'long' });
    filteredCinemas.value = filteredCinemas.value.filter((cinema) => {
      return cinema.cinemaSchedule[tomorrow] && cinema.cinemaSchedule[tomorrow].length > 0;
    })
  } else if (day === WEEKEND) {
    filteredCinemas.value = filteredCinemas.value.filter((cinema) => {
      return ((cinema.cinemaSchedule.Saturday && cinema.cinemaSchedule.Saturday.length > 0) ||
        (cinema.cinemaSchedule.Sunday && cinema.cinemaSchedule.Sunday.length > 0));
    })
  }

  if (cinemaType === SUMMER_CINEMAS) filteredCinemas.value = filteredCinemas.value.filter((cinema) => cinema.isOutdoor);
  else if (cinemaType === WINTER_CINEMAS) filteredCinemas.value = filteredCinemas.value.filter((cinema) => !cinema.isOutdoor);

  if (location !== 'ALL') filteredCinemas.value = filteredCinemas.value.filter((cinema) => cinema.cinemaLocation === location);
}

const dayNameMapping = {
  Monday: 'Δευτέρα',
  Tuesday: 'Τρίτη',
  Wednesday: 'Τετάρτη',
  Thursday: 'Πέμπτη',
  Friday: 'Παρασκευή',
  Saturday: 'Σάββατο',
  Sunday: 'Κυριακή'
};

const mapDayName = (dayName) => {
  return dayNameMapping[dayName] || dayName;
};

onBeforeMount(() => {
  state.value = moviesStore.getIndividualMovie(props.filmId);
  filteredCinemas.value = [...unref(state).cinemas];
});
</script>
