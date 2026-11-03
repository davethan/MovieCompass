<template>
  <div class="position-relative double-range">
    <input type="range" class="form-range mt-0" :min="min" :max="max" :step="step" :value="lower"
      @input="handleInput($event, 'lower')" @change="draggedThumb = null">
    <input type="range" class="form-range mt-0" :min="min" :max="max" :step="step" :value="upper"
      @input="handleInput($event, 'upper')" @change="draggedThumb = null">
    <div class="coloredRail"
      :style="{ left: `${toPercentage(lower)}%`, width: `${toPercentage(upper) - toPercentage(lower)}%`, transform: 'translateY(-50%)' }" />
    <div v-if="showStep && draggedThumb" class="rangeStep"
      :style="{ left: `${toPercentage(draggedThumb === 'lower' ? lower : upper)}%`, transform: 'translateX(-50%)' }">
      {{ editStepString(draggedThumb === 'lower' ? lower : upper) }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

// Range slider with two thumbs: a lower and an upper limit. Emits `changed` with [lower, upper].
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [0, 0]
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 0
  },
  step: {
    type: Number,
    default: 1
  },
  showStep: {
    type: Boolean,
    default: false
  },
  editStepString: {
    type: Function,
    default: (step) => step
  },
});

const emit = defineEmits(['changed']);

const draggedThumb = ref(null);
const lower = computed(() => Number(props.modelValue[0]));
const upper = computed(() => Number(props.modelValue[1]));

const toPercentage = (value) => ((value - props.min) / (props.max - props.min)) * 100;

const handleInput = (e, thumb) => {
  draggedThumb.value = thumb;
  const value = Number(e.target.value);
  // Thumbs can't cross each other
  const range = thumb === 'lower' ? [Math.min(value, upper.value), upper.value] : [lower.value, Math.max(value, lower.value)];
  e.target.value = thumb === 'lower' ? range[0] : range[1];
  emit('changed', range);
};
</script>

<style scoped lang="scss">
// Both inputs share one track (the second sits exactly on top of the first) and the rail is centred on it.
// Only the thumbs catch clicks and touches.
.double-range {
  padding: 0.65rem 0; // same height as Range.vue's line

  .form-range {
    display: block;
    pointer-events: none;
    background: transparent;

    &:last-of-type {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      transform: translateY(-50%);

      &::-webkit-slider-runnable-track {
        background-color: transparent;
      }

      &::-moz-range-track {
        background-color: transparent;
      }
    }

    &::-webkit-slider-thumb {
      pointer-events: auto;
      position: relative;
      z-index: 2;
    }

    &::-moz-range-thumb {
      pointer-events: auto;
    }
  }
}
</style>
