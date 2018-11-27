<template>
  <div class="main">
    <div class="headNav">
      <!-- 基本信息 -->
      <mt-header class="Loginhead"
        :title="$t('batteryList.information')">
        <mt-button icon=""
          slot="left"></mt-button>
        <!-- <mt-button slot="right"
          @click="sheetVisible=true">{{localLanguge}}</mt-button> -->
      </mt-header>
      <nav>
        <div class="search">
          <input :placeholder="$t('batteryList.searchContent')"
            v-model="searchContent.content"
            type="text">
          <button @click="searchInput"><img src="../../../static/search.jpg"
              alt=""></button>
        </div>
        <button class="searchBtn2 fr"
          @click="showMore">
          <img v-if="isShowbind"
            style="width: 20px;height: 20px;"
            src="../../../static/xiajiantoufff.svg"
            alt="">
          <img v-else
            style="width: 20px;height: 20px;"
            src="../../../static/jiantoufff.svg"
            alt="">
        </button>
        <button @click.stop="switchBattery"
          class="batteryType fr">
          <p>{{batteryName}}</p><img src="../../../static/xiasanjiao.svg"
            alt="">
        </button>
        <button @click.stop="switchCompany"
          class="qiye fr">
          <p>{{company}}</p><img src="../../../static/xiasanjiao.svg"
            alt="">
        </button>

      </nav>
      <div class="showIsBind"
        v-show="isShowbind">
        <!-- 状态 -->
        <div>{{$t('batteryList.binding')}}</div>
        <ul>
          <!-- 已绑定 -->
          <li :class="{'active': choosed == 'hasbind'}"
            @click="searchBind">{{$t('batteryList.hasBind')}}</li>
          <!-- 未绑定 -->
          <li :class="{'active': choosed == 'nobind'}"
            @click="searchNoBind">{{$t('batteryList.noBind')}}</li>
          <li @click="clearAll">{{$t('timeBtn.clear')}}</li>
        </ul>
      </div>
    </div>
    <mt-popup v-model="selectone"
      position="bottom">
      <mt-picker valueKey="name"
        v-show="selectone"
        class="enterprise"
        :slots="batterySlot"
        :show-toolbar="true"
        @change="onBatteryChange">
        <!-- 取消 -->
        <div class="mint-datetime-action mint-datetime-cancel"
          @click.stop="BatteryCancel">{{$t('timeBtn.cancle')}}</div>
        <!-- 确定 -->
        <div class="mint-datetime-action mint-datetime-confirm"
          @click="BatterySureBtn">{{$t('timeBtn.sure')}}</div>
      </mt-picker>
    </mt-popup>
    <mt-popup v-model="selecttwo"
      position="bottom">
      <mt-picker valueKey="name"
        v-show="selecttwo"
        class="enterprise"
        :slots="companySlots"
        :show-toolbar="true"
        @change="onCompanyChange">
        <!-- 取消 -->
        <div class="mint-datetime-action mint-datetime-cancel"
          @click.stop="CompanyCancel">{{$t('timeBtn.cancle')}}</div>
        <!-- 确定 -->
        <div class="mint-datetime-action mint-datetime-confirm"
          @click="CompanySureBtn">{{$t('timeBtn.sure')}}</div>
      </mt-picker>
    </mt-popup>

    <div class="tableBody"
      ref="wrapper"
      :style="{ height: wrapperHeight + 'px' }">
      <div ref="wrapper"
        v-infinite-scroll="loadBottom"
        infinite-scroll-distance="30">
        <battery-list-item v-for="item in tableData"
          :key="item.code + new Date().getTime()"
          :listData="item"
          @bindDevice="selectItem"
          @unbindSuc="ifUnbind"></battery-list-item>
        <!-- 没有更多数据 -->
        <p v-show='isShowSpinner'
          class='loading'>{{$t('noMoreData')}}</p>
      </div>
    </div>
    <div class="pb"
      :class="{'animation': activeBtn}"
      @click="batteryAdd">
      {{$t('regBattery')}}
    </div>
    <mt-actionsheet :actions="actions"
      v-model="sheetVisible"
      :cancelText="$t('user.cancel')">
    </mt-actionsheet>
  </div>
</template>

<script>
import {
  Toast,
  Popup,
  PaletteButton,
  Picker,
  Indicator,
  Loadmore
} from "mint-ui";
/* eslint-disable */
import Paho from "Paho";
import mqtt from "@/api/mqtt.config";
import utils from "@/utils/utils";
import t from "@/utils/translate";
import batteryListItem from "./batteryListItem";

