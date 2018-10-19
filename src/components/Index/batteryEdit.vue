<template>
  <div class="bind-content">
    <mt-header class="Loginhead" v-bind:title="'电池登记'">
      <router-link to="/index" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <mt-button icon="" slot="right" @click.stop="_submit">保存</mt-button>
    </mt-header>
    <div class="fieldWarp">
      <ul>
        <li>
          <div class="itmeKey">电池组编号</div>
          <div class="itmeValue">
            <input type="text" placeholder="请输入电池组编号" v-model="battery.username">
          </div>
        </li>
        <li>
          <div class="itmeKey">电池组额定电压</div>
          <div class="itmeValue">
            <input type="text" placeholder="请输入额定电压" v-model="battery.voltage">
          </div>
        </li>
        <li>
          <div class="itmeKey">电池组额定容量</div>
          <div class="itmeValue">
            <input type="text" placeholder="请输入额定电压" v-model="battery.capacity">
          </div>
        </li>
        <li>
          <div class="itmeKey">电池组客户企业</div>
          <div class="itmeValue" @click="openPopPicker('customer')">
            <span v-show="!customer">选择客户企业</span><img v-show="!customer" class="downIcon" :src="ImgSrc" alt="">
            <p v-show="customer">{{battery.customer}}</p>
          </div>
        </li>
        <li>
          <div class="itmeKey">电池组型号</div>
          <div class="itmeValue" @click="openPopPicker('model')">
            <span v-show="!model">选择电池组型号</span><img v-show="!model" class="downIcon" :src="ImgSrc" alt="">
            <p v-show="model">{{battery.BatteryModel}}</p>
          </div>
        </li>
        <li>
          <div class="itmeKey">电池组规格</div>
          <div class="itmeValue" @click="openPopPicker('specif')">
            <span v-show="!specif">选择电池组规格</span><img v-show="!specif" class="downIcon" :src="ImgSrc" alt="">
            <p v-show="specif">{{battery.specif}}</p>
          </div>
        </li>
        <li>
          <div class="itmeKey">电池单体型号</div>
          <div class="itmeValue" @click="openPopPicker('singleModel')">
            <span v-show="!singleModel">选择电池单体型号</span><img v-show="!singleModel" class="downIcon" :src="ImgSrc" alt="">
            <p v-show="singleModel">{{battery.singleModel}}</p>
          </div>
        </li>

        <li>
          <div class="itmeKey">电池组生产日期</div>
          <div class="itmeValue" @click="openDatePicker('porduct')">
            <span v-show="!prodHasData">选择生产日期</span><img v-show="!prodHasData" class="downIcon" :src="ImgSrc" alt="">
            <p v-show="prodHasData">{{battery.productTime}}</p>
          </div>
        </li>
        <li>
          <div class="itmeKey">电池组出厂日期</div>
          <div class="itmeValue" @click="openDatePicker('factory')">
            <span v-show="!factoryTime">选择出厂日期</span><img v-show="!factoryTime" class="downIcon" :src="ImgSrc" alt="">
            <p v-show="factoryTime">{{battery.factoryTime}}</p>
          </div>
        </li>
        <li>
          <div class="itmeKey">电池组质保期</div>
          <div class="itmeValue" @click="openDatePicker('quality')">
            <span v-show="!qualityTime">选择质保期</span><img v-show="!qualityTime" class="downIcon" :src="ImgSrc" alt="">
            <p v-show="qualityTime">{{battery.qualityTime}}</p>
          </div>
        </li>
        <li>
          <div class="itmeKey">监测设备编号</div>
          <div class="itmeValue" @click="openPopPicker('deviceCode')">
            <span v-show="!deviceCode">选择设备编号</span><img v-show="!deviceCode" class="downIcon" :src="ImgSrc" alt="">
            <p v-show="deviceCode">{{battery.deviceCode}}</p>
          </div>
        </li>
      </ul>
    </div>

    <mt-datetime-picker ref="picker" type="date" v-model="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="dateChange">
    </mt-datetime-picker>

    <mt-popup v-model="popupVisible" position="bottom" class="mint-popup-4">
      <mt-picker :slots="selectOpts" @change="onValuesChange" :visible-item-count="3" :show-toolbar="true">
        <div class="mint-datetime-action mint-datetime-cancel" @click.stop="cancel">取消</div>
        <div class="mint-datetime-action mint-datetime-confirm" @click.stop="ok">确定</div>
      </mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import { MessageBox, Toast } from "mint-ui";
