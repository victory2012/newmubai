<template>
  <div class="battery-list-item">
    <div class="top-wrapper">
      <!-- <div class="bliLeft" v-for="item in listData" :key="item.code"> -->
      <div class="top-wrapper" @click="sssj">
        <div class="bliright" @click.stop.prevent="handleBindButton(listData)">
          <img v-show="!listData.bindVisible" src="../../../static/jiantou2.svg" alt="">
          <img v-show="listData.bindVisible" src="../../../static/jiantou1.svg" alt="">
        </div>
        <div class="left common">
          <span class="number">
            {{listData.code}}
          </span>
          <span class="sub">
            电池组编号
          </span>
        </div>
        <div class="binds">
          {{listData.bindingName}}
        </div>
        <div class="right common">
          <span class="number">
            {{listData.deviceCode || "无"}}
          </span>
          <span class="sub">
            设备编号
          </span>
        </div>
      </div>
      <div class="bottom-wrapper clearfix">
        <div class="item">
          电池组型号
          <span>{{listData.model}}</span>
        </div>
        <div class="item">
          电池组规格
          <span>{{listData.norm}}</span>
        </div>
        <div class="item item1">
          额定电压
          <span>{{listData.voltage}}v</span>
        </div>
      </div>
      <div v-show="listData.visitBtn" class="bind-menu">
        <div v-if="listData.deviceId === null" class="is-bind bind">
          <div @click.stop="scanBind(listData)" class="bind-menu-item">扫码绑定</div>
          <div @click.stop="handBind(listData)" class="bind-menu-item">手动绑定</div>
          <!-- <div @click.stop="scanQRbind('0457100d131b', listData)" class="bind-menu-item">手动绑定</div> -->
          <div @click.stop="detailInfo(listData)" class="bind-menu-item">详情</div>
        </div>
        <div v-else class="not-bind bind">
          <div @click.stop="cancelBind(listData)" class="bind-menu-item">解绑</div>

          <div @click.stop="detailInfo(listData)" class="bind-menu-item">详情</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MessageBox, Toast, Indicator } from "mint-ui";
/* eslint-disable */
import WX from "wx";
import isWeixin from "@/utils/checkBrowser";
import utils from "@/utils/utils";
import roles from "@/utils/role";

