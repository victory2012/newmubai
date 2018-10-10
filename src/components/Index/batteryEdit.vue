<template>
  <div class="bind-content">
    <div class="headNav">
      <mt-header class="Loginhead" v-bind:title="'更改'+item.text">
        <router-link to="/batteryDetail" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
        <mt-button icon="" slot="right" @click.stop="_submit">保存</mt-button>
      </mt-header>
    </div>

    <div v-if="item.type=='text'">
      <mt-field v-bind:placeholder="'请输入'+item.text" type="text" v-model="item.val"></mt-field>
    </div>
    <div v-if="item.type=='mumber'">
      <mt-field v-bind:placeholder="'请输入'+item.text" type="number" v-model="item.val"></mt-field>
    </div>
    <div v-if="item.type=='date'" @click="openDatePicker" class="mint-cell cell-val">
      {{showVal || '请点击选择'+item.text}}
    </div>
    <div v-if="item.type=='select'" @click="openPopPicker" class="mint-cell cell-val">
      {{showVal || '请点击选择'+item.text}}
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
import * as _m from "moment";

export default {
  name: "batteryBind",

  data() {
    return {
      item: {}, // item data
      date: new Date(), // picker model
      showVal: "", // show val
      selectVal: "", // select 中间val
      popupVisible: false,
      selectOpts: [
        {
          flex: 1,
          values: []
        }
      ]
    };
  },
  methods: {
    edit(params) {
      this.httpRequest
        .editBatteryItem(params)
        .then(res => {
          Toast({
            message: res["message"],
            position: "bottom"
          });

          // this.$router.push("/index");
        })
        .catch(err => {
          Toast({
            message: err["response"]["data"]["message"],
            position: "bottom",
            duration: 3000
          });
        });
    },
    checkForm() {
      if (!this.item.val) {
        Toast({
          message: this.item.text + "不能为空",
          position: "bottom"
        });

        return false;
      }

      return true;
    },
    _submit() {
      if (!this.checkForm()) return;

      let params = {
        id: this.id
      };
      params[this.item.key] = this.item.val;

      this.edit(params);
    },
    openDatePicker() {
      this.$refs.picker.open();
    },
    dateChange(value) {
      this.item.val = _m(value).unix();
      this.showVal = _m(value).format("YYYY-MM-DD");
    },
    openPopPicker() {
      this.popupVisible = true;
    },
    onValuesChange(picker, values) {
      // 中间量
      this.selectVal = values[0];
    },
    cancel() {
      this.popupVisible = false;
    },
    ok() {
      this.cancel();

      if (this.selectVal) {
        let that = this;
        let sItem = this.item.opts.filter(function(item) {
          return item.no === that.selectVal || item.name === that.selectVal;
        });

        console.log("=> sItem:\n" + JSON.stringify(sItem));
        // 赋值
        this.item.val = sItem[0].id;
        this.showVal = sItem[0].no || sItem[0].name;
      }
    }
  }
  // activated() {
  //   // init
  //   Object.assign(this.$data, this.$options.data());

  //   // set
  //   this.item = this.$route.query.data;

  //   if (this.item["opts"].length) {
  //     let tempArr = [];
  //     this.item["opts"].map(v => {
  //       tempArr.push(v["no"] || v["name"]);
  //     });

  //     this.selectOpts[0].values = tempArr;
  //   } else {
  //     this.selectOpts[0].values = ["无可选项"];
  //   }
  // }
};
</script>

<style scoped lang="scss">
/*header*/
.mint-header {
  padding: 0 5%;
}
.bind-content {
  height: 100%;
  background-color: #fafafa;
  overflow: hidden;
  text-align: left;
}
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
