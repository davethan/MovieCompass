import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'

import App from './App.vue'
import router from './router'
import ScrollToTopButton from '@/shared/ScrollToTopButton.vue';
import Drawer from '@/shared/Drawer.vue';
import Range from '@/shared/Range.vue';
import ExpandingCircleBackground from '@/shared/ExpandingCircleBackground.vue';

registerSW({
  immediate: true,
  onNeedRefresh: () => {
    console.log('New version available')
    // eslint-disable-next-line no-undef
    updateSW(true)
  }
})

const app = createApp(App)

app
  .use(createPinia())
  .use(router)
  .component('ScrollToTopButton', ScrollToTopButton)
  .component('Drawer', Drawer)
  .component('Range', Range)
  .component('ExpandingCircleBackground', ExpandingCircleBackground)

app.mount('#app')
