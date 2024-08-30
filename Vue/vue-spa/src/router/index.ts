import HomePage from '@/modules/landing/pages/HomePage.vue';
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      components: HomePage,
    },
  ],
});

export default router;
