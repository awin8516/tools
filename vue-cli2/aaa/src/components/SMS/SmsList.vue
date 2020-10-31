<template>
  <div class="table">
    <div class="crumbs">
      <h2>短信签名列表</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :inline="true">
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="新建短信签名" placement="top">
              <el-button type="primary" icon="el-icon-plus" @click="addSms()">新建</el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>

        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="searchWords" placeholder="请输入搜索的短信签名名称"></el-input>
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
                icon="el-icon-s-tools"
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
        style="width: 100%"
        v-loading="loading"
        @sort-change="sortChange"
        :header-cell-style="{background:'#f9f9f9'}"
      >
        <el-table-column label="序号" width="80" sortable prop="index">
          <template slot-scope="scppe">{{(scppe.$index + 1) + (page- 1) *limit}}</template>
        </el-table-column>
        <!-- <el-table-column prop="id" label="签名ID" width="100" sortable></el-table-column> -->
        <el-table-column prop="sign_name" label="签名" width="200" sortable></el-table-column>
        <el-table-column prop="remark" label="申请说明" sortable width="200"></el-table-column>
        <el-table-column prop="verify_status" label="申请状态" sortable width="100">
          <template slot-scope="scope">
            <p v-if="scope.row.verify_status == 0">审核中</p>
            <p v-if="scope.row.verify_status == 1">通过</p>
            <p v-if="scope.row.verify_status == 2">失败</p>
          </template>
        </el-table-column>
        <el-table-column prop="verify_reason" label="状态说明" sortable width="200"></el-table-column>
        <el-table-column prop="created_at" label="创建时间" sortable></el-table-column>

        <el-table-column label="删除">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete-solid" @click="handleDelete(scope.row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="重新提交审核">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="resubmit(scope.row)"
              :disabled="scope.row.verify_status != 2"
            ></el-button>
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

    <v-danger
      ref="danger"
      @dangerSure="dangerSure"
      :danger_type="danger_type"
      :danger_ontent="danger_ontent"
    ></v-danger>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import vDanger from "../dialogs/danger.vue";
export default {
  components: {
    vDanger
  },
  data() {
    return {
      tableData: [],
      page: 1,
      totals: 0,
      limit: 10,
      currentPage: 1,
      loading: false,
      danger_type: "签名",
      danger_ontent: "删除签名，此操作会删除签名",
      item: {},
      searchWords: ""
    };
  },
  created() {
    if (localStorage.getItem("pages")) {
      this.page =
        JSON.parse(localStorage.getItem("pages")).smsList || this.page;
      this.currentPage =
        JSON.parse(localStorage.getItem("pages")).smsList || this.page;
    }
    this.smslist();
  },
  methods: {
    // 重置
    reset() {
      this.searchWords = "";
      this.handleSearch();
    },
    resubmit(item) {
      localStorage.setItem("smsobj", JSON.stringify(item));
      this.$router.push({
        path: "/SmsAddSign"
      });
    },
    sortChange(column, prop, order) {
    },
    // sahnchu1
    handleDelete(item) {
      this.item = item;
      this.$refs.danger.showDanger();
    },
    // 删除
    dangerSure() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "smssigndel", {
          appid: this.$store.getters.showQuery,
          id: this.item.id,
          sign_name: this.item.sign_name
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("删除成功");
            this.smslist();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 搜索
    handleSearch(name) {
      this.smslist(name);
    },
    // 选择条数
    handleSizeChange(val) {
      this.page = this.currentPage;
      this.limit = val;
      this.smslist();
    },
    // 新建
    addSms() {
      localStorage.removeItem("smsobj");
      this.$router.push({
        path: "/SmsAddSign"
      });
    },
    // fanye
    handleCurrentChange(val) {
      this.page = val;
      this.smslist();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.smsList = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    smslist(name = this.searchWords) {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "smssign", {
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
    }
  }
};
</script>

<style scoped>
.inputArea {
  display: inline-block;
  width: 200px;
  margin-right: 10px;
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

