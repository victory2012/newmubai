<template>
  <div class="main">
    <div class="headNav">
      <mt-header class="Loginhead" title="个人信息">
        <router-link to="/index" slot="left">
          <mt-button icon=""></mt-button>
        </router-link>
        <mt-button icon="" slot="right"></mt-button>
      </mt-header>
    </div>
    <ul>
      <li>
        <div class="fl">用户名</div>
        <div class="fr">{{userArr.nickName}}</div>
      </li>
      <li>
        <div class="fl">账户身份</div>
        <div class="fr">{{userArr.accountType}}</div>
      </li>
      <li>
        <div class="fl">企业身份</div>
        <div class="fr">{{userArr.layerName}}</div>
      </li>
      <li>
        <div class="fl">企业名称</div>
        <div class="fr">{{userArr.companyName}}</div>
      </li>
      <li>
        <div class="fl">手机号码</div>
        <div class="fr">{{userArr.phone}}</div>
      </li>
      <li>
        <div class="fl">邮箱</div>
        <div class="fr">{{userArr.email}}</div>
      </li>
    </ul>
    <div class="unbindWarrp">
      <mt-button size="large" type="primary" @click="unbindWX">微信解绑</mt-button>
    </div>
    <!-- <button @click="unbindWX">微信解绑</button> -->
  </div>
</template>

<script>
import { Toast, Indicator } from "mint-ui";
import utils from "@/utils/utils";
export default {
  name: "warning",
  data() {
    return {
      userArr: ""
    };
  },
  methods: {
    unbindWX() {
      Indicator.open();
      this.$axios.put("/user/unbind_wx").then(res => {
        Indicator.close();
        if (res.data && res.data.code === 0) {
          Toast("解绑成功");
          setTimeout(() => {
            window.location.href = "#/login";
            sessionStorage.clear();
          }, 1000);
        }
      });
    },
    getSelf() {
      this.$axios.get("/user/current").then(res => {
        console.log(res);
        if (res.data && res.data.code === 0) {
          this.userArr = res.data.data;
          this.userArr.accountType = utils.accountType(this.userArr.type);
          this.userArr.email = res.data.data.email || "暂无";
          // this.InfoForm.email = this.userArr.email;
          // this.InfoForm.phones = res.data.data.phone;
          // this.InfoForm.userName = res.data.data.nickName;
          console.log(this.userArr);
        }
      });
    }
  },
  mounted() {
    this.getSelf();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped="" lang="scss">
.unbindWarrp {
  padding: 0 20px;
  margin: 30px;
}
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
  background: #f2f2f2;
  min-height: 100%;
}
ul {
  margin-top: 50px;
  background: #fff;
  padding: 0 20px 20px;
  overflow: hidden;
  li {
    height: 20px;
    line-height: 20px;
    margin-top: 20px;
  }
  .fl {
    float: left;
    color: #a0a0a0;
  }
  .fr {
    float: right;
  }
}
</style>
