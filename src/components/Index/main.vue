<template>
  <div class="main">
    <div class="headNav">
      <mt-header class="Loginhead" title="基本信息">
        <mt-button icon="" slot="left"></mt-button>
        <mt-button icon="" slot="right"></mt-button>
      </mt-header>
      <nav>
        <div class="search">
          <input placeholder="电池编号/设备编号" v-model="searchContent.content" type="text">
          <button @click="searchInput"><img src="../../../static/search.jpg" alt=""></button>
        </div>
        <button class="searchBtn2 fr" @click="showMore">
          <img v-if="isShowbind" style="width: 20px;height: 20px;" src="../../../static/xiajiantoufff.svg" alt="">
          <img v-else style="width: 20px;height: 20px;" src="../../../static/jiantoufff.svg" alt="">
        </button>
        <button @click.stop="switchBattery" class="batteryType fr">
          <p>{{batteryName}}</p><img src="../../../static/xiasanjiao.svg" alt="">
        </button>
        <button @click.stop="switchCompany" class="qiye fr">
          <p>{{company}}</p><img src="../../../static/xiasanjiao.svg" alt="">
        </button>

      </nav>
      <div class="showIsBind" v-show="isShowbind">
        <div>状态</div>
        <ul>
          <li :class="{'active': choosed == 'hasbind'}" @click="searchBind">已绑定</li>
          <li :class="{'active': choosed == 'nobind'}" @click="searchNoBind">未绑定</li>
          <li @click="clearAll">清空筛选</li>
        </ul>
      </div>
    </div>
    <mt-popup v-model="selectone" position="bottom">
      <mt-picker valueKey="name" v-if="selectone" class="enterprise" :slots="batterySlot" @change="onBatteryChange"></mt-picker>
    </mt-popup>
    <mt-popup v-model="selecttwo" position="bottom">
      <mt-picker valueKey="name" v-if="selecttwo" class="enterprise" :slots="companySlots" @change="onCompanyChange"></mt-picker>
    </mt-popup>
    <!-- <div class="listwapper"> -->

    <div class="tableBody" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
      <div ref="wrapper" class="wrapper" v-infinite-scroll="loadBottom" infinite-scroll-disabled="loading" infinite-scroll-distance="20">
        <battery-list-item v-for="item in tableData" :key="item.code + new Date().getTime()" :listData="item" @bindDevice="selectItem" @unbindSuc="ifUnbind"></battery-list-item>
        <p v-show='isShowSpinner' class='loading'>没有更多数据</p>
      </div>
    </div>
    <!-- <div class="tableBody" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
      <mt-loadmore :bottom-method="loadBottom" :auto-fill="false" :bottomDistance='40' @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
        <battery-list-item v-for="item in tableData" :key="item.code + new Date().getTime()" :listData="item" @unbindSuc="ifUnbind"></battery-list-item>
        <div slot="bottom" class="mint-loadmore-bottom">
          <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'loading' }">↑</span>
          <span v-show="bottomStatus === 'loading'">
            <mt-spinner type="snake"></mt-spinner>
          </span>
        </div>
      </mt-loadmore>
      <div v-show="isShowSpinner" class="loadEnd">没有更多了</div>
    </div> -->
    <!-- <mt-palette-button content="+" @expand="main_log('expand')" @expanded="main_log('expanded')" @collapse="main_log('collapse')" direction="lt" class="pb" :radius="80" ref="target_1" mainButtonStyle="color:#fff;background-color:#71BFDB;">
      <div class="my-icon-button" @click.stop="sub_log('hand')">
        <img src="/static/hand.svg" alt="">
      </div>
        <div class="my-icon-button" @click.stop="sub_log('scan')">
          <img src="/static/scan.svg" alt="">
      </div>
    </mt-palette-button> -->
  </div>
</template>

