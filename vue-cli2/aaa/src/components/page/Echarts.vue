<template>
  <div class="table">
    <div class="container" v-if="status == 2">
      <div class="welcome">欢迎使用后台管理系统</div>
    </div>
    <div class="container" v-if="status == 1">
      <div class="infos">
        <div class="card" v-for="(item,index) in panels" :key="index">
          <el-card shadow="never">
            <div class="main">
              <div class="left"  @click="handleNavTo(item)">
                <div :class="item.className">
                  <svg-icon :icon-class="item.icon"></svg-icon>
                </div>
              </div>
              <div class="right"  @click="handleNavTo(item)">
                <p>{{item.title}}</p>
                <p :class="item.className">{{item.num}}</p>
              </div>
              <div class="refresh" @click="refresh()">
                <svg-icon icon-class="refresh"></svg-icon>
              </div>
            </div>
            <div class="days">
              <div class="daysitem">
                日:
                <i
                  :class="{'up': item.percent.day_percent >= 0,'down': item.percent.day_percent < 0}"
                >
                  <svg-icon icon-class="dataup" v-if="item.percent.day_percent >= 0"></svg-icon>
                  <svg-icon icon-class="datadown" v-else></svg-icon>
                </i>
                {{dealNum(item.percent.day_percent)}}
              </div>
              <div class="daysitem">
                周:
                <i
                  :class="{'up': item.percent.week_percent >= 0,'down': item.percent.week_percent < 0}"
                >
                  <svg-icon icon-class="dataup" v-if="item.percent.week_percent >= 0"></svg-icon>
                  <svg-icon icon-class="datadown" v-else></svg-icon>
                </i>
                {{dealNum(item.percent.week_percent)}}
              </div>
              <div class="daysitem">
                月:
                <i
                  :class="{'up': item.percent.month_percent >= 0,'down': item.percent.month_percent < 0}"
                >
                  <svg-icon icon-class="dataup" v-if="item.percent.month_percent >= 0"></svg-icon>
                  <svg-icon icon-class="datadown" v-else></svg-icon>
                </i>
                {{dealNum(item.percent.month_percent)}}
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <div class="container" v-if="status == 1">
      <div class="infos">
        <div class="echat pie">
          <v-ring></v-ring>
        </div>
        <div class="echat map">
          <v-map :mapData='mapData'></v-map>
        </div>
        <div class="echat lines">
          <v-line></v-line>
        </div>
      </div>
    </div>
    <div class="container" v-if="status == 1">
      <div class="infos">
        <div class="echat histogram">
          <v-histogram></v-histogram>
        </div>
      </div>
    </div>
    <div class="container" v-if="status == 1">
      <div class="infos">
        <div class="echat curve">
          <v-curve></v-curve>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "../common/bus";
