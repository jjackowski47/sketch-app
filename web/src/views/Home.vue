<template>
  <div class="home">
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
