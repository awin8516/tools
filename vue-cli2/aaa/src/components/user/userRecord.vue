<template>
  <el-collapse v-model="activeNames" @change="handleChange" accordion>
    <v-userTimeLine :userRecord="userRecord" v-loading="loading"></v-userTimeLine>
      <div class="footer">
        <p @click="handleMore()">查看更多</p>
      </div>
  </el-collapse>
</template>
<script>
import vUserTimeLine from "./UserTimeLine";
export default {
  components: {
    vUserTimeLine
  },
  props: ["dynamicsData"],
  data() {
    return {
      activeNames: "" + new Date().getFullYear(),
      dynamicsObj: {
        appid: this.$store.getters.showQuery,
        paginate: 10,
        f_id: "",
        type: "",
        is: "",
        page: 1,
      },
      uid: "",
      times: [],
      year: "",
      userRecord: [],
      loading: false
    };
  },
  created() {
    if (localStorage.getItem("uid")) {
      this.uid = localStorage.getItem("uid");
    }
    this.dynamicsObj.f_id = this.uid;
    this.year = new Date().getFullYear().toString();
    this.getDynamics();
  },
  methods: {
    // 查看更多
    handleMore() {
      let page = this.dynamicsObj.page;
      page = page + 1;
      this.dynamicsObj.page = page;
      this.getDynamics();
    },
    // 生成时间段
    setTime() {
      // let time = 5;
      // let BaseYear = new Date().getFullYear();
      // for (let i = 0; i < time; i++) {
      //   this.times.push((BaseYear - i).toString());
      // }
    },
    // 翻页
    handleChange(val) {
      this.userRecord = [];
      this.dynamicsObj.page = 1;
      this.dynamicsObj.year = val;
      this.getDynamics();
    },
    // 获取用户行为记录
    getDynamics() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "user_dynamics_list", this.dynamicsObj)
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            let data = res.data.data.data.data;
            if (data.length) {
              if (this.userRecord.length == 0) {
                this.userRecord = data;
              } else {
                this.userRecord = this.userRecord.concat(data);
              }
            } else {
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    }
  }
};
</script>
<style lang='scss' scoped>
.footer {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.footer p {
  color: $--color-primary;
  cursor: pointer;
}
</style>