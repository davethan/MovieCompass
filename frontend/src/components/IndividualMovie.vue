<template>
  <div class="row justify-content-center g-3 mb-3">
    <div class="col-lg-6">
      <div class="card border-0">
        <div class="card-header">

          <!-- bigger than small -->
          <div class="d-none d-sm-block">
            <div class="d-flex justify-content-between gap-2">
              <img :src="state.imageUrl" :alt="state.greekTitle" class="img-fluid">
              <div class="d-flex flex-grow-1 flex-column">
                <h2 class="text-primary m-0">{{ state.greekTitle }}</h2>
                <div class="col-12 mb-2">{{ state.originalTitle }} </div>
                <div class="row g-2">
                  <div class="col-12 d-flex justify-content-start flex-wrap gap-1 align-items-center">
                    <div class="tag-outlined">Σε {{ state.cinemas.length }} σινεμά</div>
                    <div class="tag-outlined"> {{ formatDuration(state.duration) }} </div>
                    <div class="tag-outlined">{{ state.year }} </div>
                    <div class="tag-outlined" v-if="state.imdbRating">
                      {{ state.imdbRating === "None" ? '?/10' : `${state.imdbRating}/10` }}
                    </div>
                    <div v-else class="rating-placeholder placeholder-glow"> <span
                        class="placeholder rounded-3 col-12"></span>
                    </div>
                    <div v-if="state.rated" class="tag-outlined">{{ state.rated }}</div>
                  </div>
                  <div class="col-12 d-flex justify-content-start flex-wrap gap-1 align-items-center">
                    <div v-for="(tag, i) in state.tags" :key="i" class="tag-square">{{ tag }}</div>
                  </div>
                </div>
              </div>
              <i class="bi bi-list fs-3 cursor-pointer" @click="openMovieDrawer" />
            </div>
          </div>

          <!-- small -->
          <div class="d-block d-sm-none">
            <div class="row g-2 mb-2">
              <img :src="state.imageUrl" :alt="state.greekTitle" class="col-3 img-fluid">
              <div class="col-8 d-flex flex-column">
                <h2 class="text-primary m-0">{{ state.greekTitle }}</h2>
                <div class="col-12">{{ state.originalTitle }} </div>
              </div>
              <i class="col-1 bi bi-list fs-3 cursor-pointer" @click="openMovieDrawer" />
            </div>
            <div class="row g-2">
              <div class="col-12 d-flex justify-content-start flex-wrap gap-1 align-items-center">
                <div class="tag-outlined">Σε {{ state.cinemas.length }} σινεμά</div>
                <div class="tag-outlined"> {{ formatDuration(state.duration) }} </div>
                <div class="tag-outlined">{{ state.year }} </div>
                <div class="tag-outlined" v-if="state.imdbRating">
                  {{ state.imdbRating === "None" ? '?/10' : `${state.imdbRating}/10` }}
                </div>
                <div v-else class="rating-placeholder placeholder-glow"> <span
                    class="placeholder rounded-3 col-12"></span>
                </div>
                <div v-if="state.rated" class="tag-outlined">{{ state.rated }}</div>
              </div>
              <div class="col-12 d-flex justify-content-start flex-wrap gap-1 align-items-center">
                <div v-for="(tag, i) in state.tags" :key="i" class="tag-square">{{ tag }}</div>
              </div>
            </div>
          </div>

        </div>
        <div class="card-body">
          <div class="d-flex gap-3">
            <div>
              <b>Σκηνοθεσία: </b><template v-for="(director, index) in state.directors">
                {{ director }}<span :key="index" v-if="index < state.directors.length - 1">, </span>
              </template>
            </div>
          </div>
          <div class="my-4">
            {{ state.summary }}
          </div>
          <div v-if="state.actors.length" class="mb-2">
            <b>Παίζουν: </b> <template v-for="(actor, index) in state.actors">
              {{ actor }}<span :key="index" v-if="index < state.actors.length - 1">, </span>
            </template>
          </div>
          <div v-if="state.awards" class="mb-2">
            <b>Βραβεία: </b><span> {{ state.awards }}</span>
          </div>
          <div class="d-flex justify-content-end align-items-end gap-2">
            <a :href="athinoramaUrl" target="_blank" rel="noopener noreferrer">
              <img src="@/assets/images/athinorama.jpg" alt="Athinorama" width="30" height="30"
                class="cursor-pointer" />
            </a>
            <a v-if="state.imdbLink" :href="state.imdbLink" target="_blank" rel="noopener noreferrer">
              <img src="@/assets/images/imdb.png" alt="IMDb" width="30" height="30" class="cursor-pointer" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div v-if="state.trailer" class="col-lg-6">
      <div class="card film-item-no-hover">
        <div class="card-body" style="min-height: 350px">
          <iframe :src="state.trailer" style="width: 100%; height:100%" />
        </div>
      </div>
    </div>
  </div>
  <div class="d-flex flex-column justify-content-center flex-md-row gap-3 flex-md-wrap">
    <expanding-circle-background v-for="(cinema, i) in filteredCinemas" :key="i"
      cssClass="card border-0 cinema-item cursor-pointer" @clicked="goToCinemaPage(cinema)">
      <div class="card-header">
        <h2 class="text-secondary">{{ cinema.cinema }}</h2>
        <div class="d-flex justify-content-between flex-wrap ">
          <div>{{ cinema.cinemaLocation }}</div>
          <div v-if="cinema.isOutdoor"><i class="bi bi-brightness-high-fill is-outdoor" /></div>
        </div>
      </div>
      <div class="card-body">
        <template v-if="typeof cinema.cinemaSchedule === 'string' || cinema.cinemaSchedule instanceof String">
          {{ cinema.cinemaSchedule }}
        </template>
        <div v-else>
          <template v-for="[dayName, hours] in Object.entries(cinema.cinemaSchedule)">
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
  <individual-movie-drawer v-model="isMovieDrawerOpen" @filter-changed="filterCinemas" :state="state" />
  <scroll-to-top-button />
