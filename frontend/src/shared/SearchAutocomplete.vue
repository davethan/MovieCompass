<template>
  <div :class="cssClass" ref="container">
    <div class="position-relative">
      <input class="search-input" v-model="searchTerm" @keyup="searchDebounced" @focus="showDropdown"
        placeholder="Ταινία ή σινεμά..." />
      <button type="button" :class="['btn-close', 'btn-reset-search', { 'btn-close-white': theme === 'dark' }]"
        aria-label="Close" @click="resetState" />
    </div>
    <ul v-if="showInside && showList && (filteredFilms.length || filteredCinemas.length)"
      :class="showInside ? 'list-group-inside' : 'list-group'">
      <template v-if="filteredFilms.length">
        <li class="list-group-item border-0 px-2 pt-2 pb-1 text-secondary small fw-bold">Ταινίες</li>
        <li v-for="film in filteredFilms" :key="`film-${film.id}`"
          class="list-group-item cursor-pointer border-bottom p-2 list-header" aria-current="true"
          @click="handleMovieSelection(film.id)">
          <h5 class="list-header">{{ film.greekTitle }}</h5>
          <div>{{ film.originalTitle }}</div>
        </li>
      </template>
      <template v-if="filteredCinemas.length">
        <li class="list-group-item border-0 px-2 pt-3 pb-1 text-secondary small fw-bold">Σινεμά</li>
        <li v-for="cinema in filteredCinemas" :key="`cinema-${cinema.id}`"
          class="list-group-item cursor-pointer border-bottom p-2 list-header" aria-current="true"
          @click="handleCinemaSelection(cinema.id)">
          <h5 class="list-header">{{ cinema.name }}</h5>
          <div>{{ cinema.location }}</div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch, inject } from 'vue';
import { debounce } from 'lodash';

const props = defineProps({
  dataset: {
    type: Array,
    required: true,
  },
  // Cinemas from GET /cinemas, matched by name
  cinemas: {
    type: Array,
    default: () => []
  },
  showInside: {
    type: Boolean,
    default: true
  },
  cssClass: {
    type: String,
    default: 'search-container'
  },
  resetSearch: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['film-selected', 'cinema-selected', 'search-results-updated', 'reset-value-changed']);

const theme = inject('theme');
const searchTerm = ref('');
const showList = ref(false);
const filteredFilms = ref([]);
const filteredCinemas = ref([]);
const container = ref(null);

const editString = (text) => {
  return text
    .replace(/ /g, '')
    .toLowerCase()
    .replace(/ά/g, "α")
    .replace(/έ/g, "ε")
    .replace(/ή/g, "η")
    .replace(/ί/g, "ι")
    .replace(/ό/g, "ο")
    .replace(/ύ/g, "υ")
    .replace(/ώ/g, "ω")
    .replace(/ϊ|ΐ/g, "ι")
    .replace(/ϋ|ΰ/g, "υ");
}

// Drawer mode gets { films, cinemas }, or false when nothing matched.
const emitResults = () => {
  if (props.showInside) return;
  const found = filteredFilms.value.length || filteredCinemas.value.length;
  emit('search-results-updated', found ? { films: filteredFilms.value, cinemas: filteredCinemas.value } : false)
}

const search = () => {
  const term = editString(searchTerm.value);
  if (term.length < 2) {
    filteredFilms.value = [];
    filteredCinemas.value = [];
    if (!props.showInside) emit('search-results-updated', { films: [], cinemas: [] })
    return;
  }
  filteredFilms.value = props.dataset.filter((film) => {
    const greekTitle = editString(film.greekTitle);
    const originalTitle = editString(film.originalTitle);
    return greekTitle.includes(term) || originalTitle.includes(term);
  });
  filteredCinemas.value = props.cinemas.filter((cinema) => editString(cinema.name).includes(term));
  emitResults();
};

const searchDebounced = debounce(search, 500);

const showDropdown = () => {
  showList.value = true;
}

const handleClickOutside = (event) => {
  if (container.value && !container.value.contains(event.target)) {
    showList.value = false;
  }
}

const resetState = () => {
  searchTerm.value = '';
  filteredFilms.value = [];
  filteredCinemas.value = [];
  if (!props.showInside) emit('search-results-updated', { films: [], cinemas: [] })
}

const handleMovieSelection = (id) => {
  emit('film-selected', id);
}

const handleCinemaSelection = (id) => {
  emit('cinema-selected', id);
}

watch(() => props.resetSearch, (newValue) => {
  if (newValue) {
    resetState();
    emit('reset-value-changed')
  }
});

onMounted(() => {
  if (props.showInside) document.addEventListener("click", handleClickOutside);
})
onBeforeUnmount(() => {
  if (props.showInside) document.removeEventListener("click", handleClickOutside);
})
</script>
