<template>
  <drawer id="searchDrawer" :modelValue="modelValue" @update:modelValue="closeDrawer" position="right">
    <template #drawerHeader>
      <h5 class="m-0 text-secondary"><b>Athens Cinemas</b></h5>
    </template>
    <template #drawerBody>
      <search-autocomplete :dataset="moviesStore.MOVIES" :showInside="false" cssClass="search-container-100"
        :reset-search="resetSearch" @search-results-updated="updateSearchedFilms"
        @reset-value-changed="resetSearch = false" />
      <div v-if="searchedFilms.length" class="list-group">
        <div v-for="film in searchedFilms" :key="film.id" class="cursor-pointer border-bottom p-2 list-header"
          aria-current="true" @click="goToMoviePage(film.id)">
          <h5 class="mb-1">{{ film.greekTitle }}</h5>
          <div>{{ film.originalTitle }}</div>
        </div>
      </div>
      <div v-else-if="movieNotFound" class="mx-auto fit-content">
        Δεν βρέθηκε κάποια ταινία...
      </div>
    </template>
  </drawer>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue';
import { useMoviesStore } from '@/stores/movies';
import Drawer from '@/shared/Drawer.vue';
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
const movieNotFound = ref(false)
const resetSearch = ref(false);

const goToMoviePage = (id) => {
  moviesStore.setSelectedMovieAction(id);
  router.push({ name: 'IndividualMovie', params: { filmId: id } });
  resetDrawer();
};

const updateSearchedFilms = (payload) => {
  if (payload) {
    movieNotFound.value = false
    searchedFilms.value = payload
  } else {
    movieNotFound.value = true
    searchedFilms.value = []
  }
};

const closeDrawer = () => emit("update:modelValue");

const resetDrawer = () => {
  resetSearch.value = true;
  searchedFilms.value = [];
};
</script>
