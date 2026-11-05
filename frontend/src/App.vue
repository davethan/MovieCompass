<template>
  <div>
    <LoadingView v-if="moviesStore.loading || !splashTimeDone" />
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

// In the installed app on a phone, keep the loading screen up for a moment even when the movies load fast,
// so the sayings get to change once.
const SPLASH_MIN_MS = 4000;
const isInstalledOnPhone =
  (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) &&
  window.matchMedia('(pointer: coarse)').matches;
const splashTimeDone = ref(!isInstalledOnPhone);
if (isInstalledOnPhone) setTimeout(() => (splashTimeDone.value = true), SPLASH_MIN_MS);

onMounted(async () => {
  const savedTheme = localStorage.getItem('theme');
  if (!savedTheme) localStorage.setItem('theme', 'dark');
  document.body.setAttribute('data-bs-theme', localStorage.getItem('theme'));
  theme.value = localStorage.getItem('theme');

  await moviesStore.getAllCurrentMoviesDetails();
  // After the movies: on a cold server /cinemas would be empty until the first scrape is saved.
  moviesStore.getAllCinemasAction();
  moviesStore.getAllImdbRatings();
})

provide('theme', theme);
</script>
