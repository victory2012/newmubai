<template>
  <div class="login-content">
    <mt-header class="Loginhead"
      :title="$t('loginMsg.bindLogin')">
      <router-link to="/"
        slot="left">
        <mt-button icon="back">{{$t('loginMsg.back')}}</mt-button>
      </router-link>
      <mt-button icon="more"
        slot=""></mt-button>
    </mt-header>
    <p class="Logintitle">{{$t('loginMsg.bindLogin')}}</p>
    <div class="iptPhone">
      <img src="../../../static/phone.svg"
        class="icon"
        alt="">
      <mt-field class="phone"
        label=""
        :placeholder="$t('loginMsg.phone')"
        type="tel"
        v-model="phone"></mt-field>
    </div>
    <div class="iptYzm">
      <img src="../../../static/yanzheng.svg"
        class="icon"
        alt="">

      <mt-field class="yzm"
        label=""
        :placeholder="$t('loginMsg.smsCode')"
        v-model="captcha"></mt-field>
      <div class="VerButton"
        @click="getSmsCode"
        type="primary">{{smsMsg}}</div>
    </div>
    <mt-button @click="login"
      class="Loginbutton"
      type="primary">{{$t('loginMsg.loginBtn')}}</mt-button>
    <mt-button @click="testlogin"
      class="Loginbutton"
      type="primary">登录</mt-button>
  </div>
</template>

<script>
import utils from "@/utils/utils";
import { Toast } from "mint-ui";
import isWeixin from "@/utils/checkBrowser";
import t from "@/utils/translate";

// const AppId = "wxee1c1e26121022f2";
export default {
  name: "Login",
  data () {
    return {
      phone: "",
      captcha: "",
      smsMsg: t('loginMsg.getSmsCode'), // "获取验证码",
      openid: "",
      setDown: "",
      wechatCode: "",
      wechatState: "",
      cookieUserInfo: "",
      code: "",
      hasGetSms: false
    };
  },
  mounted () {
    this.openid = this.$route.query.openid;
  },
  methods: {
    getSmsCode () {
      if (this.hasGetSms) {
        // Toast("操作过于频繁");
        return;
      }
      if (/^1[3|4|5|7|8][0-9]\d{8}$/.test(this.phone)) {
        let conut = 60;
        this.$axios.post("/login/sms/send", { phone: this.phone }).then(res => {
          console.log(res);
          if (res.data && res.data.code === 0) {
            this.hasGetSms = true;
            let Timer = setInterval(() => {
              conut--;
              this.smsMsg = `${conut}s`;
              if (conut < 1) {
                this.smsMsg = t('loginMsg.getSmsCode'); // "获取验证码";
                this.hasGetSms = false;
                clearInterval(Timer);
              }
            }, 1000);
            Toast(t('loginMsg.smsSuccess')); // ("发送成功");
          }
        });
      } else {
        Toast(t('loginMsg.errorMsg.checkPhone')); // ("手机号格式有误");
      }
    },
    login () {
      if (!/^1[3|4|5|7|8][0-9]\d{8}$/.test(this.phone)) {
        Toast(t('loginMsg.errorMsg.checkPhone')); // ("手机号有误");
        return;
      }
      if (!this.captcha) {
        Toast(t('loginMsg.errorMsg.smsCodeErr')); // ("验证码不能为空");
        return;
      }
      let phoneObj = {
        phone: this.phone,
        code: this.captcha
      };
      this.$axios.post("/login/sms/verify", phoneObj).then(login => {
        console.log(login);
        if (login.data && login.data.code === 0) {
          utils.setStorage("loginData", JSON.stringify(login.data));
          utils.setToken(login.headers.token);
          if (this.openid) {
            this.$axios.put(`/user/${this.openid}/wx`).then(data => {
              if (data.data.code === 0) {
                this.$axios
                  .get(`/user/permissions/${login.data.data.id}`)
                  .then(opts => {
                    if (opts.data && opts.data.code === 0) {
                      utils.setStorage(
                        "userRoles",
                        JSON.stringify(opts.data.data)
                      );
                      this.$router.push("/index");
                    }
                  });
              }
            });
          } else if (isWeixin()) {
            Toast(t('connectErr')); // ("网络请求失败，请稍后重试");
          } else {
            this.$axios
              .get(`/user/permissions/${login.data.data.id}`)
              .then(opts => {
                if (opts.data && opts.data.code === 0) {
                  utils.setStorage(
                    "userRoles",
                    JSON.stringify(opts.data.data)
                  );
                  this.$router.push("/index");
                }
              });
          }
        }
      });
    },
    testlogin () {
      let person = {
        account: "demo001",
        password: "demo001"
      };
      this.$axios.post(`/login`, person).then(res => {
        console.log(res);
        if (res.data && res.data.code === 0) {
          utils.setStorage("loginData", JSON.stringify(res.data));
          utils.setToken(res.headers.token);
          this.$axios
            .get(`/user/permissions/${res.data.data.id}`)
            .then(opts => {
              if (opts.data && opts.data.code === 0) {
                utils.setStorage("userRoles", JSON.stringify(opts.data.data));
                this.$router.push("/index");
              }
            });
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.icon {
  margin-right: 10px;
}
.login-content {
  overflow: hidden;
  background: #ffffff;
  .Logintitle {
    text-align: left;
    margin-left: 35px;
    font-weight: 600;
    height: 50px;
    font-size: 20px;
    line-height: 50px;
    margin-top: 18px;
  }
  .VerButton {
    color: #71bfdb;
    font-size: 14px;
    border-left: 1px #aaa solid;
    float: right;
    padding-left: 10px;
    margin-top: 16px;
    margin-right: 10px;
  }
  .Loginbutton {
    width: 217px;
    margin-top: 60px;
    background: #71bfdb;
    font-size: 14px;
    border-radius: 20px;
  }
  .Loginhead {
    background: #484848;
  }
  .iptPhone {
    width: 80%;
    margin-left: 40px;
    border-bottom: 1px #ddd solid;
    margin-top: 24px;
    img {
      width: 20px;
      height: 20px;
      display: block;
      float: left;
      margin-top: 16px;
    }
    .phone {
      width: 80%;
      border: none;
      border: 1px #fff;
      outline: none;
    }
  }
  .iptYzm {
    margin-top: 38px;
    width: 80%;
    margin-left: 40px;
    border-bottom: 1px #ddd solid;
    overflow: hidden;

    img {
      width: 20px;
      height: 20px;
      display: block;
      float: left;
      margin-top: 16px;
    }
    .yzm {
      width: 40%;
      font-size: 14px;
      float: left;
    }
  }

  .mint-cell-wrapper {
    padding-left: 0;
    padding-right: 0;
    background-image: none;
  }

  .mint-cell:last-child {
    background-image: none;
  }
}
</style>
