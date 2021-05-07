<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <router-view/>
</template>

<style lang="scss">
* {
  margin: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #05386B;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #5CDB95;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    font-size: 24px;
    color: #05386B;
    text-decoration: none;

    &.router-link-exact-active {
      color: #EDF5E1;
    }
  }
}
</style>
