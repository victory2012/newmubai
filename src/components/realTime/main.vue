<template>
  <div v-if="isShowMain" class="index">
    <div class="black"></div>
    <nav>
      <mt-header title="运行状况" class="realTimeHead">
        <router-link to="/index" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
        <mt-button icon="more" slot=""></mt-button>
      </mt-header>
      <div class="realTime demo1 left">
        实时数据
      </div>
      <div @click="toHisTime" class="histroyTime demo1 left">
        历史数据
      </div>

      <div class="searchIpt">
        <div @click="searchBetteryNo" class="searchBtn fl"><img src="../../../static/search.jpg" alt=""></div>
        <input v-model="betteryNo" class="search" type="text" placeholder="电池编号/设备编号">
        <div class="batteryList" v-show="showBatteryList">
          <ul>
            <li v-for="key in tableData" :key="key.code" @click="chooseList(key)">{{key.code}}</li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="MMwrap"></div>
    <div class="message">
      <ul class="dataUser">
        <li>
          <img src="../../../static/p1.jpg" alt="">
          <p>{{companyInfo.companyName}}</p>
        </li>
        <li>
          <img src="../../../static/p2.jpg" alt="">
          <p>{{address}}</p>
        </li>
        <li>
          <img src="../../../static/p3.jpg" alt="">
          <p>{{companyInfo.code}}</p>
        </li>
        <li>
          <img src="../../../static/p4.jpg" alt="">
          <p>{{companyInfo.deviceCode}}</p>
        </li>
      </ul>
    </div>
    <ul class="dataDisplay">
      <li>
        <dl>
          <dt>
            <img src="../../../static/y.jpg" alt="">
          </dt>
          <dd>
            <p class="testdata">{{companyInfo.fluid}}</p>
            <p class="category">液位</p>
          </dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>
            <img src="../../../static/c.jpg" alt="">
          </dt>
          <dd>
            <p class="testdata">{{companyInfo.temperature}}°C</p>
            <p class="category">温度</p>
          </dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>
            <img src="../../../static/voltage_total.png" alt="">
          </dt>
          <dd>
            <p class="testdata">{{companyInfo.singleVoltage}}A</p>
            <p class="category">单体电压</p>
          </dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>
            <img src="../../../static/v.jpg" alt="">
          </dt>
          <dd>
            <p class="testdata">{{companyInfo.voltage}}V</p>
            <p class="category">电压</p>
          </dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>
            <img src="../../../static/capacity.png" alt="">
          </dt>
          <dd>
            <p class="testdata">{{quantity}}</p>
            <p class="category">电量</p>
          </dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>
            <img src="../../../static/a.jpg" alt="">
          </dt>
          <dd>
            <p class="testdata">{{companyInfo.current}}A</p>
            <p class="category">电流</p>
          </dd>
        </dl>
      </li>
    </ul>
    <div class="wrap-map">
      <map-container :mapCenter="mapPosition" @addressCallback="addressBack"></map-container>
    </div>

    <div class="updateTime">
      <div class="updateTimeShow">
        <p>更新时间</p>
        <ul class="showTime">
          <li class="hourTime">{{companyInfo.hhmmss}}</li>
          <li class="dayTime">{{companyInfo.yyddmm}}</li>
        </ul>
      </div>
      <div class="initiative">
        <mt-button @click="activeQuery" class="initiativeButton" type="primary">{{btnTip}}</mt-button>
      </div>
    </div>
    <div class="midaF">
      <div>过去4小时监测数据</div>
      <div class="dami"></div>
    </div>
    <line-chart :chartData="dataObj" :mqttData="ReceiveObj"></line-chart>
  </div>
</template>

<script>
import Paho from "Paho";
import echarts from "echarts";
import { Toast, Indicator } from "mint-ui";
import mqttConfig from "@/api/mqtt.config";
import utils from "@/utils/utils";
import mapContainer from "./map";
import lineChart from "./Linechart";

let mqttClient = {};

