<template>
  <div class="main">
    <div id="canvas-div">
      <canvas class="sketch-canvas" id="canvas"></canvas>
    </div>
    <v-item-group>
      <v-btn v-if="animationCaptured" @click="playAnimation" large class="green white--text mx-2"
        >Play</v-btn
      >
      <v-btn v-if="!animationCaptured" @click="saveAnimation" large class="green white--text mx-2"
        >Save</v-btn
      >
      <v-btn v-if="!animationCaptured" @click="clearCanvas" large class="green white--text mx-2"
        >Clear</v-btn
      >
      <TitleDialog v-if="animationCaptured && isAuthenticated" />
      <v-menu bottom offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            large
            class="green white--text mx-2"
            :disabled="!animationCaptured"
          >
            Download
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, i) in items" :key="i" @click="item.handler">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn @click="reset" large class="green white--text mx-2">Reset</v-btn>
    </v-item-group>
    <v-slider
      v-if="animating || animationCaptured"
      v-model="t"
      :max="nodesLength - 1"
      @input="updateCanvasState"
      :readonly="!animationCaptured"
      color="green darken-1"
      track-color="green lighten-3"
    >
      <template v-slot:append>{{ progress }}</template>
    </v-slider>
  </div>
</template>

<script>
import { putPointOnCanvas, fillCanvas, initAnimationFrame, downloadFile } from '../utils/index.js';
import TitleDialog from './TitleDialog.vue';