export default {
  name: "index",
  components: {
    batteryListItem,
    "mt-popup": Popup,
    "mt-palette-button": PaletteButton,
    "mt-picker": Picker,
    "mt-loadmore": Loadmore
  },
  data () {
    return {
      localLanguge: t("Language"),
      sheetVisible: false,
      actions: [
        { name: "中文", method: this.languageChange, id: "cn" },
        { name: "English", method: this.languageChange, id: "en" }
      ],
      topStatus: "",
      activeBtn: false,
      mqttClient: {},
      choosed: "",
      isShowSpinner: false,
      pageSize: 8,
      companyObj: {}, // 选择企业
      batteryNameObj: {}, // 选择电池型号
      currentPage: 1,
      loadingDom: true,
      wrapperHeight: 0,
      allLoaded: false,
      bottomStatus: "",
      company: t('batteryList.company'), // "企业",
      batteryName: t('batteryList.model'), // "电池型号",
      searchContent: {},

      selectone: false,
      selecttwo: false,
      isShowbind: false,
      tableData: [],
      companySlots: [
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "center"
        }
      ],
      batterySlot: [
        {
          flex: 1,
          values: [],
          className: "slot2",
          textAlign: "center"
        }
      ]
    };
  },
  created () {

  },
  mounted () {
    this.loginData = JSON.parse(utils.getStorage("loginData"));
    this.connectMqtt();
    this.getBatteryList();
    this.getBatteryModelList();
    if (this.loginData.layerName === "平台") {
      this.getCompanyManufacturer(); // 查询生产企业
    } else {
      this.getCompanyId();
    }
    this.wrapperHeight =
      document.documentElement.clientHeight -
      this.$refs.wrapper.getBoundingClientRect().top -
      60;
  },
  methods: {
    BatteryCancel () {
      this.selectone = false;
    },
    BatterySureBtn () {
      this.selectone = false;
      this.batteryName = this.batteryNameObj.name;
      this.tableData = [];
      this.currentPage = 1;
      this.getBatteryList();
    },
    CompanyCancel () {
      this.selecttwo = false;
    },
    CompanySureBtn () {
      this.selecttwo = false;
      this.company = this.companyObj.name;
      this.tableData = [];
      this.currentPage = 1;
      this.getBatteryList();
    },
    languageChange (str) {
      if (str.id === "en") {
        this.$i18n.locale = "en";
        localStorage.setItem("locale", "en");
      } else {
        this.$i18n.locale = "zh";
        localStorage.setItem("locale", "zh");
      }
      this.company = t('batteryList.company'), // "企业",
        this.batteryName = t('batteryList.model'), // "电池型号",
        this.localLanguge = t("Language");
    },
    batteryAdd () {
      if (this.loginData.type !== 2) {
        Toast(t('responseCode.permissions')); // ("权限不足");
        return;
      }
      this.activeBtn = !this.activeBtn;
      this.$router.push("/batteryEdit");
    },
    loadBottom () {
      // this.$refs.loadmore.onBottomLoaded();
      setTimeout(() => {
        this.currentPage++;
        if (this.currentPage <= this.totalPage) {
          this.getBatteryList();
        } else {
          this.isShowSpinner = true;
        }
      }, 500);
    },
    handleBottomChange (status) {
      this.bottomStatus = status;
    },
    ifUnbind () {
      this.tableData = [];
      this.currentPage = 1;
      this.getBatteryList();
    },
    onCompanyChange (picker, values) {
      this.companyObj = values[0];
    },
    onBatteryChange (picker, values) {
      this.batteryNameObj = values[0];
      // }
    },
    searchInput () {
      this.tableData = [];
      this.getBatteryList();
    },
    switchCompany () {
      this.selecttwo = !this.selecttwo;
    },
    switchBattery () {
      this.selectone = !this.selectone;
    },
    showMore () {
      this.isShowbind = !this.isShowbind;
    },
    searchBind () {
      this.isShowbind = false;
      if (this.choosed === "hasbind") {
        this.choosed = "";
        this.searchContent.bindStatus = "";
      } else {
        this.choosed = "hasbind";
        this.searchContent.bindStatus = 1;
      }
      this.currentPage = 1;
      this.tableData = [];
      this.getBatteryList();
    },
    searchNoBind () {
      if (this.choosed === "nobind") {
        this.choosed = "";
        this.searchContent.bindStatus = "";
      } else {
        this.choosed = "nobind";
        this.searchContent.bindStatus = 2;
      }
      this.isShowbind = false;
      this.tableData = [];
      this.currentPage = 1;
      this.getBatteryList();
    },
    clearAll () {
      this.currentPage = 1;
      this.company = t('batteryList.company');// "企业";
      this.batteryName = t('batteryList.model');// "电池型号";
      this.companyObj = {};
      this.batteryNameObj = {};
      this.searchContent = {}
      this.isShowbind = false;
      this.tableData = [];
      this.choosed = "";
      this.getBatteryList();
    },
    getBatteryList () {
      Indicator.open();
      console.log(' pageSize', this.companyObj)
      let options = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        companyName: this.companyObj && this.companyObj.id ? this.companyObj.name : '',
        batteryGroupOrDeviceCode: this.searchContent.content,
        modelId: this.batteryNameObj && this.batteryNameObj.id ? this.batteryNameObj.id : '',
        status: 0
      };
      if (
        this.searchContent.bindStatus &&
        this.searchContent.bindStatus === 2
      ) {
        options.bindingStatus = 0;
      } else if (
        this.searchContent.bindStatus &&
        this.searchContent.bindStatus === 1
      ) {
        options.bindingStatus = 1;
      }
      this.$axios.get("/battery_group", options).then(res => {
        console.log('getBatteryList', res);
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
                key.bindingName = t('batteryList.hasBind');// "已绑定";
              } else {
                key.bindingName = t('batteryList.noBind');// "未绑定";
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
    getCompanyId () {
      this.$axios.get("/company/purchase_names").then(res => {
        console.log("获取电池组客户企业表", res);
        if (res.data && res.data.code === 0) {
          this.batCustomOpts = res.data.data;
          if (this.batCustomOpts.length > 0) {
            this.companySlots[0].values = [
              {
                id: "",
                name: t('timeBtn.all')// "全部"
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
                name: t('stock.noData'), // "暂无数据",
                id: ""
              }
            ];
          }
        }
      });
    },
    /* 获取生产企业列表 */
    getCompanyManufacturer () {
      this.$axios
        .get(`company/manufacturer_names?t=${new Date().getTime()}`)
        .then(res => {
          if (res.data && res.data.code === 0) {
            this.batCustomOpts = res.data.data;
            // this.companySlots[0].values = [...this.batCustomOpts];
            if (this.batCustomOpts.length > 0) {
              this.companySlots[0].values = [
                {
                  id: "",
                  name: t('timeBtn.all')// "全部"
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
                  name: t('stock.noData'), // "暂无数据",
                  id: ""
                }
              ];
            }
          }
        });
    },
    /* 获取电池型号列表 */
    getBatteryModelList () {
      this.$axios.get("/dic?type=Model&categoryId=2").then(res => {
        console.log("获取电池型号列表", res);
        if (res.data && res.data.code === 0) {
          this.Modeloptions = res.data.data;
          // this.batterySlot[0].values = [...this.Modeloptions];
          if (this.Modeloptions.length > 0) {
            this.batterySlot[0].values = [
              {
                id: "",
                name: t('timeBtn.all')// "全部"
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
                name: t('stock.noData'), // "暂无数据",
                id: "noData"
              }
            ];
          }
        }
      });
    },
    /* 扫码后绑定 */
    selectItem (data) {
      console.log("扫码返回值", data);
      // Toast("开始绑定");
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
          Toast(t('successTips.bindSuccess')); // 绑定成功
          let message = new Paho.MQTT.Message(`k:${data.code}`);
          message.destinationName = `cmd/${data.deviceBianhao}`;
          console.log(message);
          this.mqttClient.send(message);
        }
      });
    },
    /* mqtt链接 */
    connectMqtt () {
      this.mqttClient = mqtt.mqttClient();
      this.mqttClient.connect({
        onSuccess: this.onConnect,
        reconnect: mqtt.mqttConfig().reconnect,
        keepAliveInterval: mqtt.mqttConfig().keepAliveInterval,
        useSSL: mqtt.mqttConfig().useSSL,
        timeout: mqtt.mqttConfig().timeout
      });
      this.mqttClient.onFailure = res => {
        console.log(res);
      };
      this.mqttClient.onConnectionLost = responseObject => {
        console.log("mqtt-closed:", responseObject);
      };
      this.mqttClient.onMessageArrived = message => {
        console.log("message", message);
      };
    },
    onConnect () {
      if (
        typeof this.mqttClient === "object" &&
        typeof this.mqttClient.subscribe === "function"
      ) {
        console.log("mqtt is connected");
      }
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   // ...
  // },
  beforeRouteLeave (to, from, next) {
    if (to.name !== "loading") {
      next();
    }
  },

  beforeDestroy () {
    if (
      typeof this.mqttClient === "object" &&
      typeof this.mqttClient.isConnected === "function" &&
      this.mqttClient.isConnected()
    ) {
      this.mqttClient.disconnect();
      this.mqttClient = {};
    }
    this.wrapperHeight = 0;
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
  overflow: auto;
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
  color: rgb(255, 255, 255);
  background-color: rgb(113, 191, 219);
  font-size: 14px;
  text-align: center;
  border-radius: 50%;
  transition: transform 0.1s ease-in-out;
  position: fixed;
  top: 75%;
  right: 20px;
  // background:
  -webkit-box-shadow: 0 2px 12px rgba(0, 0, 0, 0.175);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.175);
}
.animation {
  -webkit-animation: mint-zoom 0.5s ease-in-out;
  animation: mint-zoom 0.5s ease-in-out;
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
