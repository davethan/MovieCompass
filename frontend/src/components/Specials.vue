<template>
  <div class="row g-3">
    <div class="col-lg-12">
      <div class="card film-item-no-hover">
        <div class="card-body">
          <h4 class="text-center text-secondary m-0"> Οι ειδικές προβολές της εβδομάδας </h4>
        </div>
      </div>
    </div>
    <template v-if="!specialsStore.loadingSpecials">
      <template v-if="specialsStore.SPECIALS.length">
        <div class="col-lg-3" v-for="(event, i) in specialsStore.SPECIALS" :key="i">
          <div class="card film-item-no-hover">
            <div class="card-body">
              <div class="text-primary"> {{ event.title }} </div>
              <div> {{ event.cinema }} </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="col-lg-3">
          <div class="card film-item-no-hover">
            <div class="card-body">
              <div class="text-primary"> Δεν βρέθηκαν ειδικές προβολές </div>
              <div> Δοκιμάστε να ξαναφορτώσετε τη σελίδα! </div>
            </div>
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <div class="col-lg-3 placeholder-specialEvent" v-for="i in 4" :key="i">
        <div class="placeholder-glow h-100 w-100">
          <span class="placeholder h-100 rounded-2 col-12"></span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useSpecialsStore } from '@/stores/specials';

const specialsStore = useSpecialsStore();

onMounted(() => {
  if (!specialsStore.SPECIALS.length) specialsStore.getSpecialsAthinoramaAction();
})
</script>
