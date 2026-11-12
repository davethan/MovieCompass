<template>
  <!-- The outer div takes the classes given by the page (e.g. a grid column), the card stays fit-content -->
  <div v-if="showNotice">
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
// Cinemas change their schedule on Thursdays (Athens time), so the scraped data may be out of date until the
// second Thursday scrape (21:00 Athens time, see backend/src/scraping/cron.ts). Checked once on mount.
const parts = Object.fromEntries(
  new Intl.DateTimeFormat('en-US', { weekday: 'short', hour: 'numeric', hourCycle: 'h23', timeZone: 'Europe/Athens' })
    .formatToParts(new Date())
    .map(({ type, value }) => [type, value])
);
const showNotice = parts.weekday === 'Thu' && Number(parts.hour) < 21;
</script>
