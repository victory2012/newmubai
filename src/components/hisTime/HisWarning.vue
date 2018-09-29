<template>
  <!--listData.data-->
  <div class="warrps">

    <div class="wraningItem" v-for="item in alarmData" :key="item.time">
      <ul class="WItop">
        <li class="fl">{{item.index}}</li>
        <li class="fl">
          <h2>{{item.hostCode}}</h2>
          <div>电池编号</div>
        </li>
        <li class="fl">
          <div>{{item.createTime}}</div>
          <div>{{item.companyName}}</div>
        </li>
        <li class="fl">
          {{item.items}}
        </li>
      </ul>
      <ul class="WIbottom">
        <li>
          告警内容：{{item.content}}
        </li>

      </ul>
    </div>
  </div>

</template>

<script>
// import AMap from "AMap";

export default {
  name: "HisWarning",
  props: {
    alaData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      alarmData: this.alaData,
      listData: {},
      pages: 1,
      sum: ""
    };
  },
  watch: {
    alaData: {
      handler: function(val) {
        console.log(val);
        this.alarmData = val;
      }
    }
  },
  mounted() {
    console.log(this.alaData);
  }
};
</script>


<style scoped="" lang="scss">
.warrps {
  width: 100%;
  background: #ffffff;
}
.fl {
  float: left;
}
.fenyeBtn {
  height: 25px;
  width: 25px;
  text-align: center;
  padding: 0;
  margin-left: 8px;
  margin-bottom: 10px;
  background: #71bfdb;
  font-size: 12px;
}

.wraningItem {
  height: 100px;
  width: 90%;
  margin-left: 5%;
  border-left: 1px #f4f4f4 solid;
  border-right: 1px #f4f4f4 solid;
  border-top: 1px #fafafa solid;
  margin-top: 15px;
  box-shadow: 1px 1px 1px #e3e3e3;
  margin-bottom: 15px;
  .WItop {
    width: 100%;
    height: 60px;
    padding-top: 15px;
    padding-left: 10px;
    li:nth-child(1) {
      width: 5%;
      color: #71bfdb;
      font-size: 20px;
      padding-right: 20px;
      border-right: 1px #aaaaaa solid;
    }
    li:nth-child(2) {
      width: 20%;
      h2 {
        color: #484848;
        font-size: 12px;
      }
      div {
        color: #a0a0a0;
        font-size: 12px;
      }
    }
    li:nth-child(3) {
      width: 38%;
      font-size: 12px;
      div {
        height: 18px;
        line-height: 20px;
      }
      div:nth-child(1) {
        border-bottom: 1px #bfbfbf solid;
      }
      div:nth-child(2) {
        margin-top: 2px;
      }
    }
    li:nth-child(4) {
      font-size: 20px;
      color: #71bfdb;
      margin-left: 20px;
    }
  }
  .WIbottom {
    height: 30px;
    font-size: 12px;
    padding: 0 10px 0;
    li {
      line-height: 30px;
      text-align: center;
      margin-top: 5px;
      h2,
      p {
        float: left;
      }
      h2 {
        color: #a0a0a0;
      }
      p {
        color: #484848;
        margin-left: 3px;
      }
    }
    li:nth-child(3) {
      width: 27%;
    }
    li:nth-child(2) {
      width: 22%;
    }
    li:nth-child(4) {
      width: 25%;
      margin-left: 3px;
    }
  }
}

.wrap-map {
  width: 55%;
  height: 139px;
  margin-left: 24%;
  border: #a0a0a0 1px solid;
  text-align: center;
  border-radius: 5px;
  margin-top: 20px;
  margin-bottom: 20px;
}

#map-container {
  width: 94%;
  height: 94%;
  margin-top: 3%;
  margin-left: 3%;
}
.currentIndex {
  color: #000;
  background: #fff;
}
</style>
