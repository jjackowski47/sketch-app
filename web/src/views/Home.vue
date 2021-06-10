<template>
  <div class="home">
    <h1>Draw quick sketch note, then press Play to see animation!</h1>
    <Canvas />
    <ToolBox />
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
