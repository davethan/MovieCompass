<template>
  <div class="row g-3">
    <div class="col-lg-12">
      <div class="card film-item-no-hover">
        <div class="card-body">
          <h4 v-if="upcomingStore.loadingUpcoming"
            class="d-flex column-gap-2 justify-content-center flex-wrap text-center text-secondary m-0">
            <div> Προσεχώς </div>
            <div class="upcoming-no-placeholder placeholder-glow">
              <span class="placeholder rounded-3 col-12"></span>
            </div>
            <div> ταινίες στις αίθουσες! </div>
          </h4>
          <h4 v-else class="text-center text-secondary m-0"> Προσεχώς {{ upcomingStore.UPCOMING.length }} ταινίες στις
            αίθουσες!</h4>
        </div>
      </div>
    </div>

    <template v-if="upcomingStore.loadingUpcoming && !upcomingStore.UPCOMING.length">
      <div class="col-sm-6 col-md-6 col-lg-3 placeholder-upcomingMovie" v-for="i in 4" :key="i">
        <div class="placeholder-glow h-100 w-100">
          <span class="placeholder h-100 rounded-2 col-12"></span>
        </div>
      </div>
    </template>

    <template v-if="upcomingStore.UPCOMING.length">
      <div class="col-sm-6 col-md-6 col-lg-3" v-for="(upcomingMovie, i) in sortedUpcomingMovies" :key="i">
        <template v-if="upcomingMovie.isBrief">
          <div class="card film-item-no-hover">
            <div class="card-header">
              <div class="d-flex justify-content-between gap-2">
                <h2 class="text-primary m-0">{{ upcomingMovie.greekTitle }}</h2>
              </div>
              <div class="row g-2">
                <div class="col-12">{{ upcomingMovie.originalTitle }} </div>
              </div>
            </div>
            <div class="card-body">
              <div>
                <b>Σκηνοθεσία: </b> {{ upcomingMovie.directors }}
              </div>
            </div>
            <div class="card-footer">
              Έρχεται στις {{ upcomingMovie.premiere }}
            </div>
          </div>
        </template>
        <template v-else>
          <div class="card film-item-no-hover">
            <div class="card-header">
              <div class="d-flex justify-content-between gap-2">
                <h2 class="text-primary m-0">{{ upcomingMovie.greekTitle }}</h2>
              </div>
              <div class="row g-2">
                <div class="col-12">{{ upcomingMovie.originalTitle }} </div>
                <div class="col-12 d-flex justify-content-start flex-wrap gap-1 align-items-center">
                  <div class="tag-outlined"> {{ formatDuration(upcomingMovie.duration) }} </div>
                  <div class="tag-outlined">{{ upcomingMovie.year }} </div>
                </div>
                <div class="col-12 d-flex justify-content-start flex-wrap gap-1 align-items-center">
                  <div v-for="(tag, i) in upcomingMovie.tags" :key="i" class="tag-square">{{ tag }}</div>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div>
                <b>Σκηνοθεσία: </b> {{ upcomingMovie.directors }}
              </div>
              <div class="mt-4">
                {{ upcomingMovie.summary }}
              </div>
            </div>
            <div class="card-footer">
              {{ upcomingMovie.premiere ? `Έρχεται στις ${upcomingMovie.premiere}` :
                'Η πρεμιέρα δεν έχει ανακοινωθεί ακόμα.' }}
            </div>
          </div>
        </template>
      </div>
      <div v-if="upcomingStore.loadingUpcoming" class="col-sm-6 col-md-6 col-lg-3 placeholder-upcomingMovie">
        <div class="placeholder-glow h-100 w-100">
          <span class="placeholder h-100 rounded-2 col-12"></span>
        </div>
      </div>
    </template>

    <template v-if="!upcomingStore.loadingUpcoming && !upcomingStore.UPCOMING.length">
      <div class="col-sm-6 col-md-6 col-lg-3">
        <div class="card film-item-no-hover">
          <div class="card-header">
            <h2 class="text-primary m-0">Δεν βρέθηκαν ταινίες</h2>
          </div>
          <div class="card-body">
            Δοκιμάστε να ξαναφορτώσετε τη σελίδα!
          </div>
        </div>
      </div>
    </template>
  </div>
  <scroll-to-top-button />
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useUpcomingStore } from '@/stores/upcoming';
import { formatDuration, sortByDate } from '@/tools/tools';
import { cloneDeep } from 'lodash'

const upcomingStore = useUpcomingStore();

const sortedUpcomingMovies = computed(() => {
  const upcomingMovies = cloneDeep(upcomingStore.UPCOMING);
  if (!upcomingMovies.length) return [];
  else return upcomingMovies.sort((movie1, movie2) => sortByDate(movie1.premiere, movie2.premiere));
});

onMounted(() => {
  if (!upcomingStore.UPCOMING.length) upcomingStore.getAllUpcomingFilmDetailsAction();
})
</script>
