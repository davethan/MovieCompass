<template>
  <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
    <div class="offcanvas-header">
      <button type="button" class="mx-0 py-0 btn-close" data-bs-dismiss="offcanvas" aria-label="Close"
        @click="handleClose"></button>
      <h5 class="ms-auto offcanvas-title" id="offcanvasExampleLabel">Εργαλεία</h5>
    </div>
    <div class="offcanvas-body">
      <div class="row g-2">
        <div class="col-6">
          <button :class="`btn w-100 ${sortedBy === POPULARITY ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="handleSortChange(POPULARITY)">
            <i class="bi bi-fire me-1"></i>Δημοφιλία
          </button>
        </div>
        <div class="col-6">
          <button v-if="!moviesStore.loadingRating"
            :class="`btn w-100 ${sortedBy === RATING ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="handleSortChange(RATING)"><i class="bi bi-star-half me-1"></i>Βαθμολογία</button>
          <div v-else class="placeholder-glow h-100 w-100">
            <span class="placeholder h-100 rounded-2 col-12"></span>
          </div>
        </div>
        <div class="col-12 mb-2" />
        <div class="col-12">
          <button :class="`btn w-100 ${filteredByDay === EVERY_DAY ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="handleDayChange(EVERY_DAY)">Κάθε μέρα</button>
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
const POPULARITY = 1, RATING = 2;

const sortedBy = ref(POPULARITY);
const filteredByDay = ref(EVERY_DAY);
const filteredByCinema = ref(ALL_CINEMAS);

const handleClose = () => {
  window.scrollTo(0, 0);
};

const handleSortChange = (value) => {
  sortedBy.value = value;
  applyFiltersAndSort();
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

  if (sortedBy.value === POPULARITY) {
    filteredMovies = sortByPopularity(filteredMovies);
  } else if (sortedBy.value === RATING) {
    filteredMovies = sortByRating(filteredMovies);
  }
  state.value = filteredMovies;
};

const sortByPopularity = (filteredMovies) => {
  return filteredMovies.sort((a, b) => {
    if (a.cinemas.length !== b.cinemas.length) {
      return b.cinemas.length - a.cinemas.length;
    }
    if (a.imdbRating && b.imdbRating) {
      return b.imdbRating - a.imdbRating;
    }
    if (!a.imdbRating && b.imdbRating) {
      return 1;
    }
    if (a.imdbRating && !b.imdbRating) {
      return -1;
    }
    return 0;
  });
};

const sortByRating = (filteredMovies) => {
  return filteredMovies.sort((a, b) => {
    if (a.imdbRating && b.imdbRating) {
      if (b.imdbRating !== a.imdbRating) {
        return b.imdbRating - a.imdbRating;
      }
    }
    if (!a.imdbRating && b.imdbRating) {
      return 1;
    }
    if (a.imdbRating && !b.imdbRating) {
      return -1;
    }
    return b.cinemas.length - a.cinemas.length;
  });
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

/*
const filterBySelectedLocations = (locations) => {
  locations = ['Wednesday', 'Monday']
  state.value = state.value.filter((film) => {
    return film.cinemas.some((cinema) => {
      return locations.some((day) => {
        return cinema.cinemaSchedule[day] && cinema.cinemaSchedule[day].length > 0;
      })
    });
  });
};
*/
</script>
