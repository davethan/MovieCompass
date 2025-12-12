<template>
  <div>
    <LoadingView v-if="moviesStore.loading" />
    <div v-else>
      <TheHeader />
      <div class="appBody">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, provide, ref } from 'vue';
import { RouterView } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';
import LoadingView from '@/views/LoadingView.vue';
import { useMoviesStore } from './stores/movies';

const moviesStore = useMoviesStore();

const theme = ref('');

onMounted(async () => {
  const savedTheme = localStorage.getItem('theme');
  if (!savedTheme) localStorage.setItem('theme', 'dark');
  document.body.setAttribute('data-bs-theme', localStorage.getItem('theme'));
  theme.value = localStorage.getItem('theme');

  await moviesStore.getAllCurrentMoviesDetails();
  moviesStore.getAllImdbRatings();
})

provide('theme', theme);
</script>