export default {
  props: {
    listData: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data() {
    return {
      bindVisible: false,
      jiantou: 1,
      isShow: false,
      chooseObj: {}
    };
  },
  mounted() {},
  methods: {
    //打开实时数据
    sssj() {
      // if (!checkPermisstion(19)) {
      //   Toast({
      //     message: "您无此操作权限!",
      //     position: "bottom"
      //   });
      //   return;
      // }
      if (this.listData.deviceId) {
        this.$router.push({
          path: "/realTime",
          query: {
            deviceId: this.listData.deviceId,
            deviceCode: this.listData.deviceCode,
            hostId: this.listData.hostId,
            id: this.listData.id
          }
        });
      } else {
        Toast("请先绑定设备");
      }
    },
    //打开详情
    detailInfo(item) {
      console.log(item);
      // if (!checkPermisstion(18)) {
      //   Toast({
      //     message: "您无此操作权限!",
      //     position: "bottom"
      //   });
      //   return;
      // }
      this.$router.push({
        path: "/batteryDetail",
        query: { code: item.id, deviceCode: item.deviceCode }
      });
    },
    //绑定操作visible
    handleBindButton(item) {
      item.visitBtn = !item.visitBtn;
      item.bindVisible = !item.bindVisible;
    },
    //解绑操作
    cancelBind(row) {
      console.log(row);
      let loginData = JSON.parse(utils.getStorage("loginData"));
      if (loginData.type === 1) {
        Toast("权限不足");
        return;
      }
      MessageBox({
        title: "设备解绑",
        message: "是否将电池与设备解绑",
        showCancelButton: true
      }).then(action => {
        if (action === "confirm") {
          this.$axios.put(`host/unbind/${row.hostId}`).then(res => {
            if (res.data && res.data.code === 0) {
              // console.log(res);
              Toast({
                message: res.data.msg
              });
              this.$emit("unbindSuc", { unbind: true });
            }
          });
        }
      });
    },
    edit(dId) {
      this.httpRequest
        .batteryBind({
          id: this.itemData.id,
          device_id: dId
        })
        .then(res => {
          Toast({
            message: res["message"],
            position: "bottom"
          });

          this.$router.push({
            path: "/index",
            query: { id: ~~(Math.random() * 1000) }
          });
        })
        .catch(err => {
          Toast({
            message: err["response"]["data"]["message"],
            position: "",
            duration: 3000
          });
        });
    },
    //扫码绑定
    scanBind(listData) {
      let loginData = JSON.parse(utils.getStorage("loginData"));
      if (loginData.type === 1 || loginData.type === 3) {
        Toast("权限不足");
        return;
      }
      if (!isWeixin()) {
        Toast("此功能仅在微信中使用");
        return;
      } // 如果不是在微信中打开 则禁止二维码
      this.chooseObj = listData;
      let URl = window.location.href.split("#")[0];
      let that = this;
      Indicator.open();
      this.$axios
        .post(`/wechat/config`, { url: encodeURIComponent(URl) })
        .then(res => {
          console.log(res);
          if (res.data && res.data.code === 0) {
            Indicator.close();
            let result = res.data.data;
            WX.config({
              debug: false, // 是否开启调试模式
              appId: result.appId, // 必填，微信号AppID
              timestamp: Number(result.timestamp), // 必填，生成签名的时间戳
              nonceStr: result.nonceStr, // 必填，生成签名的随机串
              signature: result.signature, // 必填，签名
              jsApiList: ["scanQRCode"] // 必填，需要使用的JS接口列表
            });
            WX.ready(() => {
              WX.checkJsApi({
                jsApiList: ["scanQRCode"],
                success: function(res) {
                  console.log("checkJsApi", res);
                  // Toast(JSON.stringify(res));
                }
              });
              WX.scanQRCode({
                needResult: 1,
                desc: "scanQRCode desc",
                scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function(res) {
                  console.log("scanQRCode", res);
                  that.scanQRbind(res.resultStr);
                }
              });
            });
            WX.error(res => {
              Toast(res.errMsg);
              console.log(res.errMsg);
            });
          }
        });
    },
    scanQRbind(str) {
      if (!str) return;
      // this.chooseObj = listData;
      this.$axios.post(`/device/${str}/check`).then(res => {
        console.log("根据code拿到的设备id", res);
        if (res.data && res.data.code === 0) {
          let result = res.data.data;
          if (result.hostId) {
            Toast("该设备已绑定");
          } else {
            MessageBox.confirm(`确定与设备(编号：${str})绑定吗?`).then(
              action => {
                if (action === "confirm") {
                  this.chooseObj.deviceBianhao = str;
                  this.chooseObj.deviceBianhaoId = result.id;
                  this.$emit("bindDevice", this.chooseObj);
                }
              }
            );
          }
        }
      });
    },
    //手动绑定
    handBind(item) {
      let loginData = JSON.parse(utils.getStorage("loginData"));
      if (loginData.type === 1 || loginData.type === 3) {
        Toast("权限不足");
        return;
      }
      this.$router.push({
        path: "/batteryBind",
        query: { hostId: item.hostId, code: item.id, batteryCode: item.code }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.left {
  float: left;
}

.battery-list-item {
  margin-bottom: 10px;
  margin-top: 10px;
  padding: 4px 1px;
  background: #fff;
  padding-top: 10px;
  overflow: hidden;
  .top-wrapper {
    text-align: center;
    min-height: 43px;
    overflow: hidden;
    margin-top: 10px;
    .common {
      display: inline-block;
      width: 35%;
      .number {
        display: block;
        color: #71bfdb;
        font-size: 18px;
      }
    }
    .binds {
      display: inline-block;
      transform: scale(0.8);
      color: #fff;
      background: #71bfdb;
      border-radius: 20px;
      height: 24px;
      width: 60px;
      font-size: 14px;
      line-height: 24px;
      padding: 0 5px 0;
      // float: left;
      margin-top: 10px;
    }
  }
  .bottom-wrapper {
    margin-top: 15px;

    .item {
      white-space: nowrap;
      float: left;
      margin-left: 6px;
      transform: scale(0.9);
      text-align: center;
      color: #a0a0a0;
      font-size: 11px;
      span {
        padding-left: 10px;
        color: #484848;
        font-size: 11px;
      }
    }
    .item1 {
      margin-left: 10px;
    }
  }
}

.bind-menu {
  margin-top: 20px;
  .bind {
    display: flex;
    padding-bottom: 12px;
  }
  .bind-menu-item {
    flex: 1;
    font-size: 14px;
    border-right: 1px solid #ddd;
    &:last-child {
      border-right: none;
    }
  }
}
.sub {
  font-size: 12px;
}
.bliLeft {
  width: 100%;
  margin-bottom: 10px;
  margin-top: 10px;
  background: #fff;
  padding: 10px 0;
  // float: left;
}
.bliright {
  width: 9%;
  float: right;
  img {
    width: 24px;
    height: 24px;
    margin-top: 20px;
  }
}
</style>
