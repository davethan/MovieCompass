<template>
  <div v-if="loading"class="d-flex justify-content-center my-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div v-else-if="!cinema" class="card border-0 mb-3 cinema-details">
    <div class="card-body text-center">
      <p>Το σινεμά δεν βρέθηκε ή δεν προβάλλει ταινίες αυτή την εβδομάδα.</p>
      <button class="btn btn-primary" @click="router.push({ name: 'Home' })">Αρχική</button>
    </div>
  </div>
  <template v-else>
    <div class="card border-0 mb-3 cinema-details">
      <div class="card-body">
        <div class="d-flex justify-content-between">
          <h2 class="text-secondary m-0">{{ cinema.name }}</h2>
          <div v-if="cinema.isOutdoor"><i class="bi bi-brightness-high-fill ms-3 is-outdoor" /></div>
        </div>
        <div class="row g-2">
          <div class="col-12">{{ cinema.location }}</div>
          <div v-if="cinema.address" class="col-12">
            <a :href="mapsLink" target="_blank" rel="noopener noreferrer" class="text-reset">
              <i class="bi bi-geo-alt me-1" />{{ cinema.address }}
            </a>
          </div>
          <div v-if="cinema.ticketsUrl" class="col-12">
            <a :href="cinema.ticketsUrl" target="_blank" rel="noopener noreferrer" class="text-reset">
              <i class="bi bi-ticket-perforated me-1" />Εισιτήρια
            </a>
          </div>
          <div class="col-12 d-flex justify-content-start flex-wrap gap-1 align-items-center">
            <div class="tag-outlined">
              {{ cinema.movies.length }}
              {{ cinema.movies.length > 1 ? 'ταινίες' : 'ταινία' }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <thursday-notice class="mb-3" />
    <div class="d-flex flex-column justify-content-center flex-md-row gap-3 flex-md-wrap">
      <expanding-circle-background v-for="film in cinema.movies" :key="film.id"
        cssClass="card border-0 cinema-item cursor-pointer" @clicked="goToMoviePage(film.id)">
        <div class="card-header">
          <div class="row g-2">
            <div class="col-3">
              <img :src="film.imageUrl" :alt="film.greekTitle" class="img-fluid">
            </div>
            <div class="col-9">
              <h2 class="text-primary m-0">{{ film.greekTitle }}</h2>
              <div>{{ film.originalTitle }}</div>
            </div>
          </div>
        </div>
        <div class="card-body">
          <!-- A string schedule is the scraped text the backend couldn't parse, shown as is -->
          <template v-if="typeof film.cinemaSchedule === 'string'">
            {{ film.cinemaSchedule }}
          </template>
          <div v-else>
            <template v-for="[dayName, hours] in Object.entries(film.cinemaSchedule)">
              <div v-if="hours.length" class="row my-2" :key="dayName">
                <div class="col-5 text-truncate">
                  {{ mapDayName(dayName) }}
                </div>
                <div class="col-7 d-flex flex-wrap column-gap-2">
                  <span v-for="(hour, i) in hours" :key="i">
                    {{ hour }}
                  </span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </expanding-circle-background>
    </div>
  </template>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { computed, ref, watch } from 'vue';
import request from '@/http/request';
import { mapDayName } from '@/tools/tools';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const router = useRouter();

// GET /cinemas/:id -> { id, name, location, address, isOutdoor, ticketsUrl?, movieCount, movies }
const cinema = ref(null);
const loading = ref(true);

// Runs on open and when the id changes (searching another cinema from this page reuses the component).
// Any failure (404, bad id, network) shows the "not found" message.
const loadCinema = async () => {
  const id = props.id;
  loading.value = true;
  cinema.value = null;
  let result = null;
  try {
    const response = await request.get(`/cinemas/${encodeURIComponent(id)}`);
    result = response.data;
  } catch {
    result = null;
  }
  // A slower answer for a cinema we already left must not replace the current one.
  if (id !== props.id) return;
  cinema.value = result;
  loading.value = false;
}

watch(() => props.id, loadCinema, { immediate: true });

// Opens the cinema in Google Maps
const mapsLink = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${cinema.value.name}, ${cinema.value.address}`)}`)

const goToMoviePage = (id) => {
  router.push({ name: 'IndividualMovie', params: { filmId: id } });
};
</script>
