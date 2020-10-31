<template>
  <div class="table">
    <div class="crumbs">
      <h2>模板消息发送记录</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="searchObj.template_id" placeholder="请输入搜索模板ID"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchObj.title" placeholder="请输入搜索标题"></el-input>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="搜索" placement="top">
              <el-button type="primary" @click="search()">搜索</el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="重置搜索条件" placement="top">
              <el-button
                type="primary"
                icon="el-icon-refresh"
                @click="reset()"
              >重置</el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="导出搜索结果" placement="top">
              <el-button
                type="primary"
                icon="el-icon-upload"
                @click="exportData()"
              >导出</el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 200]"
          :page-size="searchObj.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="searchObj.totals"
          :current-page.sync="searchObj.currentPage"
        ></el-pagination>
      </div>
      <el-table
        :data="tableData"
        :header-cell-style="{background:'#f9f9f9'}"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column fixed label="序号" width="50" align="center" type="index">
          <template slot-scope="scope">{{(scope.$index + 1) + (searchObj.page- 1) *searchObj.limit}}</template>
        </el-table-column>
        <el-table-column prop="template_id" label="模板ID" width="200" sortable></el-table-column>
        <el-table-column prop="title" label="标题" width="120" sortable></el-table-column>
        <el-table-column prop="filter_content" label="目标用户" width="250" sortable>
          <template slot-scope="scope">
            <p class="remark" v-if="scope.row.send_type == 1">{{scope.row.filter_content}}</p>
            <div
              class="remarks"
              v-for="(item,index) in showTag(scope.row)"
              :key="index"
              v-else-if="scope.row.send_type == 2"
            >
              <p class="remark">{{item}}</p>
            </div>
            <p class="remark" v-else-if="scope.row.send_type == 0">全部</p>
            <p class="remark" v-else>{{scope.row.filter_content}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="qian_content" label="内容" width="200" sortable>
          <template slot-scope="scope">
            <p v-if="scope.row.send_type != 3">{{scope.row.qian_content}}</p>
            <el-tooltip class="item" effect="dark" content="鼠标点击下载文件" placement="top" v-else>
              <p @click="downCSV(scope.row.filter_content)">{{showUpload(scope.row.filter_content)}}</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" sortable>
          <template slot-scope="scope">
            <p v-if="scope.row.status == '0'">待发送</p>
            <p v-if="scope.row.status == '1'">发送中</p>
            <p v-if="scope.row.status == '2'">发送成功</p>
            <p v-if="scope.row.status == '3'">发送失败</p>
            <p v-if="scope.row.status == '5'">未发送</p>
            <p v-if="scope.row.status == '6'">紧急停止</p>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" sortable></el-table-column>
        <el-table-column prop="send_time" label="发送时间" sortable>
          <template slot-scope="scope">
            <p>{{scope.row.send_time | formatTime}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="success_num" label="总人数" sortable>
          <template slot-scope="scope">
            <p>{{(allNum(scope.row))}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="success_num" label="成功人数" sortable></el-table-column>
        <el-table-column prop label="紧急停止" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="紧急停止" placement="top">
              <el-button
                type="danger"
                :disabled="scope.row.status === 6"
                @click="endHandle(scope.row)"
              >停止</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width="180">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="流水记录" placement="top">
              <el-button type="success" @click="handleEdit(scope.row)">流水记录</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 200]"
          :page-size="searchObj.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="searchObj.totals"
          :current-page.sync="searchObj.currentPage"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import vDanger from "../dialogs/danger.vue";
export default {
  components: {
    vDanger
  },
  data() {
    return {
      tableData: [],
      page: 1,
      diy_tagList: "",
      searchObj: {
        appid: this.$store.getters.showQuery,
        title: "",
        template_id: "",
        page: 1,
        limit: 10,
        currentPage: 1,
        totals: 0
      },
      loading: false
    };
  },
  filters: {
    formatTime: function(time) {
      // 不足10  补0
      function addZero(num) {
        if (num < 10) {
          num = "0" + num;
        }
        return num;
      }
      let date = new Date(time * 1000);
      return (
        date.getFullYear() +
        "-" +
        addZero(date.getMonth() + 1) +
        "-" +
        addZero(date.getDate()) +
        " " +
        addZero(date.getHours()) +
        ":" +
        addZero(date.getMinutes()) +
        ":" +
        addZero(date.getSeconds())
      );
    }
  },
  created() {
    if (localStorage.getItem("pages")) {
      this.searchObj.page =
        JSON.parse(localStorage.getItem("pages")).tempRecord ||
        this.searchObj.page;
      this.searchObj.currentPage =
        JSON.parse(localStorage.getItem("pages")).tempRecord ||
        this.searchObj.page;
    }

    this.getalldiytag();
  },
  methods: {
    allNum(item) {
      return parseInt(item.success_num) + parseInt(item.faile_num);
    },
    // 紧急停止
    endHandle(item) {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "templatestop", {
          appid: this.$store.getters.showQuery,
          id: item.id
        })
        .then(res => {
          if (res.data.code == 0) {
            this.getList();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 下载
    downCSV(url) {
      window.location.href = this.GLOBAL.TEMPFILE + url;
    },
    // 下载
    showUpload(url) {
      return this.GLOBAL.TEMPFILE + url;
    },
    // daochu1
    exportData() {
      // console.log(
      //   this.GLOBAL.BASE_URL +
      //     "template_recorder_down=" +
      //     this.$store.getters.showQuery
      // );
      window.location.href =
        this.GLOBAL.BASE_URL +
        "template_recorder_down?appid=" +
        this.$store.getters.showQuery;
    },
    // 匹配标签
    showTag(value) {
      let result = [];
      let item = value.filter_content;
      if (value.send_type == 1) {
        result = item;
      } else if (value.send_type == 2) {
        // 标签
        item = item.split(",");
        for (var j = 0; j < item.length; j++) {
          for (var i = 0; i < this.diy_tagList.length; i++) {
            if (item[j] == this.diy_tagList[i].value) {
              result.push(this.diy_tagList[i].label);
            }
          }
        }
      } else if (value.send_type == 3) {
        result = item;
      }

      return result;
    },
    // 打开发送柳树激励
    handleEdit(value) {
      localStorage.setItem("obj", JSON.stringify(value));
      localStorage.setItem("tid", window.btoa(value.id));
      this.$router.push({
        path: "/TempRecordWater"
      });
    },
    // 重置
    reset() {
      this.searchObj.page = 1;
      this.searchObj.template_id = "";
      this.searchObj.title = "";
      this.getList();
    },
    // sosuo
    search() {
      this.searchObj.page = 1;
      this.searchObj.template_id = this.searchObj.template_id.trim();
      this.searchObj.title = this.searchObj.title.trim();
      this.getList();
    },
    // 翻页
    handleCurrentChange(val) {
      this.searchObj.page = val;
      this.getList();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.tempRecord = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    handleSizeChange(val) {
      this.searchObj.page = this.searchObj.currentPage;
      this.searchObj.limit = val;
      this.getList();
    },
    getList() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "templaterecorder", this.searchObj)
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
            this.searchObj.totals = res.data.data.total;
            this.searchObj.currentPage = res.data.data.current_page;
            if (this.searchObj.page > res.data.data.last_page) {
              this.searchObj.page = res.data.data.last_page;
              this.getList();
            }
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
    // 获取自定义标签
    getalldiytag() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "getalldiytag", {
          appid: this.$store.getters.showQuery,
          page: this.searchObj.page,
          limit: this.searchObj.limit
        })
        .then(res => {
          if (res.data.code == 0) {
            this.diy_tagList = this.changeDiyTagsList(res.data.data.data);
            this.getList();
          } else {
            this.$message.error(res.data.message);
          }
        });
    }
  }
};
</script>

<style lang='scss' scoped>
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
/* ------------------------------ */


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

