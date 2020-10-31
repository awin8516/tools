<template>
  <div class="table">
    <!-- 使用这个vue文件 -->
    <div class="crumbs">
      <h2>用户列表</h2>
    </div>
    <div class="container">
      <div class="tagstable">
        <div class="handle-box">
          <el-form :inline="true" :model="listObj" class="demo-form-inline">
            <el-form-item label>
              <el-input v-model="listObj.name" placeholder="请输入昵称" @keyup.enter.native="search"></el-input>
            </el-form-item>
            <el-form-item label>
              <el-input
                v-model="listObj.openid"
                placeholder="请输入OpenID"
                @keyup.enter.native="search"
              ></el-input>
            </el-form-item>
            <el-form-item label>
              <el-select
                v-model="listObj.province"
                placeholder="请选择省份"
                @change="getScene('province',listObj.province)"
              >
                <el-option
                  v-for="item in citydata"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label>
              <el-select
                v-model="listObj.sex"
                placeholder="请选择性别"
                @change="getScene('sex',listObj.sex)"
              >
                <el-option
                  v-for="item in sexData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label>
              <el-select
                v-model="listObj.diy_tagid_list"
                placeholder="请选择自定义标签"
                @change="getScene('diy_tagid_list',listObj.diy_tagid_list)"
                multiple
              >
                <el-option
                  v-for="(item,index) in diy_tagList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label>
              <el-select
                v-model="listObj.subscribe_scene"
                placeholder="请选择来源"
                @change="getScene('subscribe_scene',listObj.subscribe_scene)"
              >
                <el-option
                  v-for="item in scene_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label>
              <el-select
                v-model="listObj.fan_status"
                placeholder="是否关注"
                @change="getScene('fan_status',listObj.fan_status)"
              >
                <el-option
                  v-for="item in status_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label>
              <el-select
                v-model="listObj.tag_list"
                placeholder="请选择微信标签"
                @change="getScene('tag_list',listObj.tag_list)"
                multiple
              >
                <el-option
                  v-for="(item,index) in tagListOnly"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户活跃时间">
              <el-date-picker
                v-model="select_active_time"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                type="datetimerange"
                @change="getpickerTimesActive(select_active_time)"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="用户关注时间">
              <el-date-picker
                v-model="select_time"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                type="datetimerange"
                @change="getpickerTimes(select_time)"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label>
              <el-checkbox v-model="listObj.user_shows" @change="search()">显示活动授权用户</el-checkbox>
            </el-form-item>
          </el-form>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label>
              <el-tooltip class="item" effect="dark" content="搜索" placement="top">
                <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
              </el-tooltip>
            </el-form-item>
            <el-form-item label>
              <el-tooltip class="item" effect="dark" content="导出搜索结果" placement="top">
                <el-button type="primary" icon="el-icon-upload" @click="iexport()">导出数据</el-button>
              </el-tooltip>
            </el-form-item>
            <el-form-item label>
              <el-tooltip class="item" effect="dark" content="重置搜索条件" placement="top">
                <el-button type="primary" icon="el-icon-refresh" @click="reset()">重置</el-button>
              </el-tooltip>
            </el-form-item>
          </el-form>
        </div>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 50, 200]"
            :page-size="listObj.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listObj.totals"
            :current-page.sync="listObj.current_page1"
          ></el-pagination>
        </div>
        <el-table
          :data="tableData"
          :header-cell-style="{background:'#f9f9f9'}"
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column fixed label="序号" width="50" align="center" type="index">
            <template slot-scope="scope">{{(scope.$index + 1) + (listObj.page- 1) *listObj.limit}}</template>
          </el-table-column>
          <el-table-column prop="nickname" label="昵称" width="180" sortable>
            <template slot-scope="scope">
              <div style="display:flex;align-items:center;cursor:pointer" @click="show(scope.row)">
                <div class="qrurl">
                  <img v-if="scope.row.headimgurl" :src="scope.row.headimgurl" />
                  <p v-else>用户头像未获取</p>
                  <p>{{scope.row.nickname}}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="openid" label="OpenID" width="260" sortable></el-table-column>
          <el-table-column prop="phone" label="手机号" width="100" sortable></el-table-column>
          <el-table-column prop="province" label="省份" width="100" sortable></el-table-column>
          <el-table-column prop="sex" label="性别" width="100" sortable></el-table-column>
          <el-table-column prop="remark" label="自定义标签" width="200" sortable>
            <template slot-scope="scope">
              <div
                class="remarks"
                v-for="(item,index) in showDiyTag(scope.row.diy_tagid_list)"
                :key="index"
              >
                <p class="remark">{{item}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="subscribe_scene" label="来源" width="100" sortable></el-table-column>
          <el-table-column prop="fan_status" label="关注状态" width="120" sortable></el-table-column>
          <el-table-column prop="updated_at" label="最后活跃时间" sortable width="150">
            <template slot-scope="scope">{{scope.row.updated_at}}</template>
          </el-table-column>
          <el-table-column prop label="操作" min-width="160">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="查看与用户对话信息" placement="top">
                <el-button
                  type="primary"
                  icon="el-icon-chat-line-round"
                  @click="message(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="查看详细信息" placement="top">
                <el-button type="primary" size="mini" @click="show(scope.row)">详细</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 50, 200]"
            :page-size="listObj.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listObj.totals"
            :current-page.sync="listObj.current_page1"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import citydata from "../../utils/citydata";
