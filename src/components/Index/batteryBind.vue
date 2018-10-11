<template>
  <div class="bind-content">
    <div class="headNav">
      <mt-header class="Loginhead" title="绑定设备">
        <router-link to="/index" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
        <mt-button icon="" slot="right"></mt-button>
      </mt-header>
    </div>
    <mt-field placeholder="请输入需要绑定的设备号" v-model="no"></mt-field>
    <div class="dp-content">
      <div v-show="!showList" v-for="item in deviceIdOpts" :key="item.id" @click.stop="selectItem(item)" class="select-item">
        <div class="select-item_value">{{item.code}}</div>
        <div class="select-item_title">绑定</div>
      </div>
      <div v-show="showList" class="select-item">
        <p class="textCenter">暂无数据</p>
      </div>
    </div>
  </div>
</template>

<script>
import { MessageBox, Toast } from "mint-ui";
import Paho from "Paho";
import mqttConfig from "../../api/mqtt.config";

let mqttClient = {};
export default {
  name: "batteryBind",

  data() {
    return {
      id: "", // 电池id
      no: "", //输入no
      bindHostId: "",
      selectOptions: [],
      filterOptions: [],
      showList: false,
      deviceIdOpts: []
    };
  },
  methods: {
    selectItem(data) {
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
          let message = new Paho.MQTT.Message(`k:${this.batteryCode}`);
          message.destinationName = `cmd/${bindObj.deviceCode}`;
          console.log(message);
          mqttClient.send(message);
          this.getDeviceList();
        }
      });
    },
    connectMqtt() {
      mqttClient = new Paho.MQTT.Client(
        mqttConfig.hostname,
        mqttConfig.port,
        mqttConfig.clientId
      );
      mqttClient.connect({
        onSuccess: this.onConnect,
        reconnect: mqttConfig.reconnect,
        keepAliveInterval: mqttConfig.keepAliveInterval,
        useSSL: mqttConfig.useSSL,
        timeout: mqttConfig.timeout
      });
      mqttClient.onFailure = res => {
        console.log(res);
      };
      mqttClient.onConnectionLost = responseObject => {
        console.log("mqtt-closed:", responseObject);
      };
      mqttClient.onMessageArrived = message => {
        console.log("message", message);
      };
    },
    onConnect() {
      if (
        typeof mqttClient === "object" &&
        typeof mqttClient.subscribe === "function"
      ) {
        console.log("mqtt is connected");
      }
    },
    getDeviceList() {
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
    no: function(val) {
      if (!val) {
        this.deviceIdOpts = [];
      } else {
        this.code = val;
        this.getDeviceList();
      }
    }
  },
  mounted() {
    this.hostId = this.$route.query.hostId;
    this.hostCode = this.$route.query.code;
    this.batteryCode = this.$route.query.batteryCode;
    this.connectMqtt();
  },
  destroyed() {
    if (typeof mqttClient === "object" && mqttClient.isConnected()) {
      // console.log(mqttClient);
      mqttClient.disconnect();
      mqttClient = {};
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
