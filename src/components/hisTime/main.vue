<template>
  <div class="indexHis">
    <div v-if="isShowMain" class="index">
      <nav>
        <mt-header title="运行状况" class="realTimeHead">
          <router-link to="/index" slot="left">
            <mt-button icon="back"></mt-button>
          </router-link>
          <mt-button icon="more" slot=""></mt-button>
        </mt-header>
        <div @click="torealTime" class="realTime demo1 left">
          实时数据
        </div>
        <div class="histroyTime demo1 left">
          历史数据
        </div>
        <div class="checkTime">
          <p class="fl">从</p>
          <div class="fl ctime" @click="openPicker">{{showStartTime}}</div>
          <p class="fl">到</p>
          <div class="fl ctime" @click="openPicker1">{{showEndTime}}</div>
          <mt-button @click="getChartData" class="TimeButton fl" type="primary">确认</mt-button>
          <div class="fl popDownBtn" @click="HandletopShow">
            <img v-show="topShow" style="width: 20px;height: 20px;" src="../../../static/jiantoufff.svg" alt="">
            <img v-show="!topShow" style="width: 20px;height: 20px;" src="../../../static/xiajiantoufff.svg" alt="">
          </div>
        </div>
      </nav>
      <mt-datetime-picker ref="picker" type="date" v-model="pickerValue" :endDate="endDate" @confirm="handleConfirm">
      </mt-datetime-picker>
      <mt-datetime-picker ref="picker1" type="date" v-model="pickerValue1" :endDate="endDate" @confirm="handleConfirm1">
      </mt-datetime-picker>
      <div class="smzq" v-if="!topShow">
        <div>时间范围</div>
        <ul>
          <li @click="ChoiceTime(item)" :class="{timeStyle2:item.isShow}" class="fl" v-for="item in TimeTap" :key="item.item">{{item.item}}</li>
        </ul>
      </div>
      <!-- <div class="mask"></div> -->
      <div class="message" :class="{messageNo:!topShow}" v-if="topShow">
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
      <div class="MMwrap" :class="{MMwrapNo:!topShow}"></div>
      <div class="chartsLine">
        <line-echart :chartData="dataObj" :loading="loading" @timeZoom="timeZoom"></line-echart>
        <!-- <echart-map :chartData="dataObj" :loading="loading" @timeZoom="timeZoom"></echart-map> -->
      </div>

      <ul class="DataTop">
        <li>
          <div class="Data1">{{summary.cycle}}</div>
          <div class="Data2">电池循环次数</div>
        </li>
        <li>
          <div class="Data1">{{summary.chargeDuration}}h</div>
          <div class="Data2">充电时间</div>
        </li>
        <li>
          <div class="Data1">{{summary.dischargeDuration}}h</div>
          <div class="Data2">放电时间</div>
        </li>
      </ul>
      <ul class="DataDown">
        <li>
          <div class="Data1">{{summary.avgChargeDuration}}h</div>
          <div class="Data2">平均充电时间</div>
        </li>
        <li>
          <div class="Data1">{{summary.avgDischargeDuration}}h</div>
          <div class="Data2">平均放电时间</div>
        </li>
        <li>
          <div class="Data1">{{summary.fluidSupplementTimes}}</div>
          <div class="Data2">补水次数</div>
        </li>
        <li>
          <div class="Data1">{{summary.avgFluidSupplementDuration}}h</div>
          <div class="Data2">平均补水时长</div>
        </li>
      </ul>

      <chart-pie :loading="loading" :summary="summary" :eventSummary="eventSummary"></chart-pie>

      <div class="list-title">
        <div class="fl1" :class="{C484848:isA,CACACAC:!isA}" @click="getAlarmData">告警事件列表</div>
        <div class="fl1" :class="{CACACAC:isA,C484848:!isA}" @click="getliquidData">补水列表</div>
      </div>
      <his-alarm v-if="alarm" :alaData="alarmData"></his-alarm>
      <fluid-Alarm v-if="alarmFluid" :fliudData="liquidData"></fluid-Alarm>
      <div class="page">
        <span>当前第{{pages}}页，共{{totalPage}}页</span>
        <mt-button @click="nextPage" size="small" class="fenyeBtn" type="primary">下一页</mt-button>
        <mt-button @click="prevPage" size="small" class="fenyeBtn" type="primary">上一页</mt-button>
      </div>
      <div class="wrap-map">
        <p>监测位置变化趋势</p>
        <div class="dami2"></div>
      </div>
      <travel-map :travelData="positions"></travel-map>
    </div>
  </div>
</template>


