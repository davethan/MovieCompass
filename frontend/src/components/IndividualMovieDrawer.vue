<template>
  <drawer id="individualMovieDrawer" :modelValue="modelValue" @update:modelValue="closeDrawer">
    <template #drawerHeader>
      <h5 class="m-0 text-secondary"><b>{{ moviesStore.getSelectedMovie.greekTitle }}</b></h5>
    </template>
    <template #drawerBody>
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
          <button :class="`btn w-100 h-100 ${!filteredByLocations.length ? ' btn-primary' : 'btn-outline-primary'}`"
            @click="handleLocationChange(false)">
            <i class="bi bi-geo-alt-fill me-1" />Όλες
          </button>
        </div>
        <div class="col-12 primary-text-hover" v-for="(uniqueLocation, i) in uniqueCinemaLocations" :key="i">
          <div class="form-check">
            <input type="checkbox" class="form-check-input" :id="'location-checkbox-' + i"
              :checked="filteredByLocations.includes(uniqueLocation)" @change="handleLocationChange(uniqueLocation)">
            <label class="form-check-label w-100 cursor-pointer" :for="'location-checkbox-' + i">
              {{ toPascalCase(uniqueLocation) }}
            </label>
          </div>
        </div>
      </div>
    </template>
  </drawer>
</template>

<script setup>
import { ref, unref, computed } from 'vue';
import { useMoviesStore } from '@/stores/movies';
import { toPascalCase } from '@/tools/tools';

const moviesStore = useMoviesStore();

const props = defineProps({
  state: {
    type: Object,
    default: (() => { })
  },
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['filter-changed', 'update:modelValue']);

const EVERY_DAY = 1, TODAY = 2, TOMORROW = 3, WEEKEND = 4;
const ALL_CINEMAS = 1, SUMMER_CINEMAS = 2, WINTER_CINEMAS = 3;

const filteredByDay = ref(EVERY_DAY);
const filteredByCinema = ref(ALL_CINEMAS);
const filteredByLocations = ref([]);

const handleDayChange = (value) => {
  filteredByDay.value = value;
  emit('filter-changed', { day: filteredByDay.value, cinemaType: filteredByCinema.value, locations: filteredByLocations.value });
};
const handleCinemaChange = (value) => {
  filteredByCinema.value = value;
  emit('filter-changed', { day: filteredByDay.value, cinemaType: filteredByCinema.value, locations: filteredByLocations.value });
};
const handleLocationChange = (value) => {
  if (value) filteredByLocations.value.includes(value) ? filteredByLocations.value = filteredByLocations.value.filter(item => item !== value) : filteredByLocations.value.push(value);
  else filteredByLocations.value = []
  emit('filter-changed', { day: filteredByDay.value, cinemaType: filteredByCinema.value, locations: filteredByLocations.value });
};

const uniqueCinemaLocations = computed(() => {
  const cinemaLocations = unref(props).state.cinemas.map((cinema) => cinema.cinemaLocation);
  return [...new Set(cinemaLocations)];
});

const closeDrawer = () => {
  emit('update:modelValue', false);
};
</script>
