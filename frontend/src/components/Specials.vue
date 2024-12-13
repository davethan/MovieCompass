<template>
  <div class="row g-3">
    <div class="col-lg-12">
      <div class="card film-item">
        <div class="card-body">
          <h4 class="text-center text-secondary m-0"> Οι ειδικές προβολές της εβδομάδας </h4>
        </div>
      </div>
    </div>
    <div class="col-lg-3" v-for="(event, i) in moviesStore.SPECIALS" :key="i">
      <div class="card film-item">
        <div class="card-body">
          <div class="text-primary"> {{ event.title }} </div>
          <div> {{ event.cinema }} </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMoviesStore } from '@/stores/movies';
const moviesStore = useMoviesStore();
</script>
