<template>
  <drawer id="searchDrawer" :modelValue="modelValue" @update:modelValue="closeDrawer" position="right">
    <template #drawerHeader>
      <h5 class="m-0 text-secondary"><b>Athens Cinemas</b></h5>
    </template>
    <template #drawerBody>
      <search-autocomplete :dataset="moviesStore.MOVIES" :cinemas="moviesStore.CINEMAS" :showInside="false"
        cssClass="search-container-100" :reset-search="resetSearch" @search-results-updated="updateSearchResults"
        @reset-value-changed="resetSearch = false" />
      <div v-if="searchedFilms.length" class="list-group">
        <div class="px-2 pt-2 pb-1 text-secondary small fw-bold">Ταινίες</div>
        <div v-for="film in searchedFilms" :key="`film-${film.id}`"
          class="cursor-pointer border-bottom p-2 list-header" aria-current="true" @click="goToMoviePage(film.id)">
          <h5 class="mb-1">{{ film.greekTitle }}</h5>
          <div>{{ film.originalTitle }}</div>
        </div>
      </div>
      <div v-if="searchedCinemas.length" class="list-group">
        <div class="px-2 pt-3 pb-1 text-secondary small fw-bold">Σινεμά</div>
        <div v-for="cinema in searchedCinemas" :key="`cinema-${cinema.id}`"
          class="cursor-pointer border-bottom p-2 list-header" aria-current="true" @click="goToCinemaPage(cinema.id)">
          <h5 class="mb-1">{{ cinema.name }}</h5>
          <div>{{ cinema.location }}</div>
        </div>
      </div>
      <div v-if="nothingFound" class="mx-auto fit-content">
        Δεν βρέθηκε κάποια ταινία ή σινεμά...
      </div>
    </template>
  </drawer>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue';
import { useMoviesStore } from '@/stores/movies';
import { useRouter } from 'vue-router';

const router = useRouter();
const moviesStore = useMoviesStore();

defineProps({
  noOfFilteredFilms: {
    type: Number,
    default: 0
  },
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const SearchAutocomplete = defineAsyncComponent(() => import('@/shared/SearchAutocomplete.vue'))

const searchedFilms = ref([]);
const searchedCinemas = ref([]);
const nothingFound = ref(false)
const resetSearch = ref(false);

const goToMoviePage = (id) => {
  router.push({ name: 'IndividualMovie', params: { filmId: id } });
  resetDrawer();
};

const goToCinemaPage = (id) => {
  router.push({ name: 'Cinema', params: { id } });
  resetDrawer();
};

// payload is { films, cinemas }, or false when nothing matched
const updateSearchResults = (payload) => {
  nothingFound.value = !payload
  searchedFilms.value = payload ? payload.films : []
  searchedCinemas.value = payload ? payload.cinemas : []
};

const closeDrawer = () => emit("update:modelValue");

const resetDrawer = () => {
  resetSearch.value = true;
  searchedFilms.value = [];
  searchedCinemas.value = [];
};
</script>
