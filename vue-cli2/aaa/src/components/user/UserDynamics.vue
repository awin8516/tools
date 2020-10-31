<template>
  <div class="table">
    <div class="crumbs">
      <h2>用户动态</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item>
            <el-select v-model="select_type" placeholder="请选择消息类型" @change="handleChange()">
              <el-option v-for="item in items" :key="item.id" :label="item.select" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="select_words" placeholder="请输入OpenId" @keyup.enter.native="search"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="select_time"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              type="datetimerange"
              @change="getpickerTimes(select_time)"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="搜索" placement="top">
              <el-button
                type="primary"
                icon="el-icon-search"
                class="handle-del mr10"
                @click="search()"
              >搜索</el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
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
          :page-size="dynamicsObj.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="dynamicsObj.totals"
          :current-page.sync="dynamicsObj.currentPage1"
        ></el-pagination>
      </div>
      <el-table
        :data="tableData"
        :header-cell-style="{background:'#f9f9f9'}"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column fixed label="序号" width="50" align="center" type="index">
          <template
            slot-scope="scope"
          >{{(scope.$index + 1) + (dynamicsObj.page- 1) *dynamicsObj.limit}}</template>
        </el-table-column>
        <el-table-column prop label="用户" width="150" sortable>
          <template slot-scope="scope">
            <div style="display:flex;align-items:center;cursor:pointer" @click="show(scope.row)">
              <div class="qrurl" v-if="scope.row.is_sys == '1'">
                <img class="getheadimg" :fit="fit" :src="avatar" />
                <p>{{name}}</p>
              </div>
              <div class="qrurl" v-else>
                <div v-if="scope.row.fan" style="display:flex;align-items:center;">
                  <img v-show="scope.row.is_sys != '1'" :src="scope.row.fan.headimgurl" />
                  <p>{{scope.row.fan.nickname}}</p>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="openid" label="OpenID" width="250" sortable>
          <template slot-scope="scope">{{scope.row.openid}}</template>
        </el-table-column>
        <el-table-column prop="手机号码" label="手机号码" width="200" sortable>
          <template slot-scope="scope">
            <p v-if="scope.row.fan">{{scope.row.fan.phone}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="str" label="动态类型" width="200" sortable>
          <template slot-scope="scope">
            <span v-html="handleDivision(scope.row.message_type)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="str" label="动态" width="350" sortable>
          <template slot-scope="scope">
            <div class v-if="scope.row.message_type == 'event'">{{scope.row.message_content}}</div>
            <div class v-if="scope.row.message_type == 'authorize'">{{scope.row.message_content}}</div>
            <div
              class
              v-if="scope.row.message_type == '1' || scope.row.message_type == '8'"
            >{{scope.row.message_content}}</div>
            <div class="imgCover" v-if="scope.row.message_type == '6'">
              <img :src="showImg(scope.row.message_content)" />
            </div>
            <div v-if="scope.row.message_type == '2'">
              <v-LinkNews
                v-if="scope.row.message_content"
                :replyContent="strToJsons(scope.row.message_content)"
              ></v-LinkNews>
            </div>
            <div class v-if="scope.row.message_type == '3'">
              <v-voice :replyContent="getUrl('voice',scope.row.message_content)"></v-voice>
            </div>
            <div v-if="scope.row.message_type == '4'">
              <v-NewsList
                v-if="scope.row.message_content"
                :replyContent="strToJsons(scope.row.message_content)"
              ></v-NewsList>
            </div>
            <div class v-if="scope.row.message_type == '5'">
              <v-video :replyContent="getUrl('video',scope.row.message_content)"></v-video>
            </div>
            <div v-if="scope.row.message_type == '7'">
              <v-wechatapp
                v-if="scope.row.message_content"
                :replyContent="strToJsons(scope.row.message_content)"
              ></v-wechatapp>
            </div>
            <div v-if="scope.row.message_type == '10'">
              <v-voucher
                v-if="scope.row.message_content"
                :replyContent="strToJsons(scope.row.message_content)"
              ></v-voucher>
            </div>
            <div v-if="scope.row.message_type == '11'">
              <v-voucher
                v-if="scope.row.message_content"
                :replyContent="strToJsons(scope.row.message_content)"
              ></v-voucher>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="时间" width="260" sortable></el-table-column>
        <el-table-column prop="is" label>
          <template slot-scope="scope">
            <i
              :class="{ 'el-icon-star-on': scope.row.is == '1', 'el-icon-star-off': scope.row.is == '2' , 'big': true}"
              @click="setstar(scope.row)"
            ></i>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 200]"
          :page-size="dynamicsObj.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="dynamicsObj.totals"
          :current-page.sync="dynamicsObj.currentPage1"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import BaseView from "../common/BaseView";
