<template>
  <div class="dashboard">
    <h1>Your files</h1>
    <v-progress-circular
      :width="10"
      :size="100"
      position-y="center"
      color="green"
      v-if="loading"
      class="justify-center align-center align-self-center"
      indeterminate
    ></v-progress-circular>
    <v-container v-if="cards" fluid>
      <v-row dense style="display: flex; flex-wrap: wrap">
        <v-col v-for="(card, i) in cards" :key="i" class="col-3">
          <v-card>
            <v-img
              :src="card.src"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="200px"
            >
              <v-card-title v-text="card.title"></v-card-title>
            </v-img>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn icon @click="download(card.content)">
                <v-icon>mdi-download</v-icon>
              </v-btn>
              <v-dialog v-model="dialog" persistent max-width="900">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-share-variant</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="text-h5"> Share your note with this link! </v-card-title>
                  <v-card-text>
                    <a :href="'http://localhost:8080/notes/' + card.share_uuid">
                      {{ 'http://localhost:8080/notes/' + card.share_uuid }}
                    </a>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" @click="dialog = false" text> Close </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      cards: null,
      loading: true,
      dialog: false,
    };
  },
  methods: {
    goto(url) {
      window.open(url);
    },
    getNotes() {
      this.$store.dispatch('getNotes').then((data) => {
        this.loading = false;
        this.cards = data;
      });
    },
    download(nodes) {
      this.$store.dispatch('setCanvasNodes', nodes);
      this.$router.push('/', this.emitRunAnimation);
    },
    emitRunAnimation() {
      this.$store.dispatch('activateCanvas');
    },
  },
  created() {
    this.getNotes();
  },
};
</script>

<style scoped>
.dashboard {
  width: 100%;
}
</style>
