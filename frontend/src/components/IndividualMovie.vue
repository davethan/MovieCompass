<template>
  <div>
    <div class="card border-0 mb-1">
      <div class="card-header border-0">
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
      </div>
    </div>
    <div class="card border-0">
      <div class="card-header border-0">
        Πρόγραμμα
      </div>
      <div class="card-body">
        <div class="mb-3" v-for="(cinema, i) in state.cinemas" :key="i">
          <div>{{ cinema.cinema }}</div>
          <div>{{ cinema.cinemaLocation }}</div>
          <div>{{ cinema.isOutdoor }}</div>
          <div v-for="[dayName, hours] in Object.entries(cinema.cinemaSchedule)" :key="dayName">
            <div>{{ `${dayName}: ${hours.join(', ') || ''}` }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onBeforeMount } from 'vue';
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

onBeforeMount(() => {
  state.value = movieStore.getIndividualMovie(props.filmId)
});
</script>

