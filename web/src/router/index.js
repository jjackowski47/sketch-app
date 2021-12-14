import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Signup from '../views/Signup.vue';
import Signin from '../views/Signin.vue';
import Dashboard from '../views/Dashboard.vue';
import store from '../store/index.js';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    beforeEnter(to, from, next) {
      if (store.getters.isAuthenticated) {
        next('/');
      } else {
        next();
      }
    },
  },
  {
    path: '/notes',
    name: 'Notes',
    component: Dashboard,
    beforeEnter(to, from, next) {
      if (store.getters.isAuthenticated) {
        next();
      } else {
        next('/');
      }
    },
  },
  {
    path: '/signin',
    name: 'Signin',
    component: Signin,
    beforeEnter(to, from, next) {
      if (store.getters.isAuthenticated) {
        next('/');
      } else {
        next();
      }
    },
  },
  {
    path: '/signout',
    name: 'Signout',
    beforeEnter(to, from, next) {
      if (store.getters.isAuthenticated) {
        store.commit('setJwtToken', { jwt: '' });
      }
      next('/');
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
