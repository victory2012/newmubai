<template>
  <div class="bgFFF">
    <div class="chartInfo"
      id="echartV"></div>
    <div class="chartInfo"
      id="echartSv"></div>
    <div class="chartInfo"
      id="echartA"></div>
    <div class="chartInfo"
      id="echartC"></div>
    <div class="chartInfo"
      id="echartT"></div>
  </div>
</template>

<script>
/* eslint-disable */
import echarts from "echarts";
import _ from "lodash";
import t from "@/utils/translate";
import utils from "@/utils/utils";
import options from "@/config/echartOptions";

export default {
  props: {
    chartData: {
      type: Object,
      default () {
        return {};
      }
    },
    loading: {
      type: Boolean,
      default () {
        return false;
      }
    }
  },
  data () {
    return {
      myEcharts: null,
      isOptionAbnormal: false
    };
  },
  watch: {
    loading: {
      handler: function (curVal) {
        // console.log(curVal);
        this.showLoading(curVal);
      },
      deep: true
    },
    chartData: {
      handler: function (curVal) {
        // Toast("数据已更新");
        // console.log("chartData", curVal);
        this.dataChange(curVal);
      },
      deep: true
    }
  },
  mounted () {
    this.init();
  },
  // created() {
  //   this.init();
  // },
  methods: {
    init () {
      let $echartsDOM1 = document.getElementById("echartV");
      let $echartsDOM2 = document.getElementById("echartSv");
      let $echartsDOM3 = document.getElementById("echartA");
      let $echartsDOM4 = document.getElementById("echartC");
      let $echartsDOM5 = document.getElementById("echartT");
      this.myEcharts1 = echarts.init($echartsDOM1);
      this.myEcharts2 = echarts.init($echartsDOM2);
      this.myEcharts3 = echarts.init($echartsDOM3);
      this.myEcharts4 = echarts.init($echartsDOM4);
      this.myEcharts5 = echarts.init($echartsDOM5);
      echarts.connect([
        this.myEcharts1,
        this.myEcharts2,
        this.myEcharts3,
        this.myEcharts5,
        this.myEcharts4
      ]);
      window.onresize = () => {
        this.myEcharts1.resize();
        this.myEcharts2.resize();
        this.myEcharts3.resize();
        this.myEcharts4.resize();
        this.myEcharts5.resize();
      };
      this.showLoading();
      this.dataChange(this.chartData);
    },
    showLoading (curVal) {
      if (curVal) {
        this.myEcharts1.showLoading();
        this.myEcharts2.showLoading();
        this.myEcharts3.showLoading();
        this.myEcharts4.showLoading();
        this.myEcharts5.showLoading();
      } else {
        this.myEcharts1.hideLoading();
        this.myEcharts2.hideLoading();
        this.myEcharts3.hideLoading();
        this.myEcharts4.hideLoading();
        this.myEcharts5.hideLoading();
      }
    },
    dataChange (datas) {
      console.log("chartData", datas);
      let voltageOptions = _.cloneDeep(options);
      voltageOptions.title.text = t('realTime.voltage'); // "电压";
      voltageOptions.yAxis.axisLabel.formatter = "{value} v";
      voltageOptions.series[0].data = datas.voltage;
      // voltageOptions.series[0].seriesName = "电压";
      voltageOptions.tooltip.formatter = p => {
        let item = "";
        p.forEach(v => {
          item += `${utils.dateFomat(v.value[0])}<br/>${t('realTime.voltage')}:${v.value[1]}V<br/>`;
        });
        return item;
      };
      this.myEcharts1.setOption(voltageOptions);

      let singleVoltageOptions = _.cloneDeep(options);
      singleVoltageOptions.title.text = t('realTime.singleVoltage'); // "单体电压";
      singleVoltageOptions.yAxis.axisLabel.formatter = "{value} V";
      singleVoltageOptions.series[0].data = datas.singleVoltage;
      singleVoltageOptions.tooltip.formatter = p => {
        let item = "";
        p.forEach(v => {
          item +=
            utils.dateFomat(v.value[0]) +
            "<br/>" +
            `${t('realTime.singleVoltage')}` +
            " : " +
            v.value[1] +
            "V<br/>";
        });
        return item;
      };
      this.myEcharts2.setOption(singleVoltageOptions);

      let currentOptions = _.cloneDeep(options);
      currentOptions.title.text = t('realTime.current'); // "电流";
      currentOptions.yAxis.axisLabel.formatter = "{value} A";
      currentOptions.series[0].data = datas.current;
      currentOptions.tooltip.formatter = p => {
        let item = "";
        p.forEach(v => {
          item +=
            utils.dateFomat(v.value[0]) +
            "<br/>" +
            `${t('realTime.current')}` +
            " : " +
            v.value[1] +
            "A<br/>";
        });
        return item;
      };
      this.myEcharts3.setOption(currentOptions);

      let temperatureOptions = _.cloneDeep(options);
      temperatureOptions.title.text = t('realTime.temperature'); // "温度";
      temperatureOptions.yAxis.axisLabel.formatter = "{value} ℃";
      temperatureOptions.series[0].data = datas.temperature;
      temperatureOptions.tooltip.formatter = p => {
        let item = "";
        p.forEach(v => {
          item +=
            utils.dateFomat(v.value[0]) +
            "<br/>" +
            `${t('realTime.temperature')}` +
            " : " +
            v.value[1] +
            "℃<br/>";
        });
        return item;
      };
      this.myEcharts4.setOption(temperatureOptions);

      let capacity = _.cloneDeep(options);
      capacity.title.text = t('realTime.quantity'); // "电量";
      capacity.yAxis.axisLabel.formatter = "{value} %";
      capacity.series[0].data = datas.capacity;
      capacity.tooltip.formatter = p => {
        let item = "";
        p.forEach(v => {
          item +=
            utils.dateFomat(v.value[0]) +
            "<br/>" +
            `${t('realTime.quantity')}` +
            " : " +
            v.value[1] +
            "%<br/>";
        });
        return item;
      };
      this.myEcharts5.setOption(capacity);
    }
  }
};
</script>

<style scoped lang="scss">
.bgFFF {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  .chartInfo {
    padding: 0 15px;
    flex: 1;
    width: 100%;
    height: 340px;
    margin-bottom: 20px;
  }
}
.btns {
  padding-left: 22px;
  margin-bottom: 20px;
}
</style>
