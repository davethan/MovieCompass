<template>
  <button :type="type" :disabled="disabled" :class="cssClass + ' icon-button px-4'" @click="handleClick">
    <div :class="titleClass">{{ title }}</div>
    <i :class="iconClass" />
  </button>
</template>

<script setup>
import { computed, ref, onUnmounted } from 'vue';

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  cssClass: {
    type: [String, Array],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  reverted: {
    type: Boolean,
    default: false
  }
})

const isClicked = ref(false);
let clickTimeout = null;

const titleClass = computed(() => {
  const baseClass = props.reverted ? "icon-button-title-reverted" : "icon-button-title";
  return isClicked.value ? `${baseClass} clicked-state` : baseClass;
});

const iconClass = computed(() => {
  const baseClass = props.reverted ? `icon-on-button-reverted ${props.icon}` : `icon-on-button ${props.icon}`;
  return isClicked.value ? `${baseClass} clicked-state` : baseClass;
});

const handleClick = () => {
  if (clickTimeout) clearTimeout(clickTimeout);

  isClicked.value = true;
  clickTimeout = setTimeout(() => {
    isClicked.value = false;
  }, 500);
}

onUnmounted(() => {
  if (clickTimeout) clearTimeout(clickTimeout);
});
</script>

<style lang="scss">
$hovered-position: translate(-10px, -50%);
$hovered-position-reverted: translate(25px, -50%);

.icon-button {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.icon-button-title,
.icon-button-title-reverted {
  transition: all 0.3s ease;
}

.icon-on-button,
.icon-on-button-reverted {
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  transition: all 0.3s ease;
  opacity: 0;
}

/* Hover states */
.icon-button:hover .icon-button-title {
  transform: translateX(-10px);
}

.icon-button:hover .icon-on-button {
  opacity: 1;
  top: 50%;
  right: 0%;
  transform: $hovered-position;
}

.icon-button:hover .icon-button-title-reverted {
  transform: translateX(10px);
}

.icon-button:hover .icon-on-button-reverted {
  opacity: 1;
  top: 50%;
  right: 100%;
  transform: $hovered-position-reverted;
}

/* Clicked states - keep the hover position */
.icon-button .icon-button-title.clicked-state {
  transform: translateX(-10px);
}

.icon-button .icon-on-button.clicked-state {
  opacity: 1;
  top: 50%;
  right: 0%;
  transform: $hovered-position;
}

.icon-button .icon-button-title-reverted.clicked-state {
  transform: translateX(10px);
}

.icon-button .icon-on-button-reverted.clicked-state {
  opacity: 1;
  top: 50%;
  right: 100%;
  transform: $hovered-position-reverted;
}
</style>
