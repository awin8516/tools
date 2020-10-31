<template>
  <div class="table">
    <div class="crumbs">
      <h2>发送记录列表</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="searchWords" placeholder="请输入搜索的模板名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="搜索" placement="top">
              <el-button type="primary" @click="handleSearch(searchWords)">搜索</el-button>
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
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column fixed label="序号" width="50" align="center" type="index">
          <template slot-scope="scope">{{(scope.$index + 1) + (page- 1) *limit}}</template>
        </el-table-column>
        <el-table-column prop="smssign_name" label="签名" width="100" sortable></el-table-column>
        <el-table-column prop="smstemplate_name" label="模板名称" sortable></el-table-column>
        <el-table-column prop="filter_content" label="目标用户" sortable width="200">
          <template slot-scope="scope">
            <p class="remark" v-if="scope.row.send_type === 0">未知</p>
            <p class="remark" v-if="scope.row.send_type === 1">{{scope.row.filter_content}}</p>
            <div
              v-if="scope.row.send_type === 2"
              class="remark"
              v-for="(item,index) in showTag(scope.row)"
              :key="index"
            >
              <p class="remark">{{item}}</p>
            </div>
            <p class="remark" v-if="scope.row.send_type === 3">全部</p>
            <p class="remark" v-if="scope.row.send_type === 4">{{scope.row.filter_content}}</p>
            <!-- <span v-html="showTag(scope.row.tagid)"></span> -->
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" sortable>
          <template slot-scope="scope">
            <!-- 短信模板：发送状态，0：待发送，1发送中，2发送成功，3发送失败4.表示已经推送了5.表示紧急停止了 -->
            <p v-if="scope.row.status == 0">待发送</p>
            <p v-if="scope.row.status == 1">发送中</p>
            <p v-if="scope.row.status == 2">发送成功</p>
            <p v-if="scope.row.status == 3">发送失败</p>
            <p v-if="scope.row.status == 4">发送中</p>
            <p v-if="scope.row.status == 5">紧急停止</p>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="任务创建时间" sortable></el-table-column>
        <el-table-column prop="send_time" label="发送时间" sortable></el-table-column>
        <el-table-column prop="collect_total" label="总人数" sortable></el-table-column>
        <el-table-column prop="success_total" label="成功人数" sortable></el-table-column>
        <el-table-column prop label="紧急停止" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="紧急停止" placement="top">
              <el-button
                type="danger"
                :disabled="scope.row.status === 5"
                @click="endHandle(scope.row)"
              >停止</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column p label="流水记录" sortable width="180">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看流水记录" placement="top">
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
export default {
  data() {
    return {
      tableData: [],
      page: 1,
      totals: 0,
      limit: 10,
      currentPage: 1,
      loading: false,
      diy_tagList: "",
      searchWords: ""
    };
  },
  created() {
    if (localStorage.getItem("pages")) {
      this.page =
        JSON.parse(localStorage.getItem("pages")).smsRecord || this.page;
      this.currentPage =
        JSON.parse(localStorage.getItem("pages")).smsRecord || this.page;
    }
    this.getalldiytag();
  },
  methods: {
    // 重置
    reset() {
      this.searchWords = "";
      this.handleSearch();
    },
    // 紧急停止
    endHandle(item) {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "smsstop", {
          appid: this.$store.getters.showQuery,
          id: item.id
        })
        .then(res => {
          if (res.data.code == 0) {
            this.smslist();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 导出
    iExport() {
      var str = `${this.GLOBAL.BASE_URL}smstaskexport?appid=${this.$store.getters.showQuery}&name=${this.searchWords}`;
      window.location.href = str;
    },
    showFail(item) {
      return item.collect_total - item.success_total;
    },
    // 匹配标签
    showTag(value) {
      let result = [];
      let item = value.filter_content;
      if (value.send_type === 1) {
        result = item;
      } else if (value.send_type === 2) {
        // 标签
        item = item.split(",");
        for (var j = 0; j < item.length; j++) {
          for (var i = 0; i < this.diy_tagList.length; i++) {
            if (item[j] == this.diy_tagList[i].value) {
              result.push(this.diy_tagList[i].label);
            }
          }
        }
        if (!result.length) {
          result = ["标签已经删除"];
        }
      } else if (value.send_type === 3) {
        result = item;
      }

      return result;
    },
    // 显示
    handleEdit(item) {
      localStorage.setItem("tid", window.btoa(item.id));
      this.$router.push({
        path: "/SmsRecordWater"
      });
    },
    // 搜索
    handleSearch(val) {
      this.smslist(val);
    },
    // 选择条数
    handleSizeChange(val) {
      this.page = this.currentPage;
      this.limit = val;
      this.smslist();
    },
    // 新建
    addSms() {
      this.$router.push({
        name: "SmsAddSign"
      });
    },
    // fanye
    handleCurrentChange(val) {
      this.page = val;
      this.smslist();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.smsRecord = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    smslist(name = this.searchWords) {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "smstask", {
          appid: this.$store.getters.showQuery,
          page: this.page,
          limit: this.limit,
          name: name
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
            this.totals = res.data.data.total;
            this.currentPage = res.data.data.current_page;
            if (this.page > res.data.data.last_page) {
              this.page = res.data.data.last_page;
              this.smslist();
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
          page: 1,
          limit: 10000
        })
        .then(res => {
          if (res.data.code == 0) {
            this.diy_tagList = this.changeDiyTagsList(res.data.data.data);
            this.smslist();
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
  display: inline-block;
  line-height: 1;
  padding: 4px;
  white-space: nowrap;
  padding: 4px;
}
.remarks {
  display: inline-block;
  margin-right: 5px;
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

