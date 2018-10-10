<template>
  <div>
    <div id="mapContainers" class="realMapContainer"></div>
  </div>
</template>
<script>
import AMap from "AMap";
import { Toast } from "mint-ui";
import utils from "@/utils/utils";
import lnglatTrabsofor from "@/utils/longlatTransfor";

let map;
let marker;
const PI = 3.14159265358979324;
const x_pi = (3.14159265358979324 * 3000.0) / 180.0;
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
      IdObj: {},
      address: "",
      hostId: "",
      deviceId: "",
      deviceCode: "",
      id: ""
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
            this.addressCallBack(sendAddress);
          }
        });
      }
    },
    /* 发送地址给后台 */
    addressCallBack(data) {
      let param = {
        id: this.IdObj.id,
        address: data
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
.realMapContainer {
  width: 100%;
  height: 220px;
}
</style>
