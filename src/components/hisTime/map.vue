<template>
  <div class="maps">
    <div class="date">
      <mt-button v-show="!trajectory"
        :class="{'active': active === 'start'}"
        size="small"
        @click="startOnclick">
        <i class="iconfont icon-ic_song_next"></i>
      </mt-button>
      <mt-button v-show="!trajectory"
        :class="{'active': active === 'pause'}"
        size="small"
        @click="pauseOnclick">
        <i class="iconfont icon-artboard25copy"></i>
      </mt-button>
      <mt-button v-show="!trajectory"
        :class="{'active': active === 'resume'}"
        size="small"
        @click="resumeOnclick">
        <i class="iconfont icon-icons-resume_button"></i>
      </mt-button>
      <mt-button v-show="!trajectory"
        :class="{'active': active === 'stop'}"
        size="small"
        @click="stopOnclick">
        <i class="iconfont icon-stop"></i>
      </mt-button>
      <!-- 活动热区 -->
      <mt-button v-show="!trajectory"
        size="small"
        type="danger"
        @click="heat">{{$t('history.heatActive')}}</mt-button>
      <!-- 轨迹回放 -->
      <mt-button v-show="trajectory"
        size="small"
        type="primary"
        @click="posi">{{$t('history.TrackReplay')}}</mt-button>
    </div>
    <div id="map-container"
      class="historyContent"
      ref="mapChoice"></div>
  </div>
</template>
<script>
/* eslint-disable */
import AMap from "AMap";
import AMapUI from "AMapUI";
import utils from "@/utils/utils";
import t from "@/utils/translate";

