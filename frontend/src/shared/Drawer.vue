<template>
  <div :class="['offcanvas', classDirection]" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" :id="id"
    :aria-labelledby="id">
    <div class="offcanvas-header">
      <button type="button" class="mx-0 py-0 btn-close" aria-label="Close" @click="close"></button>
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
import { watch, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    default: 'left'
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const classDirection = computed(() => props.position === 'left' ? 'offcanvas-start' : 'offcanvas-end')

watch(() => props.modelValue, (newValue) => {
  const drawerElement = document.getElementById(props.id);
  if (drawerElement) {
    if (newValue) drawerElement.classList.add('show');
    else drawerElement.classList.remove('show');
  }
});

watch(() => route.path, (newPath, oldPath) => {
  if (newPath === oldPath) return
  close();
});

const close = () => emit('update:modelValue', false);
</script>
