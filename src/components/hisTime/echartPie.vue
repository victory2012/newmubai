<template>
  <div class="circel">
    <div class="circelInfo">
      <div class="pei"
        id="peiCharts1"></div>
    </div>
    <div class="msg">
      <p class="times">{{alarmTime ||0}}</p>
      <!-- 累计告警 -->
      <p>{{$t('realTime.totalWarn')}}</p>
    </div>
    <div class="circelInfo">
      <div class="pei"
        id="peiCharts2"></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import echarts from "echarts";
import _ from "lodash";
import t from "@/utils/translate";

export default {
  props: {
    // peiData: {
    //   type: Object,
    //   default: () => {
    //     return {
    //       summary: {},
    //       eventSummary: {}
    //     };
    //   }
    // },
    summary: {
      type: Object,
      default: {}
    },
    eventSummary: {
      type: Object,
      default: {}
    },
    loading: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  data () {
    return {
      pieOption: {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {d}%"
        },
        grid: {
          right: "15%"
        },
        legend: {
          right: 5,
          top: "center",
          orient: "vertical",
          itemWidth: 12,
          itemHeight: 12,
          itemGap: 25,
          textStyle: {
            color: "#484848"
          },
          data: []
        },
        series: [
          {
            type: "pie",
            radius: ["30%", "50%"],
            center: ["35%", "50%"],
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontWeight: 300,
                  fontSize: 16 // 文字的字体大小
                },
                formatter: "{c}"
              }
            }
          }
        ]
      },
      alarmTime: 0
    };
  },
  watch: {
    summary: {
      handler: function (vals) {
        // console.log(vals);
        this.summaryChange(vals);
      },
      deep: true
    },
    eventSummary: {
      handler: function (vals) {
        // console.log(vals);
        this.eventSummaryChange(vals);
      },
      deep: true
    },
    loading: {
      handler: function (vals) {
        this.loadingChange(vals);
      },
      deep: true
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      let BarDOM1 = document.getElementById("peiCharts1");
      let BarDOM2 = document.getElementById("peiCharts2");

      this.peiEcharts1 = echarts.init(BarDOM1);
      this.peiEcharts2 = echarts.init(BarDOM2);
      this.loadingChange(this.loading);
      // console.log(this.peiData);
      // this.dataChange(this.peiData);
      this.eventSummaryChange(this.eventSummary);
      this.summaryChange(this.summary);
    },
    loadingChange (loading) {
      if (loading) {
        this.peiEcharts1.showLoading();
        this.peiEcharts2.showLoading();
      } else {
        this.peiEcharts1.hideLoading();
        this.peiEcharts2.hideLoading();
      }
    },
    summaryChange (peiData) {
      // console.log("peiData", peiData);
      // console.log("peiData", peiData.summary);
      let voltageOptions = _.cloneDeep(this.pieOption);
      voltageOptions.legend.data = [t('history.chargeDuration'), t('history.dischargeDuration'), t('history.empty')]; // ["充电时间", "放电时间", "空载时间"];
      voltageOptions.tooltip.formatter = p => {
        let item = `${p.percent}%<br />${p.data.name}: ${p.data.value}h`;
        return item;
      };
      voltageOptions.series[0].data = [
        { value: peiData.chargeDuration || 0, name: t('history.chargeDuration') },
        { value: peiData.dischargeDuration || 0, name: t('history.dischargeDuration') },
        { value: peiData.idleDuration || 0, name: t('history.empty') }
      ];
      voltageOptions.series[0].label.normal.formatter = "{c}h";
      this.peiEcharts1.setOption(voltageOptions);
    },
    eventSummaryChange (peiData) {
      this.alarmTime =
        Number(peiData.temperature) +
        Number(peiData.fluidLevel) +
        Number(peiData.voltage) +
        Number(peiData.current);
      let currentOptions = _.cloneDeep(this.pieOption);
      currentOptions.legend.data = [t('realTime.temperature'), t('realTime.fluid'), t('realTime.voltage'), t('realTime.current')]; // ["温度", "液位", "电压", "电流"];
      currentOptions.tooltip.formatter = p => {
        let item = `${p.percent}%<br />${p.data.name}-${t('realTime.warn')}: ${p.data.value}${t('realTime.times')}`;
        return item;
      };
      currentOptions.series[0].data = [
        { value: peiData.temperature || 0, name: t('realTime.temperature') },
        { value: peiData.fluidLevel || 0, name: t('realTime.fluid') },
        { value: peiData.voltage || 0, name: t('realTime.voltage') },
        { value: peiData.current || 0, name: t('realTime.current') }
      ];
      this.peiEcharts2.setOption(currentOptions);
    }
  }
};
</script>

<style scoped lang="scss">
.circel {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  .circelInfo {
    height: 200px;
    display: flex;
    padding: 0 10px;
    .pei {
      flex: 1;
      height: 200px;
    }
    .msg {
      text-align: center;
      border-top: 1px solid #e5e5e5;
    }
  }
}
.titles {
  font-size: 12px;
  color: #484848;
  float: left;
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
</style>
