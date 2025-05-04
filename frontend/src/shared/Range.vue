<template>
  <div class="position-relative">
    <input type="range" :value="modelValue" @change="handleChange" class="form-range mt-0" :min="min" :max="max"
      :step="step">
    <div :class="`d-flex ${leftToRight ? 'justify-content-start' : 'justify-content-end'}`">
      <div class="coloredRail" :style="{ width: `${widthPercentage * 100}%` }" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const emit = defineEmits(['changed'])

const widthPercentage = computed(() => {
  const MaxMinusTarget = Math.round((props.max - Number(props.modelValue)) * 10) / 10
  return props.leftToRight ? 1 - (MaxMinusTarget / (props.max - props.min)) : MaxMinusTarget / (props.max - props.min)
})

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
});

const handleChange = (e) => {
  emit('changed', Number(e.target.value))
}

</script>
