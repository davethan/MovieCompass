<template>
  <div :class="[cssClass, 'background-circle']" @mouseenter="setCirclePosition" @touchstart="handleTouchStart"
    @click="clicked">
    <slot />
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';

defineProps({
  cssClass: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['clicked']);

const circleX = ref(0);
const circleY = ref(0);

const setCirclePosition = (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  circleX.value = event.clientX - rect.left;
  circleY.value = event.clientY - rect.top;
};

let timeout;
const handleTouchStart = (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const touch = event.touches[0];

  circleX.value = touch.clientX - rect.left;
  circleY.value = touch.clientY - rect.top;

  const element = event.currentTarget;
  element.classList.add('touch-active');

  timeout = setTimeout(() => {
    element.classList.remove('touch-active');
  }, 500);
};

const clicked = () => emit('clicked')

onUnmounted(() => clearTimeout(timeout))

</script>

<style lang="scss">
.background-circle {
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    border-radius: 50%;
    background-color: var(--color-highlight);
    top: v-bind('circleY + "px"');
    left: v-bind('circleX + "px"');
    transform: translate(-50%, -50%);
    transition: width 0.5s ease, height 0.5s ease, opacity 0.5s ease;
    z-index: 0;
  }

  &:hover::before,
  &.touch-active::before {
    width: 250%;
    height: 250%;
    opacity: 1;
  }
}

.background-circle>* {
  position: relative;
  z-index: 1;
}
</style>
