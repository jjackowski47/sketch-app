<template>
  <v-dialog v-model="dialog" persistent max-width="290">
    <template v-slot:activator="{ on, attrs }">
      <v-btn large class="green white--text mx-2" v-bind="attrs" v-on="on"> Keep </v-btn>
    </template>
    <v-card>
      <v-card-title class="text-h5"> Title your note </v-card-title>
      <v-card-text>
        <v-text-field label="Title*" type="text" v-model="title" required></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="keepNote" text> Save </v-btn>
        <v-btn color="green darken-1" @click="dialog = false" text> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      dialog: false,
    };
  },
  methods: {
    keepNote() {
      if (this.title != '') {
        this.dialog = false;
        this.$store.dispatch('keepNote', this.title);
      }
    },
  },
};
</script>

<style></style>
