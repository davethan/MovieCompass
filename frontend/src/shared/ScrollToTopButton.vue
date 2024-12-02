<template>
  <transition name="fade">
    <div v-if="isScrollToTopButtonShown" class="scrollToTopButton rounded-5 px-5 py-2 cursor-pointer"
      @click="scrollToTop">
      <i class="bi bi-arrow-up fs-5 cursor-pointer" />
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
const scrollToTop = () => window.scrollTo(0, 0);

const lastScrollTop = ref(0);
const isScrollToTopButtonShown = ref(false);

const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  if (lastScrollTop.value - scrollTop >= 5) {
    if (scrollTop < 350) isScrollToTopButtonShown.value = false
    else isScrollToTopButtonShown.value = true;
  }
  else if (scrollTop > lastScrollTop.value) isScrollToTopButtonShown.value = false;
  lastScrollTop.value = scrollTop;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
})

</script>
