<template>
  <div class="home">
    <Canvas />
  </div>
</template>

<script>
import Canvas from '../components/Canvas.vue';

export default {
  name: 'Home',
  components: {
    Canvas,
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
