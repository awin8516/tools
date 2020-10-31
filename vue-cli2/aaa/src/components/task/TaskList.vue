<template>
  <div class="table">
    <div class="crumbs">
      <h2>群发任务列表</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :inline="true">
          <el-form-item>
            <el-select
              v-model="select_words"
              placeholder="请选择发送任务类型"
              @change="handleSearch(select_words)"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="重置搜索条件" placement="top">
              <el-button
                type="primary"
                icon="el-icon-refresh"
                class="handle-del mr10"
                @click="reset()"
              >重置</el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 200]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
          :current-page.sync="currentPage"
        ></el-pagination>
      </div>
      <el-table
        :data="tableData"
        :header-cell-style="{background:'#f9f9f9'}"
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column fixed label="序号" width="50" align="center" type="index">
          <template slot-scope="scope">{{(scope.$index + 1) + (page- 1) *limit}}</template>
        </el-table-column>
        <el-table-column prop="type" label="发送类型" width="100" sortable>
          <template slot-scope="scope">{{handleDivision(scope.row.type)}}</template>
        </el-table-column>
        <el-table-column prop="send_status" label="状态" width="100" sortable>
          <template slot-scope="scope">
            <p v-if="scope.row.send_status == '0'">待发送</p>
            <p v-if="scope.row.send_status == '1'">发送中</p>
            <p v-if="scope.row.send_status == '2'">已发送</p>
            <p v-if="scope.row.send_status == '3'">停止</p>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="创建时间" width="150" sortable>
          <template slot-scope="scope">{{(scope.row.created_at)}}</template>
        </el-table-column>
        <el-table-column prop="status" label="推送内容" width="300" sortable>
          <template slot-scope="scope">
           <div class v-if="scope.row.type == '1'">{{scope.row.value}}</div>
            <div class="imgCover" v-if="scope.row.type == '6'">
              <el-image :src="showImg(scope.row.url)" fit="contain"></el-image>
            </div>
            <div class v-if="scope.row.type == '3'">
              <v-voice v-if="scope.row.send_content" :replyContent="scope.row.send_content.url"></v-voice>
            </div>
            <div v-if="scope.row.type == '4'">
              <v-NewsList ref="NewsList" v-if="scope.row.send_content" :replyContent="scope.row.send_content.info"></v-NewsList>
            </div>
            <div class="" v-if="scope.row.type == '5'">
              <v-video v-if="scope.row.send_content" :replyContent="scope.row.send_content.url"></v-video>
            </div>
            <div v-if="scope.row.type == '7'">
              <v-wechatapp v-if='scope.row.send_content' :replyContent="scope.row.send_content"></v-wechatapp>
            </div>
            <div v-if="scope.row.type == '10'">
              <v-voucher v-if='scope.row.send_content' :replyContent="scope.row.send_content"></v-voucher>
            </div>
            <div v-if="scope.row.type == '11'">
              <v-voucher v-if='scope.row.send_content' :replyContent="scope.row.send_content"></v-voucher>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="标签" width="100" sortable>
          <template slot-scope="scope">
            <p class="remark" v-if="scope.row.tagname">{{(scope.row.tagname)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="need_custom_taglist" label="发送标签" width="180" sortable>
          <template slot-scope="scope">
            <p class="remark" v-if="scope.row.need_custom_taglist == 'all'">所有用户</p>
            <div
              v-else
              class="remarks"
              v-for="(item,index) in showTag(scope.row.need_custom_taglist)"
              :key="index"
            >
              <p class="remark">{{item}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="过滤标签" width="180" sortable>
          <template slot-scope="scope">
            <div
              class="remarks"
              v-for="(item,index) in showTag(scope.row.drop_custom_taglist)"
              :key="index"
            >
              <p class="remark">{{item}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop label="发送时间" width="120" sortable>
          <template slot-scope="scope">{{(scope.row.send_time)}}</template>
        </el-table-column>
        <el-table-column prop label="总人数" width="120" sortable>
          <template slot-scope="scope">{{(scope.row.prenum)}}</template>
        </el-table-column>
        <el-table-column prop label="成功人数" width="100" sortable>
          <template slot-scope="scope">{{(scope.row.success_num)}}</template>
        </el-table-column>
        <el-table-column prop label="紧急停止">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="紧急停止"
              placement="top"
              v-if="is_end(scope.row)"
            >
              <el-button
                type="danger"
                :disabled="scope.row.status === 3"
                @click="endHandle(scope.row)"
              >停止</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 200]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
          :current-page.sync="currentPage"
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
      loading: false,
      tableData: [],
      totals: 0,
      page: 1,
      currentPage: 1,
      limit: 10,
      diy_tagList: [],
      // 文字是1； 外联图文是2 ；3是语音4是图文素材；5是视频；6是图片，7小程序8地理位置9卡券
      options: [
        { value: "", label: "所有" },
        { value: 1, label: "文字" },
        { value: 2, label: "外联图文" },
        { value: 3, label: "语音" },
        { value: 4, label: "图文素材" },
        { value: 5, label: "视频" },
        { value: 6, label: "图片" },
        { value: 7, label: "小程序" },
        { value: 8, label: "地理位置" },
        { value: 9, label: "卡券" }
      ],
      select_words: null
    };
  },
  created() {
    if (localStorage.getItem("pages")) {
      this.page =
        JSON.parse(localStorage.getItem("pages")).taskList || this.page;
      this.currentPage =
        JSON.parse(localStorage.getItem("pages")).taskList || this.page;
    }
    this.newstask();
    this.getalldiytag();
  },
  methods: {
    is_end(item) {
      let is_show;
      let sendTime = new Date(item.send_time).getTime();
      let nowTime = Date.now();
      if (sendTime < nowTime) {
        is_show = false;
      } else {
        is_show = true;
      }
      return is_show;
    },
    // 重置
    reset() {
      this.select_words = null;
      this.handleSearch();
    },
    handleSearch(type) {
      this.newstask(type);
    },
    // 紧急停止
    endHandle(item) {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "senior_news_stop", {
          appid: this.$store.getters.showQuery,
          id: item.id
        })
        .then(res => {
          if (res.data.code == 0) {
            this.newstask();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    showTag(value) {
      if (value == "all") {
        return "";
      } else {
        let result = [];
        value = JSON.parse(value);
        if (value && value.length) {
          for (var j = 0; j < value.length; j++) {
            for (var i = 0; i < this.diy_tagList.length; i++) {
              if (value[j] == this.diy_tagList[i].value) {
                result.push(this.diy_tagList[i].label);
              }
            }
          }
          return result;
        } else {
          return;
        }
      }
    },
    getalldiytag() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "getalldiytag", {
          appid: this.$store.getters.showQuery,
          page: 1,
          limit: 10000
        })
        .then(res => {
          if (res.data.code == 0) {
            this.diy_tagList = this.changeDiyTagsList(res.data.data.data);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 将json数据中的id和name转化为value和label
    changeDiyTagsList(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/tag_id/g, "value"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/tag_name/g, "label"));
      return obj2;
    },
    // 翻页
    handleCurrentChange(val) {
      this.page = val;
      this.newstask();
      // this.$redrawVueMasonry('containerId')
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.taskList = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    handleSizeChange(val) {
      this.page = this.currentPage;
      this.limit = val;
      this.newstask();
    },
    newstask(type = this.select_words) {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "newstask", {
          appid: this.$store.getters.showQuery,
          page: this.page,
          limit: this.limit,
          type: type
        })
        .then(res => {
          if (res.data.code == 0) {
            this.loading = false;
            this.tableData = res.data.data.data;
            this.totals = res.data.data.total;
            this.currentPage = res.data.data.current_page;
            if (this.page > res.data.data.last_page) {
              this.page = res.data.data.last_page;
              this.newstask();
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    statusType(item) {
      if (parseInt(item.status) == 0) {
        return "发送";
      } else if (parseInt(item.status) == 1) {
        return "定时任务还没发送";
      } else if (parseInt(item.status) == 2) {
        return "发送失败";
      } else if (parseInt(item.status) == 3) {
        return item.error_message;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.imgCover {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
}
.imgCover > i {
  font-size: 30px;
}
.remark {
  text-align: center;
  background: #79c1fb;
  border-radius: 2px;
  margin: auto;
  color: #fff;
  box-sizing: border-box;
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
