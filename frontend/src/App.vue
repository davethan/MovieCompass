<template>
  <div data-bs-theme="dark">
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
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';
import LoadingView from '@/views/LoadingView.vue';
import { useMoviesStore } from './stores/movies';

const moviesStore = useMoviesStore();

onMounted(async () => {
  await moviesStore.getAllCurrentMoviesDetails();
  moviesStore.getAllImdbRatings();
})
</script>