<script>
import { Toast,Indicator } from "mint-ui";
import utils from "@/utils/utils";
import lineEchart from "./historyChart";
import lnglatTrabsofor from "@/utils/longlatTransfor";
import chartPie from "./echartPie";
import travelMap from "./map";

let address;
export default {
  name: "histime",
  components: {
    lineEchart,
    chartPie,
    travelMap,
    hisAlarm: () => import("./HisWarning.vue"),
    fluidAlarm: () => import("./HisBushui.vue")
  },
  data() {
    return {
      pageSize: 4,
      pages: 1,
      totalPage: 0,
      alarmFluid: false,
      alarm: false,
      hisOrFluid: "hisAlarm",
      loading: false,
      TimeTap: [
        { item: "最近一周", isShow: false, index: 1 },
        { item: "最近一个月", isShow: false, index: 2 },
        { item: "最近三天个月", isShow: false, index: 3 },
        { item: "最近六个月", isShow: false, index: 4 },
        { item: "最近一年", isShow: false, index: 5 },
        { item: "全生命周期", isShow: false, index: 6 }
      ],
      companyInfo: {},
      markerArr: [],
      address: "",
      clientName: "",
      addresss: "",
      liquidData: [],
      no: "",
      deviceNo: "",
      isShowMain: "true",
      startTime: "",
      endTime: "",
      pickerValue: "",
      pickerValue1: "",
      dataObj: {},
      alarmData: [],
      liquidData: [],
      heatData: [],
      summary: {},
      eventSummary: {},
      peiObj: {},
      endDate: new Date(),
      positions: {},
      fourObj: {},
      isA: true,
      topShow: true,
      showStartTime: utils.sortTime2(utils.getWeek()),
      showEndTime: utils.sortTime2(new Date())
    };
  },

  mounted() {
    this.hostObj = {
      deviceId: this.$route.query.deviceId,
      hostId: this.$route.query.hostId,
      deviceCode: this.$route.query.deviceCode,
      id: this.$route.query.id
    };
    this.getChartData();
    this.getCompanyInfo(this.hostObj);
  },
  methods: {
    /* 确认按钮 */
    getChartData() {
      let startTime = utils.toUTCTime(utils.startTime(this.showStartTime));
      let endTime = utils.toUTCTime(utils.endTime(this.showEndTime));
      this.getChartDatafun(startTime, endTime);
    },
    /* 获取Echart相关数据 以及 地图坐标 */
    getChartDatafun(startTime, endTime) {
      this.loading = true;
      Indicator.open();
      // Toast("开始请求数据");
      this.$axios
        .get(
          `/battery_group/${this.hostObj.hostId}/${
            this.hostObj.deviceId
          }/data2?startTime=${startTime}&endTime=${endTime}`
        )
        .then(res => {
          Indicator.close();
          this.dataObj = {
            singleVoltage: [],
            timeArr: [],
            temperature: [],
            voltage: [],
            current: [],
            capacity: []
          };
          if (res.data && res.data.code === 0) {
            let result = res.data.data;
            this.exportData = result.list;
            this.positions = {
              travel: [],
              heatmap: []
            }; // 轨迹点集合
            this.resultList = result.list;
            this.resultList.forEach((key, index) => {
              let timeStr = utils.TimeSconds(key.time); // 时间
              // console.log(timeStr);
              // console.log("key.time", key.time);
              let capacity = Math.round(key.capacity * 100);
              this.dataObj.singleVoltage.push({
                name: timeStr,
                value: [timeStr, key.singleVoltage]
              });
              this.dataObj.temperature.push({
                name: timeStr,
                value: [timeStr, key.temperature]
              });
              this.dataObj.voltage.push({
                name: timeStr,
                value: [timeStr, key.voltage]
              });
              this.dataObj.current.push({
                name: timeStr,
                value: [timeStr, -key.current]
              });
              this.dataObj.capacity.push({
                name: timeStr,
                value: [timeStr, capacity]
              });
              let gcjLongitude = Number(key.gcjLongitude);
              let gcjLatitude = Number(key.gcjLatitude);
              if (
                gcjLongitude > -180 &&
                gcjLatitude > -90 &&
                gcjLatitude <= 90 &&
                gcjLongitude <= 180 &&
                Math.abs(gcjLongitude) > 1 &&
                Math.abs(gcjLatitude) > 1
              ) {
                this.positions.travel.push([
                  key.gcjLongitude,
                  key.gcjLatitude,
                  timeStr
                ]); // 坐标
                this.positions.heatmap.push({
                  lng: key.gcjLongitude,
                  lat: key.gcjLatitude,
                  count: 100
                });
              }
            });
            this.enlargeBtn = true; // 放大按钮禁止
            this.btnTypeUp = "info"; // 修改el-button的type
            this.loading = false;
            let sums = result.summary;
            this.eventSummary = result.eventSummary || {};
            this.summary = {
              chargeDuration: (sums.chargeDuration / 60).toFixed(2),
              dischargeDuration: (sums.dischargeDuration / 60).toFixed(2),
              cycle: sums.cycle,
              avgChargeDuration: (+sums.avgChargeDuration / 60).toFixed(2),
              avgDischargeDuration: (+sums.avgDischargeDuration / 60).toFixed(
                2
              ),
              fluidSupplementTimes: sums.fluidSupplementTimes,
              avgFluidSupplementDuration: (
                sums.avgFluidSupplementDuration / 60
              ).toFixed(2),
              idleDuration: (sums.idleDuration / 60).toFixed(2)
            };
            this.peiObj.eventSummary = result.eventSummary || {};
            this.peiObj.summary = this.summary || {};
            // this.heatMapFun();
            // this.positionChange(positions);
          }
        });
      this.getAlarmData();
    },
    openPicker() {
      this.$refs.picker.open();
    },
    openPicker1() {
      this.$refs.picker1.open();
    },
    handleConfirm(res) {
      // console.log(res);
      // this.startTime = this.getTime(res);
      this.showStartTime = utils.sortTime2(res);
    },
    handleConfirm1(res) {
      // this.endTime = this.getTime(res);
      this.showEndTime = utils.sortTime2(res);
    },
    /* 获取公司信息 */
    getCompanyInfo(hostObj) {
      Indicator.open();
      this.$axios.get(`/battery_group/${hostObj.hostId}/info`).then(res => {
        console.log(res);
        Indicator.close();
        this.companyInfo = "";
        if (res.data && res.data.code === 0 && res.data.data) {
          let result = res.data.data;
          let position = {
            gcjLongitude: result.gcjLongitude,
            gcjLatitude: result.gcjLatitude
          };
          this.companyInfo = result;
          this.companyInfo.fluid = result.fluidLevel === 0 ? "正常" : "异常";
          this.companyInfo.yyddmm = utils.yyyymmdd(new Date());
          this.companyInfo.hhmmss = utils.hhmmss(new Date());
          this.positionData(position);
        }
      });
    },

    /* 根据经纬度 用高德查询详细地址 */
    positionData(data) {
      if (data && data.gcjLongitude) {
        let position = new AMap.LngLat(data.gcjLongitude, data.gcjLatitude);
        /* 根据经纬度 用高德查询详细地址 */
        lnglatTrabsofor(position, res => {
          let sendAddress = `${res.addressComponent.province}-${
            res.addressComponent.city
          }`;
          if (this.address !== sendAddress) {
            this.hasSend = false;
            this.address = sendAddress;
          }
          if (!this.hasSend) {
            this.addressCallBack(sendAddress);
          }
        });
      }
    },

    addressCallBack(data) {
      let param = {
        id: this.hostObj.id,
        address: data
      };
      this.$axios.put(`battery_group/address`, param).then(res => {
        console.log(res);
        if (res.data && res.data.code === 0) {
          this.hasSend = true;
        }
      });
    },

    timeZoom() {},
    /* 历史告警 */
    getAlarmDataFun() {
      Indicator.open();
      let startTime = utils.toUTCTime(utils.startTime(this.showStartTime));
      let endTime = utils.toUTCTime(utils.endTime(this.showEndTime));
      let pageObj = {
        pageSize: this.pageSize,
        pageNum: this.pages
      };
      this.$axios
        .get(
          `/battery_group_event?hostId=${
            this.hostObj.hostId
          }&startTime=${startTime}&endTime=${endTime}`,
          pageObj
        )
        .then(res => {
          Indicator.close();
          if (res.data && res.data.code === 0) {
            let result = res.data.data;
            if (result) {
              this.total = result.total;
              this.totalPage = result.totalPage;
              this.alarmData = [];
              if (result.pageData.length > 0) {
                // this.alarmData = result.pageData;
                result.pageData.forEach((key, index) => {
                  // key.alarmtime = utils.fomats(key.time);
                  key.levels = utils.level(key.level);
                  key.hierarchy = key.hierarchy === "Group" ? "整组" : "单体";
                  key.items = utils.item(key.item);
                  if (key.item === "Fluid") {
                    key.thresholdValue = "-";
                    key.actualValue = "异常";
                  }
                  key.index = index + 1;
                  this.alarmData.push(key);
                });
              }
            }
          }
        });
    },
    getAlarmData() {
      this.isA = true;
      this.alarm = true;
      this.alarmFluid = false;
      this.getAlarmDataFun();
    },
    getliquidData() {
      this.isA = false;
      this.getliquidDataFun();
    },
    /* 历史补水 */
    getliquidDataFun() {
      Indicator.open();
      let startTime = utils.toUTCTime(utils.startTime(this.showStartTime));
      let endTime = utils.toUTCTime(utils.endTime(this.showEndTime));
      let pageObj = {
        pageSize: this.pageSize,
        pageNum: this.pages,
        startTime: `${startTime}`,
        endTime: `${endTime}`
      };
      this.$axios
        .get(
          `/battery_group/${this.hostObj.hostId}/${
            this.hostObj.deviceId
          }/fluid`,
          pageObj
        )
        .then(res => {
          Indicator.close();
          console.log(res);
          if (res.data && res.data.code === 0) {
            let result = res.data.data;
            if (result) {
              this.total = result.total;
              this.totalPage = result.totalPage;
              this.liquidData = [];
              let dataArr = [];
              if (result.pageData.length > 0) {
                result.pageData.forEach((key, index) => {
                  let currentTime = utils.TimeSconds(key.time);
                  key.position = new AMap.LngLat(
                    key.gcjLongitude,
                    key.gcjLatitude
                  );
                  if (index + 1 < result.pageData.length) {
                    key.updateWater = utils.Days(
                      currentTime -
                        utils.TimeSconds(result.pageData[index + 1].time)
                    );
                  } else {
                    key.updateWater = "-";
                  }
                  key.index = index + 1;
                  key.temperature = `${key.temperature}°C`;
                  key.Replenishing = utils.UTCTime(key.time);
                  key.address = "查看地址";
                  key.disabled = false;
                  key.hasAdress = false;
                  if (index < this.pageSize) {
                    dataArr.push(key);
                  }
                });
                this.liquidData = dataArr;
                this.alarmFluid = true;
                this.alarm = false;
              }
            }
          }
        });
    },
    nextPage() {
      this.pages++;
      if (this.pages > this.totalPage) {
        this.pages = this.totalPage;
        return;
      }
      if (this.alarm) {
        this.getAlarmData();
      } else {
        this.getliquidData();
      }
    },
    prevPage() {
      this.pages--;

      if (this.pages < 1) {
        this.pages = 1;
        return;
      }
      if (this.alarm) {
        this.getAlarmData();
      } else {
        this.getliquidData();
      }
    },
    torealTime() {
      this.$router.push({
        path: "/realTime",
        query: {
          hostId: this.hostObj.hostId,
          deviceId: this.hostObj.deviceId,
          deviceCode: this.hostObj.deviceCode,
          id: this.hostObj.id
        }
      });
    },

    HandletopShow() {
      this.topShow = !this.topShow;
    },
    ChoiceTime(item) {
      for (let i = 0; i < this.TimeTap.length; i++) {
        this.TimeTap[i].isShow = false;
      }
      item.isShow = !item.isShow;
      this.topShow = !this.topShow;
      let startTimes;
      if (item.index == 1) {
        startTimes = utils.getWeek();
        this.startTime = utils.sortTime2(startTimes);
      }
      if (item.index == 2) {
        startTimes = utils.getMouth();
        this.startTime = utils.sortTime2(startTimes);
      }
      if (item.index == 3) {
        startTimes = utils.getThreeMounth();
        this.startTime = utils.sortTime2(startTimes);
      }
      if (item.index == 4) {
        startTimes = utils.getSixMounth();
        this.startTime = utils.sortTime2(startTimes);
      }
      if (item.index == 5) {
        startTimes = utils.getYear();
        this.startTime = utils.sortTime2(startTimes);
      }
      if (item.index == 6) {
        this.startTime = "2017-01-01";
      }
      this.showStartTime = this.startTime;
      this.showEndTime = utils.sortTime2(new Date());
      // console.log(utils.toUTCTime(utils.startTime(startTimes)));
      // console.log(utils.toUTCTime(utils.startTime(new Date())));
      this.getChartData();
    }
  }
};
</script>