const initialState = () => {
  return {
    t: 0,
    context: null,
    canvas: null,
    points: [],
    dragging: false,
    recordedBlobs: [],
    mediaRecorder: null,
    stream: null,
    animationCaptured: false,
    animating: false,
  };
};
export default {
  data() {
    return initialState();
  },
  components: {
    TitleDialog,
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    nodesLength() {
      return this.$store.getters.nodesLength;
    },
    progress() {
      return Math.floor((this.t / (this.points.length - 1)) * 100) + '%';
    },
    items() {
      return [
        {
          title: 'MP4',
          handler: this.downloadMP4,
        },
        {
          title: 'webm',
          handler: this.downloadWebm,
        },
        {
          title: 'nodes JSON file',
          handler: this.downloadNodes,
        },
      ];
    },
  },
  methods: {
    putPoint(e) {
      if (!this.animationCaptured && !this.animating) {
        this.context.lineWidth = this.$store.state.size * 2;
        if (this.dragging) {
          putPointOnCanvas(
            this.context,
            e.offsetX,
            e.offsetY,
            this.$store.state.penColor,
            this.$store.state.size
          );
          this.$store.commit('addCanvasNode', {
            x: e.offsetX,
            y: e.offsetY,
            action: 'lineTo',
            lineWidth: this.$store.state.size,
            color: this.$store.state.penColor,
          });
        }
      }
    },
    engage(e) {
      if (!this.animationCaptured && !this.animating) {
        this.dragging = true;
        this.context.beginPath();
        this.context.moveTo(e.offsetX, e.offsetY);
        this.$store.commit('addCanvasNode', {
          x: e.offsetX,
          y: e.offsetY,
          action: 'moveTo',
        });
        this.putPoint(e);
      }
    },
    disengage() {
      if (!this.animationCaptured && !this.animating) {
        this.dragging = false;
        this.context.beginPath();
      }
    },
    animate() {
      if (this.t < this.points.length - 1) {
        this.animating = true;
        requestAnimationFrame(this.animate);
      } else {
        this.animating = false;
        if (this.mediaRecorder.state == 'recording') {
          this.stopRecording();
          this.animationCaptured = true;
        }
      }
      if (this.points.length > 0) {
        let node = this.points[this.t];
        this.context.lineWidth = 2 * node.lineWidth;
        if (node.action === 'lineTo') {
          putPointOnCanvas(this.context, node.x, node.y, node.color, node.lineWidth);
        } else if (node.action === 'moveTo') {
          this.context.beginPath();
          this.context.moveTo(node.x, node.y);
        } else if (node.action === 'clearCanvas') {
          fillCanvas(this.context, this.canvas.width, this.canvas.height, 'white');
        }

        this.t += 1;
      }
    },
    saveAnimation() {
      this.startRecording();
      this.playAnimation();
    },
    playAnimation() {
      this.updateCanvasState();
      if (!this.animating) {
        this.animate();
      }
    },

    reset() {
      if (this.animating) {
        this.stopRecording();
      }
      Object.assign(this.$data, initialState());
      this.canvas = document.getElementById('canvas');
      this.context = this.canvas.getContext('2d');
      this.stream = this.canvas.captureStream(60);
      this.$store.commit('emptyCanvasNodes');
      fillCanvas(this.context, this.canvas.width, this.canvas.height, 'white');
    },
    startRecording() {
      let options = { mimeType: 'video/webm' };
      this.recordedBlobs = [];
      this.animationCaptured = false;
      try {
        this.mediaRecorder = new MediaRecorder(this.stream, options);
      } catch (e0) {
        console.log('Unable to create MediaRecorder with options Object: ', e0);
        try {
          options = { mimeType: 'video/webm,codecs=vp9' };
          this.mediaRecorder = new MediaRecorder(this.stream, options);
        } catch (e1) {
          console.log('Unable to create MediaRecorder with options Object: ', e1);
          try {
            options = 'video/vp8';
            this.mediaRecorder = new MediaRecorder(this.stream, options);
          } catch (e2) {
            alert(
              'MediaRecorder is not supported by this browser.\n\n' +
                'Try Firefox 29 or later, or Chrome 47 or later, ' +
                'with Enable experimental Web Platform features enabled from chrome://flags.'
            );
            console.error('Exception while creating MediaRecorder:', e2);
            return;
          }
        }
      }
      console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);
      this.mediaRecorder.onstop = this.handleStop;
      this.mediaRecorder.ondataavailable = this.handleDataAvailable;
      this.mediaRecorder.start(50);
      console.log('MediaRecorder started', this.mediaRecorder);
    },
    stopRecording() {
      this.mediaRecorder.stop();
      console.log('Recorded Blobs: ', this.recordedBlobs);
    },
    handleDataAvailable(event) {
      if (event.data && event.data.size > 0) {
        this.recordedBlobs.push(event.data);
      }
    },
    handleStop(event) {
      console.log('Recorder stopped: ', event);
    },
    downloadMP4() {
      downloadFile(this.recordedBlobs, 'test.mp4', 'video/mp4');
    },
    downloadWebm() {
      downloadFile(this.recordedBlobs, 'test.webm', 'video/webm');
    },
    downloadNodes() {
      var data = [JSON.stringify(this.$store.state.canvasNodes)];
      downloadFile(data, 'test.txt', 'text/plain'); // data to store
    },
    clearCanvas() {
      fillCanvas(this.context, this.canvas.width, this.canvas.height, 'white');
      this.$store.commit('addCanvasNode', {
        x: 0,
        y: 0,
        action: 'clearCanvas',
        lineWidth: this.$store.state.size,
        color: this.$store.state.penColor,
      });
    },
    updateCanvasState() {
      fillCanvas(this.context, this.canvas.width, this.canvas.height, 'white');
      this.points = [...this.$store.state.canvasNodes];
      if (this.nodesLength > 0) {
        this.context.moveTo(this.points[this.t].x, this.points[this.t].y);
      }
      if (this.points.length > 0) {
        for (let i = 0; i < this.t; i++) {
          let node = this.points[i];
          this.context.lineWidth = 2 * node.lineWidth;
          if (node.action === 'lineTo') {
            putPointOnCanvas(this.context, node.x, node.y, node.color, node.lineWidth);
          } else if (node.action === 'moveTo') {
            this.context.beginPath();
            this.context.moveTo(node.x, node.y);
          } else if (node.action === 'clearCanvas') {
            fillCanvas(this.context, this.canvas.width, this.canvas.height, 'white');
          }
        }
      }
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
    this.stream = this.canvas.captureStream(60);

    initAnimationFrame();

    if (this.$store.getters.activateCanvas) {
      this.saveAnimation();
      this.$store.dispatch('deactivateCanvas');
    }
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
