<template>
  <div class="echart">
    <div class="echart-title">
      <p>男女比例</p>
      <p class="tips">Male to female ratio</p>
    </div>
    <ve-ring
      ref="pie"
      :data="chartData"
      height="330px"
      :extend="extend"
      :events="chartEvents"
      v-loading="loading"
    ></ve-ring>
    <div class="echart-footer">
      <div v-for="(item) in infos">
        <p :class="'color'+item.index">{{item.title}}{{item.num}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "../common/bus";
export default {
  data() {
    var self = this;
    this.chartEvents = {
      click: e => {
        let sex=''
        if(e.name == '男'){
          sex = 1;
        }
        if(e.name == '女'){
          sex = 2;
        }
        if(e.name == '其他'){
          sex = 3;
        }
        localStorage.setItem('sex',sex)
        this.$router.push({
          path: "/UserInfo"
        });
      }
    };
    this.extend = {
      color: ["#63d6ff", "#ff6b6b", "#ddd"],
      top: "20%",
      series: {
        center: ["35%", "50%"],
        radius: ["40%", "60%"],
        label: {
          normal: {
            show: false
          }
        }
      }
    };
    return {
      infos: [
        {
          index: 1,
          color: "#63d6ff",
          title: "男：",
          num: ""
        },
        {
          index: 2,
          color: "#ff6b6b",
          title: "女：",
          num: ""
        },
        {
          index: 3,
          color: "#eeeeee",
          title: "其他：",
          num: ""
        }
      ],
      men: "",
      women: "",
      other: "",
      pieData: [],
      loading: false,
      chartData: {
        columns: ["性别", "访问用户"],
        rows: [
          // { 性别: "男", 访问用户: 0 },
          // { 性别: "女", 访问用户: 0 },
          // { 性别: "其他", 访问用户: 0 }
        ]
      }
    };
  },
  created() {
    this.loading = true;
    this.getPerRatio();
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      // this.$nextTick(_ => {
      //   this.$refs["pie"].echarts.resize();
      // });
    });
  },
  methods: {
    getPerRatio() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "peopleratio", {
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.chartData.rows = [];
            if (res.data.data.length == 0) {
              this.men = 0;
              this.women = 0;
              this.other = 0;
              this.chartData.rows = [
                { 性别: "男", 访问用户: this.men },
                { 性别: "女", 访问用户: this.women },
                { 性别: "其他", 访问用户: this.other }
              ];
            } else {
              this.men = res.data.data.men;
              this.women = res.data.data.women;
              this.other = res.data.data.other;

              this.infos[0].num = this.men;
              this.infos[1].num = this.women;
              this.infos[2].num = this.other;
              this.chartData.rows = [
                { 性别: "男", 访问用户: this.men },
                { 性别: "女", 访问用户: this.women },
                { 性别: "其他", 访问用户: this.other }
              ];
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    }
  }
};
</script>
<style scoped>
.echart-footer {
  position: absolute;
  right: 15%;
  top: 50%;
  transform: translateY(-50%);
}
.echart-footer p.color1 {
  color: #63d6ff;
}
.echart-footer p.color2 {
  color: #ff6b6b;
}
.echart-footer p.color3 {
  color: #ddd;
}
.echart {
  height: 400px;
  background: #fff;
  padding: 20px;
  border-radius: 5px;
  box-sizing: border-box;
  position: relative;
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
