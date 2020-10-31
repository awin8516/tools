<template>
  <div class="echart" id="map">
    <div class="echart-title">
      <p>地域分布</p>
      <p class="tips">Geographical distribution</p>
    </div>
    <ve-map
      ref="map"
      :data="chartData"
      height="300px"
      v-loading="loading"
      :events="chartEvents"
      :settings="chartSettings"
      :extend="chartExtend "
    ></ve-map>
  </div>
</template>

<script>
import bus from "../common/bus";
import elementResizeDetectorMaker from "element-resize-detector";
var max = 0;
export default {
  data() {
    var self = this;
    this.chartExtend = {
      visualMap: {
        left: 0,
        bottom: 0,
        itemWidth: 10,
        itemHeight: 100,
        show: true,
        min: 0, //最小值
        max: max, //最大值
        calculable: true, //是否显示拖拽用的手柄（手柄能拖拽调整选中范围）。
        inRange: {
          color: ["#ddd", "#ddd"] //颜色
        },
        outOfRange: {
          color: ["#ddd", "#ddd"] //颜色
        }
      }
    };
    this.chartEvents = {
      click: e => {
        localStorage.setItem("province", e.name);
        this.$router.push({
          path: "/UserInfo"
        });
      }
    };
    this.chartSettings = {
      zoom: 1,
      aspectScale: 0.75,
      position: "china",
      label: {
        show: false,
        color: "#000"
      },
      itemStyle: {
        normal: {
          borderColor: "#fff",
          areaColor: "#ddd",
          color: "#63d6ff"
        }
      },
      emphasis: {
        layoutCenter: ["30%", "30%"],
        label: {
          show: false
        }
      }
    };
    return {
      men: "",
      women: "",
      other: "",
      pieData: [],
      loading: false,
      chartData: {
        columns: ["位置", "用户数量"],
        rows: []
      },
      timer: false
    };
  },
  created() {
    this.loading = true;
    this.getPerRatio();
    bus.$on("collapse", msg => {});
  },
  mounted() {
    var erd = elementResizeDetectorMaker();
    erd.listenTo(
      document.getElementById("map"),
      this.debonce(element => {
        this.$nextTick(function() {
          this.$refs["map"].resize();
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
    getPerRatio() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "getuserdata", {
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            if (!res.data.data.province_data) {
              return false;
            }
            if (res.data.data.province_data.length == 0) {
            } else {
              let data = res.data.data.province_data;
              data = data.filter((ele, index) => {
                return ele.total > 0;
              });
              let arr = [];
              data.forEach(ele => {
                arr.push(ele.total);
              });
              arr = arr.sort((a, b) => {
                return a - b;
              });
              max = arr[arr.length - 1];
              console.log('111')
              this.chartExtend.visualMap.max = arr[arr.length - 1];
              this.chartExtend.visualMap.inRange.color = ["#abe3f7", "#1dbbf3"];
              let province_data = this.changeMapData(data);
              this.chartData.rows = this.changeMapData(province_data);
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 转化成echat需要的时间格式
    changeMapData(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/province/g, "位置"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/total/g, "用户数量"));
      return obj2;
    }
  }
};
</script>
<style scoped>
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
  height: 400px;
  background: #fff;
  padding: 20px;
  border-radius: 5px;
  box-sizing: border-box;
}
.echart-title {
  margin-bottom: 10px;
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
