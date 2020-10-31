<template>
  <div class="table">
    <div class="crumbs">
      <h2>积分列表</h2>
    </div>
    <div class="container">
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totals"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
      <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}"="jfData" style="width: 100%">
        <el-table-column fixed label="序号" width="50" align="center" type="index"></el-table-column>
        <el-table-column prop="" label="用户名" width="180">
          <template slot-scope="scope">
            {{scope.row.user.name}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="积分名称"></el-table-column>
        <el-table-column prop="created_at" label="创建时间"></el-table-column>
        <el-table-column prop="point" label="使用情况"></el-table-column>
        <el-table-column prop="point_time" label="积分名称"></el-table-column>
        <el-table-column prop="remark" label="积分备注"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totals"
          @current-change="handleCurrentChange"
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
      jfData: [],
      jfObj: {
        appid: "",
        u_id: "",
        paginate: 10,
        created_at: ""
      },
      totals: 0
    };
  },
  created() {
    this.jfObj.appid = this.$store.getters.showQuery;
    this.getData();
  },
  methods: {
    // 翻页
    handleCurrentChange() {},
    // 获取用户积分列表
    getData() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "shop/pointhistories_list", this.jfObj)
        .then(res => {
          if (res.data.code == 0) {
            this.jfData = res.data.data.data;
            this.totals = res.data.data.total;
          } else {
            this.$meaage.error(res.data.message);
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

