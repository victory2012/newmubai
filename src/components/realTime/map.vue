<template>
  <div class="RealMaps">
    <div id="mapContainers" class="realMapContainer"></div>
    <div class="localBtn" @click="gobackLocal"><img :src="ImgSrc" alt=""></div>
  </div>
</template>
<script>
import AMap from "AMap";
import { Toast } from "mint-ui";
import utils from "@/utils/utils";
import lnglatTrabsofor from "@/utils/longlatTransfor";

let map;
let marker;
// const PI = 3.14159265358979324;
// const x_pi = (3.14159265358979324 * 3000.0) / 180.0;
export default {
  props: ["mapCenter"],
  watch: {
    mapCenter: {
      handler: function(param) {
        this.positionData(param);
      },
      deep: true
    }
  },
  data() {
    return {
      markerArr: [],
      ImgSrc: require("../../../static/local_normal.png"),
      IdObj: {},
      address: "",
      hostId: "",
      deviceId: "",
      deviceCode: "",
      id: "",
      mapCenterPointer: ""
    };
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
    this.init();
  },
  methods: {
    init() {
      map = new AMap.Map("mapContainers");
    },
    positionData(data) {
      if (data && data.gcjLongitude) {
        let position = new AMap.LngLat(data.gcjLongitude, data.gcjLatitude);
        if (this.markerArr.length > 0) {
          this.markerArr.forEach(key => {
            key.setMap(null);
          });
        }
        marker = new AMap.Marker({
          icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
          position: position
        });
        marker.setMap(map);
        this.markerArr.push(marker);
        this.mapCenterPointer = position;
        map.setCenter(position);
        /* 根据经纬度 用高德查询详细地址 */
        lnglatTrabsofor(position, res => {
          let sendAddress = `${res.addressComponent.province}-${
            res.addressComponent.city
          }`;
          if (this.address !== sendAddress) {
            this.hasSend = false;
            this.address = sendAddress;
            this.$emit("addressCallback", sendAddress);
          }
          if (!this.hasSend) {
            this.addressCallBack(res.addressComponent);
          }
        });
      }
    },
    gobackLocal() {
      if (this.mapCenterPointer) {
        map.setCenter(this.mapCenterPointer);
      }
    },
    /* 发送地址给后台 */
    addressCallBack(data) {
      let param = {
        id: this.IdObj.id,
        province: data.province ? data.province : data.city,
        city: data.city
      };
      this.$axios.put(`battery_group/address`, param).then(res => {
        console.log(res);
        if (res.data && res.data.code === 0) {
          this.hasSend = true;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.RealMaps {
  position: relative;
  height: 220px;
  .realMapContainer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 220px;
  }
  .localBtn {
    position: absolute;
    bottom: 5px;
    left: 10px;
    padding: 3px;
    background: #ffffff;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
    z-index: 180;
    font-size: 0;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.2);
    img {
      width: 20px;
      height: auto;
    }
  }
}
</style>
