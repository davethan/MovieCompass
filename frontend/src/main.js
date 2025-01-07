import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ScrollToTopButton from '@/shared/ScrollToTopButton.vue';
import Drawer from '@/shared/Drawer.vue';

const app = createApp(App)

app
  .use(createPinia())
  .use(router)
  .component('ScrollToTopButton', ScrollToTopButton)
  .component('Drawer', Drawer)

app.mount('#app')
