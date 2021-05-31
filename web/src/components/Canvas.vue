<template>
    <div id="canvas-div">
        <canvas class="sketch-canvas" id="canvas"></canvas>
    </div>
</template>

<script>
export default {
  mounted() {
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');

    const start = 0;
    const end = Math.PI * 2;

    let dragging = false;

    this.canvas.width = 1000;
    this.canvas.height = 600;

    const putPoint = (e) => {
      this.context.lineWidth = this.$store.state.size * 2;
      if (dragging) {
        this.context.lineTo(e.offsetX, e.offsetY);
        this.context.strokeStyle = this.$store.state.pen_color;
        this.context.stroke();
        this.context.beginPath();
        this.context.arc(e.offsetX, e.offsetY, this.$store.state.size, start, end);
        this.context.fillStyle = this.$store.state.pen_color;
        this.context.fill();
        this.context.beginPath();
        this.context.moveTo(e.offsetX, e.offsetY);
      }
    };

    const engage = (e) => {
      dragging = true;
      putPoint(e);
    };

    const disengage = () => {
      dragging = false;
      this.context.beginPath();
    };

    this.canvas.addEventListener('mousedown', engage);
    this.canvas.addEventListener('mousemove', putPoint);
    this.canvas.addEventListener('mouseup', disengage);
  },
};
</script>

<style>
    #canvas-div {
        padding: 2%;
    }

    .sketch-canvas {
        background-color: #EDF5E1;
        border: 2px solid #05386B;
        border-radius: 5px;
    }
</style>
