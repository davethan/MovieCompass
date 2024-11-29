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
  "Φέρνουμε βόλτα όλα τα σινεμά.",
  "Μαζεύουμε τις ταινίες που παίζουν τώρα.",
  "Τα φώτα χαμηλώνουν. Τα trailers παίζουν.",
  "Ξεσκονίζουμε τις αίθουσες και ψάχνουμε για τις καλύτερες ταινίες.",
  "Φέρνουμε τη μαγεία της μεγάλης οθόνης στο κινητό σου.",
  "Το εισιτήριο είναι στο χέρι σου. Μπες στον κόσμο του σινεμά.",
  "Κινητά σε σίγαση. Ξεκινάει το έργο!",
  "Ταξιδεύουμε ανάμεσα στις προβολές.",
  "Μετράμε αντίστροφα για τη μεγάλη πρεμιέρα.",
  "Ενημερωμένοι μέχρι το τελευταίο εισιτήριο.",
  "Όλα τα φώτα στραμμένα στην επόμενη σου ταινία.",
  "Η μεγάλη οθόνη σε περιμένει. Είσαι έτοιμος;",
  "Ξετυλίγουμε το σενάριο των καλύτερων ταινιών.",
  "Απ’ το σκοτάδι της αίθουσας, στο φως της εμπειρίας.",
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
