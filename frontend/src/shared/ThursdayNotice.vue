<template>
  <!-- The outer div takes the classes given by the page (e.g. a grid column), the card stays fit-content -->
  <div v-if="isThursday">
    <div class="card film-item-no-hover fit-content mx-auto">
      <div class="card-body d-flex align-items-center gap-2">
        <i class="bi bi-exclamation-triangle text-warning" />
        <span>Σήμερα οι κινηματογράφοι αλλάζουν πρόγραμμα και οι ταινίες και οι ώρες προβολής ενδέχεται να μην είναι
          ακριβείς.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// Cinemas change their schedule on Thursdays (Athens time), so the scraped data may be out of date that day.
// Checked once on mount.
const isThursday = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'Europe/Athens' })
  .format(new Date()) === 'Thu';
</script>