let map;
let pathSimplifierIns;
let navg;
let infoWindow;
let heatmap;
// let address;
// let marker;
export default {
  props: {
    travelData: {
      type: Object,
      default: () => {
        return {
          travel: [],
          heatmap: []
        };
      }
    }
  },
  watch: {
    travelData: {
      handler: function (vals) {
        // console.log("component map", vals);
        if (this.trajectory) {
          this.heatMapFun(vals.heatmap);
        } else {
          this.positionChange(vals.travel);
        }
      },
      deep: true
    }
  },
  data () {
    return {
      active: "",
      trajectory: true,
      markerArr: [],
      timeSeconds: 50,
      alldistance: 0
    };
  },
  activated () {
    this.mapInit();
  },
  mounted () {
    this.mapInit();
  },
  methods: {
    mapInit () {
      map = new AMap.Map("map-container");
      AMap.plugin(["AMap.Heatmap"], () => {
        // 初始化heatmap对象
        heatmap = new AMap.Heatmap(map, {
          radius: 12, // 给定半径
          opacity: [0, 1] // 透明度
        });
        this.heatMapFun(this.travelData.heatmap);
      });
    },
    heat () {
      this.heatMapFun(this.travelData.heatmap);
    },
    posi () {
      this.active = "";
      this.positionChange(this.travelData.travel);
    },
    /* 热力图 方法 */
    heatMapFun (heatdata) {
      this.trajectory = true;
      if (!heatdata || heatdata.length < 1) {
        return;
      }
      if (this.markerArr.length > 0) {
        // 显示热力图的时候 删除地图上的marker点
        map.remove(this.markerArr);
      }
      pathSimplifierIns && pathSimplifierIns.setData([]); // 同理 去除轨迹
      map.setCenter([heatdata[0].lng, heatdata[0].lat]); // 显示热力图的时候，把热力图的第一个的 作为地图中心点
      heatmap.setDataSet({
        data: heatdata
      });
    },
    /* 轨迹相关方法 */
    positionChange (travels) {
      this.trajectory = false;
      heatmap && heatmap.setDataSet({ data: [] });
      if (!travels || travels.length < 1) {
        return;
      }
      if (this.markerArr.length > 0) {
        // 先删除地图上的marker点 然后在后面添加
        map.remove(this.markerArr);
      }
      this.alldistance = 0; // 两个点之间的距离
      for (let i = 0; i < travels.length; i++) {
        let dis;
        let p1;
        let p2;
        let key = travels[i];
        if (i < travels.length - 1) {
          p1 = new AMap.LngLat(key[0], key[1]);
          p2 = new AMap.LngLat(travels[i + 1][0], travels[i + 1][1]);
          dis = Math.round(p1.distance(p2));
        }
        if (typeof dis === "number") {
          this.alldistance += dis;
        }
      }
      AMapUI.load(["ui/misc/PathSimplifier"], PathSimplifier => {
        AMapUI.loadUI(["misc/PositionPicker"], PositionPicker => {
          let positionPicker = new PositionPicker({
            mode: "dragMarker",
            map: map,
            iconStyle: {
              url: '',// "http://pfsm46mq4.bkt.clouddn.com/iocna.png",
              size: [1, 1],
              ancher: [1, 1]
            }
          });
          pathSimplifierIns = new PathSimplifier({
            zIndex: 100,
            map: map,
            getHoverTitle: function (pathData, pathIndex, pointIndex) {
              if (pointIndex >= 0) {
                return `${t("history.No")} ${pointIndex} ${t(
                  "history.point"
                )}`;
              }
            },
            getPath: function (pathData) {
              return pathData.path;
            },
            renderOptions: {
              pathLineStyle: {
                strokeStyle: "rgb(193,21,52)",
                lineWidth: 6,
                dirArrowStyle: true
              },
              keyPointTolerance: 10,
              keyPointStyle: {
                radius: 3,
                fillStyle: "#20acff"
              }
            }
          });
          pathSimplifierIns.on("pointClick", (e, info) => {
            let pointIndex = info.pointIndex;
            let pathData = info.pathData;
            let point = pathData.path[pointIndex];
            let position = new AMap.LngLat(point[0], point[1]);
            positionPicker.start(position);
            positionPicker.on("success", result => {
              let infoAddress = [];
              infoAddress.push(
                `<div><div>${t("history.times")}：${utils.dateFomat(
                  point[2]
                )}</div>`
              );
              infoAddress.push(
                `<div style="font-size:14px;">${t("positions.address")} :${
                result.address
                }</div></div>`
              );
              infoWindow = new AMap.InfoWindow({
                content: info.join("<br/>")
              });
              infoWindow.open(map, position);
              map.on("click", () => {
                infoWindow.close();
              });
            });
          });
          window.pathSimplifierIns = pathSimplifierIns;
          pathSimplifierIns.setData([
            {
              name: t("history.track"), // "轨迹",
              path: travels
            }
          ]);
          // console.log("this.lineArr", this.lineArr);
          let distance = Number(this.alldistance) / 1000; // 米转成千米
          let times = Number(this.timeSeconds) / 3600; // 秒转成小时
          let speeds = Math.ceil(distance / times); // 最终得到的速度是 km/h
          navg = pathSimplifierIns.createPathNavigator(0, {
            loop: true,
            speed: speeds,
            pathNavigatorStyle: {
              width: 30,
              height: 30,
              strokeStyle: null,
              fillStyle: null,
              // 使用图片
              content: PathSimplifier.Render.Canvas.getImageContent(
                "../../../static/0181102120349.png"
              )
            }
          });
        });
        let startPot = travels[0];
        let endPot = travels[travels.length - 1];
        let start = new AMap.Marker({
          map: map,
          position: [startPot[0], startPot[1]], // 基点位置  开始位置
          icon: "https://webapi.amap.com/theme/v1.3/markers/n/start.png",
          zIndex: 50
        });
        let end = new AMap.Marker({
          map: map,
          position: [endPot[0], endPot[1]], // 基点位置  结束位置
          icon: "https://webapi.amap.com/theme/v1.3/markers/n/end.png",
          zIndex: 10
        });
        this.markerArr.push(start);
        this.markerArr.push(end);
      });
    },
    // 开始运动
    startOnclick () {
      navg && navg.start();
      this.active = "start";
    },
    // 暂停运动
    pauseOnclick () {
      navg && navg.pause();
      this.active = "pause";
    },
    // 继续运动
    resumeOnclick () {
      navg && navg.resume();
      this.active = "resume";
    },
    // 停止运动
    stopOnclick () {
      navg && navg.stop();
      this.active = "stop";
    },
    /* 设置速度 */
    speedChange () {
      if (this.timeSeconds < 1) {
        this.timeSeconds = 1;
      }
      let distance = Number(this.alldistance) / 1000;
      let times = Number(this.timeSeconds) / 3600;
      let speeds = Math.ceil(distance / times);
      navg.setSpeed(speeds);
    }
  }
};
</script>
<style lang="scss" scoped>
.maps {
  // position: relative;
  background: #ffffff;
  // padding: 24px;
  padding-bottom: 5px;
  text-align: right;
  // height: 260px;
  .date {
    display: inline-block;
    margin-bottom: 5px;
    // position: absolute;
    // top: -20px;
    // right: 5px;
    background: #ffffff;
    z-index: 10;
    // padding: 3px;
    border-radius: 3px;
    border: 1px solid #e5e5e5;
    font-size: 14px;
    .active {
      background: #ecf5ff;
      border: #b3d8ff;
      color: #409eff;
    }
  }
  .timeRange {
    position: absolute;
    top: 70px;
    right: 5px;
    background: #ffffff;
    z-index: 10;
    padding: 5px;
    font-size: 12px;
    border-radius: 3px;
    border: 1px solid #e5e5e5;
  }
  .historyContent {
    width: 100%;
    height: 260px;
  }
}
</style>
