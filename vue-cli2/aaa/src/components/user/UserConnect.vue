<template>
  <div class="table">
    <div class="crumbs">
      <h2>用户详情</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-tooltip class="item" effect="dark" content="返回用户列表" placement="top">
          <el-button type="success" @click="back()" icon="el-icon-back">{{backTips}}</el-button>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="查看与用户的聊天消息" placement="top">
          <el-button type="primary" icon="el-icon-edit" @click="message()">用户消息</el-button>
        </el-tooltip>
      </div>
      <div class="headImg">
        <div class="headImg_img">
          <img :src="headimgurl" />
        </div>
        <div class="headImg_name">{{nickname}}</div>
      </div>
      <div class="user_info">
        <div class="user_info_left">
          <div class="user_info_data">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="title">微信数据</span>
              </div>
              <div v-for="(item,index) in wxData" :key="index" class="text item">
                <p>{{item.label}}</p>
                <p>{{item.value}}</p>
              </div>
            </el-card>
          </div>
          <div class="user_info_data">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="title">用户自定义标签</span>
                <span class="sync" @click="addTag()">添加</span>
              </div>
              <div class="remarks" v-for="(item,index) in showTag(diyTag)" :key="index">
                <p class="remark">
                  <span class="delete" @click="diy_biao_qian_remove(item)">
                    <i class="el-icon-delete"></i>
                  </span>
                  {{item.label}}
                </p>
              </div>
              <div class="footer">
                <p @click="handleMore('diyTag')">查看更多</p>
              </div>
            </el-card>
          </div>
          <div class="user_info_data">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="title">微信标签</span>
                <!-- <el-button size="large" style="float: right;" type="text">同步</el-button> -->
                <div>
                  <p class="sync" @click="biao_qian_pull()">同步</p>
                  <p class="sync" @click="addUsersTag()">添加</p>
                </div>
              </div>
              <p class="remark" v-for="(item,index) in showUserTag(wxTag)" :key="index">
                <span class="delete" @click="wx_biao_qian_remove(item)">
                  <i class="el-icon-delete"></i>
                </span>
                {{ item.name}}
              </p>
              <div class="footer">
                <p @click="handleMore('wxData')">查看更多</p>
              </div>
            </el-card>
          </div>
          <div class="user_info_data">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="title">电商标签</span>
                <span class="sync" @click="syncBus()">同步</span>
              </div>
              <p class="tagList" v-for="(item,index) in BusTag" :key="index">{{ item.label_name}}</p>
              <div class="footer">
                <p @click="handleMore('BusTag')">查看更多</p>
              </div>
            </el-card>
          </div>
          <div class="user_info_data">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="title">粉丝自定义资料</span>
              </div>
              <div v-if="fansData.length">
                <div v-for="(list,index) in  fansData" :key="index">
                  <div class="fans_name" v-if="list.weboath">{{list.weboath.name}}</div>
                  <div v-for="(item,index) in showFriend(list)" :key="index" class="text item">
                    <p>{{item.label}}</p>
                    <p>{{item.value}}</p>
                  </div>
                </div>
              </div>
              <div class="footer">
                <p @click="handleMore('fansData')">查看更多</p>
              </div>
            </el-card>
          </div>
          <div class="user_info_data">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="title">朋友关系网</span>
              </div>
              <div class="fans_img" v-for="(list,index) in  friendData" :key="index">
                <img :src="list.headimgurl" />
              </div>
              <div class="footer">
                <p @click="handleMore('friendData')">查看更多</p>
              </div>
            </el-card>
          </div>
          <div class="user_info_data">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="title">位置</span>
              </div>
              <div class="maps" id="map"></div>
            </el-card>
          </div>
        </div>
        <div class="user_info_right">
          <div class="user_info_record">
            <h2>用户行为记录</h2>
            <div class="line"></div>
            <v-userRecord :dynamicsData="dynamicsData"></v-userRecord>
          </div>
        </div>
      </div>
    </div>
    <!-- 用户标签添加 -->
    <el-dialog title="微信标签" :visible.sync="userDialogVisible" width="30%" center>
      <el-select
        v-model="tagid"
        filterable
        remote
        reserve-keyword
        placeholder="请输入关键词"
        :remote-method="remoteMethod"
        v-loading="loading"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="userSure()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 自定义标签添加 -->
    <el-dialog title="用户自定义标签" :visible.sync="centerDialogVisible" width="30%" center>
      <el-select
        v-model="tagid"
        filterable
        remote
        reserve-keyword
        placeholder="请输入关键词"
        :remote-method="remoteMethod"
        v-loading="loading"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查看更多 -->
    <el-dialog :title="dialogTitle" :visible.sync="moreDialogVisible" width="30%" center>
      <p
        v-show="dialogType == 'wxData'"
        class="remark"
        v-for="(item,index1) in showUserTag(wxTag)"
        :key="index1+'--label'"
      >{{ item.name}}</p>
      <div
        v-show="dialogType == 'diyTag'"
        class="remarks"
        v-for="(item,index2) in showTag(diyTag)"
        :key="index2"
      >
        <p class="remark">
          <span class="delete" @click="diy_biao_qian_remove(item)">
            <i class="el-icon-delete"></i>
          </span>
          {{item.label}}
        </p>
      </div>
      <p
        v-show="dialogType == 'BusTag'"
        class="tagList"
        v-for="(item,index3) in BusTag"
        :key="index3"
      >{{ item.label_name}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="moreDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import vUserRecord from "./userRecord";
import { TMap } from "../LBS/TMap";
export default {
  components: {
    vUserRecord
  },
  data() {
    return {
      backTips: "返回用户列表页",
      centerDialogVisible: false,
      userDialogVisible: false,
      loading: false,
      uid: "",
      // 微信数据
      wxData: {},
      // 微信标签
      wxTag: [],
      // 自定义标签
      diyTag: [],
      // 电商标签,
      BusTag: [],
      headimgurl: "",
      nickname: "",
      dynamicsObj: {
        appid: this.$store.getters.showQuery,
        paginate: 10,
        f_id: "",
        type: "",
        is: "",
        page: 1,
        year: new Date().getFullYear()
      },
      dynamicsData: [],
      lat: "",
      lng: "",
      options: [],
      list: [],
      tagData: [],
      openid: "",
      tagid: "",
      fansData: [],
      friendData: [],
      friendDataInfo: [],
      // 自定义标签
      diy_tagList: "",
      // 微信标签
      tagid_list: "",
      moreDialogVisible: false,
      dialogTitle: "",
      dialogType: "",
      is_message: true
    };
  },
  created() {
    if (localStorage.getItem("uid")) {
      this.uid = localStorage.getItem("uid");
    }
    if (window.location.href.split("?")[1]) {
      this.uid = this.$utils.getQueryString("uid");
    }
    this.dynamicsObj.f_id = this.uid;
    this.getalldiytag();
    this.getLabelList();
    this.useractivity();
  },
  mounted() {
    this.init();
  },
  methods: {
    // 进入消息管理页面，，向父组件传递listenChild事件，父组件接收到以后做后续操作
    message() {
      let obj = {
        appid: this.$store.getters.showQuery,
        id: this.dynamicsObj.f_id,
        is: "",
        page: 1,
        paginate: "10",
        type: "2",
        nickname: this.nickname
      };
      this.$emit("listenChild", false, obj, 1);
    },
    // 查看更多
    handleMore(type) {
      this.dialogType = type;
      if (type == "wxData") {
        this.dialogTitle = "微信标签";
        this.moreDialogVisible = true;
      } else if (type == "diyTag") {
        this.dialogTitle = "用户自定义标签";
        this.moreDialogVisible = true;
      } else if (type == "BusTag") {
        this.dialogTitle = "电商标签";
        this.moreDialogVisible = true;
      } else if (type == "friendData") {
        localStorage.setItem("uid", this.uid);
        this.$router.push({
          path: "/frineds"
        });
      } else if (type == "fansData") {
        this.$router.push({
          path: "/fansData"
        });
      }
    },
    // 同步电商标签
    syncBus() {
      this.getLabelList();
      setTimeout(() => {
        this.$message.success("同步成功");
      }, 500);
    },
    // 展示朋友
    showFriend(data) {
      if (data.length) {
        let result = [
          { label: "创建时间", value: data.created_at },
          { label: "地址", value: data.district },
          { label: "key", value: data.key },
          { label: "OpenID", value: data.openid },
          { label: "活动名称", value: data.weboath.name },
          { label: "性别", value: data.sex == 0 ? "男士" : "女士" },
          { label: "联系方式", value: data.phone }
        ];
        // 遍历数组  如果哪一项是空  就删掉不在前台显示
        result.forEach((ele, index) => {
          if (!Boolean(ele.value)) {
            result.splice(index, 1);
          }
        });
        return result;
      } else {
        return [];
      }
    },
    // 获取粉丝资料列表
    useractivity() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "useractivity", {
          appid: this.$store.getters.showQuery,
          id: this.uid
        })
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data.data.length) {
              this.fansData = res.data.data.data;
              this.fansData = this.fansData.slice(0, 2);
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 获取朋友列表
    friendlist() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "friendlist", {
          appid: this.$store.getters.showQuery,
          id: this.uid
        })
        .then(res => {
          if (res.data.code == 0) {
            this.friendData = res.data.data.data;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 确定打标签
    sure() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "diy_biao_qian_add", {
          tagid: this.tagid,
          appid: this.$store.getters.showQuery,
          openid: this.openid
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("操作成功");
            this.centerDialogVisible = false;
            this.diy_biao_qian_user_list();
            this.openid = "";
            this.tagid = "";
            this.options = [];
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    userSure() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "user_biao_qian_add", {
          tagId: this.tagid,
          appid: this.$store.getters.showQuery,
          openIds: this.openid.split(",")
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("操作成功");
            this.userDialogVisible = false;
            this.wx_biao_qian_user_list();
            this.openid = "";
            this.tagid = "";
            this.options = [];
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    remoteMethod(query) {
      if (query !== "") {
        setTimeout(() => {
          this.options = this.tagData.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
    // 给用户打上标签
    addTag() {
      this.options = [];
      this.centerDialogVisible = true;
      this.gettagData();
    },
    addUsersTag() {
      this.options = [];
      this.userDialogVisible = true;
      this.biao_qian_fen_list();
    },
    // 获取自定义标签
    getalldiytag() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(255,255,255, 0.7)"
      });
      this.$axios
        .post(this.GLOBAL.BASE_URL + "getalldiytag", {
          appid: this.$store.getters.showQuery,
          page: 1,
          limit: 100000
        })
        .then(res => {
          loading.close();
          if (res.data.code == 0) {
            this.diy_tagList = this.changeDiyTagsList(res.data.data.data);
            this.getUserData();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    gettagData() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "getalldiytag", {
          appid: this.$store.getters.showQuery,
          page: 1,
          limit: 10000
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tagData = res.data.data.data;
            this.tagData = this.changeTagsList(this.tagData);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    biao_qian_fen_list() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "biao_qian_fen_list", {
          appid: this.$store.getters.showQuery,
          page: 1,
          limit: 10000
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tagData = res.data.data.data;
            let obj1 = JSON.parse(
              JSON.stringify(this.tagData).replace(/wx_tag_id/g, "value")
            );
            let obj2 = JSON.parse(
              JSON.stringify(obj1).replace(/tag_name/g, "label")
            );
            this.tagData = obj2;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    changeTagsList(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/tag_id/g, "value"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/tag_name/g, "label"));

      return obj2;
    },
    // 获取用户信息
    getUserData() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "user_get", {
          id: this.uid,
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data) {
              // 取出电商标签
              let data = res.data.data;
              this.tagid_list = res.data.data.data_biao_qian;
              this.handleData(data);
            } else {
              const loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(255,255,255, 0.7)"
              });
              this.$message.success("无数据,回到用户列表页");
              setTimeout(() => {
                this.back();
                loading.close();
              }, 1000);
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 返回用户信息列表页
    back() {
      this.$router.push({
        path: "/UserInfo"
      });
    },
    // 处理数据
    handleData(data) {
      this.headimgurl = data.headimgurl;
      this.nickname = data.nickname;
      // 处理微信数据
      // 判断直辖市 - 北京、天津、上海和重庆
      let province = data.province;
      let city = data.city;
      let district = data.district;
      if (
        province.includes("上海") ||
        province.includes("天津") ||
        province.includes("北京") ||
        province.includes("重庆")
      ) {
        data.province = province;
        data.city = province;
        data.district = district;
      }

      this.wxData = [
        { label: "来源", value: data.fan_status },
        { label: "OpenID", value: data.openid },
        { label: "UnionID", value: data.unionid },
        { label: "昵称", value: data.nickname },
        { label: "性别", value: data.sex },
        { label: "省", value: data.province },
        { label: "市", value: data.city },
        { label: "区", value: data.district },
        { label: "手机号", value: data.phone }
      ];
      // 遍历数组  如果哪一项是空  就删掉不在前台显示
      // this.wxData.forEach((ele, index) => {
      //   if (!Boolean(ele.value)) {
      //     this.wxData.splice(index, 1);
      //   }
      // });

      // 处理微信标签
      this.wxTag = data.tagid_list;
      // 处理自定义标签
      this.diyTag = data.diy_tagid_list;
      // 哦经纬度
      this.lat = data.lat;
      this.lng = data.lng;
      this.init(data.province + data.city + data.district);

      this.openid = data.openid;
      this.friendlist();
    },
    // 将json数据中的id和name转化为value和label
    changeDiyTagsList(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/tag_id/g, "value"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/tag_name/g, "label"));
      return obj2;
    },
    // 显示标签名称
    showTag(value) {
      let result = [];
      if (Boolean(value)) {
        for (var j = 0; j < value.length; j++) {
          for (var i = 0; i < this.diy_tagList.length; i++) {
            if (value[j] == this.diy_tagList[i].value) {
              result.push(this.diy_tagList[i]);
            }
          }
        }
      }
      return result;
    },
    showUserTag(value) {
      let result = [];
      if (Boolean(value)) {
        for (var j = 0; j < value.length; j++) {
          for (var i = 0; i < this.tagid_list.length; i++) {
            if (value[j] == this.tagid_list[i].id) {
              result.push(this.tagid_list[i]);
            }
          }
        }
      }
      return result;
    },
    // 电商标签
    getLabelList() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "shop_label_list", {
          appid: this.$store.getters.showQuery,
          u_id: this.uid
        })
        .then(res => {
          if (res.data.code == 0) {
            this.BusTag = res.data.data;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 获取用户行为记录
    getDynamics() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "user_dynamics_list", this.dynamicsObj)
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data.data) {
              this.dynamicsData = res.data.data.data.data;
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    init(address = "北京") {
      let vm = this;
      let marker = "";
      TMap("7EYBZ-F6R6F-4YBJZ-JZG7S-IK2ZE-UGBJZ").then(qq => {
        //步骤：定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
        //设置地图中心点
        var myLatlng = new qq.maps.LatLng(39.984104, 116.307503);

        //定义工厂模式函数
        var myOptions = {
          zoom: 8, //设置地图缩放级别
          center: myLatlng, //设置中心点样式
          mapTypeId: qq.maps.MapTypeId.ROADMAP //设置地图样式详情参见MapType
        };
        //获取dom元素添加地图信息
        var map = new qq.maps.Map(document.getElementById("map"), myOptions);
        //调用地址解析类
        vm.geocoder = new qq.maps.Geocoder({
          complete: function(result) {
            map.setCenter(result.detail.location);
            vm.marker = new qq.maps.Marker({
              map: map,
              position: result.detail.location
            });
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

        this.geocoder.getLocation(address);
      });
    },
    // 拉取微信标签ian
    biao_qian_pull() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "biao_qian_one_pull", {
          appid: this.$store.getters.showQuery,
          openid: this.openid
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("同步成功");
            this.wx_biao_qian_user_list();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 获取用户微信标签
    wx_biao_qian_user_list() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "wx_biao_qian_user_list", {
          appid: this.$store.getters.showQuery,
          openid: this.openid
        })
        .then(res => {
          if (res.data.code == 0) {
            this.getUserData();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 移除用户微信标签
    wx_biao_qian_remove(item) {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "user_biao_qian_un", {
          appid: this.$store.getters.showQuery,
          tagId: item.id,
          openIds: this.openid.split(",")
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("移除成功");
            this.diy_biao_qian_user_list();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 移除用户自定义的标签
    diy_biao_qian_remove(item) {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "diy_biao_qian_remove", {
          appid: this.$store.getters.showQuery,
          tagid: item.value,
          openid: this.openid
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("移除成功");
            this.diy_biao_qian_user_list();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 获取获取自定义标签列表
    diy_biao_qian_user_list() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "diy_biao_qian_user_list", {
          appid: this.$store.getters.showQuery,
          openid: this.openid
        })
        .then(res => {
          if (res.data.code == 0) {
            this.diyTag = [];
            res.data.data.forEach(ele => {
              this.diyTag.push(ele.tag_id);
            });
            this.getUserData();
          } else {
            this.$message.error(res.data.message);
          }
        });
    }
  }
};
</script>

<style lang='scss' scoped>
p.remark:hover .delete {
  display: flex;
}
.tools {
  width: 140px;
  display: flex;
  justify-content: space-between;
}
.fans_name {
  width: 100%;
  height: 30px;
  background: $--color-primary;
  display: flex;
  align-items: center;
  color: #fff;
  border-radius: 2px;
  padding: 0 4px;
  box-sizing: border-box;
}
.fans_img {
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 50%;
  display: inline-flex;
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}
.fans_img > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.maps {
  height: 300px;
}
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
.remark {
  text-align: center;
  background: #79c1fb;
  border-radius: 2px;
  margin: auto;
  color: #fff;
  margin-bottom: 6px;
  display: inline-block;
  margin-right: 6px;
  position: relative;
  line-height: 1;
  white-space: nowrap;
  padding: 4px;;
}
.remarks {
  display: inline-block;
  margin-right: 5px;
}
.clearfix {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sync {
  background: $--color-primary;
  color: #fff;
  padding: 3px;
  box-sizing: border-box;
  border-radius: 2px;
  width: 60px;
  text-align: center;
  cursor: pointer;
  display: inline-block;
}
.clearfix span.title {
  font-size: 20px;
  font-weight: bold;
  color: #000;
}
p.tagList {
  text-align: center;
  background: $--color-primary;
  border-radius: 2px;
  margin: auto;
  color: #fff;
  padding: 0 6px;
  margin-bottom: 6px;
  display: inline-block;
  margin-right: 6px;
  position: relative;
  cursor: pointer;
}
.delete {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  cursor: pointer;
  display: none;
  justify-content: center;
  align-items: center;
}

.item {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}
.line {
  width: 100%;
  height: 10px;
  margin-bottom: 10px;
}
.user_info {
  width: 100%;
  height: auto;
  margin-top: 20px;
  display: flex;
}
.user_info_left {
  width: 400px;
  height: auto;
}
.user_info_right {
  width: 100%;
  height: auto;
}
.user_info_data {
  width: 400px;
  height: auto;
  box-sizing: border-box;
  margin-bottom: 10px;
}
.headImg {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(218, 217, 217);
  padding-bottom: 10px;
}
.headImg_img {
  width: 80px;
  height: 80px;
  margin-right: 10px;
  border-radius: 4px;
  overflow: hidden;
}
.headImg_img > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.user_info_record {
  width: 90%;
  height: auto;
  margin: auto;
  padding: 4px;
}
/* ------------------ */
.pagination {
  display: flex;
  justify-content: flex-end;
}
/* -------------- */


.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.card {
  width: 100%;
  height: 100%;
  border: 1px solid #e4e7ed;
  padding: 10px;
  display: flex;
}
.cardItem {
  width: 150px;
  margin-right: 10px;
}
.sumit {
  text-align: center;
  margin-top: 20px;
}
</style>

