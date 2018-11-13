<template>
  <div class="detail">
    <div class="headNav">
      <!-- 详细信息 -->
      <mt-header class="Loginhead"
        :title="$t('alarmList.batteryDetail')">
        <router-link to="/index"
          slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
        <mt-button icon=""
          slot="right"></mt-button>
      </mt-header>
    </div>
    <ul>
      <li>
        <!-- 电池组客户企业 -->
        <div class="fl">{{$t('batteryList.customer')}}</div>
        <div class="fr">{{this.companyName}}</div>
      </li>
      <li>
        <!-- 电池组编号 -->
        <div class="fl">{{$t('batteryList.batteryCode')}}</div>
        <div class="fr">{{this.no}}</div>
      </li>
      <li>
        <!-- 电池组型号 -->
        <div class="fl">{{$t('batteryList.model')}}</div>
        <div class="fr">{{this.model}}</div>
      </li>
      <li>
        <!-- 电池组规格 -->
        <div class="fl">{{$t('batteryList.specif')}}</div>
        <div class="fr">{{this.norm}}</div>
      </li>
      <li>
        <!-- 电池组额定电压 -->
        <div class="fl">{{$t('batteryList.batteryVoltage')}}</div>
        <div class="fr">{{this.voltage}}V</div>
      </li>
      <li>
        <!-- 电池组额定容量 -->
        <div class="fl">{{$t('batteryList.batteryCapacity')}}</div>
        <div class="fr">{{this.capacity}}</div>
      </li>
      <li>
        <!-- 电池单体型号 -->
        <div class="fl">{{$t('batteryList.singleBattery')}}</div>
        <div class="fr">{{this.singleModel}}</div>
      </li>
      <li>
        <!-- 电池组生产日期 -->
        <div class="fl">{{$t('batteryList.createDate')}}</div>
        <div class="fr">{{this.dateProduction}}</div>
      </li>
      <li>
        <!-- 电池组出厂日期 -->
        <div class="fl">{{$t('batteryList.manufactureDate')}}</div>
        <div class="fr">{{this.dateExFactory}}</div>
      </li>
      <li>
        <!-- 电池组质保期 -->
        <div class="fl">{{$t('batteryList.warrantyDate')}}</div>
        <div class="fr">{{this.dateSecurity}}</div>
      </li>
      <li>
        <!-- 检测设备编号 -->
        <div class="fl">{{$t('batteryList.deviceCode')}}</div>
        <div class="fr">{{this.device_id}}</div>
      </li>

    </ul>
  </div>
</template>

<script>

export default {
  name: "detail",

  data () {
    return {
      capacity: '',
      client_id: '',
      companyName: '',
      dateExFactory: '',
      dateProduction: '',
      dateSecurity: '',
      device_id: '',
      id: '',
      model: '',
      no: '',
      norm: '',
      singleModel: '',
      voltage: ''
    };
  },
  methods: {
    getdetail () {
      // this.httpRequest.getdetail(this.$route.query.id).then(res=>{
      //   console.log(res)
      //   this.client_id=res.client_id;
      //   this.capacity=res.capacity;
      //   this.companyName=res.companyName;
      //   this.dateExFactory=this.getday(res.dateExFactory);
      //   this.dateProduction=this.getday(res.dateProduction);
      //   this.dateSecurity=this.getday(res.dateSecurity);
      //   this.device_id=res.device_id;
      //   this.id=res.id;
      //   this.model=res.model;
      //   this.no=res.no;
      //   this.norm=res.norm;
      //   this.voltage=res.voltage;
      //   this.singleModel=res.singleModel;
      // })
    }
  },
  activated () {
    // this.getdetail()
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
.detail {
  overflow: hidden;
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
.headNav {
  position: fixed;
  width: 100%;
  z-index: 999;
}
.main {
  overflow: hidden;
  padding-bottom: 50px;
  width: 100%;
}
ul {
  margin-top: 20px;
  padding: 10px 18px;
  li {
    overflow: hidden;
    margin-top: 25px;
  }
}
</style>