import vLinkNews from "../../template/LinkNews";
import vNewsList from "../../template/NewsList";
import vVoucher from "../../template/voucher";
import vWechatapp from "../../template/wechatapp";
import vVoice from "../../template/voice";
import vVideo from "../../template/video";
export default {
  extends: BaseView,
  components: {
    vLinkNews,
    vNewsList,
    vVoucher,
    vWechatapp,
    vVoice,
    vVideo
  },
  data() {
    return {
      value: "",
      name: localStorage.getItem("name"),
      // 统一的url
      // 图片适配
      fit: "cover",
      // 用户类型
      items: [
        { id: "", select: "全部" },
        { id: "1", select: "关注类" },
        { id: "2", select: "消息类" },
        { id: "3", select: "菜单类" },
        { id: "4", select: "活动类" },
        { id: "5", select: "领取卡券" },
        { id: "6", select: "核销卡券" }
      ],
      // 数据列表
      tableData: [],
      // 总的数据条数
      total: 100,
      select_time: "",
      // 搜索的文字
      select_words: "",
      // 类型
      select_type: null,
      // 获取列表·的参数
      dynamicsObj: {
        openid: "",
        appid: "",
        paginate: "10",
        f_id: "",
        type: "",
        is: "",
        page: 1,
        limit: 10,
        currentPage1: 1,
        totals: 0
      },
      // 用来显示左侧蓝色背景
      isbackground: "",
      loading: false,
      name: "",
      avatar: ""
    };
  },
  beforeDestroy() {
    localStorage.removeItem("dataType");
  },
  created() {
    // 初始化数据
    this.dynamicsObj.appid = this.$store.getters.showQuery;
    this.getData();
    if (localStorage.getItem("name")) {
      this.name = localStorage.getItem("name");
    }
    if (localStorage.getItem("avatar")) {
      this.avatar = localStorage.getItem("avatar");
    }
    if (localStorage.getItem("dataType")) {
      // 从今日消息跳转过来的
      var timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
      var SevenDayAgo = timeStamp - 86400 * 1;
      this.select_time = [
        new Date(SevenDayAgo * 1000),
        new Date(timeStamp * 1000 - 1)
      ];
      this.getpickerTimes(this.select_time);
    }
  },
  methods: {
    getpickerTimes(val) {
      if (val) {
        this.dynamicsObj.start_time = parseInt(val[0].getTime() / 1000);
        this.dynamicsObj.end_time = parseInt(val[1].getTime() / 1000);
        this.getData();
      } else {
        this.dynamicsObj.start_time = "";
        this.dynamicsObj.end_time = "";
        this.getData();
      }
    },
    // 提取链接
    getUrl(type, item) {
      item = JSON.parse(item);
      if (type == "voice") {
        return item;
      }
      if (type == "video") {
        return item;
      }
    },
    strToJsons(str) {
      if (str) {
        str = JSON.parse(str);
        return str;
      } else {
        return "";
      }
    },
    // 选择类型
    handleChange() {
      if (!parseInt(this.select_type)) {
        this.dynamicsObj.type = "";
      } else if (parseInt(this.select_type) == 7) {
        this.dynamicsObj.type = "";
      } else {
        this.dynamicsObj.type = this.select_type;
      }
      this.isbackground = this.select_type;
      this.dynamicsObj.page = 1;
      this.getData();
    },
    // 跳转到用户详细页
    // 点击用户头像，调用user_get接口  获取用户的信息，，
    show(row, event) {
      if (parseInt(localStorage.getItem("status")) == 1) {
        window.open(this.GLOBAL.USEROPEN + window.btoa(row.fan._id), "_blank");
      } else if (parseInt(localStorage.getItem("status")) == 2) {
      }
    },

    // 重置查询参数
    reset() {
      this.select_type = null;
      this.select_words = "";
      this.dynamicsObj.paginate = "10";
      this.dynamicsObj.openid = "";
      this.dynamicsObj.f_id = "";
      this.dynamicsObj.type = "";
      this.dynamicsObj.page = 1;
      this.select_time = "";
      this.dynamicsObj.start_time = "";
      this.dynamicsObj.end_time = "";
      this.getData();
    },
    // 待开发，无接口
    search() {
      this.dynamicsObj.openid = this.select_words;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "user_dynamics_list", this.dynamicsObj)
        .then(res => {
          if (res.data.code == 0) {
            this.getData();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 设置星级标签
    setstar(value) {
      let is = 0;
      if (value.is == 1) {
        is = 2;
      } else if (value.is == 2) {
        is = 1;
      }
      this.$axios
        .post(this.GLOBAL.BASE_URL + "update_is", {
          appid: this.$store.getters.showQuery,
          id: value.id,
          is: is
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("修改成功");
            this.getData();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 翻页
    handleCurrentChange(val) {
      this.dynamicsObj.page = val;
      this.getData();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.userDynamicsList = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    handleSizeChange(val) {
      this.dynamicsObj.page = this.dynamicsObj.currentPage1;
      this.dynamicsObj.limit = val;
      this.getData();
    },
    getData() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "user_dynamics_list", this.dynamicsObj)
        .then(res => {
          if (res.data.code == 0) {
            this.tableData = res.data.data.data.data;
            this.dynamicsObj.totals = res.data.data.data.total;
            this.dynamicsObj.currentPage1 = res.data.data.data.current_page;
            this.loading = false;
          } else {
            this.$message.error(res.data.message);
          }
        });
    }
  }
};
</script>

<style scoped>
.imgCover {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
}
.imgCover > img {
  height: 60px;
}
.imgCover > i {
  font-size: 30px;
}
/* p---------------- */
.qrurl {
  width: auto;
  height: auto;
  display: inline-flex;
  align-items: center;
}
.qrurl img {
  margin-right: 10px;
}

.qrurl img {
  width: 30px;
}
.qrurl p {
  width: 80px;
}
.active {
  background: #337ab7;
}
.active a {
  color: #fff !important;
}
.big {
  font-size: 20px;
  cursor: pointer;
}
.select {
  display: inline-block;
  margin-right: 10px;
}
.toptag {
  background: #337ab7;
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
  font-size: 14px;
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
  margin-left: 20px;
}
</style>
