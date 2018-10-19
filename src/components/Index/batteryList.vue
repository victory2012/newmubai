<template>
  <div class="battery-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="0" infinite-scroll-immediate-check="false">
    <batteryListItem v-for="item in currentDataList" :key="item.id" :itemData="item"></batteryListItem>
    <mt-spinner class="Spinner" v-if="isShowSpinner" type="snake"></mt-spinner>
    <div v-if="!isShowSpinner" class="loadEnd">没有更多了</div>
  </div>
</template>

<script>
import batteryListItem from "./batteryListItem";
import { Toast } from "mint-ui";

export default {
  name: "batteryList",
  props: [
    "valuesId",
    "valuessId",
    "isChange",
    "batteryID",
    "isChanges",
    "chuanzhi",
    "isChangess",
    "isClear"
  ],
  components: {
    batteryListItem
  },
  data() {
    return {
      currentDataList: [],
      nowpage: 2,
      currentLength: 0,
      maxPage: 0,
      isShowSpinner: false
    };
  },
  methods: {
    loadMore() {
      this.loading = true;
      this.isShowSpinner = true;

      if (this.nowpage <= this.maxPage) {
        this.httpRequest
          .batteryList({
            page: this.nowpage,
            itemsPerPage: "10",
            no: this.batteryID,
            client_id: this.valuesId,
            isBound: "",
            model: this.valuessId
          })
          .then(res => {
            this.currentLength = (this.nowpage - 1) * 10 + res.data.length;
            this.currentDataList = [...this.currentDataList, ...res.data];
            this.nowpage++;
          });
        this.loading = false;
      } else if (this.nowpage > this.maxPage) {
        this.isShowSpinner = false;
      }
    },

    getBatteryList() {
      this.httpRequest
        .batteryList({
          page: "1",
          itemsPerPage: "10",
          no: "",
          client_id: "",
          isBound: "",
          model: ""
        })
        .then(res => {
          this.currentDataList = res.data;
          this.currentLength = res.data.length;
          this.maxPage = res.length / 10 + 1;
        })
        .catch(err => {
          //this.getBatteryList()
          if (err.response.data.message == "登录状态已失效") {
            this.$router.push({ path: "/login" });
            Toast({
              message: "登录失效，请重新登录",
              position: "",
              duration: 5000
            });
          }
        });
    }
  },
  activated() {
    this.nowpage = 2;
    // this.isShowSpinner = false;
    // this.getBatteryList();
    // console.log(this.getBatteryList());
  }
};
</script>

<style lang="scss">
.battery-list {
  background: #f2f2f2;
  overflow: hidden;
  margin-top: 70px;
  min-height: 600px;
  padding-bottom: 20px;
  .loadEnd {
    width: 100%;
    text-align: center;
    color: #ccc;
    font-size: 12px;
    margin-top: 20px;
  }
  .mint-spinner-snake {
    margin-left: 47%;
  }
}
</style>
