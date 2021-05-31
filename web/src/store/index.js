import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      pen_color: '#000000',
      size: 1,
    };
  },
  mutations: {
    updateColor(state, value) {
      state.pen_color = value;
    },
    updateSize(state, value) {
      state.size = value;
    },
  },
  actions: {},
  modules: {},
});
