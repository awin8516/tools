<template>
  <div class="table">
    <div class="crumbs">
      <h2>子账号操作记录</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="success" @click="back()" icon="el-icon-back">返回子账号列表</el-button>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20,50,100,200]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
        ></el-pagination>
      </div>
      <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}" style="width: 100%" v-loading="loading">
        <el-table-column prop="b_id" label="ID" width="100"></el-table-column>
        <el-table-column prop="behavior" label="行为" width="180"></el-table-column>
        <el-table-column prop="class" label="类型"></el-table-column>
        <el-table-column prop="created_at" label="创建时间"></el-table-column>
        <el-table-column prop="ip" label="ip"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20,50,100,200]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
          :current-page.sync='currentPage'
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
      totals: 0,
      page: 1,
      limit: 10,
      currentPage: 1
    };
  },
  created() {
    this.childopertion();
    if (localStorage.getItem("pages")) {
      this.page = JSON.parse(localStorage.getItem("pages")).childopertion  || this.page;
      this.currentPage = JSON.parse(localStorage.getItem("pages")).childopertion  || this.page;
    }
  },
  methods: {
    // 返回用户信息列表页
    back() {
      localStorage.removeItem("cid");
      this.$router.push({
        name: "account"
      });
    },
    // 选择条数
    handleSizeChange(val) {
      this.page = this.currentPage;
      this.limit = val;
      this.childopertion();
    },
    // fanye
    handleCurrentChange(val) {
      this.page = val;
      this.childopertion();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.childopertion = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    childopertion() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "childopertion", {
          id: window.atob(localStorage.getItem("cid")),
          page: this.page,
          limit: this.limit
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
            this.totals = res.data.data.total;
            this.currentPage = res.data.data.current_page;
            if (this.page > res.data.data.last_page) {
              this.page = res.data.data.last_page;
              this.getData();
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
.inputarea {
  width: 200px;
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