export default {
  name: "realTime",
  components: {
    lineChart,
    mapContainer
  },
  data() {
    return {
      mapPosition: {},
      loadMap: true, // 调试用的
      showBatteryList: false,
      companyInfo: {},
      quantity: "",
      markerArr: [],
      queryData: false,
      btnTip: "主动查询",
      checked: true,
      ReceiveObj: {},
      tableData: [],
      dataObj: {
        timeArr: [],
        singleVoltage: [],
        temperature: [],
        voltage: [],
        current: []
      },
      isShowMain: true,
      address: "",
      betteryNo: ""
    };
  },
  watch: {
    betteryNo: {
      handler: function(val) {
        console.log("hostId", val);
        if (val) {
          this.getBatteryList(val);
        }
      },
      deep: true
    }
  },
  mounted() {
    this.hostId = this.$route.query.hostId;
    this.deviceId = this.$route.query.deviceId;
    this.deviceCode = this.$route.query.deviceCode;
    this.id = this.$route.query.id;
    this.IdObj = {
      hostId: this.hostId,
      deviceId: this.deviceId,
      deviceCode: this.deviceCode,
      id: this.id
    };
    this.componentInit();
  },
  beforeDestroy() {
    if (
      typeof mqttClient === "object" &&
      typeof mqttClient.isConnected === "function" &&
      mqttClient.isConnected()
    ) {
      mqttClient.disconnect();
      mqttClient = {};
    }
    this.dataObj = {};
    this.ReceiveObj = {};
    // clearInterval(this.timer);
    clearInterval(this.decriseTime);
  },
  methods: {
    componentInit() {
      this.connectMqtt();
      this.getCompanyInfo();
      this.getQuantity();
      this.getData();
    },
    /* 获取电量 */
    getQuantity() {
      if (this.IdObj.deviceCode) {
        this.interval = false;
        this.$axios
          .get(`/battery_group/${this.IdObj.deviceCode}/capacity`)
          .then(res => {
            if (res.data && res.data.code === 0) {
              this.interval = true;
              this.quantity = `${Math.round(res.data.data * 100)}%`;
            }
          });
      }
    },
    getCompanyInfo() {
      Indicator.open();
      this.$axios.get(`/battery_group/${this.IdObj.hostId}/info`).then(res => {
        console.log(res);
        Indicator.close();
        this.companyInfo = "";
        if (res.data && res.data.code === 0 && res.data.data) {
          if (this.markerArr.length > 0) {
            this.markerArr.forEach(key => {
              key.setMap(null);
            });
          }
          let result = res.data.data;
          let position = {
            gcjLongitude: result.gcjLongitude,
            gcjLatitude: result.gcjLatitude
          };
          let Times = utils.TimeSconds(result.time);
          this.companyInfo = result;
          this.companyInfo.fluid = result.fluidLevel === 0 ? "正常" : "异常";
          this.companyInfo.yyddmm = utils.yyyymmdd(Times);
          this.companyInfo.hhmmss = utils.hhmmss(Times);
          this.mapPosition = position;
        }
      });
    },
    addressBack(data) {
      this.address = data;
    },
    getData() {
      let startTime = utils.getFourHours();
      let endTime = utils.getNowTime();
      Indicator.open();
      this.$axios
        .get(
          `/battery_group/${this.IdObj.hostId}/${
            this.IdObj.deviceId
          }/data?startTime=${startTime}&endTime=${endTime}`
        )
        .then(res => {
          console.log(res);
          Indicator.close();
          if (res.data && res.data.code === 0) {
            let result = res.data.data;
            this.dataObj = {
              timeArr: [],
              singleVoltage: [],
              temperature: [],
              voltage: [],
              current: []
            };
            result.forEach(key => {
              let timeArr = utils.TimeSconds(key.time); // 时间
              this.dataObj.singleVoltage.push({
                name: timeArr,
                value: [timeArr, key.singleVoltage]
              });
              this.dataObj.temperature.push({
                name: timeArr,
                value: [timeArr, key.temperature]
              });
              this.dataObj.voltage.push({
                name: timeArr,
                value: [timeArr, key.voltage]
              });
              this.dataObj.current.push({
                name: timeArr,
                value: [timeArr, -key.current]
              });
            });
            this.hasgetData = true;
          }
        });
    },
    //实时数据页面搜索框
    searchBetteryNo() {
      console.log(this.betteryNo);
    },
    /* 获取电池列表 */
    getBatteryList(data) {
      // let loginData = JSON.parse(utils.getStorage("loginData"));
      let options = {
        pageSize: 9999,
        pageNum: 1,
        batteryGroupOrDeviceCode: data,
        bindingStatus: 1,
        status: 0
      };
      this.$axios.get("/battery_group", options).then(res => {
        this.tableData = [];
        console.log(res);
        if (res.data && res.data.code === 0) {
          let result = res.data.data;
          if (result.pageData.length > 0) {
            this.showBatteryList = true;
            this.tableData = result.pageData;
          } else {
            this.showBatteryList = false;
          }
        }
      });
    },
    chooseList(data) {
      console.log(data);
      // this.betteryNo = data.code;
      if (
        typeof mqttClient === "object" &&
        typeof mqttClient.isConnected === "function" &&
        mqttClient.isConnected()
      ) {
        mqttClient.disconnect();
        mqttClient = {};
      }
      this.IdObj = data;
      this.showBatteryList = false;
      this.componentInit();
    },
    toHisTime() {
      console.log(this.IdObj);
      this.$router.push({
        path: "/hisTime",
        query: {
          deviceId: this.IdObj.deviceId,
          deviceCode: this.IdObj.deviceCode,
          hostId: this.IdObj.hostId,
          id: this.IdObj.id
        }
      });
    },
    activeQuery() {
      if (mqttClient.isConnected() && !this.queryData) {
        this.queryData = true;
        clearInterval(this.decriseTime);
        let index = 10;
        this.decriseTime = setInterval(() => {
          if (this.queryData) {
            index--;
            this.btnTip = `主动查询(${index}s)`;
            if (index === 0) {
              clearInterval(this.decriseTime);
              this.btnTip = `主动查询`;
              this.queryData = false;
            }
          } else {
            clearInterval(this.decriseTime);
            this.btnTip = `主动查询`;
          }
        }, 1000);
        let message = new Paho.MQTT.Message("c:get");
        message.destinationName = `cmd/${this.IdObj.deviceCode}`;
        mqttClient.send(message);
      } else {
        Toast("网络连接失败，请稍后重试");
      }
    },
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
      mqttClient.onConnectionLost = responseObject => {
        console.log("mqtt-closed:", responseObject);
      };
      mqttClient.onMessageArrived = message => {
        console.log("message:", message);
        let payload = message.payloadString;
        if (payload) {
          let payloadType = payload.toString().split("]");
          if (payloadType[1]) {
            this.queryData = false;
            this.CCID = payloadType[1];
            let payloadJSON = `${payloadType[0]}]`;
            this.receiveData(payloadJSON);
          } else {
            this.receiveData(payload);
          }
        }
      };
    },
    /* 收到 mqtt数据 */
    receiveData(data) {
      let payloadString = JSON.parse(data);
      let dataObj = {
        times: utils.TimeSconds(payloadString[1]), // 时间
        singleVoltage: payloadString[3], // 单体电压
        voltage: payloadString[4], // 电压
        current: payloadString[5], // 电流
        temperature: payloadString[6], // 温度
        liquid: payloadString[7], // 液位
        longitude: payloadString[8], // 经度
        latitude: payloadString[9], // 纬度
        loop: payloadString[10], // 循环次数
        chargeingTime: payloadString[11], // 充电时间
        chargeTimes: payloadString[12], // 充电次数
        disChargeingTime: payloadString[13], // 放电时间
        disChargeTimes: payloadString[14], // 放电次数
        emptyTime: payloadString[15], // 空截时间
        addLiquidingTime: payloadString[16], // 补水时间
        addLiquidTimes: payloadString[17], // 补水次数
        addLiquidTimeOut: payloadString[18], //补水超限时间
        battery: payloadString[19], // 充电电量
        version: payloadString[20], // 版本号
        batteryCode: payloadString[21] // 电池编号
      };
      this.version = dataObj.version;
      let posData = this.gcj_encrypt(dataObj.latitude, dataObj.longitude);
      this.companyInfo.temperature = dataObj.temperature;
      this.companyInfo.fluid = dataObj.liquid === 0 ? "正常" : "异常";
      this.companyInfo.voltage = dataObj.voltage;
      this.companyInfo.singleVoltage = dataObj.singleVoltage;
      this.companyInfo.current = dataObj.current;
      this.companyInfo.hhmmss = utils.hhmmss(dataObj.times);
      this.companyInfo.yyddmm = utils.yyyymmdd(dataObj.times);
      this.companyInfo.gcjLongitude = posData.lon;
      this.companyInfo.gcjLatitude = posData.lat;
      let resultPos = {
        gcjLongitude: posData.lon,
        gcjLatitude: posData.lat
      };
      this.positionData(resultPos);

      if (this.checked) {
        this.ReceiveObj = dataObj;
      }
    },

    onConnect() {
      console.log("connect");
      if (
        typeof mqttClient === "object" &&
        typeof mqttClient.subscribe === "function"
      ) {
        mqttClient.subscribe(`dev/${this.IdObj.deviceCode}`);
      }
    },
    //硬件GPS----转高德经纬度 ----开始
    delta(lat, lon) {
      let a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
      let ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
      let dLat = this.transformLat(lon - 105.0, lat - 35.0);
      let dLon = this.transformLon(lon - 105.0, lat - 35.0);
      let radLat = (lat / 180.0) * PI;
      let magic = Math.sin(radLat);
      magic = 1 - ee * magic * magic;
      let sqrtMagic = Math.sqrt(magic);
      dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * PI);
      dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * PI);
      return { lat: dLat, lon: dLon };
    },

    /* 入口 */
    gcj_encrypt(wgsLat, wgsLon) {
      if (this.outOfChina(wgsLat, wgsLon)) return { lat: wgsLat, lon: wgsLon };

      var d = this.delta(wgsLat, wgsLon);
      return { lat: wgsLat + d.lat, lon: wgsLon + d.lon };
    },
    outOfChina(lat, lon) {
      if (lon < 72.004 || lon > 137.8347) return true;
      if (lat < 0.8293 || lat > 55.8271) return true;
      return false;
    },
    transformLat(x, y) {
      let ret =
        -100.0 +
        2.0 * x +
        3.0 * y +
        0.2 * y * y +
        0.1 * x * y +
        0.2 * Math.sqrt(Math.abs(x));
      ret +=
        ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) *
          2.0) /
        3.0;
      ret +=
        ((20.0 * Math.sin(y * PI) + 40.0 * Math.sin((y / 3.0) * PI)) * 2.0) /
        3.0;
      ret +=
        ((160.0 * Math.sin((y / 12.0) * PI) + 320 * Math.sin((y * PI) / 30.0)) *
          2.0) /
        3.0;
      return ret;
    },
    transformLon(x, y) {
      let ret =
        300.0 +
        x +
        2.0 * y +
        0.1 * x * x +
        0.1 * x * y +
        0.1 * Math.sqrt(Math.abs(x));
      ret +=
        ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) *
          2.0) /
        3.0;
      ret +=
        ((20.0 * Math.sin(x * PI) + 40.0 * Math.sin((x / 3.0) * PI)) * 2.0) /
        3.0;
      ret +=
        ((150.0 * Math.sin((x / 12.0) * PI) +
          300.0 * Math.sin((x / 30.0) * PI)) *
          2.0) /
        3.0;
      return ret;
    }
  }
};
</script>

