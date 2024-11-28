<template>
  <div class="offcanvas offcanvas-start" tabindex="-1" id="individualMovieDrawer"
    aria-labelledby="offcanvasExampleLabel">
    <div class="offcanvas-header">
      <button type="button" class="mx-0 py-0 btn-close" data-bs-dismiss="offcanvas" aria-label="Close"
        @click="handleClose"></button>
      <h5 class="ms-auto offcanvas-title" id="offcanvasExampleLabel"><b>{{ moviesStore.getSelectedMovie.greekTitle
          }}</b>
      </h5>
    </div>
    <div class="offcanvas-body">
      <div class="row g-2">
        <div class="col-12">
          <button :class="`btn w-100 ${filteredByDay === EVERY_DAY ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="handleDayChange(EVERY_DAY)"><i class="bi bi-calendar-week-fill me-1" />Κάθε μέρα</button>
        </div>
        <div class="col-4">
          <button :class="`btn w-100 ${filteredByDay === TODAY ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="handleDayChange(TODAY)">Σήμερα</button>
        </div>
        <div class="col-4">
          <button :class="`btn w-100 ${filteredByDay === TOMORROW ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="handleDayChange(TOMORROW)">Αύριο</button>
        </div>
        <div class="col-4">
          <button :class="`btn w-100 ${filteredByDay === WEEKEND ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="handleDayChange(WEEKEND)">Το ΣΚ</button>
        </div>
        <div class="col-12 mb-2" />
        <div class="col-12">
          <button :class="`btn w-100 ${filteredByCinema === ALL_CINEMAS ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="handleCinemaChange(ALL_CINEMAS)"><i class="bi bi-camera-reels-fill me-1" />Όλοι</button>
        </div>
        <div class="col-6">
          <button :class="`btn w-100 ${filteredByCinema === SUMMER_CINEMAS ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="handleCinemaChange(SUMMER_CINEMAS)"><i class="bi bi-brightness-high-fill me-1" />Θερινοί</button>
        </div>
        <div class="col-6">
          <button :class="`btn w-100 ${filteredByCinema === WINTER_CINEMAS ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="handleCinemaChange(WINTER_CINEMAS)"><i class="bi bi-cloud-fill me-1" />Χειμερινοί</button>
        </div>
        <div class="col-12 mb-2" />
        <div class="col-12">
          <button class="btn w-100 btn-outline-primary">Περιοχές</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, unref } from 'vue';
import { useMoviesStore } from '@/stores/movies';

const moviesStore = useMoviesStore();
const state = inject("state");

const EVERY_DAY = 1, TODAY = 2, TOMORROW = 3, WEEKEND = 4;
const ALL_CINEMAS = 1, SUMMER_CINEMAS = 2, WINTER_CINEMAS = 3;

const filteredByDay = ref(EVERY_DAY);
const filteredByCinema = ref(ALL_CINEMAS);

const handleClose = () => {
  window.scrollTo(0, 0);
};

const handleDayChange = (value) => {
  filteredByDay.value = value;
  applyFiltersAndSort();
};
const handleCinemaChange = (value) => {
  filteredByCinema.value = value;
  applyFiltersAndSort();
};

const applyFiltersAndSort = () => {
  let filteredMovies = [...unref(moviesStore).MOVIES];

  if (filteredByDay.value === TODAY) {
    const date = new Date();
    const today = date.toLocaleDateString('en-US', { weekday: 'long' });
    filteredMovies = filterByDays(filteredMovies, [today]);
  } else if (filteredByDay.value === TOMORROW) {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const tomorrow = date.toLocaleDateString('en-US', { weekday: 'long' });
    filteredMovies = filterByDays(filteredMovies, [tomorrow]);
  } else if (filteredByDay.value === WEEKEND) {
    filteredMovies = filterByDays(filteredMovies, ['Saturday', 'Sunday']);
  }

  if (filteredByCinema.value === SUMMER_CINEMAS) {
    filteredMovies = filterByCinemas(filteredMovies, true);
  } else if (filteredByCinema.value === WINTER_CINEMAS) {
    filteredMovies = filterByCinemas(filteredMovies, false);
  }

  state.value = filteredMovies;
};

const filterByDays = (filteredMovies, days) => {
  return filteredMovies.filter((film) => {
    return film.cinemas.some((cinema) => {
      return days.some((day) => {
        return cinema.cinemaSchedule[day] && cinema.cinemaSchedule[day].length > 0;
      })
    });
  });
};

const filterByCinemas = (filteredMovies, isOutdoor) => {
  return filteredMovies.filter((film) => film.cinemas.some((cinema) => cinema.isOutdoor === isOutdoor));
};
</script>
