<template>
  <div :class="[cssClass, 'background-circle']" @mouseenter="setCirclePosition" @click="clicked">
    <slot />
  </div>
</template>

<script setup>
import { ref } from 'vue';

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

const clicked = () => emit('clicked')

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
    background-color: $black-highlight;
    top: v-bind('circleY + "px"');
    left: v-bind('circleX + "px"');
    transform: translate(-50%, -50%);
    transition: width 0.4s ease, height 0.4s ease, opacity 0.4s ease;
    z-index: 0;
  }

  &:hover::before {
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
