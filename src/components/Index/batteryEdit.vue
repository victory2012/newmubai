<template>
  <div class="bind-content">
    <mt-header class="Loginhead" v-bind:title="'电池登记'">
      <router-link to="/index" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <mt-button icon="" slot="right" @click.stop="_submit">登记</mt-button>
    </mt-header>
    <div class="fieldWarp">
      <ul>
        <li>
          <div class="itmeKey">电池组编号<span>*</span></div>
          <div class="itmeValue">
            <input type="text" placeholder="请输入电池组编号" v-model="battery.batteryCode">
          </div>
        </li>
        <li>
          <div class="itmeKey">电池组额定电压<span>*</span></div>
          <div class="itmeValue">
            <input type="text" placeholder="请输入额定电压" v-model="battery.voltage">
          </div>
        </li>
        <li>
          <div class="itmeKey">电池组额定容量<span>*</span></div>
          <div class="itmeValue">
            <input type="text" placeholder="请输入额定电压" v-model="battery.capacity">
          </div>
        </li>
        <li>
          <div class="itmeKey">电池组客户企业<span>*</span></div>
          <div class="itmeValue" @click="openPopPicker('customer')">
            <span v-show="!customer">选择客户企业</span>
            <span v-show="customer">{{battery.customer}}</span>
            <img class="downIcon" :src="ImgSrc" alt="">
          </div>
        </li>
        <li>
          <div class="itmeKey">电池组型号<span>*</span></div>
          <div class="itmeValue" @click="openPopPicker('model')">
            <span v-show="!model">选择电池组型号</span>
            <span v-show="model">{{battery.BatteryModel}}</span>
            <img class="downIcon" :src="ImgSrc" alt="">
          </div>
        </li>
        <li>
          <div class="itmeKey">电池组规格<span>*</span></div>
          <div class="itmeValue" @click="openPopPicker('specif')">
            <span v-show="!specif">选择电池组规格</span>
            <span v-show="specif">{{battery.specif}}</span>
            <img class="downIcon" :src="ImgSrc" alt="">
          </div>
        </li>
        <li>
          <div class="itmeKey">电池单体型号<span>*</span></div>
          <div class="itmeValue" @click="openPopPicker('singleModel')">
            <span v-show="!singleModel">选择电池单体型号</span>
            <span v-show="singleModel">{{battery.singleModel}}</span>
            <img class="downIcon" :src="ImgSrc" alt="">
          </div>
        </li>

        <li>
          <div class="itmeKey">电池组生产日期<span>*</span></div>
          <div class="itmeValue" @click="openDatePicker('porduct')">
            <span v-show="!prodHasData">选择生产日期</span>
            <span v-show="prodHasData">{{battery.productTime}}</span>
            <img class="downIcon" :src="ImgSrc" alt="">
          </div>
        </li>
        <li>
          <div class="itmeKey">电池组出厂日期<span>*</span></div>
          <div class="itmeValue" @click="openDatePicker('factory')">
            <span v-show="!factoryTime">选择出厂日期</span>
            <span v-show="factoryTime">{{battery.factoryTime}}</span>
            <img class="downIcon" :src="ImgSrc" alt="">
          </div>
        </li>
        <li>
          <div class="itmeKey">电池组质保期<span>*</span></div>
          <div class="itmeValue" @click="openDatePicker('quality')">
            <span v-show="!qualityTime">选择质保期</span>
            <span v-show="qualityTime">{{battery.qualityTime}}</span>
            <img class="downIcon" :src="ImgSrc" alt="">
          </div>
        </li>
        <li>
          <div class="itmeKey">监测设备编号</div>
          <div class="itmeValue" @click="openPopPicker('deviceCode')">
            <span v-show="!deviceCode">选择设备编号</span>
            <span v-show="deviceCode">{{battery.deviceCode}}</span>
            <img class="downIcon" :src="ImgSrc" alt="">
          </div>
        </li>
      </ul>
    </div>

    <mt-datetime-picker ref="picker" type="date" v-model="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="dateChange">
    </mt-datetime-picker>
    <!-- :visible-item-count="3" :show-toolbar="false" -->
    <mt-popup v-model="popupVisible" position="bottom" class="mint-popup-4">
      <mt-picker valueKey="name" :slots="selectOpts" @change="onValuesChange" :visible-item-count="3" :show-toolbar="true">
        <div class="mint-datetime-action mint-datetime-cancel" @click.stop="cancel">取消</div>
        <div class="mint-datetime-action mint-datetime-confirm" @click="sureBtn">确定</div>
      </mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import { Toast, Indicator } from "mint-ui";
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
          values: ["获取错误"],
          className: "slot1",
          textAlign: "center"
        }
      ]
    };
  },
  methods: {
    checkForm() {},
    _submit() {
      console.log(this.battery);
      if (!this.battery.batteryCode) {
        Toast("电池编号不能为空");
        return;
      }
      if (!this.battery.voltage) {
        Toast("额定电压不能为空");
        return;
      }
      if (!this.battery.capacity) {
        Toast("额定容量不能为空");
        return;
      }
      if (!this.battery.customer) {
        Toast("客户企业不能为空");
        return;
      }
      if (!this.battery.BatteryModel) {
        Toast("电池型号不能为空");
        return;
      }
      if (!this.battery.specif) {
        Toast("电池规格不能为空");
        return;
      }
      if (!this.battery.singleModel) {
        Toast("单体型号不能为空");
        return;
      }
      if (!this.battery.productTime) {
        Toast("生产日期不能为空");
        return;
      }
      if (!this.battery.factoryTime) {
        Toast("出厂日期不能为空");
        return;
      }
      if (!this.battery.qualityTime) {
        Toast("质保期不能为空");
        return;
      }
      let params = {
        code: this.battery.batteryCode,
        modelId: this.battery.BatteryModelId,
        model: this.battery.BatteryModel,
        normId: this.battery.specifId,
        norm: this.battery.specif,
        companyId: this.battery.customerId,
        companyName: this.battery.customer,
        voltage: this.battery.voltage,
        capacity: this.battery.capacity,
        singleModelId: this.battery.singleModelId,
        singleModel: this.battery.singleModel,
        productionDate: this.battery.productTime,
        manufacturerDate: this.battery.factoryTime,
        qualityGuaranteeDate: this.battery.qualityTime
      };
      if (this.battery.deviceCode && this.battery.deviceId) {
        params.deviceId = this.battery.deviceId;
        params.deviceCode = this.battery.deviceCode;
      }
      Indicator.open();
      this.$axios.post("/battery_group", params).then(res => {
        console.log("添加电池组", res);
        Indicator.close();
        if (res.data && res.data.code === 0) {
          Toast(res.data.msg);
          // this.$emit("hasCreated", { value: true });
          this.battery = {};
          this.deviceCode = false;
          this.singleModel = false;
          this.customer = false;
          this.model = false;
          this.specif = false;
          this.prodHasData = false;
          this.factoryTime = false;
          this.qualityTime = false;
          // this.$store.state.addBattery = false;
        }
      });
    },
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
            this.selectOpts[0].values.push({
              id: key.id,
              name: key.dicKey
            });
          });
        }
      }
      if (str === "specif") {
        /* 电池组规格 */
        if (this.NormOpyions) {
          this.NormOpyions.forEach(key => {
            this.selectOpts[0].values.push({
              id: key.id,
              name: key.dicKey
            });
          });
        }
      }
      if (str === "model") {
        /* 电池组型号 */
        if (this.Modeloptions) {
          this.Modeloptions.forEach(key => {
            this.selectOpts[0].values.push({
              id: key.id,
              name: key.dicKey
            });
          });
        }
      }
      if (str === "customer") {
        /* 客户企业 */
        if (this.batCustomOpts) {
          this.batCustomOpts.forEach(key => {
            this.selectOpts[0].values.push({
              id: key.id,
              name: key.name
            });
          });
        }
      }
      if (str === "deviceCode") {
        /* 设备编号 */
        if (this.deviceIdOpts) {
          this.selectOpts[0].values.push({
            id: "",
            name: "无"
          });
          this.deviceIdOpts.forEach(key => {
            this.selectOpts[0].values.push({
              id: key.id,
              name: key.code
            });
          });
        }
      }
      this.popupVisible = true;
    },
    onValuesChange(picker, values) {
      // console.log("picker", picker);
      console.log("values", values);
      this.chooseValue = values[0];
    },
    sureBtn() {
      if (this.selectTypes === "singleModel") {
        /* 电池单体型号 */
        // this.$set(this.battery, "singleModel", this.chooseValue.name);
        this.battery.singleModel = this.chooseValue.name;
        this.battery.singleModelId = this.chooseValue.id;
        this.singleModel = true;
      }
      if (this.selectTypes === "specif") {
        /* 电池组规格 */
        this.battery.specif = this.chooseValue.name;
        this.battery.specifId = this.chooseValue.id;
        this.specif = true;
      }
      if (this.selectTypes === "model") {
        /* 电池组型号 */
        this.battery.BatteryModel = this.chooseValue.name;
        this.battery.BatteryModelId = this.chooseValue.id;
        this.model = true;
      }
      if (this.selectTypes === "customer") {
        /* 客户企业 */

        this.battery.customer = this.chooseValue.name;
        this.battery.customerId = this.chooseValue.id;
        this.customer = true;
      }
      if (this.selectTypes === "deviceCode") {
        /* 设备编号 */
        if (this.chooseValue.name && this.chooseValue.id) {
          this.deviceCode = true;
          this.battery.deviceCode = this.chooseValue.name;
          this.battery.deviceId = this.chooseValue.id;
        } else {
          this.deviceCode = false;
          this.battery.deviceCode = "";
          this.battery.deviceId = "";
        }
      }
      this.popupVisible = false;
    },
    cancel() {
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
          span {
            color: red;
            font-size: 16px;
            margin-left: 5px;
          }
        }
        &.itmeValue {
          color: #333333;
          text-align: left;
          border-bottom: 1px solid #e5e5e5;
          .downIcon {
            vertical-align: middle;
            width: 16px;
            margin: 0 10px;
          }
          span {
            display: inline-block;
            width: 140px;
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
