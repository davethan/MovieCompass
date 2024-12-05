<template>
  <drawer id="individualMovieDrawer">
    <template #drawerHeader>
      <h5><b>{{ moviesStore.getSelectedMovie.greekTitle }}</b></h5>
    </template>
    <template #drawerBody>
      <div class="row g-2">
        <div class="col-12">
          <button :class="`btn w-100 ${filteredByDay === EVERY_DAY ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="filteredByDay = EVERY_DAY"><i class="bi bi-calendar-week-fill me-1" />Κάθε μέρα</button>
        </div>
        <div class="col-4">
          <button :class="`btn w-100 ${filteredByDay === TODAY ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="filteredByDay = TODAY">Σήμερα</button>
        </div>
        <div class="col-4">
          <button :class="`btn w-100 ${filteredByDay === TOMORROW ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="filteredByDay = TOMORROW">Αύριο</button>
        </div>
        <div class="col-4">
          <button :class="`btn w-100 ${filteredByDay === WEEKEND ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="filteredByDay = WEEKEND">Το ΣΚ</button>
        </div>
        <div class="col-12 mb-2" />
        <div class="col-12">
          <button :class="`btn w-100 ${filteredByCinema === ALL_CINEMAS ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="filteredByCinema = ALL_CINEMAS"><i class="bi bi-camera-reels-fill me-1" />Όλοι</button>
        </div>
        <div class="col-6">
          <button :class="`btn w-100 ${filteredByCinema === SUMMER_CINEMAS ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="filteredByCinema = SUMMER_CINEMAS"><i class="bi bi-brightness-high-fill me-1" />Θερινοί</button>
        </div>
        <div class="col-6">
          <button :class="`btn w-100 ${filteredByCinema === WINTER_CINEMAS ? 'btn-primary' : 'btn-outline-primary'}`"
            @click="filteredByCinema = WINTER_CINEMAS"><i class="bi bi-cloud-fill me-1" />Χειμερινοί</button>
        </div>
        <div class="col-12 mb-2" />
        <div class="col-12">
          <button :class="`btn w-100 h-100 ${filteredByLocation === 'ALL' ? ' btn-primary' : 'btn-outline-primary'}`"
            @click="filteredByLocation = 'ALL'">
            <i class="bi bi-geo-alt-fill me-1" />Όλες
          </button>
        </div>
        <div class="col-6" v-for="(uniqueLocation, i) in uniqueCinemaLocations" :key="i">
          <button
            :class="`btn w-100 h-100 ${filteredByLocation === uniqueLocation ? ' btn-primary' : 'btn-outline-primary'}`"
            @click="filteredByLocation = uniqueLocation">
            {{ toPascalCase(uniqueLocation) }}
          </button>
        </div>
      </div>
    </template>
  </drawer>
</template>

<script setup>
import { ref, unref, computed, watchEffect } from 'vue';
import Drawer from '@/shared/Drawer.vue';
import { useMoviesStore } from '@/stores/movies';
import { toPascalCase } from '@/tools/tools';

const moviesStore = useMoviesStore();

const props = defineProps({
  state: {
    type: Object,
    default: (() => { })
  }
});

const emit = defineEmits(['filter-changed']);

const EVERY_DAY = 1, TODAY = 2, TOMORROW = 3, WEEKEND = 4;
const ALL_CINEMAS = 1, SUMMER_CINEMAS = 2, WINTER_CINEMAS = 3;

const filteredByDay = ref(moviesStore.filters.filteredByDay);
const filteredByCinema = ref(moviesStore.filters.filteredByCinema);
const filteredByLocation = ref(moviesStore.filters.filteredByLocation);

const uniqueCinemaLocations = computed(() => {
  const cinemaLocations = unref(props).state.cinemas.map((cinema) => cinema.cinemaLocation);
  return [...new Set(cinemaLocations)];
});

watchEffect(() => {
  emit('filter-changed', { day: filteredByDay.value, cinemaType: filteredByCinema.value, location: filteredByLocation.value });
})
</script>
