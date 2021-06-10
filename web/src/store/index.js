import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      pen_color: '#000000',
      size: 1,
      canvas_nodes: [],
    };
  },
  mutations: {
    updateColor(state, value) {
      state.pen_color = value;
    },
    updateSize(state, value) {
      state.size = value;
    },
    addCanvasNode(state, node) {
      state.canvas_nodes.push(node);
    },
    emptyCanvasNodes(state) {
      state.canvas_nodes.length = 0;
    },
  },
  actions: {},
  modules: {},
});
