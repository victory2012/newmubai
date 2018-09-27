<template>
  <div class="main" @click="toItem">
    <div class="warningItem">
      <div class="main-top">
        <div class="fl mta">
          <h2>{{itemData.items}}</h2>
          <p>告警项目</p>
        </div>
        <div class="fl mtb">
          <div class="timedata">{{itemData.createTime}}</div>
          <div>{{itemData.companyName}}</div>
        </div>
        <div class="fl mtc">
          {{itemData.actualValue}}
        </div>
      </div>
      <div class="main-bottom">
        <div class="mba fl">
          <h3 class="fl">电池编号&nbsp;&nbsp;</h3>
          <p class="fl">{{itemData.hostCode}}</p>
        </div>
        <div class="mbb fl">
          <h3 class="fl">告警描述&nbsp;&nbsp;</h3>
          <p class="fl">{{itemData.content}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MessageBox, Toast, Popup } from "mint-ui";
import detail from "./detail";

export default {
  props: ["itemData"],
  components: {
    "mt-popup": Popup,
    "mt-detail": detail
  },
  data() {
    return {};
  },
  methods: {
    toItem() {
      console.log(this.itemData.id);
      this.$router.push({
        path: "/warningDetail",
        query: { id: this.itemData.id }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.main {
  border-bottom: 1px solid #f2f2f2;
  .fl {
    float: left;
  }
  background: #f2f2f2;
  .warningItem {
    height: 104px;
    margin-top: 10px;
    margin-bottom: 10px;
    background: #fff;
    padding: 15px 10px 5px;
    .main-top {
      height: 65px;
      .mta {
        width: 30%;
        margin-top: 5px;
        h2 {
          font-size: 20px;
          color: #71bfdb;
        }
        p {
          color: #a0a0a0;
          margin-top: 5px;
          font-size: 12px;
        }
      }
      .mtb {
        width: 43%;
        font-size: 12px;
        .timedata {
          border-bottom: 1px #bfbfbf solid;
        }
        div {
          height: 28px;
          line-height: 28px;
        }
      }
      .mtc {
        font-size: 23px;
        color: #71bfdb;
        line-height: 60px;
        margin-left: 22px;
      }
    }
    .main-bottom {
      height: 20px;
      font-size: 12px;
      padding-left: 20px;
      margin-top: 5px;
      .mba {
        width: 40%;
      }
      h3 {
        color: #a0a0a0;
      }
      .mbb {
        p {
          width: 120px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          text-align: left;
        }
      }
    }
  }
}
</style>
