<template>
  <div v-show="visibility" class="bottomNav">
    <mt-tabbar v-model="selected">
      <mt-tab-item id="index" @click.native="toIndex">
        <img class="navIcon" slot="" src="../static/fffff.png">
        <div>电池信息</div>
      </mt-tab-item>
      <mt-tab-item id="warning" @click.native="toWarning">
        <img class="navIcon" slot="" src="../static/fffff.png">
        <div>告警事件</div>
      </mt-tab-item>
      <mt-tab-item id="person" @click.native="toPerson">
        <img class="navIcon" slot="" src="../static/fffff.png">
        <div>个人信息</div>
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visibility: true,
      selected: ""
    };
  },
  methods: {
    //改变底部导航是否可见
    toIndex() {
      this.$router.push("/index");
    },
    toWarning() {
      this.$router.push("/warning");
    },
    toPerson() {
      this.$router.push("/person");
    },
    changeVisible() {
      this.visibility = false;
      let options = this.$router.options.routes;
      let currentRoute = this.$route.path;
      options.forEach(item => {
        if (item.path === currentRoute) {
          this.selected = item.routeSets.bottomId;
          this.visibility = item.routeSets.bottomNavVisible;
        }
      });
    }
  },
  watch: {
    $route: function() {
      this.changeVisible();
    }
  },
  // mounted() {
  //   this.changeVisible()
  // },
  activated() {
    this.changeVisible();
  }
};
</script>

<style scoped>
.navIcon {
  width: 25px;
  height: 25px;
}
.mint-tabbar a:nth-child(1) img {
  background: url("../static/index2.svg");
}
.mint-tabbar a:nth-child(2) img {
  background: url("../static/warning2.svg");
}
.mint-tabbar a:nth-child(3) img {
  background: url("../static/person2.svg");
}

.mint-tabbar a:nth-child(1).is-selected .navIcon {
  background: url("../static/index1.svg");
}
.mint-tabbar a:nth-child(2).is-selected .navIcon {
  background: url("../static/warning1.svg");
}
.mint-tabbar a:nth-child(3).is-selected .navIcon {
  background: url("../static/person1.svg");
}
.mint-tabbar > .mint-tab-item.is-selected {
  color: #71bfdb;
  background: #fff;
}
</style>
