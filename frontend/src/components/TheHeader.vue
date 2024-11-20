<template>
  <div class="navbar sticky-top navbar-dark bg-dark px-3 shadow-lg">
    <div class="d-flex gap-3 align-items-center">
      <i class="bi bi-list fs-1" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" />
      Movie Compass
    </div>
  </div>
  <TheDrawer />
</template>

<script setup>
import TheDrawer from './TheDrawer.vue';

</script>
