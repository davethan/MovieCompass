<template>
  <div class="card border-0 mb-3 cinema-details">
    <div class="card-body">
      <div class="d-flex justify-content-between">
        <h2 class="text-primary m-0">{{ moviesStore.selectedCinema }}</h2>
        <div v-if="isCinemaOutdoor"><i class="bi bi-brightness-high-fill ms-3 is-outdoor" /></div>
      </div>
      <div class="row g-2">
        <div class="col-12">{{ cinemaLocation }} </div>
        <div class="col-12 d-flex justify-content-start flex-wrap gap-1 align-items-center">
          <div class="tag-outlined">
            {{ filmsThisCinemaShows.length }}
            {{ filmsThisCinemaShows.length > 1 ? 'ταινίες' : 'ταινία' }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="d-flex flex-column justify-content-center flex-md-row gap-3 flex-wrap">
    <div v-for="film in filmsThisCinemaShows" :key="film.id" class="card border-0 cinema-item cursor-pointer"
      @click="goToMoviePage(film.id)">
      <div class="card-header">
        <h2 class="text-primary m-0">{{ film.greekTitle }}</h2>
        <div>{{ film.originalTitle }}</div>
      </div>
      <div class="card-body">
        <template v-if="typeof filmSchedule(film) === 'string' || filmSchedule(film) instanceof String">
          {{ filmSchedule(film) }}
        </template>
        <div v-else>
          <template v-for="[dayName, hours] in Object.entries(filmSchedule(film))">
            <div v-if="hours.length" class="row my-2" :key="dayName">
              <div class="col-5 text-truncate">
                {{ mapDayName(dayName) }}
              </div>
              <div class="col-7 d-flex flex-wrap column-gap-2">
                <span v-for="(hour, i) in hours" :key="i">
                  {{ hour }}
                </span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useMoviesStore } from '@/stores/movies';
import { computed } from 'vue';

const router = useRouter();
const moviesStore = useMoviesStore();

const filmsThisCinemaShows = computed(() => {
  const films = [];
  moviesStore.MOVIES.forEach((film) => {
    const includesFilm = film.cinemas.some((cinema) => cinema.cinema === moviesStore.selectedCinema);
    if (includesFilm) films.push(film);
  })
  return films;
})
const cinemaLocation = computed(() => {
  const location = filmsThisCinemaShows.value[0].cinemas.find((cinema) => cinema.cinema === moviesStore.selectedCinema).cinemaLocation;
  return location ? location : '';
})
const isCinemaOutdoor = computed(() => filmsThisCinemaShows.value[0].cinemas.find((cinema) => cinema.cinema === moviesStore.selectedCinema).isOutdoor)

const filmSchedule = (film) => {
  return film.cinemas.find((cinema) => cinema.cinema === moviesStore.selectedCinema).cinemaSchedule
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

const goToMoviePage = (id) => {
  moviesStore.setSelectedMovieAction(id);
  router.push({ name: 'IndividualMovie', params: { filmId: id } });
};
</script>