import vRing from "../echats/ring";
import vLine from "../echats/line";
import vHistogram from "../echats/histogram";
import vCurve from "../echats/curve";
import vMap from "../echats/map";
export default {
  components: {
    vRing,
    vLine,
    vHistogram,
    vCurve,
    vMap
  },
  name: "",
  data() {
    return {
      status: "",
      testTime: "",
      start_time: "",
      end_time: "",
      DailyUserData: [],
      classObject: {
        "el-icon-refresh": true,
        active: false
      },
      panels: [
        {
          id: "1",
          className: "head red",
          icon: "todayNews",
          type: "todayNews",
          title: "今日消息",
          num: "0",
          path: "/UserDynamics",
          percent: {
            day_percent:0,
            week_percent:0,
            month_percent:0
          }
        },
        {
          id: "2",
          className: "head sky",
          icon: "addUser",
          type: "addUser",
          title: "新增用户",
          num: "0",
          path: "/UserInfo",
          percent: {
            day_percent:0,
            week_percent:0,
            month_percent:0
          }
        },
        {
          id: "3",
          className: "head purple",
          icon: "sumUser",
          type: "sumUser",
          title: "总用户数",
          num: "0",
          path: "/UserInfo",
          percent: {
            day_percent:0,
            week_percent:0,
            month_percent:0
          }
        },
        {
          id: "4",
          className: "head pink",
          icon: "activeuser",
          type: "activeuser",
          title: "活跃用户数",
          num: "0",
          path: "/UserInfo",
          percent: {
            day_percent:0,
            week_percent:0,
            month_percent:0
          }
        }
      ],
      mapData: []
    };
  },
  created() {
    localStorage.removeItem("todayNum");
    if (
      localStorage.getItem("token") &&
      Boolean(localStorage.getItem("menu"))
    ) {
      // 判断是否有token
    } else {
      localStorage.clear();
      window.location.href = global_.DOMAIN + "#/login";
    }
    if (localStorage.getItem("status")) {
      this.status = localStorage.getItem("status");
      if (this.status == 1) {
        this.getUserData();
        this.getDailyUser();
      }
    }
  },
  methods: {
    // 处理比例
    dealNum(num) {
      return `${num}%`;
    },
    handleNavTo(item) {
      localStorage.setItem("dataType", item.type);
      this.$router.push({
        path: item.path
      });
    },
    refresh() {
      this.classObject.active = true;
      this.getUserData();
      setTimeout(() => {
        this.classObject.active = false;
      }, 1000);
    },
    getUserData() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "getuserdata", {
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success('数据获取成功')
            let data = res.data.data;
            // 今日消息
            this.panels[0].num = data.message.message || 0;
            this.panels[0].percent = data.message || {};
            // 新增用户
            this.panels[1].num = data.per_user.per_user || 0;
            this.panels[1].percent = data.per_user || {};
            // 总用户数
            this.panels[2].num = data.total_follow.total_follow || 0;
            this.panels[2].percent = data.total_follow || {};
            // 活跃用户数
            this.panels[3].num = data.active_user.active_user || 0;
            this.panels[3].percent = data.active_user || {};


            this.mapData = data.province_data;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    getDailyUser() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "getdailyuser", {
          appid: this.$store.getters.showQuery,
          start_time: this.start_time,
          end_time: this.end_time
        })
        .then(res => {
          if (res.data.code == 0) {
            this.DailyUserData = this.changeMiniData(res.data.data);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 转化成echat需要的时间格式
    changeMiniData(obj) {
      let obj1 = JSON.parse(
        JSON.stringify(obj).replace(/active_user/g, "每日活跃用户数量")
      );
      let obj2 = JSON.parse(
        JSON.stringify(obj1).replace(/interaction/g, "每日交互数量")
      );
      let obj3 = JSON.parse(JSON.stringify(obj2).replace(/per_date/g, "日期"));
      return obj3;
    }
  }
};
</script>

<style scoped>
.infos {
  width: 100%;
  font-size: 0;
  display: flex;
}
.card {
  width: 24%;
  display: inline-block;
  border: none;
  padding: 0;
  border-radius: 5px;
  margin-right: 1%;
  border: 1px solid #f1f1f1;
  background: #fff;
}
.card .el-card {
  background: transparent;
}
.card:last-child {
  margin-right: 0%;
}
.card .el-card {
  border: none;
}
.echats {
  width: 100%;
  display: flex;
  margin-top: 24px;
}
.echats.echats1 {
  margin-top: 10px;
}
.echat {
  border: 1px solid #f1f1f1;
}
.echat.pie {
  width: 24%;
  display: inline-block;
  margin-right: 1%;
}
.echat.map {
  width: 24%;
  display: inline-block;
  margin-right: 1%;
}
.echat.lines {
  width: 49.1%;
  display: inline-block;
}
.echat.histogram {
  width: 99.26%;
  display: block;
}
.echat.curve {
  width: 99.26%;
  display: block;
}
/* ------------------ */
.welcome {
  width: 100%;
  height: 100%;
}
.refresh .active {
  animation: ani_rotate 1s linear;
}
@keyframes ani_rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate((360deg));
  }
}
/* ----------------------------------- */
.container {
  background: transparent;
  border: none;
  padding-left: 0;
  padding-top: 10px;
  display: flex;
  padding-bottom: 10px;
  justify-content: space-between;
}
.main {
  width: 100%;
  display: flex;
  position: relative;
  color: #fff;
  cursor: pointer;
}
.days {
  width: 100%;
  display: flex;
  position: relative;
  margin-top: 10px;
  justify-content: space-between;
}
.days .daysitem {
  width: auto;
  height: auto;
  padding: 0 4px;
  color: #000;
  font-size: 14px;
  margin: 0 4px;
}
/* #41d4ae   red */
.days .daysitem i {
  margin: 0 4px;
}
.days .daysitem i.up .svg-icon {
  color: #41d4ae;
}
.days .daysitem i.down .svg-icon {
  color: red;
}
.refresh {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 18px;
}
.left {
  width: 80px;
}
.left .head {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: red;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 24px;
}
.left .head .svg-icon {
  color: #fff;
}
.left .head.red {
  background: #ff6b6b;
}
.left .head.sky {
  background: #63d6ff;
}
.left .head.purple {
  background: #6e6eff;
}
.left .head.pink {
  background: #f76fff;
}

.left .head i {
  font-size: 24px;
  color: #fff;
}
.right {
  width: 60%;
  display: inline-flex;
  flex-direction: column;
  box-sizing: border-box;
}
.main .right p:nth-of-type(1) {
  font-size: 18px;
  color: #878888;
}
.main .right p:nth-of-type(2) {
  font-size: 26px;
}
.main .right p:nth-of-type(2).head.red {
  color: #ff6b6b;
}
.main .right p:nth-of-type(2).head.sky {
  color: #63d6ff;
}
.main .right p:nth-of-type(2).head.purple {
  color: #6e6eff;
}
.main .right p:nth-of-type(2).head.pink {
  color: #f76fff;
}
</style>
