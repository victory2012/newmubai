<template>
  <div class="bgFFF">
    <div class="chartInfo"
      id="echart1"></div>
    <div class="chartInfo"
      id="echart2"></div>
    <div class="chartInfo"
      id="echart3"></div>
    <div class="chartInfo"
      id="echart4"></div>
  </div>
</template>

<script>
/* eslint-disable */
import echarts from "echarts";
import _ from "lodash";
import utils from "@/utils/utils";
import options from "@/config/echartOptions";
import t from "@/utils/translate";

export default {
  props: {
    chartData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    mqttData: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      timeArr: [],
      singleVoltage: [],
      temperature: [],
      voltage: [],
      current: [],
      myEcharts: null,
      isOptionAbnormal: false
    };
  },
  mounted () {
    this.init();
  },
  watch: {
    mqttData: {
      handler: function (val) {
        this.formatter(val);
      },
      deep: true
    },
    chartData: {
      handler: function (val) {
        // console.log("chartData changes", val);
        this.dataChange(val);
      },
      deep: true
    }
  },
  methods: {
    init () {
      let $echartsDOM1 = document.getElementById("echart1");
      let $echartsDOM2 = document.getElementById("echart2");
      let $echartsDOM3 = document.getElementById("echart3");
      let $echartsDOM4 = document.getElementById("echart4");
      this.myEcharts1 = echarts.init($echartsDOM1);
      this.myEcharts2 = echarts.init($echartsDOM2);
      this.myEcharts3 = echarts.init($echartsDOM3);
      this.myEcharts4 = echarts.init($echartsDOM4);

      echarts.connect([
        this.myEcharts1,
        this.myEcharts2,
        this.myEcharts3,
        this.myEcharts4
      ]);
      // console.log(myEcharts1);
      // console.log(echarts);
      window.onresize = () => {
        this.myEcharts1.resize();
        this.myEcharts2.resize();
        this.myEcharts3.resize();
        this.myEcharts4.resize();
      };
      this.dataChange(this.chartData);
    },
    dataChange (datas) {
      // console.log("datas.current1", datas.current);
      // console.log("datas.current2", -datas.current);
      let voltageOptions = _.cloneDeep(options);
      voltageOptions.title.text = t("realTime.voltage"); // "电压";
      voltageOptions.yAxis.axisLabel.formatter = "{value} v";
      voltageOptions.series[0].data = datas.voltage;
      voltageOptions.tooltip.formatter = p => {
        let item = "";
        p.forEach(v => {
          item += `${utils.dateFomat(v.value[0])}<br/>${t(
            "realTime.voltage"
          )}:${v.value[1]}V<br/>`;
        });
        return item;
      };
      this.myEcharts1.setOption(voltageOptions);

      let singleVoltageOptions = _.cloneDeep(options);
      singleVoltageOptions.title.text = t("realTime.singleVoltage");// "单体电压";
      singleVoltageOptions.yAxis.axisLabel.formatter = "{value} v";
      singleVoltageOptions.series[0].data = datas.singleVoltage;
      singleVoltageOptions.tooltip.formatter = p => {
        let item = "";
        p.forEach(v => {
          item += `${utils.dateFomat(v.value[0])}<br/>${t(
            "realTime.singleVoltage"
          )}:${v.value[1]}V<br/>`;
        });
        return item;
      };
      this.myEcharts2.setOption(singleVoltageOptions);

      let currentOptions = _.cloneDeep(options);
      currentOptions.title.text = t("realTime.current"); //"电流";
      currentOptions.yAxis.axisLabel.formatter = "{value} A";
      currentOptions.series[0].data = datas.current;
      currentOptions.tooltip.formatter = p => {
        let item = "";
        p.forEach(v => {
          item += `${utils.dateFomat(v.value[0])}<br/>${t(
            "realTime.current"
          )}:${v.value[1]}A<br/>`;
        });
        return item;
      };
      this.myEcharts3.setOption(currentOptions);

      let temperatureOptions = _.cloneDeep(options);
      temperatureOptions.title.text = t("realTime.temperature"); // "温度";
      temperatureOptions.yAxis.axisLabel.formatter = "{value} ℃";
      temperatureOptions.series[0].data = datas.temperature;
      temperatureOptions.tooltip.formatter = p => {
        let item = "";
        p.forEach(v => {
          item += `${utils.dateFomat(v.value[0])}<br/>${t(
            "realTime.temperature"
          )}:${v.value[1]}℃<br/>`;
        });
        return item;
      };
      this.myEcharts4.setOption(temperatureOptions);
    },
    formatter (data) {
      // console.log('实时数据', data);
      // console.log("data.current1", data.current);
      // console.log("data.current2", -data.current);
      this.chartData.voltage.shift();
      this.chartData.singleVoltage.shift();
      this.chartData.current.shift();
      this.chartData.temperature.shift();
      this.chartData.voltage.push({
        name: data.times,
        value: [data.times, data.voltage]
      });
      this.chartData.singleVoltage.push({
        name: data.times,
        value: [data.times, data.singleVoltage]
      });
      this.chartData.current.push({
        name: data.times,
        value: [data.times, -data.current]
      });
      this.chartData.temperature.push({
        name: data.times,
        value: [data.times, data.temperature]
      });
      // console.log('chartData', this.chartData);
      this.myEcharts1.setOption({
        series: [
          {
            data: this.chartData.voltage
          }
        ]
      });
      this.myEcharts2.setOption({
        series: [
          {
            data: this.chartData.singleVoltage
          }
        ]
      });
      this.myEcharts3.setOption({
        series: [
          {
            data: this.chartData.current
          }
        ]
      });
      this.myEcharts4.setOption({
        series: [
          {
            data: this.chartData.temperature
          }
        ]
      });
    }
  }
};
</script>

<style scoped lang="scss">
.bgFFF {
  background: #ffffff;
  .chartInfo {
    padding: 0 15px;
    width: 100%;
    height: 340px;
    margin-bottom: 20px;
  }
}
.btns {
  padding-left: 22px;
  margin-bottom: 20px;
}
// .echarts {
//   width: 100%;
//   height: 100%;
// }
</style>
