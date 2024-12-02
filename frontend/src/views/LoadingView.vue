<template>
  <div class="mx-auto loading-center text-center">
    <h1 class="text-gradient mb-3">Athens Cinemas</h1>
    <transition name="fade-slide" mode="out-in">
      <div :key="sayingIndex" class="w-100 text-primary saying">{{ currentSaying }}</div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const sayings = [
  "Φέρνουμε βόλτα όλα τα σινεμά της Αττικής.",
  "Μαζεύουμε τις ταινίες που παίζουν αυτή τη στιγμή.",
  "Μετράμε αντίστροφα για τη μεγάλη πρεμιέρα.",
  "Ξετυλίγουμε το σενάριο των καλύτερων ταινιών.",
  "Πατάμε play στις πιο δυνατές σκηνές.",
  "Ξεφυλλίζουμε το πρόγραμμα των Αθηναϊκών κινηματογράφων.",
  "Στοχεύουμε στο επίκεντρο της δράσης.",
  "Στρέφουμε τα φώτα στις ταινίες της πρωτεύουσας.",
  "Δίνουμε ραντεβού στο πρώτο κάθισμα.",
  "Αναζητούμε κάθε καρέ με πάθος.",
  "Συναντάμε τους ήρωες της επόμενης πλοκής.",
  "Φέρνουμε κοντά σας κάθε έργο που αξίζει να δείτε.",
  "Βουτάμε στις πιο ανατρεπτικές ιστορίες.",
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
