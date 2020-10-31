<template>
  <div class="echart" id="curve">
    <div class="echart-title">
      <div style="display:inline-block">
        <p>累计关注人数</p>
        <p class="tips">Cumulative number of followers</p>
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

    <!--  <ve-line :data="chartData"></ve-line> -->
    <ve-line
      ref="curve"
      :data="chartData"
      height="380px"
      width="100%"
      :extend="extend"
      v-loading="loading"
    ></ve-line>
    <div class="echart-footer">
      <!-- <p class="color1">每日总关注人数：100</p> -->
    </div>
  </div>
</template>

<script>
import bus from "../common/bus";
import elementResizeDetectorMaker from "element-resize-detector";
export default {
  props: ["qrcode"],
  data() {
    this.extend = {
      series: {
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
    return {
      start_time: "",
      end_time: "",
      curveData: [],
      timepicker: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      tineQuantum: "30",
      options: [
        { label: "最近30天", value: "30", time: "30" },
        { label: "最近14天", value: "14", time: "14" },
        { label: "最近7天", value: "7", time: "7" }
      ],
      chartData: {
        columns: ["日期", "每日总关注人数"],
        rows: [
          // { 日期: "2020/10/10", 每日总关注人数: 100 }
        ]
      },
      loading: false,
      is_qrcode: false,
      id: ""
    };
  },
  created() {
    if (localStorage.getItem("qid")) {
      this.id = localStorage.getItem("qid");
    }
    this.getTimes(30);
  },
  mounted() {
    var erd = elementResizeDetectorMaker();
    erd.listenTo(
      document.getElementById("curve"),
      this.debonce(element => {
        this.$nextTick(function() {
          this.$refs["curve"].resize();
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
        parseInt(new Date().getTime() / 1000) - val * 24 * 60 * 60;
      if (this.qrcode) {
        this.getQrdata();
      } else {
        this.getDailyData();
      }
      this.timepicker = "";
    },
    getDailyUser() {
      if (this.qrcode) {
        this.getQrdata();
      } else {
        this.getDailyData();
      }
    },
    getDailyData() {
      this.loading = true;
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
              this.chartData.columns = ["日期", "每日总关注人数"];
              let time = [{ 日期: toDay, 每日总关注人数: 0 }];
              this.chartData.rows = time;
            } else {
              this.curveData = this.changeMiniData(res.data.data);
              this.chartData.columns = ["日期", "每日总关注人数"];
              this.chartData.rows = this.curveData;
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    getQrdata() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "qrdata", {
          appid: this.$store.getters.showQuery,
          id: this.id,
          start_time: this.start_time,
          end_time: this.end_time
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            if (res.data.data.length == 0) {
              var toDay = `${new Date().getFullYear()}/${new Date().getMonth() +
                1}/${new Date().getDate()}`;
              this.chartData.columns = ["日期", "扫码数量", "扫码后关注的数量"];
              let time = [{ 日期: toDay, 扫码数量: 0, 每日总关注人数: 0 }];
              this.chartData.rows = time;
            } else {
              this.chartData.rows = [];
              this.curveData = this.changeQrcodeData(res.data.data.qrdata);
              this.chartData.columns = ["日期", "扫码数量", "扫码后关注的数量"];
              this.chartData.rows = this.curveData;
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 转化成echat需要的时间格式
    changeMiniData(obj) {
      let obj1 = JSON.parse(
        JSON.stringify(obj).replace(/total_follow/g, "每日总关注人数")
      );
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/per_date/g, "日期"));
      return obj2;
    },
    // 转化成echat需要的时间格式
    changeQrcodeData(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/updated_at/g, "日期"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/scan/g, "扫码数量"));
      let obj3 = JSON.parse(
        JSON.stringify(obj2).replace(/subscribe/g, "扫码后关注的数量")
      );
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
