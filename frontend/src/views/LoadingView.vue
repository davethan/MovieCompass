<template>
  <div class="mx-auto loading-center text-center">
    <h1 class="text-secondary mb-3">Athens Cinemas</h1>
    <transition name="fade-slide" mode="out-in">
      <div :key="sayingIndex" class="w-100">{{ currentSaying }}</div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const sayings = [
  'Φέρνουμε βόλτα όλα τα σινεμά.',
  'Μαζεύουμε τις ταινίες που παίζουν τώρα.',
  'Σχεδόν φτάσαμε.',
  'Μόνο λίγο έμεινε.',
];

const sayingIndex = ref(0);

const currentSaying = computed(() => sayings[sayingIndex.value]);

let interval;

const cycleSayings = () => {
  interval = setInterval(() => {
    sayingIndex.value = (sayingIndex.value + 1) % sayings.length;
  }, 2000);
};

onMounted(() => {
  cycleSayings();
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
  position: relative;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
