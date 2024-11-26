<template>
  <div>
    <div class="card border-0 mb-1">
      <div class="card-header">
        <h2 class="text-primary">{{ state.greekTitle }}</h2>
        <div class="d-flex justify-content-between flex-wrap column-gap-3">
          <div>{{ state.originalTitle }} </div>
          <div class="d-flex justify-content-end gap-3 align-items-center">
            <div>Σε {{ state.cinemas.length }} σινεμά</div>
            <div> {{ formatDuration(state.duration) }} </div>
            <div>{{ state.year }} </div>
            <div v-if="state.imdbRating">
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
            Σκηνοθεσία: <template v-for="(director, index) in state.directors">
              {{ director }}<span :key="index" v-if="index < state.directors.length - 1">, </span>
            </template>
          </div>
        </div>
        <div class="my-4">
          {{ state.summary }}
        </div>
        <div class="d-flex gap-3">
          <div v-if="state.actors.length">
            Παίζουν: <template v-for="(actor, index) in state.actors">
              {{ actor }}<span :key="index" v-if="index < state.actors.length - 1">, </span>
            </template>
          </div>
        </div>
        <!-- <div class="">
          <svg width="10" height="10">
            <use xlink:href="../../public/imdbIcon.svg" />
          </svg>
        </div> -->
      </div>
    </div>
    <div class="mt-3 mb-3 text-center">
      <div class="d-flex justify-content-center flex-wrap gap-2">
        <div>
          <button :class="`btn ${filteredByLocation === 'ΟΛΑ' ? ' btn-secondary' : 'btn-outline-secondary'}`"
            @click="filteredByLocation = 'ΟΛΑ'">
            ΟΛΑ
          </button>
        </div>
        <div v-for="(uniqueLocation, i) in uniqueCinemaLocations" :key="i">
          <button
            :class="`btn flex-item110 ${filteredByLocation === uniqueLocation ? ' btn-secondary' : 'btn-outline-secondary'}`"
            @click="filteredByLocation = uniqueLocation">
            {{ uniqueLocation }}
          </button>
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
  </div>
</template>

<script setup>
import { ref, defineProps, onBeforeMount, computed } from 'vue';
import { formatDuration } from '@/tools/tools';
import { useMoviesStore } from '@/stores/movies';

const props = defineProps({
  filmId: {
    type: String,
    default: ''
  }
});

const movieStore = useMoviesStore();
const state = ref('');
const filteredByLocation = ref('ΟΛΑ');

const uniqueCinemaLocations = computed(() => {
  const cinemaLocations = state.value.cinemas.map((cinema) => cinema.cinemaLocation);
  return [...new Set(cinemaLocations)];
});

const filteredCinemas = computed(() => {
  if (filteredByLocation.value === 'ΟΛΑ') return state.value.cinemas;
  else return state.value.cinemas.filter(cinema => cinema.cinemaLocation === filteredByLocation.value);
})

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
  state.value = movieStore.getIndividualMovie(props.filmId);
});
</script>
