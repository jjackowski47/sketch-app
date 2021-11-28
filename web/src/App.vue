<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" absolute temporary class="d-xl-none">
      <v-list nav dense>
        <v-list-item-group v-model="group" active-class="green--text text--accent-4">
          <v-list-item v-for="item in navItems" :key="item.id" :to="item.path">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app dense dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <v-app-bar-title>DESCRIBBLE</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-item-group v-for="item in navItems" :key="item.id" class="d-none d-md-flex">
        <v-btn :to="item.path" tile active-class="green--text text--lighten-2">{{
          item.title
        }}</v-btn>
      </v-item-group>
    </v-app-bar>
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid class="main-container">
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-footer app dark>
      <p class="ma-1 text-overline text-center">© 2021 Jakub Jackowski</p>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    userLogged: false,
    drawer: false,
    group: 1,
    navItems: [
      { id: 1, title: 'Home', path: '/', icon: 'mdi-home-outline' },
      {
        id: 2,
        title: 'About',
        path: '/about',
        icon: 'mdi-information-outline',
      },
      {
        id: 3,
        title: 'Sign Up',
        path: '/signup',
        icon: 'mdi-account-plus-outline',
      },
      { id: 4, title: 'Sign In', path: '/signin', icon: 'mdi-login' },
    ],
  }),
};
</script>

<style lang="scss">
* {
  margin: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

.main-container {
  min-height: 100%;
  display: flex;
  justify-content: center;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #05386b;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #efefef;
}

#nav {
  a {
    font-weight: bold;
    font-size: 24px;
    color: #05386b;
    text-decoration: none;

    &.router-link-exact-active {
      color: #edf5e1;
    }
  }
}
</style>
