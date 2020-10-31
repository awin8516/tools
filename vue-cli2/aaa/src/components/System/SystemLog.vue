<template>
  <div class="table">
    <div class="crumbs">
      <h2>系统操作日志</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="selectObj.behavior_class" placeholder="请输入操作的类别"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="timepicker"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              type="datetimerange"
              :picker-options="pickerOptions"
              @change="getpickerTimes(timepicker)"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="搜索" placement="top">
              <el-button type="primary" @click="handleSelect(selectObj)">搜索</el-button>
            </el-tooltip>
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
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column fixed label="序号" width="50" align="center" type="index">
          <template slot-scope="scope">{{(scope.$index + 1) + (page- 1) *limit}}</template>
        </el-table-column>
        <el-table-column prop label="账号" sortable>
          <template slot-scope="scope">
            <p v-if="scope.row.admin">{{scope.row.admin.name}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="class" label="类别" sortable></el-table-column>
        <el-table-column prop="behavior" label="动作" sortable></el-table-column>
        <el-table-column prop="ip" label="IP" sortable></el-table-column>
        <el-table-column prop="created_at" label="更新时间" sortable></el-table-column>
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
      loading: false,
      tableData: [],
      totals: 0,
      page: 1,
      currentPage: 1,
      limit: 10,
      selectObj: {
        behavior_appid: "",
        behavior_class: "",
        start_time: "",
        end_time: "",
        ip: ""
      },
      pickerOptions: {},
      timepicker: ""
    };
  },
  created() {
    if (localStorage.getItem("pages")) {
      this.page =
        JSON.parse(localStorage.getItem("pages")).systemLog || this.page;
      this.currentPage =
        JSON.parse(localStorage.getItem("pages")).systemLog || this.page;
    }
    this.getLogData();
  },
  methods: {
    // cz
    reset() {
      this.selectObj.behavior_class = "";
      this.timepicker = "";
      this.selectObj.start_time = "";
      this.selectObj.end_time = "";
      this.handleSelect();
    },
    getpickerTimes(val) {
      if (val) {
        this.selectObj.start_time = parseInt(val[0].getTime() / 1000);
        this.selectObj.end_time = parseInt(val[1].getTime() / 1000);
        this.getLogData(this.selectObj);
      } else {
        this.selectObj.start_time = "";
        this.selectObj.end_time = "";
        this.getLogData(this.selectObj);
      }
    },
    // 搜索
    handleSelect(selectObj) {
      this.getLogData(selectObj);
    },
    // 翻页
    handleCurrentChange(val) {
      this.page = val;
      this.getLogData();;
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.systemLog = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    // 选择条数
    handleSizeChange(val) {
      this.page = this.currentPage;
      this.limit = val;
      this.getLogData();
    },
    // 获取信息
    getLogData(selectObj = this.selectObj) {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "behaviorlist", {
          appid: this.$store.getters.showQuery,
          page: this.page,
          limit: this.limit,
          behavior_appid: selectObj.behavior_appid,
          behavior_class: selectObj.behavior_class,
          start_time: selectObj.start_time,
          end_time: selectObj.end_time,
          ip: selectObj.ip
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
            this.totals = res.data.data.total;
            this.currentPage = res.data.data.current_page;
            if (this.page > res.data.data.last_page) {
              this.page = res.data.data.last_page;
              this.getLogData();
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

