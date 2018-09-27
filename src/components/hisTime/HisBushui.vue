<template>
  <div class="warrps">
    <div class="wraningItem" v-for="item in listData" :key="item.time">
      <ul class="WItop">
        <li class="fl">{{item.index}}</li>
        <li class="fl"></li>
        <li class="fl">
          <div>{{item.Replenishing}}</div>
          <p>距上次补水: {{item.updateWater}}</p>

        </li>
        <li class="fl">
          <h2>{{item.temperature}}°</h2>
          <p>补水温度</p>
        </li>
      </ul>
      <ul>
        <li>
          <div>{{item.address}}</div>
        </li>
      </ul>
    </div>
  </div>

</template>

<script>
export default {
  name: "HisBushui",
  props: {
    fliudData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      listData: this.fliudData
    };
  },
  mounted() {
    console.log(this.listData);
  }
};
</script>
<style lang="scss" scoped>
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
  margin-left: 12px;
  margin-bottom: 10px;
  background: #71bfdb;
  font-size: 12px;
}

.wraningItem {
  height: 110px;
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
    margin-top: 20px;
    li:nth-child(1) {
      width: 5%;
      color: #71bfdb;
      font-size: 25px;
      margin-top: 5px;
    }

    li:nth-child(3) {
      width: 60%;
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
      font-size: 12px;
      width: 20%;
      border-right: 1px #aaaaaa solid;
      h2 {
        font-size: 16px;
      }
      p {
        color: #a0a0a0;
      }
    }
    li:nth-child(5) {
      font-size: 12px;
      width: 20%;
      h2 {
        font-size: 16px;
      }
      p {
        color: #a0a0a0;
      }
    }
  }
}

.currentIndex {
  color: #000;
  background: #fff;
}
</style>
