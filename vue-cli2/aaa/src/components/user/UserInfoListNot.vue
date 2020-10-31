<template>
  <div class="table">
    <div class="crumbs">
      <h2>用户信息1</h2>
    </div>
    <div class="qtags">
      <div class="tagstable">
        <div class="handle-box">
          <div class="select">
            <el-input v-model="listObj.name" placeholder="请输入昵称" @keyup.enter.native="search"></el-input>
          </div>
          
          <div class="select">
            <el-input v-model="listObj.openid" placeholder="请输入OpenID" @keyup.enter.native="search"></el-input>
          </div>
          <div class="select">
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
          </div>
          <div class="select">
            <el-select
              v-model="listObj.fan_status"
              placeholder="请选择关注状态"
              @change="getScene('fan_status',listObj.fan_status)"
            >
              <el-option
                v-for="item in status_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="select">
            <el-select
              v-model="listObj.tag_list"
              placeholder="请选择标签"
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
          </div>
          <div class="select">
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
          </div>
        </div>
        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
        <el-button type="primary" icon="el-icon-upload" @click="iexport()">导出数据</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="reset()">重置</el-button>
        <el-button type="primary" icon="el-icon-s-data" @click="sync()">电商信息同步</el-button>
        <div class="line"></div>
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
        <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}"="tabeData" style="width: 100%" v-loading="loading">
          <el-table-column fixed label="序号" width="50" align="center" type="index">
            <template slot-scope="scope">{{(scope.$index + 1) + (listObj.page- 1) *listObj.limit}}</template>
          </el-table-column>
          <el-table-column prop="nickname" label="昵称" width="180" sortable>
            <template slot-scope="scope">
              <div style="display:flex;align-items:center;cursor:pointer" @click="show(scope.row)">
                <div class="qrurl">
                  <el-image v-if="scope.row.headimgurl" :src="scope.row.headimgurl" :fit="fit"></el-image>
                  <p v-else>用户头像未获取</p>
                </div>
                {{scope.row.nickname}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="微信标签" width="200" sortable>
            <template slot-scope="scope">
              <div
                class="remarks"
                v-for="(item,index) in showTag(scope.row.tagid_list)"
                :key="index"
              >
                <p class="remark">{{item}}</p>
              </div>
            </template>
          </el-table-column>
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
          <el-table-column prop="openid" label="OpenID" width="260" sortable></el-table-column>
          <el-table-column prop="subscribe_scene" label="来源" width="100" sortable></el-table-column>
          <el-table-column prop="fan_status" label="关注状态" width="120" sortable></el-table-column>
          <el-table-column prop="subscribe_time" label="最后关注时间" sortable>
            <template slot-scope="scope">{{scope.row.subscribe_time}}</template>
          </el-table-column>
          <el-table-column prop label="消息管理">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" @click="message(scope.row)"></el-button>
            </template>
          </el-table-column>
          <el-table-column prop label="电商信息">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-data-line" @click="getBusiness(scope.row)"></el-button>
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
        <el-dialog
          title="微信用户信息"
          :visible.sync="dialogVisible"
          width="50%"
          @close="handleClose()"
          center
        >
          <div>
            <div class="uHeader">
              <div class="uHeader_img">
                <img :src="personData.headimgurl" style="width:100%;height:100%;object-fit:cover" />
              </div>
              <div class="uHeader_txt">
                <div class="uname">
                  {{ personData.nickname }}
                  <i
                    class="el-icon-male uicon"
                    v-if="personData.sex == '男'"
                  ></i>
                  <i v-if="personData.sex == '女'" class="el-icon-female uicon"></i>
                </div>
                <div class="uinput">
                  <div v-if="personData.remark">
                    <span class="ubtn uedit" @click="editRemark()">
                      <i class="el-icon-edit"></i>
                    </span>
                    <p class="uremark" v-html="personData.remark" v-show="is_remark"></p>
                    <div class="ueditarea" v-show="!is_remark">
                      <el-input v-model="personData.remark" placeholder="请输入内容"></el-input>
                      <span class="ubtn usure" @click="editSure()">
                        <i class="el-icon-check"></i>
                      </span>
                      <span class="ubtn unosure" @click="editDelete()">
                        <i class="el-icon-close"></i>
                      </span>
                    </div>
                  </div>
                  <div v-else>
                    <span class="ubtn uedit" @click="editRemark()">
                      <i class="el-icon-edit"></i>
                    </span>
                    <p class="uremark" v-show="is_remark">Empty</p>
                    <div class="ueditarea" v-show="!is_remark">
                      <el-input v-model="personData.remark" placeholder="请输入内容"></el-input>
                      <span class="ubtn usure" @click="editSure()">
                        <i class="el-icon-check"></i>
                      </span>
                      <span class="ubtn unosure" @click="editDelete()">
                        <i class="el-icon-close"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="uStatus">
                  <p>{{ personData.fan_status }}</p>
                </div>
                <div class="uTime">
                  <p>最后关注时间：{{ personData.subscribe_time }}</p>
                </div>
              </div>
            </div>
            <div class="utabs">
              <el-tabs v-model="activeName" @tab-click="handleClick(personData)" type="border-card">
                <el-tab-pane label="微信信息" name="1">
                  <div class="info">
                    <p>OpenID: {{personData.openid}}</p>
                    <p>国家: {{personData.country}}</p>
                    <p>省份: {{personData.province}}</p>
                    <p>城市: {{personData.city}}</p>
                    <p>语言: {{personData.language}}</p>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="综合资料" name="2">
                  <el-form :model="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="标签" prop="region">
                      <el-select
                        v-model="tagid_list"
                        multiple
                        placeholder="请选择标签"
                        @change="handleTagList"
                        @remove-tag="deleteTagList"
                      >
                        <el-option
                          v-for="(item) in tagid_lists"
                          :key="item.value"
                          :label="item.label"
                          :value="item"
                        ></el-option>
                      </el-select>
                      <!-- <span style="color:#ccc;font-size:12px;">因微信限制，用户标签超过三个将不能同步微信用户标签</span> -->
                    </el-form-item>
                    <el-form-item label="真实姓名" prop="name">
                      <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="name">
                      <el-input v-model="ruleForm.mobile"></el-input>
                    </el-form-item>
                    <el-form-item label="其他固话" prop="name">
                      <el-input v-model="ruleForm.gu_hua"></el-input>
                    </el-form-item>
                    <el-form-item label="地区" prop="name">
                      <div class="uArea">
                        <el-input v-model="ruleForm.country"></el-input>
                      </div>
                      <div class="uArea">
                        <el-input v-model="ruleForm.province"></el-input>
                      </div>
                      <div class="uArea">
                        <el-input v-model="ruleForm.city"></el-input>
                      </div>
                      <div class="uArea">
                        <el-input v-model="ruleForm.district"></el-input>
                      </div>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="name">
                      <el-input v-model="ruleForm.xiang_xi_addr"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="name">
                      <el-input v-model="ruleForm.remark"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="个人状态" name="4">
                  <div class="info">
                    <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}"="dynamicsData" style="width: 100%" v-loading="loading1">
                      <el-table-column label="昵称" width="180">
                        <template slot-scope="scope">
                          <div style="display:flex;align-items:center;cursor:pointer">
                            <div class="qrurl">
                              <img
                                class="getheadimg"
                                v-show="scope.row.is_sys == '1'"
                                :fit="fit"
                                :src="avatar"
                              />
                              <!-- <el-image
                                v-show="scope.row.is_sys == '1'"
                                src="../../src/assets/getheadimg.png"
                                :fit="fit"
                              ></el-image>-->
                              <div v-if="scope.row.fan">
                                <el-image
                                  v-show="scope.row.is_sys != '1'"
                                  :src="scope.row.fan.headimgurl"
                                  :fit="fit"
                                ></el-image>
                              </div>
                            </div>
                            <p v-show="scope.row.is_sys != '1'">{{scope.row.fan.nickname}}</p>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="str" label="关注状态" width="180"></el-table-column>
                      <el-table-column prop="updated_at" label="最后关注时间"></el-table-column>
                    </el-table>
                    <div class="pagination">
                      <el-pagination
                        background
                        @current-change="dynamicsCurrentChange"
                        layout="prev, pager, next"
                        :total="dynamicsObj_total"
                        :current-page="dynamicsObj.page"
                      ></el-pagination>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import BaseView from "../common/BaseView";
