import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routeGuard = (to, from) => {
  const { isProtected = false } = to.meta;
  const isAccessible = !!from.name;
  const defaultRoute = '/';
  if ((isProtected && !isAccessible)) return { path: defaultRoute };
  return true;
};

const guard = (to, from) => {
  const route = routeGuard(to, from);
  return route;
};


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      meta: {
        isProtected: false
      }
    },
    {
      path: '/film/:filmId',
      name: 'IndividualMovie',
      component: () => import('@/components/IndividualMovie.vue'),
      props: true,
      meta: {
        isProtected: true
      }
    },
    {
      path: '/cinema/:cinema',
      name: 'Cinema',
      component: () => import('@/components/Cinema.vue'),
      meta: {
        isProtected: true
      }
    },
    {
      path: '/specials',
      name: 'Specials',
      component: () => import('@/components/Specials.vue'),
      meta: {
        isProtected: true
      }
    },
    {
      path: '/upcoming',
      name: 'Upcoming',
      component: () => import('@/components/Upcoming.vue'),
      meta: {
        isProtected: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
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

router.beforeEach(guard);

export default router
