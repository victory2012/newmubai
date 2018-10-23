<template>
  <div class="main">
    <div class="headNav">
      <mt-header class="Loginhead" title="个人信息">
        <router-link v-show="!isAddPt" to="/index" slot="left">
          <mt-button icon=""></mt-button>
        </router-link>
        <mt-button icon="" slot="left" @click="doCancelSaveData" v-show="isAddPt">取消</mt-button>
        <mt-button icon="" slot="right" @click="doSaveData" v-show="isAddPt">保存</mt-button>
        <mt-button icon="" slot="right" @click="editBattery" v-show="!isAddPt">编辑</mt-button>
      </mt-header>
    </div>
    <ul>
      <li>
        <div class="fl">用户名</div>
        <div v-show="!isAddPt" class="fr">{{userArr.nickName}}</div>
        <div v-show="isAddPt" class="fr itmeValue">
          <input type="text" placeholder="请输入额定电压" v-model="userArr.nickName">
        </div>
      </li>
      <li>
        <div class="fl">账户身份</div>
        <div :class="{'colorGray': isAddPt}" class="fr">{{userArr.accountType}}</div>
      </li>
      <li>
        <div class="fl">企业身份</div>
        <div :class="{'colorGray': isAddPt}" class="fr">{{userArr.layerName}}</div>
      </li>
      <li>
        <div class="fl">企业名称</div>
        <div :class="{'colorGray': isAddPt}" class="fr">{{userArr.companyName}}</div>

      </li>
      <li>
        <div class="fl">手机号码</div>
        <div v-show="!isAddPt" class="fr">{{userArr.phone}}</div>
        <div v-show="isAddPt" class="fr itmeValue">
          <input type="text" v-model="userArr.phone">
        </div>
      </li>
      <li>
        <div class="fl">邮箱</div>
        <div v-show="!isAddPt" class="fr">{{userArr.email}}</div>
        <div v-show="isAddPt" class="fr itmeValue">
          <input type="text" v-model="userArr.email">
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { Toast, Indicator } from "mint-ui";
import utils from "@/utils/utils";
export default {
  name: "warning",
  data() {
    return {
      userArr: "",
      isAddPt: false
    };
  },
  methods: {
    doCancelSaveData() {
      this.isAddPt = false;
      this.getSelf();
    },
    doSaveData() {
      const phone = /^[1][3,4,5,7,8][0-9]{9}$/;
      const email = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      console.log(this.userArr);
      // if(this.userArr.phone) {
      //   Toast('手机号不能为空');
      // }
      if (!phone.test(this.userArr.phone)) {
        Toast("手机号格式有误");
        return;
      }
      if (this.userArr.email && !email.test(this.userArr.email)) {
        Toast("邮箱格式有误");
        return;
      }
      let userObj = {};
      userObj.phone = this.userArr.phone;
      userObj.nickName = this.userArr.nickName;
      userObj.email = this.userArr.email;
      Indicator.open();
      this.$axios.put("user/info", userObj).then(res => {
        console.log(res);
        Indicator.close();
        if (res.data && res.data.code === 0) {
          Toast("修改成功");
          this.doCancelSaveData();
        }
      });
    },
    editBattery() {
      this.isAddPt = true;
    },
    getSelf() {
      Indicator.open();
      this.$axios.get("/user/current").then(res => {
        console.log(res);
        Indicator.close();
        if (res.data && res.data.code === 0) {
          this.userArr = res.data.data;
          this.userArr.accountType = utils.accountType(this.userArr.type);
          this.userArr.email = res.data.data.email || "暂无";
          // this.InfoForm.email = this.userArr.email;
          // this.InfoForm.phones = res.data.data.phone;
          // this.InfoForm.userName = res.data.data.nickName;
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
.colorGray {
  color: gray;
}
.itmeValue {
  color: #333333;
  text-align: right;
  // border-bottom: 1px solid #e5e5e5;
  // .downIcon {
  //   vertical-align: middle;
  //   width: 16px;
  //   margin: 0 10px;
  // }
  // span {
  //   display: inline-block;
  //   width: 140px;
  // }
  input {
    height: 28px;
    width: 100%;
    border: none;
    text-align: right;
    // border-bottom: 1px solid #e5e5e5;
    vertical-align: middle;
  }
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
    height: 34px;
    line-height: 34px;
    margin-top: 10px;
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