import BaseView from "../common/BaseView";
export default {
  components: {},
  extends: BaseView,
  props: ["current_page"],
  data() {
    return {
      // 统一的url
      // 图片适配
      fit: "cover",
      // 打开用户信息页面时，下面的tab页面处在默认的第一个显示
      activeName: "1",
      // 用户列表上一壶酒
      tableData: [],
      // 获取用户信息列表的参数
      listObj: {
        paginate: "10",
        name: "",
        openid: "",
        start: "",
        end: "",
        appid: "",
        tag_list: [],
        page: 1,
        limit: 10,
        totals: 0,
        current_page1: 0,
        diy_tagid_list: []
      },
      // 外层的列表的总条数
      listObj_total: 0,
      // 进入个人用户信息面板的数据总条数
      dynamicsObj_total: 0,
      // 查询参数---来源    写死就好
      scene_options: [
        { label: "所有来源", value: "" },
        { label: "公众号搜索", value: "ADD_SCENE_SEARCH" },
        { label: "公众号迁移", value: "ADD_SCENE_ACCOUNT_MIGRATION" },
        { label: "名片分享", value: "ADD_SCENE_PROFILE_CARD" },
        { label: "扫描二维码", value: "ADD_SCENE_QR_CODE" },
        { label: "图文页内名称点击", value: "ADD_SCENEPROFILE LINK" },
        { label: "图文页右上角菜单", value: "ADD_SCENE_PROFILE_ITEM" },
        { label: "支付后关注", value: "ADD_SCENE_PAID" },
        { label: "活动授权", value: "ACTIVITY_AUTH" },
        { label: "其他", value: "ADD_SCENE_OTHERS" }
      ],
      // 查询参数---是否关注   写死就好
      status_options: [
        { label: "关注", value: "1" },
        { label: "未关注", value: "0" }
      ],
      //查询参数---标签组
      tagList: [],
      tagListOnly: [],
      diy_tagList: [],
      // 页面加载
      loading: false,
      // 微信用户信息面板参数
      dialogVisible: false,
      // 个人信息数据（在信息面板中使用）
      personData: {},
      // 是否输入用户的备注名称2，默认是一个笔的icon
      is_remark: true,
      // 个人信息数据内使用（用户的综合资料页面数据参数）
      ruleForm: {
        id: "",
        city: "",
        province: "",
        country: "",
        name: "",
        mobile: "",
        gu_hua: "",
        xiang_xi_addr: "",
        nickname: "",
        district: "",
        remark: ""
      },
      // 标签数据，这个数据通过请求接口获得  不写死
      tagid_lists: [],
      // 选中的标签
      tagid_list: "",
      // 用户信息面板中的个人状态列表
      dynamicsData: [],
      // 获取个人状态数据列表的参数
      dynamicsObj: {
        appid: "",
        paginate: "10",
        f_id: "",
        type: "",
        is: "",
        page: 1
      },
      limit: 100000,
      page: 1,
      avatar: "",
      loading1: false,
      citydata: citydata,
      sexData: [
        {
          value: 0,
          label: "全部"
        },
        {
          value: 1,
          label: "男"
        },
        {
          value: 2,
          label: "女"
        },
        {
          value: 3,
          label: "其他"
        }
      ],
      select_time: "",
      select_active_time: ""
    };
  },
  beforeDestroy() {
    localStorage.removeItem("dataType");
    localStorage.removeItem("sex");
    localStorage.removeItem("province");
    localStorage.removeItem("activeData");
    localStorage.removeItem("cid");
    localStorage.removeItem("tid");
  },
  created() {
    this.getalldiytag();
    // 初始化数据
    this.listObj.appid = this.$store.getters.showQuery;
    if (localStorage.getItem("pages")) {
      this.listObj.page =
        JSON.parse(localStorage.getItem("pages")).userinfo || this.page;
      this.listObj.currentPage =
        JSON.parse(localStorage.getItem("pages")).userinfo || this.page;
    }
    this.biao_qian_lists().then(() => {
      if (localStorage.getItem("cid")) {
        let diy_tagid_list = parseInt(window.atob(localStorage.getItem("cid")));
        this.listObj.diy_tagid_list = [diy_tagid_list];
      }
      if (localStorage.getItem("tid")) {
        let tag_list = parseInt(window.atob(localStorage.getItem("tid")));
        this.listObj.tag_list = [tag_list];
      }
      this.getData();
    });
    if (localStorage.getItem("avatar")) {
      this.avatar = localStorage.getItem("avatar");
    }
    if (localStorage.getItem("dataType")) {
      if (localStorage.getItem("dataType") == "sumUser") {
        this.listObj.fan_status = "1";
        this.getData();
      }
      if (localStorage.getItem("dataType") == "addUser") {
        this.listObj.fan_status = "1";
        this.handleAddUser();
      }
      if (localStorage.getItem("dataType") == "activeuser") {
        this.listObj.fan_status = "1";
        this.handleActiveser();
      }
    }
    if (localStorage.getItem("sex")) {
      this.listObj.fan_status = "1";
      this.listObj.sex = parseInt(localStorage.getItem("sex"));
      this.getData();
    }
    if (localStorage.getItem("province")) {
      this.listObj.fan_status = "1";
      this.listObj.province = localStorage.getItem("province");
      this.getData();
    }
    if (localStorage.getItem("activeData")) {
      this.listObj.fan_status = "1";
      this.handleActiveData();
    }
  },
  methods: {
    // 每日活跃
    handleActiveData() {
      let activeData = `${localStorage.getItem("activeData")} 0:0:0`;
      var timeStamp = new Date(new Date(activeData).getTime()) / 1000;
      var SevenDayAgo = timeStamp + 86400 * 1;
      this.select_active_time = [
        new Date(timeStamp * 1000),
        new Date(SevenDayAgo * 1000 - 1)
      ];
      this.getpickerTimesActive(this.select_active_time);
    },
    // 获取昨日新增用户
    handleAddUser(time) {
      var timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
      var SevenDayAgo = timeStamp - 86400 * 1;
      this.select_time = [
        new Date(SevenDayAgo * 1000),
        new Date(timeStamp * 1000 - 1)
      ];
      this.getpickerTimes(this.select_time);
    },
    getpickerTimes(val, str) {
      if (val) {
        this.listObj.start_time = parseInt(val[0].getTime() / 1000);
        this.listObj.end_time = parseInt(val[1].getTime() / 1000);
        this.getData();
      } else {
        this.listObj.start_time = "";
        this.listObj.end_time = "";
        this.getData();
      }
    },
    handleActiveser(time) {
      var timeStamp = new Date(new Date().getTime()) / 1000;
      var SevenDayAgo = timeStamp - 86400 * 3;
      this.select_active_time = [
        new Date(SevenDayAgo * 1000),
        new Date(timeStamp * 1000 - 1)
      ];
      this.getpickerTimesActive(this.select_active_time);
    },
    getpickerTimesActive(val, str) {
      if (val) {
        this.listObj.active_start = parseInt(val[0].getTime() / 1000);
        this.listObj.active_end = parseInt(val[1].getTime() / 1000);
        this.getData();
      } else {
        this.listObj.active_start = "";
        this.listObj.active_end = "";
        this.getData();
      }
    },
    // 获取用户电商信息
    getBusiness(item) {
      localStorage.setItem(
        "BusId",
        window.btoa(item.id) + "?" + this.listObj.page
      );
      this.$router.push({
        path: "/business",
        params: {
          id: item.id
        }
      });
    },
    // 同步电商数据
    sync() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "shop_sync", {
          u_id: "",
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("同步成功");
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 进入消息管理页面，，向父组件传递listenChild事件，父组件接收到以后做后续操作
    message(value) {
      console.log(JSON.stringify(value));
      localStorage.setItem("uid", JSON.stringify(value));
      this.$router.push({
        path: "/UserMessage"
      });
    },
    // 重置ruleForm数据
    resetRuleForm() {
      this.ruleForm.id = "";
      this.ruleForm.city = "";
      this.ruleForm.province = "";
      this.ruleForm.country = "";
      this.ruleForm.name = "";
      this.ruleForm.mobile = "";
      this.ruleForm.gu_hua = "";
      this.ruleForm.xiang_xi_addr = "";
      this.ruleForm.nickname = "";
      this.ruleForm.district = "";
      this.ruleForm.remark = "";
      this.tagid_list = "";
      this.tagid_lists = [];
    },
    // 点击用户头像，调用user_get接口  获取用户的信息，，
    show(row, event) {
      if (parseInt(localStorage.getItem("status")) == 1) {
        window.open(this.GLOBAL.USEROPEN + window.btoa(row.id), "_blank");
      } else if (parseInt(localStorage.getItem("status")) == 2) {
        // 管理员
        this.dialogVisible = true;
        this.getUserData(row);
      }
    },
    getUserData(item) {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "user_get", {
          id: item.id,
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            if (res.data.data) {
              this.personData = res.data.data;
              // this.biao_qian_lists();
            } else {
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 获取微信标签
    biao_qian_lists() {
      return new Promise(resolve => {
        this.$axios
          .post(this.GLOBAL.BASE_URL + "biao_qian_list", {
            appid: this.$store.getters.showQuery
          })
          .then(res => {
            if (res.data.code == 0) {
              this.tagList = this.changeTagsList(res.data.data);
              this.tagid_lists = this.changeTagsList(res.data.data);
              this.tagListOnly = this.changeTagsList(res.data.data);

              resolve();
            } else {
              this.$message.error(res.data.message);
            }
          });
      });
    },
    // 显示标签名称
    showTag(value) {
      let result = [];
      if (Boolean(value)) {
        for (var j = 0; j < value.length; j++) {
          for (var i = 0; i < this.tagList.length; i++) {
            if (value[j] == this.tagList[i].value) {
              result.push(this.tagList[i].label);
            }
          }
        }
      }
      return result;
    },
    // 显示标签名称
    showDiyTag(value) {
      let result = [];
      if (Boolean(value)) {
        for (var j = 0; j < value.length; j++) {
          for (var i = 0; i < this.diy_tagList.length; i++) {
            if (value[j] == this.diy_tagList[i].value) {
              result.push(this.diy_tagList[i].label);
            }
          }
        }
      }
      return result;
    },
    // 转换json数据中的属性
    changeKey(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/id/g, "value"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/name/g, "label"));
      for (let key in obj2) {
        delete obj2[key].count;
      }
      return obj2;
    },
    // 导出功能
    iexport() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "user_exit_new", this.listObj)
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success(res.data.message);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 无用函数，，插眼
    getScene(type, value) {
      if (type == "subscribe_scene") {
        this.listObj.subscribe_scene = value;
      } else if (type == "fan_status") {
        this.listObj.fan_status = value;
      } else if (type == "tag_list") {
        this.listObj.tag_list = value;
      } else if (type == "diy_tagid_list") {
        this.listObj.diy_tagid_list = value;
      }
      this.getData();
    },
    // 重置查询参数
    reset() {
      this.listObj.name = "";
      this.listObj.remark = "";
      this.listObj.openid = "";
      this.listObj.subscribe_scene = null;
      this.listObj.fan_status = null;
      this.listObj.page = 1;
      this.listObj.paginate = "10";
      this.listObj.tag_list = "";
      this.listObj.diy_tagid_list = "";
      this.listObj.sex = "";
      this.listObj.province = "";
      this.listObj.user_shows = "";

      this.listObj.start_time = "";
      this.listObj.end_time = "";
      this.listObj.active_start = "";
      this.listObj.active_end = "";
      this.select_active_time = "";
      this.select_time = "";
      this.getData();
    },
    // 搜索
    search() {
      this.listObj.page = 1;
      this.getData();
    },
    // 翻页
    handleCurrentChange(val) {
      this.listObj.page = val;
      this.getData();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.userinfo = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    // 选择条数
    handleSizeChange(val) {
      this.listObj.page = this.listObj.current_page1;
      this.listObj.limit = val;
      this.getData();
    },
    // 获取列表信息
    getData() {
      this.listObj.user_shows
        ? (this.listObj.user_show = 1)
        : (this.listObj.user_show = 0);
      this.$axios
        .post(this.GLOBAL.BASE_URL + "user_list", this.listObj)
        .then(res => {
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
            this.listObj.totals = res.data.data.total;
            this.listObj.current_page1 = res.data.data.current_page;
            if (this.listObj.page > res.data.data.last_page) {
              this.listObj.page = res.data.data.last_page;
              this.getData();
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 获取自定义标签
    getalldiytag() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "getalldiytag", {
          appid: this.$store.getters.showQuery,
          page: this.page,
          limit: this.limit
        })
        .then(res => {
          if (res.data.code == 0) {
            this.diy_tagList = this.changeDiyTagsList(res.data.data.data);
            if (window.location.href.split("?")[1]) {
              let tid = Number(this.$utils.getQueryString("tid"));
              this.listObj.diy_tagid_list = [tid];
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 将json数据中的id和name转化为value和label
    changeTagsList(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/id/g, "value"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/name/g, "label"));
      return obj2;
    },
    // 将json数据中的id和name转化为value和label
    changeDiyTagsList(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/tag_id/g, "value"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/tag_name/g, "label"));
      return obj2;
    },
    // 个人信息标签的添加
    handleTagList(item) {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "user_biao_qian_add", {
          appid: this.$store.getters.showQuery,
          openIds: ["" + this.ruleForm.openid],
          tagId: item[item.length - 1].value
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("操作成功");
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 删除标签
    deleteTagList(item) {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "user_biao_qian_un", {
          appid: this.$store.getters.showQuery,
          openIds: ["" + this.ruleForm.openid],
          tagId: item.value
        })
        .then(res => {
          if (res.data.code == 0) {
          } else {
            this.$message.error(res.data.message);
          }
        });
    }
  }
};
</script>

<style lang='scss' scoped>
.checkbox {
  height: 32px;
  display: inline-flex !important;
  align-items: center;
  margin-right: 50px;
}
// ------------------------------
.footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
.remark {
  text-align: center;
  background: #79c1fb;
  border-radius: 2px;
  margin: auto;
  color: #fff;
  margin-bottom: 4px;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  padding: 4px;
}
.remarks {
  display: inline-block;
  margin-right: 5px;
}
.info {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}
.info p {
  margin: 20px 0;
}

.qrurl {
  width: auto;
  height: auto;
  display: inline-flex;
  justify-content: center;
  margin-right: 10px;
  align-items: center;
}
.qrurl img {
  width: 30px;
}
.qrurl p {
  width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 10px;
}
.uArea {
  width: 100px;
  display: inline-block;
}
.uHeader {
  width: 100%;
  height: 120px;
  display: flex;
  margin-top: -20px;
}
.uHeader_img {
  width: 120px;
  height: 120px;
  overflow: hidden;
  border-radius: 5px;
  margin-right: 33px;
}
.uicon {
  padding-left: 10px;
  color: green;
  font-size: 20px;
}
.uinput {
  width: 250px;
  height: 30px;
  margin-top: 8px;
  margin-left: -8px;
  font-size: 14px;
}
.ueditarea {
  display: flex;
}
.uinput > div {
  width: 100%;
  display: flex;
}
.uremark {
  display: inline-flex;
  align-items: center;
  color: rgb(112, 110, 110);
  font-style: italic;
}
.ubtn {
  display: inline-flex;
  width: 30px;
  height: 30px;
  background: #337ab7;
  justify-content: center;
  align-items: center;
  color: #fff;
  border-radius: 5px;
  margin-left: 10px;
  flex-shrink: 0;
  cursor: pointer;
}
.uedit {
  width: 20px;
  background: transparent;
  color: #333;
  justify-content: start;
}
.uHeader_txt {
  font-size: 20px;
}
.uStatus {
  font-size: 14px;
  color: rgb(112, 110, 110);
  margin-top: 8px;
}
.uTime {
  font-size: 14px;
  color: rgb(112, 110, 110);
  margin-top: 8px;
}
.utabs {
  width: 100%;
  height: 100%;
  margin-top: 30px;
}
.line {
  width: 100%;
  height: 10px;
}
.select {
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
  min-width: 200px;
}
.toptag {
  background: #337ab7 !important;
  border-radius: 5px 5px 0 0;
}
.toptag a {
  color: #fff !important;
}
.tips {
  font-size: 14px;
  color: #ccc;
}
.qtags {
  width: 100%;
  display: flex;
}
.panel {
  width: 250px;
  height: 100%;
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.tagPanel {
  display: flex;
}
.line {
  width: 20px;
}
.tagItem {
  width: 250px;
  margin-top: 20px;
}
.tagItem ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.tagItem ul li {
  width: 100%;
  height: 35px;
  position: relative;
}
.tagItem ul li:hover {
  background: rgb(233, 231, 231);
}
.tagItem ul li i {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 10;
}
.tagItem ul li a {
  display: flex;
  align-items: center;
  color: #333;
  padding-left: 10px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #ddd;
  z-index: 9;
}
.tagItem ul li:last-child a {
  border-bottom: none;
}
</style>
