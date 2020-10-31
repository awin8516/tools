<template>
  <div class="echart" id="history">
    <div class="echart-title">
      <div style="display:inline-block">
        <p>每日新增关注/每日取关</p>
        <p class="tips">Daily active statistics daily new attention/daily check</p>
      </div>
      <div class="echats-filter">
        <div class="selectArea">
          <el-select v-model="tineQuantum" placeholder="请选择时间段" @change="getTimes(tineQuantum)">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              size="mini"
            ></el-option>
          </el-select>
        </div>
        <div class="timepicker">
          <el-date-picker
            v-model="timepicker"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            type="datetimerange"
            :picker-options="pickerOptions"
            @change="getpickerTimes(timepicker)"
          ></el-date-picker>
        </div>
      </div>
    </div>

    <ve-histogram
      ref="history"
      :data="chartData"
      height="380px"
      width="100%"
      :extend="extend"
      :events="chartEvents"
      v-loading="loading"
    ></ve-histogram>
    <div class="echart-footer">
      <!-- <p class="color1">每日新增关注：100</p> -->
      <!-- <p class="color2">每日取关：120</p> -->
    </div>
  </div>
</template>

<script>
import bus from "../common/bus";
import elementResizeDetectorMaker from "element-resize-detector";
export default {
  data() {
    var self = this;
    this.chartEvents = {
      click: e => {
        console.log(e);
        // localStorage.setItem('province',e.name)
        // this.$router.push({
        //   path: "/UserInfo"
        // });
      }
    };
    this.extend = {
      yAxis: {
        minInterval:1,
        splitLine: {
          lineStyle: {
            // 使用深浅的间隔色
            color: "#f2f0f0"
          }
        }
      },
      series: {
        smooth: false,
        label: {
          // show: true,
          // position: "top"
        }
      }
    };
    return {
      start_time: "",
      end_time: "",
      histogramData: [],
      timepicker: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      tineQuantum: "30",
      options: [
        { label: "最近30天", value: "30" },
        { label: "最近14天", value: "14" },
        { label: "最近7天", value: "7" }
      ],
      chartData: {
        columns: ["日期", "每日新增关注", "每日取关"],
        rows: [
          // { '日期': '2018/10/1', '每日新增关注': 100, '每日取关': 1093,},
          // { '日期': '2018/10/2', '每日新增关注': 600, '每日取关': 3230,},
          // { '日期': '2018/10/3', '每日新增关注': 300, '每日取关': 2623,},
          // { '日期': '2018/10/4', '每日新增关注': 400, '每日取关': 1423,},
          // { '日期': '2018/10/5', '每日新增关注': 500, '每日取关': 3492, },
          // { '日期': '2018/10/6', '每日新增关注': 600, '每日取关': 10000,}
        ]
      },
      loading: false
    };
  },
  created() {
    this.loading = true;
    this.getTimes(30);

    bus.$on("collapse", msg => {
      // this.$nextTick(_ => {
      //   this.$refs["history"].echarts.resize();
      // });
    });
  },
  mounted() {
    var erd = elementResizeDetectorMaker();
    erd.listenTo(
      document.getElementById("history"),
      this.debonce(element => {
        this.$nextTick(function() {
          this.$refs["history"].resize();
        });
      }, 100)
    );
  },
  methods: {
    debonce(fn, delay) {
      var timer;
      return function() {
        var context = this;
        var args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
          fn.apply(context, args);
        }, delay);
      };
    },
    reset() {
      this.start_time = "";
      this.end_time = "";
      this.getDailyUser();
    },
    getpickerTimes(val) {
      if (val) {
        this.start_time = parseInt(val[0].getTime() / 1000);
        this.end_time = parseInt(val[1].getTime() / 1000);
        this.getDailyUser();
        this.tineQuantum = "";
      } else {
        this.start_time = "";
        this.end_time = "";
        this.getDailyUser();
        this.tineQuantum = "1";
      }
    },
    getTimes(val) {
      this.end_time = parseInt(new Date().getTime() / 1000);
      this.start_time =
        parseInt(new Date().getTime() / 1000) - val  * 24 * 60 * 60;
      this.getDailyUser();
      this.timepicker = "";
    },
    getDailyUser() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "getdailyuser", {
          appid: this.$store.getters.showQuery,
          start_time: this.start_time,
          end_time: this.end_time
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.chartData.rows = [];
            if (res.data.data.length == 0) {
              var toDay = `${new Date().getFullYear()}/${new Date().getMonth() +
                1}/${new Date().getDate()}`;
              this.chartData.columns = ["日期", "每日新增关注", "每日取关"];
              let time = [{ 日期: toDay, 每日新增关注: 0, 每日取关: 0 }];
              this.chartData.rows = time;
            } else {
              this.histogramData = this.changeMiniData(res.data.data);
              this.chartData.rows = this.histogramData;
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 转化成echat需要的时间格式
    changeMiniData(obj) {
      let obj1 = JSON.parse(
        JSON.stringify(obj).replace(/per_user/g, "每日新增关注")
      );
      let obj2 = JSON.parse(
        JSON.stringify(obj1).replace(/per_unfollow/g, "每日取关")
      );
      let obj3 = JSON.parse(JSON.stringify(obj2).replace(/per_date/g, "日期"));
      return obj3;
    }
  }
};
</script>
<style scoped>
.timepicker {
  width: auto;
  display: inline-block;
}
.selectArea {
  width: 130px;
  display: inline-block;
  margin-right: 10px;
}
.echats-filter {
  width: auto;
  height: auto;
  border-radius: 5px;
  margin-bottom: 5px;
}
.echart-footer p.color1 {
  color: #41d4ae;
}
.echart-footer p.color2 {
  color: #5ab1ef;
}
.echart-footer p.color3 {
  color: #f86f86;
}
.echart {
  width: 100%;
  height: 450px;
  background: #fff;
  border-radius: 5px;
  padding: 20px;
  box-sizing: border-box;
}
.echart-title {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
.echart-title p {
  font-size: 18px;
  color: #878888;
}
.echart-title p.tips {
  font-size: 12px;
  color: #878888;
}
.echart-footer p {
  font-size: 14px;
  color: #878888;
}
</style>
