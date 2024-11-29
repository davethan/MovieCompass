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
  "Φέρνουμε βόλτα όλα τα σινεμά της Αττικής.",
  "Μαζεύουμε τις ταινίες που παίζουν τώρα.",
  "Χαμηλώνουμε τα φώτα",
  "Ξεσκονίζουμε τις αίθουσες και ψάχνουμε για τις καλύτερες ταινίες.",
  "Φέρνουμε τη μαγεία της μεγάλης οθόνης στο κινητό σου.",
  "Κόβουμε το εισητήριο σου.",
  "Ταξιδεύουμε ανάμεσα στις προβολές.",
  "Βάζουμε τα κινητά μας σε σίγαση.",
  "Μετράμε αντίστροφα για τη μεγάλη πρεμιέρα.",
  "Ενημερωνόμαστε μέχρι το τελευταίο εισιτήριο.",
  "Στρέφουμε τα φώτα στην επόμενη σου ταινία.",
  "Ξετυλίγουμε το σενάριο των καλύτερων ταινιών.",
  "Περάσαμε απ’ όλες τις αίθουσες. Εσύ σε ποια θα μπεις;",
];

const sayingIndex = ref(0);

const currentSaying = computed(() => sayings[sayingIndex.value]);

let interval;

const cycleSayings = () => {
  interval = setInterval(() => {
    sayingIndex.value = (sayingIndex.value + 1) % sayings.length;
  }, 3000);
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