<style scoped lang="scss">
/*#Vecharts {*/
/*width: 100%;*/
/*height: 200px;*/
/*}*/

.charts {
  margin-left: 5%;
  margin-top: 40px;
}
// .wrap-map {
//   width: 94%;
//   height: 220px;
//   margin-left: 3%;
//   text-align: center;
//   border-radius: 5px;
// }

// .realMapContainer {
//   width: 100%;
//   height: 220px;
// }

.index {
  // height: 300%;
  overflow: hidden;
  padding-bottom: 50px;
}

.realTimeHead {
  background: #484848;
}

.left {
  float: left;
}

nav {
  height: 110px;
  background: #484848;
  color: #fff;
  position: fixed;
  width: 100%;
  z-index: 99999999;
}

.demo1 {
  width: 50%;
  text-align: center;
  height: 10%;
  font-size: 12pt;
}

.histroyTime {
  color: #9b9b9b;
  height: 30px;
}
.searchIpt {
  position: relative;
  background: #3f3f3f;
  height: 30px;
  float: left;
  width: 86%;
  margin-left: 7%;
  margin-top: 5px;
  img {
    float: left;
  }
  .batteryList {
    position: absolute;
    background: #ffffff;
    width: 100%;
    height: auto;
    top: 30px;
    left: 0;
    z-index: 300;
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.2);
    ul {
      padding: 0 5px;
      li {
        color: #3f3f3f;
        text-align: left;
        padding: 10px;
        padding-left: 32px;
        border-bottom: 1px dashed #e5e5e5;
      }
    }
  }
}
.search {
  background: #3f3f3f;
  border: none;
  color: #fff;
  float: left;
  width: 80%;
  height: 100%;
}
.searchBtn {
  border: none;
  height: 25px;
  width: 30px;
  float: left;
  margin-top: 2%;
  margin-left: 2%;
  img {
    height: 20px;
    width: 20px;
  }
}
.searchRes {
  position: absolute;
  top: 100%;
  left: 25%;
  box-shadow: 2px 2px 3px #ccc;
  border-radius: 10px;
  background: #fff;
  color: #484848;
  font-size: 14px;
  li {
    height: 40px;
    line-height: 40px;
    width: 180px;
    text-align: left;
    padding-left: 20px;
  }
}
.message {
  width: 85%;
  position: absolute;
  height: 70px;
  background: #fff;
  left: 8%;
  border-radius: 10px;
  box-shadow: 1px 2px 2px #cccccc;
  margin-top: 120px;
  .dataUser {
    width: 100%;
    height: 100%;
    padding-left: 6%;

    li {
      width: 50%;
      height: 50%;
      float: left;
      line-height: 33px;
      img {
        height: 60%;
        float: left;
        margin-left: 5px;
        margin-top: 7px;
      }
      p {
        font-size: 9px;
        color: #484848;
        width: 80%;
      }
    }
  }
}

