<template>
  <TransitionGroup name="list">
    <slot />
  </TransitionGroup>
</template>

<style>
@media (min-width: 992px) {

  .list-move,
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
  }

  .list-leave-active {
    position: absolute;
  }
}
</style>
