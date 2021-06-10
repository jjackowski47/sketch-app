<template>
    <div id="canvas-div">
        <canvas class="sketch-canvas" id="canvas"></canvas>
    </div>
    <div class="play-btn-div">
      <button class='play-btn' @click="playAnimation">Play</button>
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
        window.cancelAnimationFrame = window[`${vendors[x]}CancelAnimationFrame`] || window[`${vendors[x]}CancelRequestAnimationFrame`];
      }

      if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (callback) => {
          const currTime = new Date().getTime();
          const timeToCall = Math.max(0, 16 - (currTime - lastTime));
          const id = window.setTimeout(() => {
            callback(currTime + timeToCall);
          },
          timeToCall);
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
        this.context.strokeStyle = this.$store.state.pen_color;
        this.context.stroke();
        this.context.beginPath();
        this.context.arc(e.offsetX, e.offsetY, this.$store.state.size, 0, Math.PI * 2);
        this.context.fillStyle = this.$store.state.pen_color;
        this.context.fill();
        this.context.beginPath();
        this.context.moveTo(e.offsetX, e.offsetY);
        this.$store.commit('addCanvasNode', {
          x: e.offsetX, y: e.offsetY, action: 'lineTo', lineWidth: this.$store.state.size, color: this.$store.state.pen_color,
        });
      }
    },
    engage(e) {
      if (this.$store.state.canvas_nodes.length === 0) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      this.dragging = true;
      this.context.beginPath();
      this.context.moveTo(e.offsetX, e.offsetY);
      this.$store.commit('addCanvasNode', { x: e.offsetX, y: e.offsetY, action: 'moveTo' });
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
          this.context.lineTo(this.points[this.t].x,
            this.points[this.t].y);
          this.context.strokeStyle = this.points[this.t].color;
          this.context.stroke();

          this.context.beginPath();
          this.context.arc(this.points[this.t].x,
            this.points[this.t].y, this.points[this.t].lineWidth, 0, Math.PI * 2);
          this.context.fillStyle = this.points[this.t].color;
          this.context.fill();

          this.context.beginPath();
          this.context.moveTo(this.points[this.t].x,
            this.points[this.t].y);
        } else if (this.points[this.t].action === 'moveTo') {
          this.context.beginPath();
          this.context.moveTo(this.points[this.t].x,
            this.points[this.t].y);
        }

        this.t += 1;
      }
    },
    playAnimation() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.t = 1;
      this.points = [...this.$store.state.canvas_nodes];
      this.animate();
      this.$store.commit('emptyCanvasNodes');
    },
  },
  mounted() {
    this.canvas = document.getElementById('canvas');
    this.canvas.width = 1000;
    this.canvas.height = 600;
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
        background-color: #EDF5E1;
        border: 2px solid #05386B;
        border-radius: 5px;
    }

    .play-btn {
        color: #05386B;
        background-color: #EDF5E1;
        border: 2px solid #05386B;
        border-radius: 15px;
        width: 150px;
        height: 50px;
        font-size: 20px;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        font-weight: 700;
        transition: 1s;

        &:hover {
          background-color: #0d68c4;
          color: #EDF5E1;
          transition: 1s;
        }
    }
</style>
