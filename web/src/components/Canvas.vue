<template>
  <div class="main">
    <div id="canvas-div">
      <canvas class="sketch-canvas" id="canvas"></canvas>
    </div>
    <v-item-group>
      <v-btn @click="playAnimation" large class="green white--text mr-4">Play</v-btn>
      <v-btn @click="clearCanvas" large class="green white--text">Clear</v-btn>
    </v-item-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      t: 1,
      context: null,
      canvas: null,
      points: [],
      dragging: false,
    };
  },
  methods: {
    initAnimationFrame() {
      let lastTime = 0;
      const vendors = ['ms', 'moz', 'webkit', 'o'];
      for (let x = 0; x < vendors.length && !window.requestAnimationFrame; x += 1) {
        window.requestAnimationFrame = window[`${vendors[x]}RequestAnimationFrame`];
        window.cancelAnimationFrame =
          window[`${vendors[x]}CancelAnimationFrame`] ||
          window[`${vendors[x]}CancelRequestAnimationFrame`];
      }

      if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (callback) => {
          const currTime = new Date().getTime();
          const timeToCall = Math.max(0, 16 - (currTime - lastTime));
          const id = window.setTimeout(() => {
            callback(currTime + timeToCall);
          }, timeToCall);
          lastTime = currTime + timeToCall;
          return id;
        };
      }

      if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = (id) => {
          clearTimeout(id);
        };
      }
    },
    putPoint(e) {
      this.context.lineWidth = this.$store.state.size * 2;
      if (this.dragging) {
        this.context.lineTo(e.offsetX, e.offsetY);
        this.context.strokeStyle = this.$store.state.penColor;
        this.context.stroke();
        this.context.beginPath();
        this.context.arc(e.offsetX, e.offsetY, this.$store.state.size, 0, Math.PI * 2);
        this.context.fillStyle = this.$store.state.penColor;
        this.context.fill();
        this.context.beginPath();
        this.context.moveTo(e.offsetX, e.offsetY);
        this.$store.commit('addCanvasNode', {
          x: e.offsetX,
          y: e.offsetY,
          action: 'lineTo',
          lineWidth: this.$store.state.size,
          color: this.$store.state.penColor,
        });
      }
    },
    engage(e) {
      if (this.$store.state.canvasNodes.length === 0) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      this.dragging = true;
      this.context.beginPath();
      this.context.moveTo(e.offsetX, e.offsetY);
      this.$store.commit('addCanvasNode', {
        x: e.offsetX,
        y: e.offsetY,
        action: 'moveTo',
      });
      this.putPoint(e);
    },
    disengage() {
      this.dragging = false;
      this.context.beginPath();
    },
    animate() {
      if (this.t < this.points.length - 1) {
        requestAnimationFrame(this.animate);
      }
      if (this.points.length > 0) {
        this.context.lineWidth = 2 * this.points[this.t].lineWidth;
        if (this.points[this.t].action === 'lineTo') {
          this.context.lineTo(this.points[this.t].x, this.points[this.t].y);
          this.context.strokeStyle = this.points[this.t].color;
          this.context.stroke();

          this.context.beginPath();
          this.context.arc(
            this.points[this.t].x,
            this.points[this.t].y,
            this.points[this.t].lineWidth,
            0,
            Math.PI * 2
          );
          this.context.fillStyle = this.points[this.t].color;
          this.context.fill();

          this.context.beginPath();
          this.context.moveTo(this.points[this.t].x, this.points[this.t].y);
        } else if (this.points[this.t].action === 'moveTo') {
          this.context.beginPath();
          this.context.moveTo(this.points[this.t].x, this.points[this.t].y);
        } else if (this.points[this.t].action === 'clearCanvas') {
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        this.t += 1;
      }
    },
    playAnimation() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.t = 1;
      this.points = [...this.$store.state.canvasNodes];
      this.animate();
      this.$store.commit('emptyCanvasNodes');
    },
    clearCanvas() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.$store.commit('addCanvasNode', {
        x: 0,
        y: 0,
        action: 'clearCanvas',
        lineWidth: this.$store.state.size,
        color: this.$store.state.penColor,
      });
    },
  },
  mounted() {
    this.canvas = document.getElementById('canvas');
    this.canvas.width = 900;
    this.canvas.height = 650;
    this.canvas.addEventListener('mousedown', this.engage);
    this.canvas.addEventListener('mousemove', this.putPoint);
    this.canvas.addEventListener('mouseup', this.disengage);

    this.context = this.canvas.getContext('2d');

    this.initAnimationFrame();
  },
};
</script>

<style lang="scss" scoped>
#canvas-div {
  padding: 2%;
}

.sketch-canvas {
  background-color: #ffffff;
  border: 2px solid #05386b;
}
</style>