.dataDisplay {
  width: 100%;
  overflow: hidden;
  // height: 18%;
  margin-top: 200px;
  li:nth-child(1) {
    p {
      font-size: 24px;
    }
  }
  li {
    height: 150px;
    width: 50%;
    float: left;
    p {
      font-size: 20px;
      height: 32px;
    }
    dl {
      width: 100%;
      height: 100%;
      dt {
        height: 50%;
        width: 100%;

        img {
          height: 80%;
        }
      }
      dd {
        height: 40%;
        width: 100%;
        color: #484848;
        .category {
          font-size: 12px;
          margin-top: 2px;
        }
      }
    }
  }
}

.updateTime {
  width: 100%;
  height: 5%;
  padding: 0 12% 0;
  margin-top: 5px;
  overflow: hidden;
  margin-bottom: 20px;
  .updateTimeShow {
    width: 60%;
    height: 80%;
    overflow: hidden;
    float: left;
    margin-top: 10px;
    p {
      font-size: 12px;
      color: #a0a0a0;
      float: left;
      margin-top: 7px;
      width: 30%;
    }
    .showTime {
      margin-top: 5px;
      width: 65%;
      float: right;
      text-align: left;
      color: #484848;
      margin-left: 8px;
    }
    .hourTime {
      font-size: 20px;
      text-align: right;
      margin-right: 20px;
    }
    .dayTime {
      margin-top: 5px;
      font-size: 14px;
      text-align: right;
      margin-right: 22px;
    }
  }
  .initiative {
    float: right;
    width: 40%;
    height: 40%;
    border-left: 1px #ccc solid;
    margin-top: 20px;
    .initiativeButton {
      background: #71bfdb;
      width: 90px;
      height: 35px;
      font-size: 12px;
      margin-left: 25px;
    }
  }
}
.MMwrap {
  background: #484848;
  width: 100%;
  height: 150px;
  position: absolute;
}
.dami {
  float: left;
  width: 8px;
  height: 16px;
  background: #5fb6d5;
  border-radius: 4px;
  margin-left: 8px;
  margin-top: 1px;
}
.midaF {
  height: 20px;

  div:nth-child(1) {
    margin-left: 15px;
    font-size: 12px;
  }
  div {
    display: block;
    float: left;
  }
}
</style>
