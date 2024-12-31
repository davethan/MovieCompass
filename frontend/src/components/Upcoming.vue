<template>
  <div class="row g-3">
    <div class="col-lg-12">
      <div class="card film-item">
        <div class="card-body">
          <h4 class="text-center text-secondary m-0"> Οι ταινίες που έρχονται στα σινεμά </h4>
        </div>
      </div>
    </div>
    <template v-if="!upcomingStore.loadingUpcoming">
      <template v-if="upcomingStore.UPCOMING.length">
        <div class="col-lg-3" v-for="(upcomingMovie, i) in upcomingStore.UPCOMING" :key="i">
          <div class="card film-item">
            <div class="card-header">
              <h2 class="text-primary m-0">{{ upcomingMovie.greekTitle }}</h2>
              <div class="mb-1">{{ upcomingMovie.originalTitle }} </div>
              <div v-if="upcomingMovie.duration" class="tag-outlined fit-content"> {{
                formatDuration(upcomingMovie.duration) }} </div>
            </div>
            <div class="card-body">
              <div>
                <b>Σκηνοθεσία: </b> {{ upcomingMovie.directors }}
              </div>
              <div class="mt-4">
                {{ upcomingMovie.summary }}
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="col-lg-3">
          <div class="card film-item">
            <div class="card-header">
              <h2 class="text-primary m-0">Δεν βρέθηκαν ταινίες</h2>
            </div>
            <div class="card-body">
              Δοκιμάστε να ξαναφορτώσετε τη σελίδα!
            </div>
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <div class="col-lg-3 placeholder-upcomingMovie" v-for="i in 4" :key="i">
        <div class="placeholder-glow h-100 w-100">
          <span class="placeholder h-100 rounded-2 col-12"></span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUpcomingStore } from '@/stores/upcoming';
import { formatDuration } from '@/tools/tools';

const upcomingStore = useUpcomingStore();

onMounted(async () => {
  await upcomingStore.getAllUpcomingFilmDetailsAction();
})
</script>
