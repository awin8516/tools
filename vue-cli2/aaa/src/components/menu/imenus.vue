<template>
  <div class="table">
    <div class="crumbs">
      <h2>个性化菜单</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-tooltip class="item" effect="dark" content="添加个性化菜单" placement="top">
          <el-button
            type="primary"
            icon="el-icon-plus"
            class="handle-del mr10"
            @click="addOauth()"
          >添加</el-button>
        </el-tooltip>
        <div class="q-input">
          <el-input v-model="select_words" placeholder="请输入搜索的菜单名称"></el-input>
        </div>
        <div style="margin-right:10px;display:inline-block;">
          <el-tooltip class="item" effect="dark" content="搜索" placement="top">
            <el-button type="primary" @click="handleSearch(select_words)">搜索</el-button>
          </el-tooltip>
        </div>
        <el-tooltip class="item" effect="dark" content="重置搜索条件" placement="top">
          <el-button
            type="primary"
            icon="el-icon-refresh"
            class="handle-del mr10"
            @click="reset()"
          >重置</el-button>
        </el-tooltip>
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
      <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}" style="width: 100%">
        <el-table-column fixed label="序号" width="50" align="center" type="index">
          <template slot-scope="scope">{{(scope.$index + 1) + (page- 1) *limit}}</template>
        </el-table-column>
        <el-table-column prop="date" label="菜单名称" width="180"></el-table-column>
        <el-table-column prop="name" label="备注" width="180"></el-table-column>
        <el-table-column prop="address" label="标签"></el-table-column>
        <el-table-column prop label="操作" width="180">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改个性化菜单" placement="top">
              <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除个性化菜单" placement="top">
              <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
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
      currentPage:0,
      totals:0,
      select_words: "",
      page: 1,
      limit: 10,
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    }
  },
  created(){
    if (localStorage.getItem("pages")) {
      this.page = JSON.parse(localStorage.getItem("pages")).imenus  || this.page;
      this.currentPage =  JSON.parse(localStorage.getItem("pages")).imenus  || this.page;
    }

    this.getData();
  },
  methods:{
    handleEdit(item){
      localStorage.setItem('mid',JSON.stringify(item))
      this.$router.push({
        path:'/imenugroup'
      })
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.imenus = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    // 选择条数
    handleSizeChange(val) {
      this.page = this.currentPage;
      this.limit = val;
      this.getData();
    },
    getData(selectObj = this.selectObj) {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "weboath", {
          appid: this.$store.getters.showQuery,
          page: this.page,
          limit: this.limit,
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
    },
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

