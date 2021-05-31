<template>
  <div class='toolbox'>
    <div class='toolbox-item'>
        <label for="pen_color">Color</label>
        <input type="color" name="pen_color" id="pen_color" v-model="color">
    </div>
    <div class='toolbox-item'>
        <label for="size">Size</label>
        <input type="range" id="size" name="size"
                min="1" max="10" v-model="size" step="1">
        {{size}}
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    color: {
      get() {
        return this.$store.state.pen_color;
      },
      set(value) {
        this.$store.commit('updateColor', value);
      },
    },
    size: {
      get() {
        return this.$store.state.size;
      },
      set(value) {
        this.$store.commit('updateSize', value);
      },
    },
  },

};
</script>

<style lang='scss' scoped>
.toolbox {
  display: flex;
  justify-content: center;

  .toolbox-item {
    padding: 1em;
    label {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      font-weight: 600;
      padding: 1em;
    }
  }
}

</style>
