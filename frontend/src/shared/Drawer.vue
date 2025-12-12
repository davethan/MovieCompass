<template>
  <transition :name="drawerTransition" @before-enter="handleBeforeEnter" @after-enter="handleAfterEnter">
    <div v-if="isOpen" :class="['offcanvas show', classDirection]" data-bs-scroll="true" data-bs-backdrop="false"
      tabindex="-1" :id="id" :aria-labelledby="id" ref="drawerElement">
      <div class="offcanvas-header">
        <button type="button" :class="['mx-0 py-0 btn-close', { 'btn-close-white': theme === 'dark' }]"
          aria-label="Close" @click="close"></button>
        <div class="ms-auto offcanvas-title" :id="id">
          <slot name="drawerHeader"></slot>
        </div>
      </div>
      <div class="offcanvas-body">
        <slot name="drawerBody"></slot>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { onBeforeUnmount, onMounted, watch, computed, ref, inject } from 'vue';

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
const drawerTransition = computed(() => props.position === 'left' ? 'drawer-fade-left' : 'drawer-fade-right')

const isOpen = ref(false);
const isOpening = ref(false);
const drawerElement = ref(null);
const theme = inject('theme');

const handleClickOutside = (event) => {
  if (drawerElement.value && !drawerElement.value.contains(event.target) && !isOpening.value) close();
}
const handleBeforeEnter = () => isOpening.value = true;
const handleAfterEnter = () => isOpening.value = false;
const close = () => emit('update:modelValue', false);

watch(() => props.modelValue, (newValue) => isOpen.value = newValue);

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
})
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
})
</script>

<style scoped>
.drawer-fade-left-leave-active,
.drawer-fade-right-leave-active {
  transition: translate 0.3s ease;
}

.drawer-fade-left-leave-to {
  translate: -100%;
}

.drawer-fade-right-leave-to {
  translate: 100%;
}

.drawer-fade-left-enter-active,
.drawer-fade-right-enter-active {
  transition: translate 0.3s ease;
}

.drawer-fade-left-enter-from {
  translate: -100%;
}

.drawer-fade-right-enter-from {
  translate: 100%;
}
</style>
