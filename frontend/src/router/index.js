import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/film/:filmId',
      name: 'IndividualMovie',
      component: () => import('@/components/IndividualMovie.vue'),
      props: true,
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (to.name === 'IndividualMovie') {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }, 0);
      return false;
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return {
        left: 0,
        top: 0,
        behavior: 'smooth',
      };
    }
  }
})

export default router