import utils from "@/utils/utils";

export default {
  name: "batteryBind",

  data() {
    return {
      battery: {}, // item data
      date: new Date(), // picker model
      showVal: "", // show val
      selectVal: "", // select 中间val
      popupVisible: false,
      prodHasData: false,
      factoryTime: false,
      qualityTime: false,

      deviceCode: false,
      singleModel: false,
      customer: false,
      model: false,
      specif: false,

      ImgSrc: require("../../../static/down.png"),
      deviceIdOpts: "", // 设备编号
      batCustomOpts: "", // 客户企业
      Modeloptions: "", // 电池型号列表
      singleModelOptions: "", // 电池单体型号
      NormOpyions: "", // 电池组规格
      selectOpts: [
        {
          flex: 1,
          values: []
        }
      ]
    };
  },
  methods: {
    checkForm() {},
    _submit() {},
    openDatePicker(str) {
      console.log("Timetype", str);
      this.Timetype = str;
      this.$refs.picker.open();
    },
    dateChange(value) {
      let data = utils.yyyymmdd(value);
      console.log(data);
      if (this.Timetype === "porduct") {
        this.$set(this.battery, "productTime", data);
        this.prodHasData = true;
      }
      if (this.Timetype === "factory") {
        this.$set(this.battery, "factoryTime", data);
        this.factoryTime = true;
      }
      if (this.Timetype === "quality") {
        this.$set(this.battery, "qualityTime", data);
        this.qualityTime = true;
      }
    },
    openPopPicker(str) {
      console.log(str);
      this.selectTypes = str;
      this.selectOpts[0].values = [];
      if (str === "singleModel") {
        /* 电池单体型号 */
        if (this.singleModelOptions) {
          this.singleModelOptions.forEach(key => {
            this.selectOpts[0].values.push(key);
          });
        }
      }
      if (str === "specif") {
        /* 电池组规格 */
        if (this.NormOpyions) {
          this.NormOpyions.forEach(key => {
            this.selectOpts[0].values.push(key);
          });
        }
      }
      if (str === "model") {
        /* 电池组型号 */
        if (this.Modeloptions) {
          this.Modeloptions.forEach(key => {
            this.selectOpts[0].values.push(key);
          });
        }
      }
      if (str === "customer") {
        /* 客户企业 */
        if (this.batCustomOpts) {
          this.batCustomOpts.forEach(key => {
            this.selectOpts[0].values.push(key);
          });
        }
      }
      if (str === "deviceCode") {
        /* 设备编号 */
        if (this.deviceIdOpts) {
          this.deviceIdOpts.forEach(key => {
            this.selectOpts[0].values.push(key);
          });
        }
      }
      this.popupVisible = true;
    },
    onValuesChange(picker, values) {},
    cancel() {
      // if (this.selectTypes === "singleModel") {
      //   /* 电池单体型号 */
      //   this.singleModel = true;
      // }
      // if (this.selectTypes === "specif") {
      //   /* 电池组规格 */
      //   this.specif = true;
      // }
      // if (this.selectTypes === "model") {
      //   /* 电池组型号 */
      //   this.model = true;
      // }
      // if (this.selectTypes === "customer") {
      //   /* 客户企业 */
      //   this.customer = true;
      // }
      // if (this.selectTypes === "deviceCode") {
      //   this.deviceCode = true;
      // }
      this.popupVisible = false;
    },
    /* 获取电池组规格列表 */
    getGroupSpecif() {
      this.$axios.get("/dic?type=Norm&categoryId=2").then(res => {
        console.log("电池组规格", res);
        if (res.data && res.data.code === 0) {
          this.NormOpyions = res.data.data;
        }
      });
    },
    /* 获取电池单体型号列表 */
    getSinglBattery() {
      this.$axios.get("/dic?type=SingleModel&categoryId=2").then(res => {
        console.log("电池单体型号", res);
        if (res.data && res.data.code === 0) {
          this.singleModelOptions = res.data.data;
        }
      });
    },
    /* 获取电池型号列表 */
    getBatteryModelList() {
      this.$axios.get("/dic?type=Model&categoryId=2").then(res => {
        console.log("获取电池型号列表", res);
        if (res.data && res.data.code === 0) {
          this.Modeloptions = res.data.data;
          // console.log(utils);
          // utils.setStorage("Modeloptions", JSON.stringify(res.data.data));
          // this.$store.commit(
          //   "SETGroupModelOpts",
          //   JSON.stringify(res.data.data)
          // );
        }
      });
    },
    /* 获取电池组客户企业表 */
    getCompanyId() {
      this.$axios.get("/company/purchase_names").then(res => {
        console.log("获取电池组客户企业表", res);
        if (res.data && res.data.code === 0) {
          this.batCustomOpts = res.data.data;
          // this.$store.commit("SETCustomOpts", JSON.stringify(res.data.data));
          // utils.setStorage("batCustomOpts", JSON.stringify(res.data.data));
        }
      });
    },
    /* 设备编号 */
    getDeviceList() {
      this.$axios.get("/device/code?status=0&bindingStatus=0").then(res => {
        console.log("设备编号", res);
        if (res.data && res.data.code === 0) {
          this.deviceIdOpts = res.data.data;
          // utils.setStorage("deviceIdOpts", JSON.stringify(res.data.data));
          // this.$store.commit(
          //   "SETdeviceIdOpts",
          //   JSON.stringify(res.data.data)
          // );
        }
      });
    }
  },
  mounted() {
    this.getGroupSpecif();
    this.getSinglBattery();
    this.getCompanyId();
    this.getBatteryModelList();
    this.getDeviceList();
  }
};
</script>

