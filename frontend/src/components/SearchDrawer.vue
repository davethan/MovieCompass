<template>
  <drawer id="searchDrawer" :modelValue="modelValue" @update:modelValue="closeDrawer" position="right">
    <template #drawerHeader>
      <h5 class="m-0"><b>Athens Cinemas</b></h5>
    </template>
    <template #drawerBody>
      <search-autocomplete :dataset="moviesStore.MOVIES" :showInside="false" cssClass="search-container-100"
        :reset-search="resetSearch" @search-results-updated="updateSearchedFilms"
        @reset-value-changed="handleResetChange" />
      <div v-if="searchedFilms.length" class="list-group">
        <div v-for="film in searchedFilms" :key="film.id" class="cursor-pointer border-bottom p-2 list-header"
          aria-current="true" @click="goToMoviePage(film.id)">
          <h5>{{ film.greekTitle }}</h5>
          <div>{{ film.originalTitle }}</div>
        </div>
      </div>
    </template>
  </drawer>
</template>

<script setup>
import { ref } from 'vue';
import { useMoviesStore } from '@/stores/movies';
import Drawer from '@/shared/Drawer.vue';
import { useRouter } from 'vue-router';
import SearchAutocomplete from '@/shared/SearchAutocomplete.vue';

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

const searchedFilms = ref([]);
const resetSearch = ref(false);

const goToMoviePage = (id) => {
  moviesStore.setSelectedMovieAction(id);
  router.push({ name: 'IndividualMovie', params: { filmId: id } });
  closeDrawer();
};

const updateSearchedFilms = (films) => searchedFilms.value = films;

const handleResetChange = () => {
  resetSearch.value = false
}

const closeDrawer = () => {
  resetSearch.value = true;
  searchedFilms.value = [];
  emit('update:modelValue', false);
};
</script>
