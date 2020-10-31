<template>
  <div class="maps">
    <div class="tools">
      <div class="input">
        <el-input v-model="pos" placeholder="请输入内容"></el-input>
      </div>
      <el-button type="primary" size="small" @click="getLocation()">搜索</el-button>
      <div class="pos pos1">
        <span>当前坐标：</span>
        <div class="latLngs">
          <el-input v-model="latLng" placeholder :readonly="readonly"></el-input>
        </div>
      </div>
      <div class="pos pos2">
        <span>详细地址：</span>
        <div class="latLngs">
          <el-input v-model="address" placeholder :readonly="readonly"></el-input>
        </div>
      </div>
      <div class="info">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入详细信息"
          v-model="intro"
        ></el-input>
      </div>
      <!-- <el-button type="primary" size="small" @click="addIntro()">添加详细信息</el-button> -->
      <el-button type="primary" size="small" @click="addlocation()">添加</el-button>
    </div>
    <div class="map" id="map"></div>

    <el-dialog title="详细信息" :visible.sync="dialogVisible" width="30%">
      <el-input
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 4}"
        placeholder="请输入内容"
        v-model="intro"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancle()">取 消</el-button>
        <el-button type="primary" @click="sure()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { TMap } from "./TMap";
// lat: 40.84706035607122   纬度
// lng: 116.8341064453125    进度
export default {
  props: ["lbs"],
  data() {
    return {
      dialogVisible: false,
      textarea2: "",
      lat: "",
      lng: "",
      readonly: true,
      pos: "",
      latLng: "",
      geocoder: "",
      codeLatLng: "",
      address: "",
      intro: "",
      // 'detail_address':地址,'intro':介绍,'longitude'：经度'latitude'：维度,'appid'：
      locationObj: {
        detail_address: "",
        intro: "",
        longitude: "",
        latitude: "",
        appid: ""
      }
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let vm = this;
      let marker = "";
      TMap("7EYBZ-F6R6F-4YBJZ-JZG7S-IK2ZE-UGBJZ").then(qq => {
        //步骤：定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
        //设置地图中心点
        var myLatlng = new qq.maps.LatLng(39.916527, 116.397128);

        //定义工厂模式函数
        var myOptions = {
          zoom: 8, //设置地图缩放级别
          center: myLatlng, //设置中心点样式
          mapTypeId: qq.maps.MapTypeId.ROADMAP //设置地图样式详情参见MapType
        };
        //获取dom元素添加地图信息
        var map = new qq.maps.Map(document.getElementById("map"), myOptions);
        var markersArray = [];

        //添加监听事件   获取鼠标单击事件
        qq.maps.event.addListener(map, "click", function(event) {
          if (markersArray) {
            for (let i in markersArray) {
              markersArray[i].setMap(null);
            }
            markersArray.length = 0;
          }
          var marker = new qq.maps.Marker({
            position: event.latLng,
            map: map
          });
          markersArray.push(marker);
          vm.latLng = event.latLng;
          vm.lat = vm.latLng.lat;
          vm.lng = vm.latLng.lng;
          var lat = parseFloat(vm.lat);
          var lng = parseFloat(vm.lng);
          var latLng = new qq.maps.LatLng(lat, lng);
          vm.codeLatLng.getAddress(vm.latLng);
          vm.latLng = vm.latLng.toString();
          qq.maps.event.addListener(map, "click", function(event) {
            marker.setMap(null);
          });
        });

        //调用地址解析类
        vm.geocoder = new qq.maps.Geocoder({
          complete: function(result) {
            if (markersArray) {
              for (let i in markersArray) {
                markersArray[i].setMap(null);
              }
              markersArray.length = 0;
            }
            map.setCenter(result.detail.location);
            vm.marker = new qq.maps.Marker({
              map: map,
              position: result.detail.location
            });

            markersArray.push(vm.marker);
            vm.latLng = result.detail.location;
            vm.lat = vm.latLng.lat;
            vm.lng = vm.latLng.lng;
            var lat = parseFloat(vm.lat);
            var lng = parseFloat(vm.lng);
            var latLng = new qq.maps.LatLng(lat, lng);
            vm.codeLatLng.getAddress(vm.latLng);
            vm.latLng = vm.latLng.toString();
            // vm.marker.setMap(null);
          }
        });

        // 逆地址解析
        vm.codeLatLng = new qq.maps.Geocoder({
          complete: function(result) {
            vm.address = result.detail.address;
            vm.address = vm.address.toString();
          }
        });
      });
    },
    getLocation() {
      if (this.pos == "") {
        this.$message.warning("请输入搜索的地址");
      } else {
        this.geocoder.getLocation(this.pos);
      }
    },
    addlocation() {
      if (this.lng == "" || this.lat == "") {
        this.$message.warning("当前坐标不能为空");
      } else if (this.address == "") {
        this.$message.warning("详细地址不能为空");
      } else if (this.intro == "") {
        this.$message.warning("详细信息不能为空");
      } else {
        this.$axios
          .post(this.GLOBAL.BASE_URL + "addlocation", {
            detail_address: this.address,
            intro: this.intro,
            longitude: this.lng,
            latitude: this.lat,
            appid: this.$store.getters.showQuery
          })
          .then(res => {
            if (res.data.code == 0) {
              if (this.lbs) {
                this.$message.success("操作成功");
                this.$router.push({
                  path: "/linknewslist"
                });
              } else {
                this.$message.success("操作成功,可到外链图文处查看");
                this.$router.push({
                  path: "/linknewslist"
                });
              }
            } else {
              this.$message.error(res.data.message);
            }
          });
      }
    },
    cancle() {
      this.dialogVisible = false;
    },
    sure() {
      this.dialogVisible = false;
    },
    addIntro() {
      this.dialogVisible = true;
    }
  }
};
</script>

<style scoped>
.info {
  width: 300px;
  margin: 10px 0;
}
.map {
  height: 500px;
}
.tools {
  width: 100%;
  /* height: 40px; */
  margin-bottom: 10px;
  align-items: center;
}
.input {
  width: 230px;
  display: inline-block;
  margin-right: 10px;
}
.latLngs {
  width: 300px;
  display: inline-block;
}
.pos {
  width: auto;
  display: inline-flex;
  align-items: center;
  color: #909399;
  margin-right: 10px;
}
.pos.pos1 {
  margin-left: 30px;
}
.pos.pos2 {
  margin-left: 10px;
}
</style>

