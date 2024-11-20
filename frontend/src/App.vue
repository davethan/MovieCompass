<template>
  <TheHeader />
  <!-- <RouterLink to="/">Home</RouterLink> -->
  <div class="appBody">
    <RouterView />
  </div>
</template>

<script setup>
import { /*RouterLink,*/ RouterView } from 'vue-router'
import TheHeader from '@/components/TheHeader.vue'
</script>
