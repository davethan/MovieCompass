<template>
  <div class="navbar sticky-top navbar-dark bg-dark px-3">
    <div class="d-flex gap-3 justify-content-between align-items-center">
      <i v-if="route.name === 'home'" class="bi bi-list fs-3 cursor-pointer" @click="openTheDrawer" />
      <i v-else class="bi bi-arrow-left fs-3 cursor-pointer" @click="router.back" />
      <h4 class="m-0 cursor-pointer text-gradient" @click="router.push({ name: 'home' })">Athens Cinemas
      </h4>
    </div>
    <div class="d-flex gap-3 align-items-center">
      <div class="d-none d-sm-block">
        <button :disabled="specialsStore.loadingSpecials" class="btn w-100 btn-outline-secondary"
          @click="router.push({ name: 'Specials' })">
          Specials
        </button>
      </div>
      <div class="d-none d-sm-block">
        <button :disabled="upcomingStore.loadingUpcoming" class="btn w-100 btn-outline-secondary"
          @click="router.push({ name: 'Upcoming' })">
          Upcoming
        </button>
      </div>
      <i class="bi bi-search fs-6 cursor-pointer" @click="openSearchDrawer" />
    </div>
  </div>
  <search-drawer v-model="isSearchDrawerOpen" />
  <the-drawer v-model="isTheDrawerOpen" />
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import TheDrawer from './TheDrawer.vue';
import { useSpecialsStore } from '@/stores/specials';
import { useUpcomingStore } from '@/stores/upcoming';

const SearchDrawer = defineAsyncComponent(() => import('./SearchDrawer.vue'))

const router = useRouter();
const route = useRoute();

const specialsStore = useSpecialsStore();
const upcomingStore = useUpcomingStore();

const isSearchDrawerOpen = ref(false);
const isTheDrawerOpen = ref(false);

const openSearchDrawer = () => {
  isSearchDrawerOpen.value = true;
}

const openTheDrawer = () => {
  isTheDrawerOpen.value = true;
}
</script>
