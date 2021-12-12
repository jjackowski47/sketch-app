<template>
  <div class="dashboard">
    <h1>Your files</h1>
    <v-container fluid>
      <v-row dense style="display: flex; flex-wrap: wrap">
        <v-col v-for="card in cards" :key="card.title" class="col-3">
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

              <v-btn icon>
                <v-icon>mdi-download</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    cards: [
      {
        id: 1,
        title: 'Test_1',
        src: './2.png',
      },
      { id: 2, title: 'Test_2', src: './2.png' },
      { id: 3, title: 'Test_3', src: './2.png' },
      { id: 4, title: 'Test_4', src: './2.png' },
      { id: 5, title: 'Test_5', src: './2.png' },
      { id: 6, title: 'Test_6', src: './2.png' },
      { id: 7, title: 'Test_7', src: './2.png' },
      { id: 8, title: 'Test_8', src: './2.png' },
      { id: 9, title: 'Test_9', src: './2.png' },
    ],
  }),
  name: 'Dashboard',
};
</script>
