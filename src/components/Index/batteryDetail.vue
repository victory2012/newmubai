<template>
  <div class="edit-battery">
    <div class="headNav">
      <mt-header class="Loginhead" v-bind:title="id?'详细信息':'电池登记'">
        <router-link to="/index" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
        <mt-button icon="" slot="right" v-if="isAddPt">完成</mt-button>
      </mt-header>
    </div>

    <div class="dp-content">
      <div class="select-item">
        <div class="select-item_value">电池组客户企业</div>
        <div class="select-item_title">{{tableObj.companyName}}</div>
        <div class="arrow-right" v-show="isAddPt">
          <img src="/static/jiantou2.svg" alt="">
        </div>
      </div>
      <div class="select-item">
        <mt-field label="电池组编号" v-model="tableObj.code" :disabled="!isAddPt"></mt-field>
      </div>
      <div class="select-item">
        <div class="select-item_value">电池组型号</div>
        <div class="select-item_title">{{tableObj.model}}</div>
        <div class="arrow-right" v-show="isAddPt">
          <img src="/static/jiantou2.svg" alt="">
        </div>
      </div>
      <div class="select-item">
        <div class="select-item_value">电池组规格</div>
        <div class="select-item_title">{{tableObj.norm}}</div>
        <div class="arrow-right" v-show="isAddPt">
          <img src="/static/jiantou2.svg" alt="">
        </div>
      </div>
      <div class="select-item">
        <mt-field label="电池组额定电压" v-model="tableObj.voltage" type="number" :disabled="!isAddPt"></mt-field>
      </div>
      <div class="select-item">
        <mt-field label="电池组额定容量" v-model="tableObj.capacity" type="number" :disabled="!isAddPt"></mt-field>
      </div>
      <div class="select-item">
        <div class="select-item_value">电池单体型号</div>
        <div class="select-item_title">{{tableObj.singleModel}}</div>
        <div class="arrow-right" v-show="isAddPt">
          <img src="/static/jiantou2.svg" alt="">
        </div>
      </div>
      <div class="select-item">
        <div class="select-item_value">电池组生产日期</div>
        <div class="select-item_title">{{tableObj.manufacturerDate}}</div>
        <div class="arrow-right" v-show="isAddPt">
          <img src="/static/jiantou2.svg" alt="">
        </div>
      </div>
      <div class="select-item">
        <div class="select-item_value">电池组出厂日期</div>
        <div class="select-item_title">{{tableObj.productionDate}}</div>
        <div class="arrow-right" v-show="isAddPt">
          <img src="/static/jiantou2.svg" alt="">
        </div>
      </div>
      <div class="select-item">
        <div class="select-item_value">电池组质保期</div>
        <div class="select-item_title">{{tableObj.qualityGuaranteeDate}}</div>
        <div class="arrow-right" v-show="isAddPt">
          <img src="/static/jiantou2.svg" alt="">
        </div>
      </div>
      <div class="select-item">
        <div class="select-item_value">设备编号(选填)</div>
        <div class="select-item_title">{{tableObj.deviceCode || '无'}}</div>
        <div class="arrow-right" v-show="isAddPt">
          <img src="/static/jiantou2.svg" alt="">
        </div>
      </div>
    </div>

    <mt-popup v-model="selectVisible" position="bottom" class="mint-popup-4">
      <mt-picker :slots="selectOpts" :visible-item-count="5" :show-toolbar="true">
        <div class="mint-datetime-action mint-datetime-cancel" @click.stop="cancel">取消</div>
        <div class="mint-datetime-action mint-datetime-confirm" @click.stop="ok">确定</div>
      </mt-picker>
    </mt-popup>

    <mt-datetime-picker ref="picker" type="date" v-model="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="dateChange">
    </mt-datetime-picker>

  </div>
</template>

<script>
// import { MessageBox, Toast } from "mint-ui";
// import * as _m from "moment";
// import _cache from "../cache.js";
// import { checkPermisstion } from "../../common/js/auth";

export default {
  name: "batteryDetail",

  data() {
    return {
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
      selectState: "", //打开的是哪一个
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
      id: "",
      isAddPt: false // 是否有add、编辑权限
    };
  },
  methods: {
    dateChange() {},
    /* 根据电池编号获取电池组 */
    queryDetail() {
      this.$axios.get(`/battery_group/${this.id}`).then(res => {
        console.log(res);
        if (res.data && res.data.code === 0) {
          let result = res.data.data;
          this.tableObj = result;
        }
      });
    }
  },
  mounted() {
    this.id = this.$route.query.code;
    if (this.id) {
      this.queryDetail();
    }
  }
};
</script>

<style lang="scss">
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
    padding: 0 20px;
    height: 42px;
  }
  .select-item_value {
    width: 130px;
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
