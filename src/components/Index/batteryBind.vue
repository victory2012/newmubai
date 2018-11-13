<template>
  <div class="bind-content">
    <div class="headNav">
      <!-- 绑定设备 -->
      <mt-header class="Loginhead"
        :title="$t('batteryList.bindTitle')">
        <router-link to="/index"
          slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
        <mt-button icon=""
          slot="right"></mt-button>
      </mt-header>
    </div>
    <!-- 请输入需要绑定的设备号 -->
    <mt-field :placeholder="$t('batteryList.warn.deviceCode')"
      v-model="no"></mt-field>
    <div class="dp-content">
      <div v-show="!showList"
        v-for="item in deviceIdOpts"
        :key="item.id"
        @click.stop="selectItem(item)"
        class="select-item">
        <div class="select-item_value">{{item.code}}</div>
        <!-- 绑定 -->
        <div class="select-item_title">{{$t('batteryList.bind')}}</div>
      </div>
      <div v-show="showList"
        class="select-item">
        <!-- 暂无数据 -->
        <p class="textCenter">{{$t('noData')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
/* eslint-disable */
import Paho from "Paho";
import t from "@/utils/translate";
import mqtt from "@/api/mqtt.config";

export default {
  name: "batteryBind",

  data () {
    return {
      mqttClient: {},
      id: "", // 电池id
      no: "", // 输入no
      bindHostId: "",
      selectOptions: [],
      filterOptions: [],
      showList: false,
      deviceIdOpts: []
    };
  },
  methods: {
    selectItem (data) {
      console.log(data);
      let bindObj = {
        hostId: this.hostId,
        deviceId: data.id,
        hostCode: this.hostCode,
        deviceCode: data.code
      };
      this.$axios.put("host/bind", bindObj).then(res => {
        console.log(res);
        if (res.data && res.data.code === 0) {
          Toast({
            message: res.data.msg
          });
          setTimeout(() => {
            this.$router.push("/index");
          }, 1200);
          let message = new Paho.MQTT.Message(`k:${this.batteryCode}`);
          message.destinationName = `cmd/${bindObj.deviceCode}`;
          console.log(message);
          this.mqttClient.send(message);
        }
      });
    },
    connectMqtt () {
      this.mqttClient = mqtt.mqttClient();
      this.mqttClient.connect({
        onSuccess: this.onConnect,
        reconnect: mqtt.mqttConfig().reconnect,
        keepAliveInterval: mqtt.mqttConfig().keepAliveInterval,
        useSSL: mqtt.mqttConfig().useSSL,
        timeout: mqtt.mqttConfig().timeout
      });
      this.mqttClient.onFailure = res => {
        console.log(res);
      };
      this.mqttClient.onConnectionLost = responseObject => {
        console.log("mqtt-closed:", responseObject);
      };
      this.mqttClient.onMessageArrived = message => {
        console.log("message", message);
      };
    },
    onConnect () {
      if (
        typeof this.mqttClient === "object" &&
        typeof this.mqttClient.subscribe === "function"
      ) {
        console.log("mqtt is connected");
      }
    },
    getDeviceList () {
      this.$axios
        .get(`/device/code?status=0&bindingStatus=0&code=${this.code}`)
        .then(res => {
          console.log("设备编号", res);
          if (res.data && res.data.code === 0) {
            if (res.data.data.length < 1) {
              this.showList = true;
              this.deviceIdOpts = [];
            } else {
              this.showList = false;
              this.deviceIdOpts = res.data.data;
            }
          }
        });
    }
  },
  watch: {
    no: function (val) {
      if (!val) {
        this.deviceIdOpts = [];
      } else {
        this.code = val;
        this.getDeviceList();
      }
    }
  },
  mounted () {
    this.hostId = this.$route.query.hostId;
    this.hostCode = this.$route.query.code;
    this.batteryCode = this.$route.query.batteryCode;
    this.connectMqtt();
  },
  destroyed () {
    if (typeof this.mqttClient === "object" && this.mqttClient.isConnected()) {
      // console.log(mqttClient);
      this.mqttClient.disconnect();
    }
  }
};
</script>

<style lang="scss">
.bind-content {
  height: 100%;
  background-color: #f2f2f2;
  overflow: hidden;
  /*header*/
  .headNav {
    width: 100%;
    z-index: 999;
  }
  .Loginhead {
    background: #484848;
    margin-bottom: 12px;
  }
  /*input*/
  .mint-cell {
    min-height: 46px;
  }
  .mint-cell-wrapper {
    box-sizing: border-box;
    padding: 0 5% !important;
    background-image: none;
  }
  .mint-cell:last-child {
    background-image: none;
  }
  /*select*/
  .dp-content {
    margin-top: 12px;
  }

  .select-item {
    height: 46px;
    display: flex;
    align-items: center;
    background-color: #fff;
    margin: 1px 0;
    padding: 0 5%;
  }
  .select-item_value {
    flex: 1;
    display: flex;
    align-items: center;
  }
  .select-item_title {
    width: 105px;
    flex: none;
    color: #71bfdb;
  }
  .textCenter {
    flex: 1;
    text-align: center;
    font-size: 13px;
    color: #b6b6b6;
  }
}
</style>
