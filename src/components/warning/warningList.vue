<template>
  <!-- <mt-loadmore class="warning-list" :bottom-method="loadMoress" infinite-scroll-disabled="loading" :bottom-all-loaded="allLoaded" infinite-scroll-distance="0" infinite-scroll-immediate-check="false">

    <warningListItem v-for="(item, index) in tableData" :key="index" :itemData="item"></warningListItem>
    <mt-spinner class="Spinner" v-if="isShowSpinner" type="snake"></mt-spinner>
    <div v-if="!isShowSpinner" class="loadEnd">没有更多了</div>
  </mt-loadmore> -->
  <div class="listwapper">
    <div ref="wrapper"
      class="wrapper"
      v-infinite-scroll="loadMoress"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="20">
      <!-- <warningListItem :itemData="item"></warningListItem> -->
      <div class="warningItem"
        v-for="item in tableData"
        :key="item.id + Math.random()"
        @click="lockDetails(item)">
        <div class="item">
          <!-- 电池ID： -->
          <p class="time">{{$t('alarmList.batteryCode')}}：{{item.hostCode}}</p>
          <!-- 告警项 -->
          <p>{{$t('alarmList.alarmItem')}}：<span class="light">{{item.item}}</span></p>
        </div>
        <div class="item">
          <!-- 告警时间 -->
          <p class="time">{{$t('alarmList.time')}}：{{item.createTime}}</p>
          <!-- 告警层级 -->
          <p>{{$t('alarmList.alarmHierarchy')}}：<span class="light">{{item.hierarchy}}</span></p>

        </div>
        <div class="item">
          <!-- 公司名称 -->
          <!-- <p class="content">{{$t('alarmList.customer')}}：{{item.companyName}}</p> -->
          <p>{{$t('alarmList.customer')}}：{{item.companyName}}</p>
        </div>
        <div class="item">
          <!-- 告警内容 -->
          <p class="content">{{$t('alarmList.content')}}：</p>
          <p>{{item.content}}</p>
        </div>
        <!-- <div class="main-top">
          <div class="fl mta">
            <h2>{{item.items}}</h2>
            告警项目
            <p>{{$t('alarmList.alarmItem')}}</p>
          </div>
          <div class="fl mtb">
            <div class="timedata">{{item.createTime}}</div>
            <div>{{item.companyName}}</div>
          </div>
          <div class="fl mtc">
            {{item.actualValue}}
          </div>
        </div>
        <div class="main-bottom">
          <div class="mba fl">
            电池编号
            <h3 class="fl">{{$t('alarmList.batteryCode')}}</h3>
            <p class="fl">{{item.hostCode}}</p>
          </div>
          <div class="mbb fl">
            告警描述
            <h3 class="fl">{{$t('alarmList.content')}}</h3>
            <p class="fl">{{item.content}}</p>
          </div>
        </div> -->
      </div>
    </div>
    <p v-show='loadingDom'
      class='loading'>{{$t('noMoreData')}}</p>
    <!-- 没有更多数据 -->
    <mt-popup v-model="popupVisible"
      :modal="false"
      position="right">
      <mt-detail @closeIt="closeModel"
        :warnData="warnIngData"></mt-detail>
      <!-- <button>123456</button> -->
    </mt-popup>
  </div>
</template>

<script>

import { Indicator, Spinner, Popup } from "mint-ui";
import lnglatTrabsofor from "@/utils/longlatTransfor";
import utils from "@/utils/utils";
import t from "@/utils/translate";
import detail from "./detail";

