<template>
  <div class="mx-auto loading-center text-center">
    <h1 class="text-secondary mb-3">Athens Cinemas</h1>
    <transition name="fade-slide" mode="out-in">
      <div :key="sayingIndex" class="w-100 saying">{{ currentSaying }}</div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const sayings = [
  "Φέρνουμε βόλτα όλα τα σινεμά της Αττικής.",
  "Μαζεύουμε τις ταινίες που παίζουν αυτή τη στιγμή.",
  "Μετράμε αντίστροφα για τη μεγάλη πρεμιέρα.",
  "Στρέφουμε τα φώτα στην επόμενη ταινία.",
  "Ξετυλίγουμε το σενάριο των καλύτερων ταινιών.",
  "Πατάμε play στις πιο δυνατές σκηνές.",
  "Στοχεύουμε στο επίκεντρο της δράσης.",
  "Δίνουμε ραντεβού στο πρώτο κάθισμα.",
  "Παρακολουθούμε κάθε καρέ με πάθος.",
  "Συναντάμε τους ήρωες της επόμενης πλοκής.",
  "Ζούμε τη δράση, την ένταση και το συναίσθημα.",
  "Ακούμε το χειροκρότημα μετά το τέλος των τίτλων.",
  "Βουτάμε στις πιο ανατρεπτικές ιστορίες.",
  "Γιορτάζουμε τη μαγεία της κινηματογραφικής εμπειρίας.",
  "Ταξιδεύουμε ανάμεσα στις προβολές.",
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

.saying {
  height: 150px
}

.loading-center {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
