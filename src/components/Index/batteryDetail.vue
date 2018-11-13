<template>
  <div class="edit-battery">
    <div class="headNav">
      <!-- 详细信息 -->
      <mt-header class="Loginhead"
        v-bind:title="$t('batteryList.batteryDetail')">
        <router-link v-show="!isAddPt"
          to="/index"
          slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
        <mt-button icon=""
          slot="left"
          @click="doCancelSaveData"
          v-show="isAddPt">{{$t('timeBtn.cancle')}}</mt-button>
        <!-- 取消 -->
        <mt-button icon=""
          slot="right"
          @click="doSaveData"
          v-show="isAddPt">{{$t('timeBtn.save')}}</mt-button>
        <!-- 保存 -->
        <mt-button icon=""
          slot="right"
          @click="editBattery"
          v-show="!isAddPt">{{$t('user.edit')}}</mt-button>
        <!-- 编辑 -->
      </mt-header>
    </div>

    <div class="dp-content">
      <div class="select-item">
        <!-- 电池组客户企业 -->
        <div class="select-item_value">{{$t('batteryList.customer')}}</div>
        <div :class="{'colorGray': isAddPt}"
          class="select-item_title">{{tableObj.companyName}}</div>
        <!-- <div class="arrow-right" v-show="isAddPt">
          <img src="/static/jiantou2.svg" alt="">
        </div> -->
      </div>
      <div class="select-item">
        <!-- 电池组编号 -->
        <mt-field :label="$t('batteryList.batteryCode')"
          :class="{'colorGray': isAddPt}"
          v-model="tableObj.code"
          :disabled="true"></mt-field>
      </div>
      <div class="select-item">
        <!-- 电池组型号 -->
        <div class="select-item_value">{{$t('batteryList.model')}}</div>
        <div class="select-item_title"
          @click="openProp('model')">{{tableObj.model}}</div>
        <div class="arrow-right"
          v-show="isAddPt">
          <img src="/static/jiantou2.svg"
            alt="">
        </div>
      </div>
      <div class="select-item">
        <!-- 电池组规格 -->
        <div class="select-item_value">{{$t('batteryList.specif')}}</div>
        <div class="select-item_title"
          @click="openProp('specif')">{{tableObj.norm}}</div>
        <div class="arrow-right"
          v-show="isAddPt">
          <img src="/static/jiantou2.svg"
            alt="">
        </div>
      </div>
      <div class="select-item">
        <!-- 电池组额定电压 -->
        <mt-field :label="$t('batteryList.batteryVoltage')"
          v-model="tableObj.voltage"
          type="tel"
          :disabled="!isAddPt"></mt-field>
      </div>
      <div class="select-item">
        <!-- 电池组额定容量 -->
        <mt-field :label="$t('batteryList.batteryCapacity')"
          v-model="tableObj.capacity"
          type="tel"
          :disabled="!isAddPt"></mt-field>
      </div>
      <div class="select-item">
        <!-- 电池单体型号 -->
        <div class="select-item_value">{{$t('batteryList.singleBattery')}}</div>
        <div class="select-item_title"
          @click="openProp('singleModel')">{{tableObj.singleModel}}</div>
        <div class="arrow-right"
          v-show="isAddPt">
          <img src="/static/jiantou2.svg"
            alt="">
        </div>
      </div>
      <div class="select-item">
        <!-- 电池组生产日期 -->
        <div class="select-item_value">{{$t('batteryList.createDate')}}</div>
        <div class="select-item_title"
          @click="openPropDate('porduct')">{{tableObj.manufacturerDate}}</div>
        <div class="arrow-right"
          v-show="isAddPt">
          <img src="/static/jiantou2.svg"
            alt="">
        </div>
      </div>
      <div class="select-item">
        <!-- 电池组出厂日期 -->
        <div class="select-item_value">{{$t('batteryList.manufactureDate')}}</div>
        <div class="select-item_title"
          @click="openPropDate('factory')">{{tableObj.productionDate}}</div>
        <div class="arrow-right"
          v-show="isAddPt">
          <img src="/static/jiantou2.svg"
            alt="">
        </div>
      </div>
      <div class="select-item">
        <!-- 电池组质保期 -->
        <div class="select-item_value">{{$t('batteryList.warrantyDate')}}</div>
        <div class="select-item_title"
          @click="openPropDate('quality')">{{tableObj.qualityGuaranteeDate}}</div>
        <div class="arrow-right"
          v-show="isAddPt">
          <img src="/static/jiantou2.svg"
            alt="">
        </div>
      </div>
      <div class="select-item">
        <!-- 设备编号 -->
        <div class="select-item_value">{{$t('batteryList.deviceCode')}}</div>
        <div :class="{'colorGray': isAddPt}"
          class="select-item_title">{{deviceCode}}</div>
        <!-- <div class="arrow-right" v-show="isAddPt">
          <img src="/static/jiantou2.svg" alt="">
        </div> -->
      </div>
    </div>

    <mt-popup v-model="selectVisible"
      position="bottom"
      class="mint-popup-4">
      <mt-picker valueKey="name"
        @change="onValuesChange"
        :slots="selectOpts"
        :visible-item-count="5"
        :show-toolbar="true">
        <!-- 取消 -->
        <div class="mint-datetime-action mint-datetime-cancel"
          @click.stop="cancel">{{$t('timeBtn.cancle')}}</div>
        <!-- 确定 -->
        <div class="mint-datetime-action mint-datetime-confirm"
          @click="sureBtn">{{$t('timeBtn.sure')}}</div>
      </mt-picker>
    </mt-popup>

    <mt-datetime-picker ref="picker"
      type="date"
      v-model="date"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      :cancelText="$t('timeBtn.cancle')"
      :confirmText="$t('timeBtn.sure')"
      @confirm="dateChange">
    </mt-datetime-picker>

  </div>
