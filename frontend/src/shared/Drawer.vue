<template>
  <div class="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" :id="id"
    :aria-labelledby="id">
    <div class="offcanvas-header">
      <button type="button" class="mx-0 py-0 btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      <div class="ms-auto offcanvas-title" :id="id">
        <slot name="drawerHeader"></slot>
      </div>
    </div>
    <div class="offcanvas-body">
      <slot name="drawerBody"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    required: true,
  },
});
</script>