<style scoped lang="scss">
/*header*/
.mint-header {
  padding: 0 5%;
}
.fieldWarp {
  padding: 0 15px;
  ul {
    li {
      line-height: 50px;
      display: flex;
      // border-bottom: 1px dashed #e5e5e5;
      div {
        flex: 1;
        font-size: 14px;
        &.itmeKey {
          color: #858585;
          text-align: left;
        }
        &.itmeValue {
          color: #333333;
          text-align: left;
          border-bottom: 1px solid #e5e5e5;
          .downIcon {
            vertical-align: middle;
            width: 16px;
            margin: 0 15px;
          }
          span {
            display: inline-block;
            width: 116px;
          }
          input {
            height: 28px;
            width: 100%;
            border: none;
            // border-bottom: 1px solid #e5e5e5;
            vertical-align: middle;
          }
        }
      }
    }
  }
}
// .bind-content {
//   height: 100%;
//   background-color: #fafafa;

//   text-align: left;
// }
.headNav {
  width: 100%;
  z-index: 999;
}
.Loginhead {
  background: #484848;
  margin-bottom: 12px;
}
/*date*/
.cell-val {
  display: flex;
  align-items: center;
  padding: 0 10px;
}
.mint-popup-4 {
  width: 100%;
  .picker-slot-wrapper,
  .picker-item {
    backface-visibility: hidden;
  }
  .picker-toolbar {
    border-bottom: solid 1px #eaeaea !important;
  }
}
</style>