</template>

<script>
import { Toast, Indicator } from "mint-ui";
import utils from "@/utils/utils";
import t from "@/utils/translate";

export default {
  name: "batteryDetail",

  data () {
    return {
      chooseValue: "",
      form: {
        client_id: "",
        no: "",
        model: "",
        norm: "",
        voltage: "",
        capacity: "",
        singleModel: "",
        dateProduction: "",
        dateExFactory: "",
        dateSecurity: "",
        device_id: ""
      },
      show: {
        client_id: "",
        model: "",
        norm: "",
        singleModel: "",
        device_id: "",
        dateProduction: "",
        dateExFactory: "",
        dateSecurity: ""
      },
      // select
      selectVisible: false,
      selectState: "", // 打开的是哪一个
      selectOpts: [
        {
          flex: 1,
          values: []
        }
      ],
      selectVal: "", // 中间量
      opts: {
        client_id: [],
        model: [],
        norm: [],
        singleModel: [],
        device_id: []
      },
      // date picker
      date: new Date(), // picker model
      datePickerState: "",
      tableObj: {},

      Modeloptions: "",
      singleModelOptions: "",
      NormOpyions: "",
      Timetype: "",

      deviceCode: "",
      id: "",
      isAddPt: false // 是否有add、编辑权限
    };
  },
  methods: {
    /* 取消保存 */
    doCancelSaveData () {
      this.queryDetail();
      this.isAddPt = false;
    },
    /* 保存修改 */
    doSaveData () {
      console.log(this.tableObj);
      if (!this.tableObj.voltage) {
        Toast(t('batteryList.warn.batteryVoltage')); // ("电压不能为空");
        return;
      }
      if (!this.tableObj.capacity) {
        Toast(t('batteryList.warn.batteryCapacity')); // ("额定容量不能为空");
        return;
      }

      let options = {
        normId: this.tableObj.normId,
        norm: this.tableObj.norm,
        modelId: this.tableObj.modelId,
        model: this.tableObj.model,
        singleModelId: this.tableObj.singleModelId,
        singleModel: this.tableObj.singleModel,
        voltage: this.tableObj.voltage,
        capacity: this.tableObj.capacity,
        productionDate: this.tableObj.manufacturerDate,
        manufacturerDate: this.tableObj.productionDate,
        qualityGuaranteeDate: this.tableObj.qualityGuaranteeDate
      };
      console.log(options);
      Indicator.open();
      this.$axios
        .put(`/battery_group/${this.tableObj.id}`, options)
        .then(res => {
          Indicator.close();
          console.log(res);
          if (res.data && res.data.code === 0) {
            Toast(t('successTips.changeSuccess'));
            this.doCancelSaveData();
          }
        });
    },
    cancel () {
      this.selectVisible = false;
    },
    onValuesChange (picker, values) {
      this.chooseValue = values[0];
    },
    sureBtn () {
      if (this.selectType === "singleModel") {
        /* 电池单体型号 */
        this.tableObj.singleModel = this.chooseValue.name;
        this.tableObj.singleModelId = this.chooseValue.id;
      }
      if (this.selectType === "specif") {
        /* 电池组规格 */
        this.tableObj.norm = this.chooseValue.name;
        this.tableObj.normId = this.chooseValue.id;
      }
      if (this.selectType === "model") {
        /* 电池组型号 */
        this.tableObj.model = this.chooseValue.name;
        this.tableObj.modelId = this.chooseValue.id;
      }
      this.selectVisible = false;
    },
    dateChange (value) {
      let data = utils.yyyymmdd(value);
      console.log(data);
      if (this.Timetype === "porduct") {
        this.$set(this.tableObj, "manufacturerDate", data);
        // this.prodHasData = true;
      }
      if (this.Timetype === "factory") {
        this.$set(this.tableObj, "productionDate", data);
        // this.factoryTime = true;
      }
      if (this.Timetype === "quality") {
        this.$set(this.tableObj, "qualityGuaranteeDate", data);
        // this.qualityTime = true;
      }
    },
    openPropDate (str) {
      if (!this.isAddPt) return;
      this.Timetype = str;
      this.$refs.picker.open();
    },
    openProp (str) {
      if (this.isAddPt) {
        this.selectVisible = true;
        console.log(str);
        this.selectType = str;
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
      }
    },
    editBattery () {
      this.isAddPt = true;
    },
    /* 根据电池编号获取电池组 */
    queryDetail () {
      Indicator.open();
      this.$axios.get(`/battery_group/${this.id}`).then(res => {
        console.log(res);
        if (res.data && res.data.code === 0) {
          Indicator.close();
          let result = res.data.data;
          this.tableObj = result;
        }
      });
    },
    /* 获取电池组规格列表 */
    getGroupSpecif () {
      this.$axios.get("/dic?type=Norm&categoryId=2").then(res => {
        console.log("电池组规格", res);
        if (res.data && res.data.code === 0) {
          this.NormOpyions = res.data.data;
        }
      });
    },
    /* 获取电池单体型号列表 */
    getSinglBattery () {
      this.$axios.get("/dic?type=SingleModel&categoryId=2").then(res => {
        console.log("电池单体型号", res);
        if (res.data && res.data.code === 0) {
          this.singleModelOptions = res.data.data;
        }
      });
    },
    /* 获取电池型号列表 */
    getBatteryModelList () {
      this.$axios.get("/dic?type=Model&categoryId=2").then(res => {
        console.log("获取电池型号列表", res);
        if (res.data && res.data.code === 0) {
          this.Modeloptions = res.data.data;
        }
      });
    },
    init () {
      this.getGroupSpecif();
      this.getSinglBattery();
      this.getBatteryModelList();
    }
  },
  mounted () {
    this.id = this.$route.query.code;
    this.deviceCode = this.$route.query.deviceCode;
    this.init();
    if (this.id) {
      this.queryDetail();
    }
  }
};
</script>