</template>

<script setup>
import { ref, defineProps, onBeforeMount, computed, unref, watch, defineAsyncComponent } from 'vue';
import { formatDuration, mapDayName } from '@/tools/tools';
import { useRouter } from 'vue-router';
import { useMoviesStore } from '@/stores/movies';

const props = defineProps({
  filmId: {
    type: String,
    default: ''
  }
});

const IndividualMovieDrawer = defineAsyncComponent(() => import('./IndividualMovieDrawer.vue'))
const moviesStore = useMoviesStore();
const router = useRouter();

const state = ref('');
const isMovieDrawerOpen = ref(false);
const filteredCinemas = ref([]);

const TODAY = 2, TOMORROW = 3, WEEKEND = 4;
const SUMMER_CINEMAS = 2, WINTER_CINEMAS = 3;

const athinoramaUrl = computed(() => {
  let url = state.value.athinoramaLink || '';
  url = `https://www.athinorama.gr${url}`;
  return url;
})

const filterCinemas = ({ day, cinemaType, locations }) => {
  filteredCinemas.value = [...unref(state).cinemas];

  if (day === TODAY) {
    const date = new Date();
    const today = date.toLocaleDateString('en-US', { weekday: 'long' });
    filteredCinemas.value = filteredCinemas.value.filter((cinema) => {
      return cinema.cinemaSchedule[today] && cinema.cinemaSchedule[today].length > 0;
    })
  } else if (day === TOMORROW) {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const tomorrow = date.toLocaleDateString('en-US', { weekday: 'long' });
    filteredCinemas.value = filteredCinemas.value.filter((cinema) => {
      return cinema.cinemaSchedule[tomorrow] && cinema.cinemaSchedule[tomorrow].length > 0;
    })
  } else if (day === WEEKEND) {
    filteredCinemas.value = filteredCinemas.value.filter((cinema) => {
      return ((cinema.cinemaSchedule.Saturday && cinema.cinemaSchedule.Saturday.length > 0) ||
        (cinema.cinemaSchedule.Sunday && cinema.cinemaSchedule.Sunday.length > 0));
    })
  }

  if (cinemaType === SUMMER_CINEMAS) filteredCinemas.value = filteredCinemas.value.filter((cinema) => cinema.isOutdoor);
  else if (cinemaType === WINTER_CINEMAS) filteredCinemas.value = filteredCinemas.value.filter((cinema) => !cinema.isOutdoor);
  if (unref(locations).length) filteredCinemas.value = filteredCinemas.value.filter((cinema) => unref(locations).includes(cinema.cinemaLocation));
}

const goToCinemaPage = (cinema) => {
  moviesStore.setSelectedCinemaAction(cinema.cinema);
  router.push({
    name: 'Cinema',
    params: { cinema: cinema.cinema.match(/[\p{Script=Latin}\p{Script=Greek}0-9]/gu).join('') }
  });
}

const openMovieDrawer = () => {
  isMovieDrawerOpen.value = true;
}

const loadMovieData = (id) => {
  state.value = moviesStore.getIndividualMovie(id);
  filteredCinemas.value = state.value ? [...state.value.cinemas] : [];
};

watch(() => props.filmId, (newFilmId) => {
  loadMovieData(newFilmId);
});

onBeforeMount(() => {
  loadMovieData(props.filmId);
});
</script>
