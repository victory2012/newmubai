<template>
  <div class="main">
    <div class="headNav">
      <mt-header class="Loginhead" title="告警事件">
        <router-link to="/index" slot="left">
          <mt-button icon=""></mt-button>
        </router-link>
        <mt-button icon="" slot="right"></mt-button>
      </mt-header>
    </div>
    <warningList></warningList>

  </div>
</template>

<script>
// import warningList from "./warningList";
export default {
  name: "warning",
  components: {
    warningList: () => import("./warningList")
  },
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped="" >
.Loginhead {
  background: #484848;
}
nav {
  height: 30px;
  padding: 3px;
  background: #484848;
  width: 100%;
  color: #cccccc;
  font-size: 11px;
  position: relative;
}

.headNav {
  position: fixed;
  width: 100%;
  z-index: 999;
}
.main {
  overflow: hidden;
  padding-bottom: 50px;
  width: 100%;
}
</style>
