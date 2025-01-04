import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Courses from './Courses.vue';
import Recettes from './Recettes.vue';
import Repas from './Repas.vue';
import Planning from './Planning.vue';
import Admin from './Admin.vue';
import Sante from './Sante.vue';

// Définir les routes
const routes = [
  { path: '/', component: Courses },
  { path: '/recettes', component: Recettes },
  { path: '/repas', component: Repas },
  { path: '/planning', component: Planning },
  { path: '/admin', component: Admin },
  { path: '/sante', component: Sante },
];

// Créer le routeur
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Créer l'application Vue et y ajouter le routeur
createApp(App)
  .use(router)
  .mount('#app');