<style lang="scss">
.colorGray {
  color: #a0a0a0;
}
.edit-battery {
  height: 100%;
  background-color: #f2f2f2;
  text-align: left;

  /*header*/
  .headNav {
    width: 100%;
    z-index: 999;
  }
  .Loginhead {
    background: #484848;
  }

  /*select*/
  .dp-content {
    margin: 10px 0;
    padding: 2px 10px;
    background: #fff;
  }

  .select-item {
    height: 40px;
    display: flex;
    align-items: center;
    border-bottom: 1px dashed #e5e5e5;
    background-color: #fff;
    padding: 0 10px;
    height: 42px;
  }
  .select-item_value {
    width: 150px;
    display: flex;
    align-items: center;
    color: #a0a0a0;
  }
  .select-item_title {
    flex: 1;
    text-align: right;
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
      border-bottom: solid 1px #eaeaea;
    }
  }

  .mint-cell {
    width: 100%;
    min-height: 40px;

    .mint-cell-wrapper {
      padding-left: 0;
      padding-right: 0;
      background-image: none;
    }

    .mint-field-core {
      text-align: right;
      color: inherit;
    }

    .mint-cell-title {
      width: 130px;
    }

    .mint-cell-text {
      color: #a0a0a0;
    }
  }

  .mint-cell:last-child {
    background-image: none;
  }

  .arrow-right {
    margin-left: 8px;
    img {
      width: 12px;
      height: 12px;
      vertical-align: middle;
    }
  }

  input:disabled {
    background-color: #fff;
  }
}
</style>
