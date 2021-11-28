import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    penColor: "#000000",
    size: 1,
    canvasNodes: [],
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
  },
  actions: {},
  modules: {},
});
