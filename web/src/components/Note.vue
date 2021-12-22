<script>
export default {
  data() {
    return {};
  },
  methods: {
    showNoteOnCanvas(nodes) {
      this.$store.dispatch('setCanvasNodes', nodes);
      this.$router.push('/', this.emitRunAnimation);
    },
    emitRunAnimation() {
      this.$store.dispatch('activateCanvas');
    },
  },
  mounted() {
    this.$store.dispatch('getNote', this.uuid).then((nodes) => {
      this.showNoteOnCanvas(nodes);
    });
  },
  props: {
    uuid: {
      type: String,
      default: '',
    },
  },
};
</script>

<style></style>