export default {
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
      tabeData: [],
      // 获取用户信息列表的参数
      listObj: {
        paginate: "10",
        name: "",
        fan_status: "",
        openid: "",
        start: "",
        end: "",
        appid: "",
        subscribe_scene: "",
        tag_list: "",
        page: 1,
        limit: 10,
        totals: 0,
        current_page1: 0
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
        { label: "请选择", value: "" },
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
      diy_tagid_list: [],
      limit: 100000,
      page: 1,
      avatar: "",
      loading1: false
    };
  },
  created() {
    // 这个方式是当用户点消息管理后 从消息管理回来依然显示当前这列数据
    if (this.current_page) {
      this.listObj.page = this.current_page;
    }
    // 这个方式是当用户点消息管理后 从消息管理回来依然显示当前这列数据
    if (localStorage.getItem("BusId")) {
      if (localStorage.getItem("BusId").split("?")[1]) {
        this.listObj.page = parseInt(
          localStorage.getItem("BusId").split("?")[1]
        );
        localStorage.removeItem("BusId");
      }
    }
    if (localStorage.getItem("uid")) {
      if (localStorage.getItem("uid").split("?")[1]) {
        this.listObj.page = parseInt(
          localStorage.getItem("uid").split("?")[1]
        );
        localStorage.removeItem("uid");
      }
    }

    if (localStorage.getItem("avatar")) {
      this.avatar = localStorage.getItem("avatar");
    }
    // 初始化数据
    this.listObj.appid = this.$store.getters.showQuery;
    this.dynamicsObj.appid = this.$store.getters.showQuery;
    // 调用user_list  接口获取数据
    // 获取标签信息
    this.getalldiytag();
    this.biao_qian_lists();
  },
  methods: {
    // 获取用户电商信息
    getBusiness(item) {
      localStorage.setItem(
        "BusId",
        window.btoa(item.id) + "?" + this.listObj.page
      );
      this.$router.push({
        name: "business",
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
    // 用户信息面板的三个选项  点击时触发这个函数  从来获取对应tab页面的数据
    handleClick(value) {
      if (parseInt(this.activeName) == 2) {
        // 详细信息
        this.ruleForm.id = value._id;
      }
      if (parseInt(this.activeName) == 4) {
        // 获取个人状态
        this.loading1 = true;
        this.dynamicsObj.f_id = value._id;
        this.$axios
          .post(this.GLOBAL.BASE_URL + "user_dynamics_list", this.dynamicsObj)
          .then(res => {
            this.loading1 = false;
            if (res.data.code == 0) {
              if (res.data.data.data) {
                this.dynamicsData = res.data.data.data.data;
              }
              this.dynamicsObj_total = res.data.data.data.total;
            } else {
              this.$message.error(res.data.message);
            }
          });
      }
    },
    // 个人状态页面的翻页
    dynamicsCurrentChange(value) {
      this.loading1 = true;
      this.dynamicsObj.page = value;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "user_dynamics_list", this.dynamicsObj)
        .then(res => {
          this.loading1 = false;
          if (res.data.code == 0) {
            this.dynamicsData = res.data.data.data.data;
            this.dynamicsObj_total = res.data.data.data.total;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 进入消息管理页面，，向父组件传递listenChild事件，父组件接收到以后做后续操作
    message(value) {
      this.$emit("listenChild", false, value, this.listObj.page);
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
    // 个人信息页面的综合资料保存按钮
    submitForm() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "user_update", this.ruleForm)
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("操作成功");
            this.dialogVisible = false;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 关闭微信用户信息对话框的回调函数，，用来清除数据或者回复初始值之类的
    handleClose() {
      this.is_remark = true;
      this.activeName = "1";
      this.resetRuleForm();
      this.getData();
    },
    // 调用user_remark接口  更改用户的备注名
    editSure() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "user_remark", {
          appid: this.personData.appid,
          remark: this.personData.remark,
          openid: this.personData.openid
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("操作成功");
            this.getData();
          } else {
            this.$message.error(res.data.message);
          }
        });
      this.is_remark = true;
    },
    // 关闭用户输入备注名，无接口
    editDelete() {
      this.is_remark = true;
    },
    // 开启用户输入备注名，无接口
    editRemark() {
      this.is_remark = false;
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
              this.biao_qian_lists();
            } else {
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    },

    // 获取微信标签
    biao_qian_lists() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "biao_qian_list", {
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tagList = this.changeTagsList(res.data.data);
            this.tagid_lists = this.changeTagsList(res.data.data);
            this.tagListOnly = this.changeTagsList(res.data.data);
          } else {
            this.$message.error(res.data.message);
          }
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
    // 提取对象中的key  value  并将其拼接到url上  这个是为了导出需要的url
    encodeUrl(obj) {
      let url = "";
      (function(obj) {
        let kvArr = Object.entries(obj);
        kvArr.forEach(v => {
          if (Object.prototype.toString.call(v[1]) == "[object Object]") {
            arguments.callee(v[1]);
          } else {
            url += v.join("=") + "&";
          }
        });
      })(obj);
      return url.substring(0, url.length - 1);
    },
    // 导出功能
    iexport() {
      // window.location.href =
      //   this.GLOBAL.BASE_URL + "user_exit?" + this.encodeUrl(this.listObj);
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
      this.listObj.subscribe_scene = "";
      this.listObj.fan_status = "";
      this.listObj.page = 1;
      this.listObj.paginate = "10";
      this.listObj.tag_list = "";
      this.listObj.diy_tagid_list = "";
      this.getData();
    },
    // 搜索
    search() {
      this.listObj.page = 1;
      this.getData();
    },
    // 翻页
    handleCurrentChange(value) {
      this.listObj.page = value;
      this.getData();
    },
    // 选择条数
    handleSizeChange(val) {
      this.listObj.page = this.listObj.current_page1;
      this.listObj.limit = val;
      this.getData();
    },
    // 获取列表信息
    getData() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "user_list", this.listObj)
        .then(res => {
          if (res.data.code == 0) {
            this.tabeData = res.data.data.data;
            this.listObj.totals = res.data.data.total;
            this.listObj.current_page1 = res.data.data.current_page;
            this.loading = false;
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
            this.getData();
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
  padding: 4px;;
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
  width: 50px;
  height: 50px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}
.qrurl .getheadimg {
  width: 60px;
  height: 50px;
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
/* ---------------------------------- */
.qrurl {
  width: 50px;
  height: 50px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}
.line {
  width: 100%;
  height: 10px;
}
.select {
  min-width: 150px;
  display: inline-block;
  margin-right: 10px;
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
.tagstable {
  width: 100%;
  height: 100%;
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  /* margin-left: 20px; */
}
</style>
