import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const API_URL = 'http://localhost:5001';

function authenticate(userData) {
  return axios.post(`${API_URL}/signin`, userData, { withCredentials: true });
}

function register(userData) {
  return axios.post(`${API_URL}/signup`, userData, { withCredentials: true });
}

function getUserNotes(jwt) {
  return axios.get(`${API_URL}/notes`, { headers: { 'x-access-token': jwt } });
}

function addNote(jwt, noteData) {
  return axios.post(`${API_URL}/notes`, noteData, { headers: { 'x-access-token': jwt } });
}

function getNote(uuid) {
  return axios.get(`${API_URL}/notes/${uuid}`);
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
    activateCanvas: false,
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
    setCanvasNodes(state, value) {
      state.canvasNodes = value;
    },
    setUserData(state, payload) {
      state.userData = payload.userData;
    },
    setJwtToken(state, payload) {
      localStorage.token = payload.jwt;
      state.jwt = payload.jwt;
    },
    activateCanvas(state) {
      state.activateCanvas = true;
    },
    deactivateCanvas(state) {
      state.activateCanvas = false;
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
      return register(userData).then(
        setTimeout(() => {
          context.dispatch('login', userData);
        }, 1000)
      );
    },
    getNotes() {
      return getUserNotes(this.getters.jwt)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log('Error getting user notes: ', error);
        });
    },
    getNote(context, uuid) {
      return getNote(uuid)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log('Error getting note: ', error);
        });
    },
    keepNote(context, title) {
      let noteData = {
        title: title,
        content: JSON.stringify(this.getters.canvasNodes),
      };
      return addNote(this.getters.jwt, noteData)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log('Error saving note: ', error);
        });
    },
    setCanvasNodes(context, nodes) {
      let canvasNodes = JSON.parse(nodes);
      context.commit('setCanvasNodes', [...canvasNodes]);
    },
    activateCanvas(context) {
      context.commit('activateCanvas');
    },
    deactivateCanvas(context) {
      context.commit('deactivateCanvas');
    },
  },
  getters: {
    isAuthenticated(state) {
      return isValidJwt(state.jwt);
    },
    canvasNodes(state) {
      return state.canvasNodes;
    },
    nodesLength(state) {
      return state.canvasNodes.length;
    },
    activateCanvas(state) {
      return state.activateCanvas;
    },
    jwt(state) {
      return state.jwt;
    },
    userEmail(state) {
      if (!state.jwt || state.jwt.split('.').length < 3) {
        return '';
      }
      const data = JSON.parse(atob(state.jwt.split('.')[1]));
      return data.sub;
    },
  },
  modules: {},
});
