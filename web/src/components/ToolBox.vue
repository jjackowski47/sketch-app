<template>
  <v-container>
    <v-col>
      <v-row>
        <label for="penColor" style="color: rgba(0, 0, 0, 0.6)">Color</label>
        <input type="color" name="penColor" id="penColor" v-model="color"
      /></v-row>
      <v-row style="max-width: 400px">
        <v-slider v-model="size" step="1" :min="1" :max="10" label="Size" ticks hide-details>
          <template v-slot:append>{{ size }}</template>
        </v-slider></v-row
      >
    </v-col>
  </v-container>
</template>

<script>
export default {
  computed: {
    color: {
      get() {
        return this.$store.state.penColor;
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

<style lang="scss" scoped>
#penColor {
  margin-left: 10px;
}
</style>