<style scope lang="scss">
.page {
  font-size: 14px;
  padding: 10px 0;
}
.fenyeBtn {
  font-size: 14px;
}
.indexHis {
  .fl {
    float: left;
    margin-left: 10px;
  }
  .fl1 {
    float: left;
  }
  .index {
    min-height: 100%;
    // overflow: hidden;
  }

  .realTimeHead {
    background: #484848;
  }

  .left {
    float: left;
  }

  nav {
    height: 120px;
    background: #484848;
    color: #fff;
    position: fixed;
    width: 100%;
    z-index: 99999999;
  }
  .currentIndex {
    color: #000;
    background: #fff;
  }
  .demo1 {
    width: 50%;
    text-align: center;
    height: 10%;
    font-size: 12pt;
  }

  .realTime {
    color: #9b9b9b;
  }

  .messageNo {
    margin-top: 0px !important;
  }
  .messageNo1 {
    margin-top: 280px !important;
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
    z-index: 99;
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
  .checkTime {
    width: 100%;
    height: 40px;
    position: absolute;
    top: 80px;
    line-height: 40px;
    font-size: 12px;
    p {
      margin-top: -3px;
    }
    .ctime {
      height: 34px;
      width: 27%;
      background: #3f3f3f;
      color: #fff;

      line-height: 34px;
    }
    .TimeButton {
      margin-top: 2px;
      height: 29px;
      background: #71bfdb;
      font-size: 12px;
    }
    .popDownBtn {
      font-size: 25px;
    }
  }
  .charts:nth-child(7) {
    border: none;
  }
  .charts {
    margin-top: 40px;
  }
  .chartss {
    margin-top: 210px;
  }
  .DataTop {
    width: 84%;
    margin-left: 7%;
    height: 80px;
    border-bottom: 1px #bfbfbf solid;
    li {
      float: left;
      width: 33%;
      text-align: center;
      .Data1 {
        font-size: 18px;
        height: 50px;
        line-height: 50px;
      }
      .Data2 {
        font-size: 9px;
      }
    }
  }
  .DataDown {
    width: 84%;
    margin-left: 7%;
    height: 80px;
    li {
      float: left;
      width: 25%;
      text-align: center;
      .Data1 {
        font-size: 18px;
        height: 50px;
        line-height: 50px;
      }
      .Data2 {
        font-size: 9px;
      }
    }
  }
  .pie1 {
    border-bottom: 1px #c0c0c0 solid;
    width: 93%;
    height: 180px;
    margin-left: 7%;
    overflow: hidden;
    position: relative;
    ul {
      margin-top: 68px;
      li {
        margin-top: 8px;
      }
      li:nth-child(1) {
        font-size: 30px;
      }
    }
  }
  .piecharts1 {
    float: left;
  }
  .pietitle1 {
    width: 25%;
    font-size: 12px;
    color: #484848;
    float: left;
    position: absolute;
    top: 30px;
    z-index: 99;
  }
  .list-title {
    padding: 10px 0;
    height: 38px;
    overflow: hidden;
    width: 100%;
    font-size: 14px;
    div:nth-child(1) {
      border-right: 1px #aaaaaa solid;
    }
    div {
      width: 49%;
    }
  }
  .C484848 {
    color: #484848;
  }
  .CACACAC {
    color: #acacac;
  }
  .MMwrap {
    background: #484848;
    width: 100%;
    height: 150px;
    position: absolute;
  }
  .chartsLine {
    padding-top: 226px;
  }
  .MMwrapNo {
    height: 0px;
  }
  .dami {
    float: left;
    width: 8px;
    height: 16px;
    background: #5fb6d5;
    border-radius: 4px;
    position: absolute;
    top: 30px;
    z-index: 99;
    left: 85px;
  }
  .marBorder {
    height: 220px;
    border-bottom: 1px #ddd solid;
    width: 85%;
    margin-left: 5%;
  }
  .marBorder:nth-child(7) {
    border: none;
  }
  .smzq {
    width: 100%;
    height: 130px;
    background: #484848;
    padding: 15px;
    font-size: 14px;
    color: #fff;
    position: fixed;
    z-index: 999;
    top: 120px;
    div {
      color: #fff;
      text-align: left;
    }
    li {
      height: 25px;
      line-height: 25px;
      padding: 0px 10px;
      border: 1px #fff solid;
      margin-top: 15px;
    }
  }
  .timeStyle2 {
    color: #484848 !important;
    background: #fff !important;
  }
  .wrap-map {
    text-align: center;
    margin-top: 20px;
    font-size: 0;
    margin-bottom: 10px;
    // overflow: hidden;
    p {
      font-size: 14px;
      // text-align: left;
      display: inline-block;
      margin-left: 20px;
      vertical-align: middle;
      // float: left;
    }
    .dami2 {
      // float: left;
      width: 8px;
      height: 16px;
      background: #5fb6d5;
      border-radius: 4px;
      display: inline-block;
      margin-left: 8px;
      vertical-align: middle;
      // margin-bottom: 15px;
    }
  }
}
</style>
