<template>
  <div id="app">
    <!-- <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive> -->
    <router-view />
    <bottomNav class="bottomNav"></bottomNav>
  </div>
</template>

<script>
/* eslint-disable */
import bottomNav from "./bottomNav";

export default {
  name: "App",
  components: {
    bottomNav
  }
};
</script>

<style lang="scss" type="text/css" scoped="">
body {
  margin: 0px;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
.bottomNav {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
