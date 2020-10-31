<template>
  <div class="echart" id="line">
    <div class="echart-title">
      <div style="display:inline-block;flex-shrink:0">
        <p>每日活跃统计</p>
        <p class="tips">Daily active statistics</p>
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
    <ve-line
      ref="line"
      :data="chartData"
      height="330px"
      width="100%"
      :extend="extend"
      :events="chartEvents"
      v-loading="loading"
      :settings="chartSettings"
    ></ve-line>
    <div class="echart-footer">
      <!-- <p class="color1">每日活跃用户数量：100</p> -->
      <!-- <p class="color2">每日交互数量：120</p> -->
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
        localStorage.setItem("activeData", e.name);
        this.$router.push({
          path: "/UserInfo"
        });
      }
    };
    this.chartSettings = {
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "rgba(76,175,80,0.6)" // 0% 处的颜色
            },
            {
              offset: 1,
              color: "rgba(76,175,80,0)" // 100% 处的颜色
            }
          ],
          global: false // 缺省为 false
        }
      }
    };
    this.extend = {
      series(v) {
        v.forEach(i => {
          console.log(i);
          if (i.name == "每日活跃用户数量") {
            i.areaStyle = {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(65, 212, 174,0.3)" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(0,0,0,0.0)" // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            };
          }
          if (i.name == "每日交互数量") {
            i.areaStyle = {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(99, 214, 255,0.3)" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(0,0,0,0.0)" // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            };
          }
        });
        return v;
      },
      yAxis: {
        minInterval: 1,
        splitLine: {
          lineStyle: {
            // 使用深浅的间隔色
            color: "#f2f0f0"
          }
        }
      }
    };

    // #c23531','#2f4554', '#61a0a8',    '#d48265', '#91c7ae','#749f83',       '#ca8622', '#bda29a','#6e7074',      '#546570', '#c4ccd3
    return {
      timepicker: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      start_time: "",
      end_time: "",
      lineData: [],
      tineQuantum: "30",
      options: [
        { label: "最近30天", value: "30" },
        { label: "最近14天", value: "14" },
        { label: "最近7天", value: "7" }
      ],
      chartData: {
        columns: ["日期", "每日活跃用户数量", "每日交互数量"],
        rows: [
          // { 日期: "2020-02-02", 每日活跃用户数量: 100, 每日交互数量: 100 },
          // { 日期: "2020-02-03", 每日活跃用户数量: 1000, 每日交互数量: 1000 },
          // { 日期: "2020-02-04", 每日活跃用户数量: 90, 每日交互数量: 800 }
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
      //   this.$refs["line"].echarts.resize();
      // });
    });
  },
  mounted() {
    var erd = elementResizeDetectorMaker();
    erd.listenTo(
      document.getElementById("line"),
      this.debonce(element => {
        this.$nextTick(function() {
          this.$refs["line"].resize();
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
        // console.log(`起始的时间戳-----${parseInt(val[0].getTime() / 1000)}`);
        // console.log(`结束的时间戳-----${parseInt(val[1].getTime() / 1000)}`);
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
      // console.log(`今天的时间戳-----${parseInt(new Date().getTime() / 1000)}`);
      // console.log(
      //   `${val}天前的时间戳是-----${parseInt(new Date().getTime() / 1000) -
      //     10 * 24 * 60 * 60}`
      // );
      this.end_time = parseInt(new Date().getTime() / 1000);
      this.start_time =
        parseInt(new Date().getTime() / 1000) - val * 24 * 60 * 60;
      this.getDailyUser();

      // this.loading = false;

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
              this.chartData.columns = [
                "日期",
                "每日活跃用户数量",
                "每日交互数量"
              ];
              let time = [
                { 日期: toDay, 每日活跃用户数量: 0, 每日交互数量: 0 }
              ];
              this.chartData.rows = time;
            } else {
              this.lineData = this.changeMiniData(res.data.data);
              this.chartData.rows = this.lineData;
            }
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
  height: 400px;
  background: #fff;
  border-radius: 5px;
  padding: 20px;
  box-sizing: border-box;
}
.echart-title {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
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
@media screen and (max-width: 1500px) {
  .timepicker .el-range-editor.el-input__inner {
    width: 280px;
  }
  .selectArea {
    width: 98px;
  }
}
</style>
