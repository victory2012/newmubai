<template>
  <div>
    <div class="preloader">
      <div class="cs-loader">
        <div class="cs-loader-inner">
          <label> ●</label>
          <label> ●</label>
          <label> ●</label>
          <label> ●</label>
          <label> ●</label>
          <label> ●</label>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import utils from "@/utils/utils";
import WX from "wx";

export default {
  methods: {
    getQueryString () {
      let qs = window.location.search.substr(1); // 获取url中"?"符后的字串
      let args = {}; // 保存参数数据的对象
      let items = qs.length ? qs.split("&") : []; // 取得每一个参数项,
      let item = null;
      let len = items.length;

      for (let i = 0; i < len; i++) {
        item = items[i].split("=");
        let name = decodeURIComponent(item[0]);
        let value = decodeURIComponent(item[1]);
        if (name) {
          args[name] = value;
        }
      }
      return args;
    }
  },
  created () {
    let locallanguage = localStorage.getItem("locale");
    if (!locallanguage) {
      let currentLang = navigator.language || navigator.browserLanguage; // 判断除IE外其他浏览器使用语言
      if (currentLang === "zh-CN") {
        localStorage.setItem("locale", "zh");
        this.$i18n.locale = "zh";
      } else {
        localStorage.setItem("locale", "en");
        this.$i18n.locale = "en";
      }
    } else {
      this.$i18n.locale = locallanguage;
    }
  },
  mounted () {
    // sessionStorage.setItem("URl", window.location.href.split("#")[0]);
    let codes = this.getQueryString();
    console.log(codes.code);
    if (codes.code) {
      this.$axios.post("/wechat/login", { code: codes.code }).then(res => {
        console.log(res);
        if (res.data.code === 0) {
          utils.setStorage("loginData", JSON.stringify(res.data.data));
          utils.setToken(res.headers.token);
          this.$axios.get(`/user/permissions/${res.data.data.id}`).then(opts => {
            if (opts.data && opts.data !== null) {
              utils.setStorage("userRoles", JSON.stringify(opts.data.data));
              this.$router.push("/index");
            }
          });
        }
        if (res.data.code === 106001) {
          this.$router.push({
            path: "/login",
            query: {
              openid: res.data.data
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #49a9ee;
  z-index: 9999;
  transition: opacity 0.65s;
}

.preloader-hidden-add {
  opacity: 1;
  display: block;
}

.preloader-hidden-add-active {
  opacity: 0;
}

.preloader-hidden {
  display: none;
}

.cs-loader {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.cs-loader-inner {
  transform: translateY(-50%);
  top: 50%;
  position: absolute;
  width: 100%;
  color: #fff;
  text-align: center;
}

.cs-loader-inner label {
  font-size: 20px;
  opacity: 0;
  display: inline-block;
}

@keyframes lol {
  0% {
    opacity: 0;
    transform: translateX(-300px);
  }

  33% {
    opacity: 1;
    transform: translateX(0);
  }

  66% {
    opacity: 1;
    transform: translateX(0);
  }

  100% {
    opacity: 0;
    transform: translateX(300px);
  }
}

.cs-loader-inner label:nth-child(6) {
  animation: lol 3s infinite ease-in-out;
}

.cs-loader-inner label:nth-child(5) {
  animation: lol 3s 0.1s infinite ease-in-out;
}

.cs-loader-inner label:nth-child(4) {
  animation: lol 3s 0.2s infinite ease-in-out;
}

.cs-loader-inner label:nth-child(3) {
  animation: lol 3s 0.3s infinite ease-in-out;
}

.cs-loader-inner label:nth-child(2) {
  animation: lol 3s 0.4s infinite ease-in-out;
}

.cs-loader-inner label:nth-child(1) {
  animation: lol 3s 0.5s infinite ease-in-out;
}
</style>
