<template>
  <div class="warning-detail">
    <div class="headNav">
      <!-- 告警详情 -->
      <mt-header class="Loginhead"
        :title="$t('alarmList.alarmDetail')">
        <mt-button @click="colosePruop"
          slot="left"
          icon="back"></mt-button>
        <mt-button icon=""
          slot="right"></mt-button>
      </mt-header>
    </div>
    <ul>
      <!-- <li>
        告警事件
        <div class="fl">告警事件</div>
        <div class="fr">{{warnData.item}}</div>
      </li> -->
      <li>
        <!-- 告警发生时间 -->
        <div class="fl">{{$t('alarmList.time')}}</div>
        <div class="fr">{{warnData.createTime}}</div>
      </li>
      <li>
        <!-- 电池组型号 -->
        <div class="fl">{{$t('batteryList.model')}}</div>
        <div class="fr">{{warnData.normls}}</div>
      </li>
      <li>
        <!-- 电池编号 -->
        <div class="fl">{{$t('batteryList.batteryCode')}}</div>
        <div class="fr">{{warnData.hostCode}}</div>
      </li>
      <li>
        <!-- 告警层级 -->
        <div class="fl">{{$t('alarmList.alarmHierarchy')}}</div>
        <div class="fr">{{warnData.hierarchy}}</div>
      </li>
      <li>
        <!-- 告警项目 -->
        <div class="fl">{{$t('alarmList.alarmItem')}}</div>
        <div class="fr">{{warnData.items}}</div>
      </li>
      <li>
        <!-- 告警级别 -->
        <div class="fl">{{$t('alarmList.alarmLevel')}}</div>
        <div class="fr">{{warnData.levels}}</div>
      </li>
      <li>
        <!-- 告警内容 -->
        <div class="fl">{{$t('alarmList.content')}}</div>
        <div class="fr">{{warnData.content}}</div>
      </li>
      <li>
        <!-- 客户 -->
        <div class="fl">{{$t('alarmList.customer')}}</div>
        <div class="fr">{{warnData.companyName}}</div>
      </li>
      <li>
        <!-- 位置 -->
        <div class="fl">{{$t('alarmList.latLng')}}</div>
        <div class="fr">{{warnData.address}}</div>
      </li>
      <li>
        <!-- 温度 -->
        <div class="fl">{{$t('realTime.temperature')}}</div>
        <div class="fr">{{warnData.temperature}}℃</div>
      </li>
      <li>
        <!-- 液位 -->
        <div class="fl">{{$t('realTime.fluid')}}</div>
        <div class="fr">{{warnData.fluidLevel}}</div>
      </li>
      <li>
        <!-- 电压 -->
        <div class="fl">{{$t('realTime.voltage')}}</div>
        <div class="fr">{{warnData.voltage}}V</div>
      </li>
      <li>
        <!-- 电流 -->
        <div class="fl">{{$t('realTime.current')}}</div>
        <div class="fr">{{warnData.current}}A</div>
      </li>

    </ul>
  </div>
</template>

<script>
export default {
  name: "warningDetail",
  props: {
    warnData: {
      type: Object,
      default: () => { }
    }
  },
  // watch: {
  //   warnData: {
  //     handler: function(val) {
  //     },
  //     deep: true
  //   }
  // },
  data () {
    return {
      warnIng: this.warnData
    };
  },
  methods: {
    colosePruop () {
      this.$emit("closeIt", {
        closed: true
      });
    }
  }
};
</script>

<style scoped lang="scss">
.fl {
  float: left;
  color: #a0a0a0;
}
.fr {
  float: right;
}
.warning-detail {
  width: 100vw;
  background: #f2f2f2;
  min-height: 100vh;
}
.Loginhead {
  background: #484848;
}
nav {
  height: 30px;
  padding: 3px;
  background: #484848;
  width: 100%;
  color: #cccccc;
  font-size: 11px;
  position: relative;
}

.main {
  overflow: hidden;
  padding-bottom: 50px;
  width: 100%;
}
ul {
  margin-top: 50px;
  padding: 25px 18px 0;
  background: #fff;
  overflow: hidden;
  li {
    overflow: hidden;
    margin-bottom: 10px;
    font-size: 14px;
  }
}
</style>
