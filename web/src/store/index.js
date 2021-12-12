import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueCookies from 'vue-cookies';
Vue.use(Vuex);

Vue.use(VueCookies);

const API_URL = 'http://localhost:5001';

function authenticate(userData) {
  return axios.post(`${API_URL}/signin`, userData, { withCredentials: true });
}

function register(userData) {
  return axios.post(`${API_URL}/register`, userData);
}

function isValidJwt(jwt) {
  if (!jwt || jwt.split('.').length < 3) {
    return false;
  }
  const data = JSON.parse(atob(jwt.split('.')[1]));
  const exp = new Date(data.exp * 1000);
  const now = new Date();
  return now < exp;
}

export default new Vuex.Store({
  state: {
    penColor: '#000000',
    size: 1,
    canvasNodes: [],
    user: {},
    jwt: '',
  },
  mutations: {
    updateColor(state, value) {
      state.penColor = value;
    },
    updateSize(state, value) {
      state.size = value;
    },
    addCanvasNode(state, node) {
      state.canvasNodes.push(node);
    },
    emptyCanvasNodes(state) {
      state.canvasNodes.length = 0;
    },
    setUserData(state, payload) {
      state.userData = payload.userData;
    },
    setJwtToken(state, payload) {
      localStorage.token = payload.jwt;
      state.jwt = payload.jwt;
    },
  },
  actions: {
    login(context, userData) {
      context.commit('setUserData', { userData });
      return authenticate(userData).then((response) => {
        context.commit('setJwtToken', { jwt: response.data });
        return response.data;
      });
    },
    register(context, userData) {
      context.commit('setUserData', { userData });
      return register(userData)
        .then(context.dispatch('login', userData))
        .catch((error) => {
          console.log('Error Registering: ', error);
          context.$emit('failedRegistering: ', error);
        });
    },
  },
  getters: {
  actions: {},
    isAuthenticated(state) {
      return isValidJwt(state.jwt);
    },
    nodesLength(state) {
      return state.canvasNodes.length;
    },
  },
  modules: {},
});
