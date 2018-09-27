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
            <span>{{listData.voltage}}</span>
          </div>
        </div>
        <div v-show="listData.visitBtn" class="bind-menu">
          <div v-if="listData.deviceId === null" class="is-bind bind">
            <div @click.stop="scanBind" class="bind-menu-item">扫码绑定</div>
            <div @click.stop="handBind(listData)" class="bind-menu-item">手动绑定</div>
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
import _cache from "../cache";
import * as _ from "lodash";
import { checkPermisstion } from "../../common/js/auth";

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
      isShow: false
    };
  },
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
        query: { code: item.id }
      });
    },
    //绑定操作visible
    handleBindButton(item) {
      item.visitBtn = !item.visitBtn;
      item.bindVisible = !item.bindVisible;
    },
    //解绑操作
    cancelBind(row) {
      // if (!checkPermisstion(17)) {
      //   Toast({
      //     message: "您无此操作权限!",
      //     position: "bottom"
      //   });
      //   return;
      // }

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
    checkDevice(deviceNo) {
      let item = _.filter(_cache.dList, function(o) {
        return o["no"] == deviceNo;
      });

      if (Array.isArray(item) && item.length) {
        this.edit(item[0]["id"]);
      } else {
        Toast({
          message: "设备编号不存在！",
          position: "bottom"
        });
      }
    },
    edit(dId) {
      Indicator.open();

      this.httpRequest
        .batteryBind({
          id: this.itemData.id,
          device_id: dId
        })
        .then(res => {
          Indicator.close();

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
          Indicator.close();

          Toast({
            message: err["response"]["data"]["message"],
            position: "",
            duration: 3000
          });
        });
    },
    //扫码绑定
    scanBind() {
      if (!checkPermisstion(17)) {
        Toast({
          message: "您无此操作权限!",
          position: "bottom"
        });
        return;
      }
      console.log("=> url: " + location.href.split("#")[0]);
      console.log("scanBind: ", JSON.stringify(_cache.wxJsCfg));
      wx.config({
        debug: false, // 是否开启调试模式
        appId: _cache.wxJsCfg.appId, // 必填，微信号AppID
        timestamp: _cache.wxJsCfg.timestamp, // 必填，生成签名的时间戳
        nonceStr: _cache.wxJsCfg.nonceStr, // 必填，生成签名的随机串
        signature: _cache.wxJsCfg.signature, // 必填，签名，见附录1
        jsApiList: ["scanQRCode"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });

      let that = this;

      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function(res) {
          var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          // alert("扫描结果："+result);
          // window.location.href = result;//因为我这边是扫描后有个链接，然后跳转到该页面
          console.log("=> CODE : \n" + JSON.stringify(result));

          // 判断 result 是否通过正则
          var reg = new RegExp("[0-9A-Za-z]{12}");
          if (!reg.test(result)) {
            Toast({
              message: "设备编号无效！",
              position: "bottom"
            });
          } else {
            that.checkDevice(result);
          }
        }
      });
    },
    //手动绑定
    handBind(item) {
      // if (!checkPermisstion(17)) {
      //   Toast({
      //     message: "您无此操作权限!",
      //     position: "bottom"
      //   });
      //   return;
      // }
      console.log(item);
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
