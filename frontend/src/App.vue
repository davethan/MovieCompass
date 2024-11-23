<template>
  <div data-bs-theme="dark">
    <LoadingView v-if="moviesStore.loading" />
    <div v-else>
      <TheHeader />
      <!-- <RouterLink to="/">Home</RouterLink> -->
      <div class="appBody">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, provide } from 'vue';
import { /*RouterLink,*/ RouterView } from 'vue-router';
import TheHeader from '@/components/TheHeader.vue';
import LoadingView from '@/views/LoadingView.vue';
import { useMoviesStore } from './stores/movies';

const moviesStore = useMoviesStore();
const state = ref(moviesStore.MOVIES);

onMounted(async () => {
  await moviesStore.getAllCurrentMoviesDetails();
  moviesStore.getAllImdbRatings();
})

provide("state", state);
</script>