<script>
import {
  MessageBox,
  Toast,
  Popup,
  InfiniteScroll,
  PaletteButton,
  Picker,
  Indicator,
  Loadmore
} from "mint-ui";
import { checkPermisstion } from "../../common/js/auth";
import { loginOverTime } from "../../common/js/loginovertime";
import batteryListItem from "./batteryListItem";
import Vues from "./main";
import _cache from "../cache.js";
import Paho from "Paho";
import mqttConfig from "@/api/mqtt.config";

let mqttClient = {};
export default {
  name: "index",
  components: {
    batteryListItem,
    // batteryList,
    "mt-popup": Popup,
    "mt-palette-button": PaletteButton,
    "mt-picker": Picker,
    "mt-loadmore": Loadmore
  },
  data() {
    return {
      choosed: "",
      isShowSpinner: false,
      pageSize: 10,
      currentPage: 1,
      loadingDom: true,
      wrapperHeight: 0,
      allLoaded: false,
      bottomStatus: "",
      company: "企业",
      batteryName: "电池型号",
      searchContent: {},
      selectone: false,
      selecttwo: false,
      isShowbind: false,
      tableData: [],
      companySlots: [
        {
          flex: 1,
          values: ["获取错误"],
          className: "slot1",
          textAlign: "center"
        }
      ],
      batterySlot: [
        {
          flex: 1,
          values: ["获取错误"],
          className: "slot2",
          textAlign: "center"
        }
      ]
    };
  },
  methods: {
    handleBottomChange(status) {
      this.bottomStatus = status;
    },
    loadBottom() {
      setTimeout(() => {
        this.currentPage++;
        if (this.currentPage <= this.totalPage) {
          this.getBatteryList();
        } else {
          this.isShowSpinner = true;
        }
      }, 800);
    },
    ifUnbind(data) {
      this.tableData = [];
      this.getBatteryList();
    },
    onCompanyChange(picker, values) {
      console.log(values, "name");
      console.log(picker, "picker");
      this.company = values[0].name;
      this.searchContent.companyId = values[0].id;
      this.tableData = [];
      this.getBatteryList();
    },
    onBatteryChange(picker, values) {
      console.log(values, "name");
      console.log(picker, "picker");
      if (values[0].id !== "noData") {
        this.batteryName = values[0].name;
        this.searchContent.batteryId = values[0].id;
        this.tableData = [];
        this.getBatteryList();
      }
    },
    searchInput() {
      this.tableData = [];
      this.getBatteryList();
    },
    switchCompany() {
      this.selecttwo = !this.selecttwo;
    },
    switchBattery() {
      this.selectone = !this.selectone;
    },
    showMore() {
      this.isShowbind = !this.isShowbind;
    },
    searchBind() {
      this.choosed = "hasbind";
      this.isShowbind = false;
      this.searchContent.bindStatus = 1;
      this.tableData = [];
      this.getBatteryList();
    },
    searchNoBind() {
      this.choosed = "nobind";
      this.isShowbind = false;
      this.searchContent.bindStatus = 2;
      this.tableData = [];
      this.getBatteryList();
    },
    clearAll() {
      this.currentPage = 1;
      this.company = "企业";
      this.batteryName = "电池型号";
      this.searchContent.companyId = null;
      this.searchContent.batteryId = null;
      this.isShowbind = false;
      this.searchContent.bindStatus = "";
      this.searchContent.content = "";
      this.tableData = [];
      this.choosed = "";
      this.getBatteryList();
    },
    getBatteryList() {
      Indicator.open();
      let options = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        companyName: this.searchContent.companyId ? `${this.company}` : "",
        batteryGroupOrDeviceCode: this.searchContent.content
          ? this.searchContent.content
          : "",
        modelId: this.searchContent.batteryId
          ? this.searchContent.batteryId
          : "",
        status: 0
      };
      if (
        this.searchContent.bindStatus &&
        this.searchContent.bindStatus === 2
      ) {
        options.bindingStatus = 0;
      } else {
        options.bindingStatus = this.searchContent.bindStatus;
      }
      this.$axios.get("/battery_group", options).then(res => {
        console.log(res);
        Indicator.close();
        if (res.data && res.data.code === 0) {
          let result = res.data.data;
          this.total = result.total;
          this.totalPage = result.totalPage;
          if (result.pageData.length > 0) {
            this.isShowSpinner = false;
            result.pageData.forEach(key => {
              key.onLine = key.onlineStatus === 0 || key.onlineStatus === null;
              if (key.deviceId) {
                key.hasbind = false;
                key.bindingName = "已绑定";
              } else {
                key.bindingName = "未绑定";
                key.hasbind = true;
              }
              key.visitBtn = false;
              key.bindVisible = false;
              this.tableData.push(key);
            });
          } else {
            this.isShowSpinner = true;
          }
        }
      });
    },
    /* 获取电池组客户企业表 */
    getCompanyId() {
      this.$axios.get("/company/purchase_names").then(res => {
        console.log("获取电池组客户企业表", res);
        if (res.data && res.data.code === 0) {
          this.batCustomOpts = res.data.data;
          // this.companySlots[0].values = [...this.batCustomOpts];

          if (this.batCustomOpts.length > 0) {
            this.companySlots[0].values = [
              {
                id: "",
                name: "全部"
              }
            ];
            res.data.data.forEach(key => {
              let obj = {
                id: key.id,
                name: key.name
              };
              this.companySlots[0].values.push(obj);
            });
          } else {
            this.companySlots[0].values = [
              {
                name: "暂无数据",
                id: "noData"
              }
            ];
          }
        }
      });
    },
    /* 获取电池型号列表 */
    getBatteryModelList() {
      this.$axios.get("/dic?type=Model&categoryId=2").then(res => {
        console.log("获取电池型号列表", res);
        if (res.data && res.data.code === 0) {
          this.Modeloptions = res.data.data;
          // this.batterySlot[0].values = [...this.Modeloptions];
          if (this.Modeloptions.length > 0) {
            this.batterySlot[0].values = [
              {
                id: "",
                name: "全部"
              }
            ];
            this.Modeloptions.forEach(key => {
              this.batterySlot[0].values.push({
                id: key.id,
                name: key.dicKey
              });
            });
          } else {
            this.batterySlot[0].values = [
              {
                name: "暂无数据",
                id: "noData"
              }
            ];
          }
        }
      });
    },
    /* 扫码后绑定 */
    selectItem(data) {
      console.log("扫码返回值", data);
      Toast("开始绑定");
      Indicator.open();
      let bindObj = {
        hostId: data.hostId,
        deviceId: data.deviceBianhaoId,
        hostCode: data.id,
        deviceCode: data.deviceBianhao
      };
      this.$axios.put("host/bind", bindObj).then(res => {
        console.log(res);
        Indicator.close();
        if (res.data && res.data.code === 0) {
          this.tableData = [];
          this.getBatteryList();
          Toast(res.data.msg);
          let message = new Paho.MQTT.Message(`k:${data.code}`);
          message.destinationName = `cmd/${data.deviceBianhao}`;
          console.log(message);
          mqttClient.send(message);
        }
      });
    },
    /* mqtt链接 */
    connectMqtt() {
      mqttClient = new Paho.MQTT.Client(
        mqttConfig.hostname,
        mqttConfig.port,
        mqttConfig.clientId
      );
      mqttClient.connect({
        onSuccess: this.onConnect,
        reconnect: mqttConfig.reconnect,
        keepAliveInterval: mqttConfig.keepAliveInterval,
        useSSL: mqttConfig.useSSL,
        timeout: mqttConfig.timeout
      });
      mqttClient.onFailure = res => {
        console.log(res);
      };
      mqttClient.onConnectionLost = responseObject => {
        console.log("mqtt-closed:", responseObject);
      };
      mqttClient.onMessageArrived = message => {
        console.log("message", message);
      };
    },
    onConnect() {
      if (
        typeof mqttClient === "object" &&
        typeof mqttClient.subscribe === "function"
      ) {
        console.log("mqtt is connected");
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name !== "loading") {
      next();
    }
  },
  mounted() {
    this.connectMqtt();
    this.getBatteryList();
    this.getCompanyId();
    this.getBatteryModelList();
    this.wrapperHeight =
      document.documentElement.clientHeight -
      this.$refs.wrapper.getBoundingClientRect().top -
      60;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.Loginhead {
  background: #484848;
}

nav {
  height: 35px;
  padding: 3px;
  background: #484848;
  width: 100%;
  color: #cccccc;
  font-size: 11px;
  position: relative;
}
.tableBody {
  overflow: scroll;
}
.search button {
  border: none;
  background: #3f3f3f;
  color: #cccccc;
  font-size: 11px;
  margin-top: 2px;
  float: right;
  img {
    height: 20px;
  }
}

.search input {
  background: #3f3f3f;
  border: #484848;
  width: 80%;
  line-height: 25px;
  color: #fff;
  position: absolute;
  left: 0;
  padding-left: 7px;
}
.active {
  background: #ffffff;
  color: #333333;
}
.search {
  float: left;
  width: 37%;
  background: #3f3f3f;
  position: absolute;
  bottom: 7px;
  left: 10px;
  overflow: hidden;
  z-index: 999;
}

.enterprise {
  width: 500px;
}

nav button {
  border: none;
  background: #484848;
  color: #cccccc;
  font-size: 11px;
}
.tableBody {
  padding-top: 75px;
  background: #f2f2f2;
}
.batteryType {
  padding: 0;
  width: 25%;
  margin-top: 5px;
  margin-right: 10px;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: relative;

  p {
    display: inline-block;
  }
  img {
    display: inline-block;
    position: absolute;
    top: 0px;
    height: 15px;
    width: 15px;
  }
}

.qiye {
  padding: 0;
  margin-top: 5px;
  width: 28%;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  position: relative;
  p {
    display: inline-block;
  }
  img {
    display: inline-block;
    position: absolute;
    top: 0px;
    height: 15px;
    width: 15px;
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
  min-height: 100%;
  background: #f2f2f2;
}
.mint-loadmore-bottom span {
  display: inline-block;
  -webkit-transition: 0.2s linear;
  transition: 0.2s linear;
  vertical-align: middle;
}

.mint-loadmore-bottom span.is-rotate {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}
.fr {
  float: right;
}

.pb {
  width: 61px;
  height: 61px;
  line-height: 61px;
  color: #fff;
  position: fixed;
  top: 75%;
  right: 20px;
  -webkit-box-shadow: 0 2px 12px rgba(0, 0, 0, 0.175);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.175);
}

.my-icon-button {
  width: 40px;
  padding: 8px;
  height: 40px;
  border-radius: 50%;
  color: #fff;
  background: #fff;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
  -webkit-box-shadow: 0 2px 12px rgba(0, 0, 0, 0.175);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.175);
}

.searchBtn2 {
  padding: 0;
  margin: 0;
  margin-top: 4px;
  img {
    margin: 0;
  }
}
.showIsBind {
  width: 100%;
  height: 80px;
  background: #484848;
  padding-left: 20px;
  color: #fff;
  font-size: 12px;
  overflow: hidden;
  div {
    text-align: left;
    margin-top: 10px;
  }
  ul {
    margin-top: 15px;
    li:nth-child(2) {
      margin-left: 30px;
    }
    li:nth-child(3) {
      float: right;
      margin-right: 20px;
      background: #fff;
      color: #484848;
    }
  }
  li {
    float: left;
    width: 65px;
    border: 1px #fff solid;
    height: 30px;
    line-height: 30px;
  }
}
.mt150 {
  margin-top: 150px !important;
}
</style>
