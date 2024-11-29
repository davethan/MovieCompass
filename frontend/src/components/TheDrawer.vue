<template>
  <div class="offcanvas offcanvas-start" tabindex="-1" id="homeViewDrawer" aria-labelledby="offcanvasExampleLabel">
    <div class="offcanvas-header">
      <button type="button" class="mx-0 py-0 btn-close" data-bs-dismiss="offcanvas" aria-label="Close"
        @click="handleClose"></button>
      <div class="ms-auto offcanvas-title" id="offcanvasExampleLabel">
        <b>{{ noOfFilteredFilms }}/{{ moviesStore.MOVIES.length }}</b>
      </div>
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMoviesStore } from '@/stores/movies';

const moviesStore = useMoviesStore();

defineProps({
  noOfFilteredFilms: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['filter-changed']);

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
  emit('filter-changed', { day: filteredByDay.value, cinemaType: filteredByCinema.value, sort: sortedBy.value });
};
const handleDayChange = (value) => {
  filteredByDay.value = value;
  emit('filter-changed', { day: filteredByDay.value, cinemaType: filteredByCinema.value, sort: sortedBy.value });

};
const handleCinemaChange = (value) => {
  filteredByCinema.value = value;
  emit('filter-changed', { day: filteredByDay.value, cinemaType: filteredByCinema.value, sort: sortedBy.value });
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