export default {
  name: "warningList",
  components: {
    "mt-spinner": Spinner,
    "mt-Popup": Popup,
    "mt-detail": detail
  },
  data () {
    return {
      warnIngData: {},
      popupVisible: false,
      wrapperHeight: 0,
      loading: true,
      loadingDom: false,
      currentDataList: [],
      nowpage: 1,
      currentLength: 0,
      maxPage: 0,
      tableData: [],
      isShowSpinner: false,
      bottomStatus: ""
    };
  },
  methods: {
    loadMoress () {
      this.loading = true;
      this.nowpage++;
      this.getListData();
      // this.isShowSpinner = true;
    },
    handleBottomChange (status) {
      this.bottomStatus = status;
    },
    getListData () {
      Indicator.open();
      let pageObj = {
        pageSize: 15,
        pageNum: this.nowpage
      };
      this.$axios.get("/battery_group_event", pageObj).then(res => {
        console.log(res);
        Indicator.close();
        if (res.data && res.data.code === 0) {
          let result = res.data.data;
          // this.tableData = [];
          if (result.pageData.length > 0) {
            this.loadingDom = false;
            // if (result.pageData.length < 20) {
            //   this.allLoaded = true;
            // }
            result.pageData.forEach(key => {
              // key.alarmtime = utils.fomats(key.time);
              key.levels = utils.level(key.level);
              key.hierarchy = key.hierarchy === "Group" ? t('group.allGroup') : t('group.single');// "整组" : "单体";
              key.items = utils.item(key.item);
              if (key.item === "Fluid") {
                key.thresholdValue = "-";
                key.actualValue = t('realTime.abnormal'); // "异常";
              }
              this.tableData.push(key);
            });
            this.loading = false;
          } else {
            this.loadingDom = true;
          }
        }
      });
    },
    lockDetails (item) {
      console.log(item);
      this.$axios.get(`/battery_group_event/${item.dataId}`).then(res => {
        console.log(res);
        if (res.data && res.data.code === 0) {
          let result = res.data.data;
          if (result) {
            let position = [result.gcjLongitude, result.gcjLatitude];
            lnglatTrabsofor(position, callRes => {
              this.warnIngData = item;
              this.warnIngData.fluidLevel =
                result.fluidLevel === 0 ? t('realTime.normal') : t('realTime.abnormal');// "正常" : "异常";
              this.warnIngData.temperature = result.temperature;
              this.warnIngData.voltage = result.voltage;
              this.warnIngData.current = result.current;
              this.warnIngData.address = callRes.formattedAddress || "--";
            });
            this.popupVisible = true;
          }
        }
      });
    },
    closeModel (data) {
      if (data.closed) {
        this.popupVisible = false;
      }
    }
  },
  mounted () {
    this.getListData();
  }
};
</script>

<style lang="scss" scope >
.listwapper {
  padding-top: 40px;
}
.main {
  border-bottom: 1px solid #f2f2f2;
  .fl {
    float: left;
  }
  background: #f2f2f2;
  .warningItem {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 13px;
    background: #fff;
    padding: 15px 10px 5px;
    .item {
      padding: 8px 0;
      display: flex;
      justify-content: space-between;
      p {
        flex: 1;
        text-align: left;
        .light {
          color: #71bfdb;
        }
        &.time {
          flex: 0 0 58%;
        }
        &.content {
          flex: 0 0 120px;
        }
      }
    }
    .main-top {
      height: 65px;
      .mta {
        width: 30%;
        margin-top: 5px;
        h2 {
          font-size: 20px;
          color: #71bfdb;
        }
        p {
          color: #a0a0a0;
          margin-top: 5px;
          font-size: 12px;
        }
      }
      .mtb {
        width: 43%;
        font-size: 12px;
        .timedata {
          border-bottom: 1px #bfbfbf solid;
        }
        div {
          height: 28px;
          line-height: 28px;
        }
      }
      .mtc {
        font-size: 23px;
        color: #71bfdb;
        line-height: 60px;
        margin-left: 22px;
      }
    }
    .main-bottom {
      height: 20px;
      font-size: 12px;
      padding-left: 20px;
      margin-top: 5px;
      .mba {
        width: 40%;
      }
      h3 {
        color: #a0a0a0;
      }
      .mbb {
        p {
          width: 120px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          text-align: left;
        }
      }
    }
  }
}
</style>
