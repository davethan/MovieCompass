<template>
  <div :class="cssClass" ref="container">
    <input class="search-input" v-model="searchTerm" @keyup="searchDebounced" @focus="showDropdown"
      placeholder="Αναζήτηση ταινίας..." />
    <ul v-if="showInside && showList && filteredFilms.length" class="list-group">
      <li v-for="film in filteredFilms" :key="film.id" class="list-group-item cursor-pointer" aria-current="true"
        @click="handleMovieSelection(film.id)">
        <h5 class="list-header">{{ film.greekTitle }}</h5>
        <div>{{ film.originalTitle }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { debounce } from 'lodash';

const props = defineProps({
  dataset: {
    type: Array,
    required: true,
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

const emit = defineEmits(['film-selected', 'search-results-updated', 'reset-value-changed']);

const searchTerm = ref('');
const showList = ref(false);
const filteredFilms = ref([]);
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

const search = () => {
  const term = editString(searchTerm.value);
  if (term.length < 3) {
    filteredFilms.value = [];
    if (!props.showInside) emit('search-results-updated', filteredFilms.value)
    return;
  }
  filteredFilms.value = props.dataset.filter((film) => {
    const greekTitle = editString(film.greekTitle);
    const originalTitle = editString(film.originalTitle);
    return greekTitle.includes(term) || originalTitle.includes(term);
  });
  if (!props.showInside) emit('search-results-updated', filteredFilms.value)
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
}

const handleMovieSelection = (id) => {
  emit('film-selected', id);
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
