<template>
  <div class="table">
    <div class="crumbs">
      <h2>发送任务流水记录</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <div class="inputArea" style="display:inline-block;width:200px;margin-right:10px;">
          <el-input v-model="name" placeholder="请输入搜索的签名名称"></el-input>
        </div>

        <div style="margin-right:10px;margin-left:0px;display:inline-block;">
          <el-tooltip class="item" effect="dark" content="搜索" placement="top">
            <el-button type="primary" @click="search(name)">搜索</el-button>
          </el-tooltip>
        </div>
        <el-tooltip class="item" effect="dark" content="返回发送记录" placement="top">
          <el-button type="success" @click="back()" icon="el-icon-back">返回发送记录</el-button>
        </el-tooltip>
      <div style="margin-left:10px;">
        <el-tooltip class="item" effect="dark" content="重置搜索条件" placement="top">
          <el-button
            type="primary"
            icon="el-icon-s-tools"
            class="handle-del mr10"
            @click="reset()"
          >重置</el-button>
        </el-tooltip>
      </div>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 200]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
          :current-page.sync='currentPage'
        ></el-pagination>
      </div>
      <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}" style="width: 100%" v-loading="loading">
        <el-table-column fixed label="序号" width="50" align="center" type="index">
          <template slot-scope="scope">{{(scope.$index + 1) + (page- 1) *limit}}</template>
        </el-table-column>
        <!-- <el-table-column prop="smstask_id" label="任务ID" width="180" sortable></el-table-column> -->
        <el-table-column prop="cell_no" label="发送手机号" width="180" sortable></el-table-column>
        <el-table-column prop="smssign_name" label="签名" sortable></el-table-column>
        <el-table-column prop="smstempate_name" label="短信模板" sortable></el-table-column>
        <el-table-column prop="sms_content" label="短信内容" sortable></el-table-column>
        <el-table-column prop="status" label="状态" sortable>
          <template slot-scope="scope">
            <!-- 0：待发送，1发送中，2发送成功，3发送失败4.表示已经推送了 -->
            <p v-if="scope.row.status == 0">等待接收</p>
            <p v-if="scope.row.status == -1">失败</p>
            <p v-if="scope.row.status == 1">成功</p>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="发送时间" sortable></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 200]"
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
      page: 1,
      totals: 0,
      limit: 10,
      currentPage: 1,
      loading: false,
      name: ""
    };
  },
  created() {
    if (localStorage.getItem("pages")) {
      this.page = JSON.parse(localStorage.getItem("pages")).smsRecordWater  || this.page;
      this.currentPage = JSON.parse(localStorage.getItem("pages")).smsRecordWater  || this.page;
    }
    this.smslist();
  },
  methods: {
    reset(){
      this.name='';
      this.smslist(name);
    },
    // 新建
    back() {
      localStorage.removeItem("tid");
      this.$router.push({
        name: "SmsRecord"
      });
    },
    // 搜索
    search(name) {
      this.smslist(name);
    },
    // 选择条数
    handleSizeChange(val) {
      this.page = this.currentPage;
      this.limit = val;
      this.smslist();
    },
    // fanye
    handleCurrentChange(val) {
      this.page = val;
      this.smslist();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.smsRecordWater = val;
      localStorage.setItem("pages",JSON.stringify(pages));

    },
    smslist(name = this.name) {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "smstasklog", {
          appid: this.$store.getters.showQuery,
          sms_task_id: window.atob(localStorage.getItem("tid")),
          page: this.page,
          limit: this.limit,
          name: this.name
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

