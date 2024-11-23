<template>
  <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
    <div class="offcanvas-header">
      <button type="button" class="mx-0 py-0 btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      <h5 class="ms-auto offcanvas-title" id="offcanvasExampleLabel">Εργαλεία</h5>
    </div>
    <div class="offcanvas-body">
      <div class="row g-2">
        <div class="col-6">
          <button :class="`btn w-100 ${sortedBy === POPULARITY ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="sortByPopularity()">
            <i class="bi bi-fire me-1"></i>Δημοφιλία
          </button>
        </div>
        <div class="col-6">
          <button v-if="!moviesStore.loadingRating"
            :class="`btn w-100 ${sortedBy === RATING ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="sortByRating()"><i class="bi bi-star-half me-1"></i>Βαθμολογία</button>
          <div v-else class="placeholder-glow h-100 w-100">
            <span class="placeholder h-100 rounded-2 col-12"></span>
          </div>
        </div>
        <div class="col-4">
          <button :class="`btn w-100 ${filteredByDay === EVERY_DAY ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="resetDayFilter()">Κάθε μέρα</button>
        </div>
        <div class="col-4">
          <button :class="`btn w-100 ${filteredByDay === TODAY ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="filterByToday()">Σήμερα</button>
        </div>
        <div class="col-4">
          <button :class="`btn w-100 ${filteredByDay === WEEKEND ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="filterByWeekend()">Το ΣΚ</button>
        </div>
        <div class="col-4">
          <button :class="`btn w-100 ${filteredByCinema === ALL_CINEMAS ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="resetCinemaFilter()">Όλοι</button>
        </div>
        <div class="col-4">
          <button :class="`btn w-100 ${filteredByCinema === SUMMER_CINEMAS ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="filterBySummerCinemas()">Θερινοί</button>
        </div>
        <div class="col-4">
          <button :class="`btn w-100 ${filteredByCinema === WINTER_CINEMAS ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="filterByWinterCinemas()">Χειμερινοί</button>
        </div>
        <div class="col-12">
          <button class="btn w-100 btn-outline-primary">Περιοχές</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useMoviesStore } from '@/stores/movies';

const moviesStore = useMoviesStore();
const state = inject("state");

const EVERY_DAY = 1, TODAY = 2, WEEKEND = 3;
const ALL_CINEMAS = 1, SUMMER_CINEMAS = 2, WINTER_CINEMAS = 3;
const POPULARITY = 1, RATING = 2;

const sortedBy = ref(POPULARITY);
const filteredByDay = ref(EVERY_DAY);
const filteredByCinema = ref(ALL_CINEMAS);

const sortByPopularity = () => {
  sortedBy.value = POPULARITY;
  state.value = state.value.sort((a, b) => {
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

const sortByRating = () => {
  sortedBy.value = RATING;
  state.value = state.value.sort((a, b) => {
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

const filterByToday = () => {
  filteredByDay.value = TODAY;
  const date = new Date();
  const today = date.toLocaleDateString('en-US', { weekday: 'long' });
  state.value = state.value.filter((film) => {
    return film.cinemas.some((cinema) => {
      return cinema.cinemaSchedule[today] && cinema.cinemaSchedule[today].length > 0;
    });
  });
};

const resetDayFilter = () => {
  filteredByDay.value = EVERY_DAY;
  state.value = moviesStore.MOVIES;
};
const filterByWeekend = (days) => {
  filteredByDay.value = WEEKEND;
  days = ['Saturday', 'Sunday'];
  state.value = state.value.filter((film) => {
    return film.cinemas.some((cinema) => {
      return days.some((day) => {
        return cinema.cinemaSchedule[day] && cinema.cinemaSchedule[day].length > 0;
      })
    });
  });
};

const resetCinemaFilter = () => {
  filteredByCinema.value = 1;
};
const filterBySummerCinemas = () => {
  filteredByCinema.value = 2;
};
const filterByWinterCinemas = () => {
  filteredByCinema.value = 3;
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
