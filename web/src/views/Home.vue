<template>
  <div class="home">
    <v-container fluid>
      <v-row align-center align-content-center justify-center>
        <v-col class="col-lg-2 col-md-12">
          <ToolBox />
        </v-col>
        <v-col class="col-lg-10 col-md-12">
          <Canvas />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Canvas from '../components/Canvas.vue';
import ToolBox from '../components/ToolBox.vue';

export default {
  name: 'Home',

  components: {
    Canvas,
    ToolBox,
  },
};
</script>

<style scoped>
.home {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
</style>
