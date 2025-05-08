<template>
  <div class="position-relative">
    <input type="range" :value="modelValue" @input="handleInput" @change="handleChange" class="form-range mt-0"
      :min="min" :max="max" :step="step">
    <div :class="`d-flex ${leftToRight ? 'justify-content-start' : 'justify-content-end'}`">
      <div class="coloredRail" :style="{ width: `${widthPercentage * 100}%` }" />
      <div v-if="showStep && isStepShown" class="rangeStep" :style="{
        [leftToRight ? 'left' : 'right']: `${widthPercentage * 100}%`,
        transform: leftToRight ? 'translateX(-50%)' : 'translateX(50%)'
      }">
        {{ modelValue }} </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const emit = defineEmits(['changed'])

const widthPercentage = computed(() => {
  const MaxMinusTarget = Math.round((props.max - Number(props.modelValue)) * 10) / 10
  return props.leftToRight ? 1 - (MaxMinusTarget / (props.max - props.min)) : MaxMinusTarget / (props.max - props.min)
})

const isStepShown = ref(false);

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  leftToRight: {
    type: Boolean,
    default: true
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
  }
});

const handleInput = (e) => {
  isStepShown.value = true;
  emit('changed', Number(e.target.value));
}

const handleChange = () => isStepShown.value = false

</script>
