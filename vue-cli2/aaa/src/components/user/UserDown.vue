<template>
  <div class="table">
    <div class="crumbs">
      <h2>用户下载任务</h2>
    </div>
    <div class="container">
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
      <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}" style="width: 100%" v-loading="loading">
        <el-table-column fixed label="序号" width="50" align="center" type="index"></el-table-column>
        <el-table-column prop="status" label="状态" >
          <template slot-scope="scope">
            <span v-html="showStatus(scope.row.status)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" ></el-table-column>
        <el-table-column prop="url" label="操作" >
          <template slot-scope="scope">
            <!-- <el-button type="primary" v-if="scope.row.status == '1'"  icon="el-icon-upload" @click="iexport(scope.row)">导出数据</el-button> -->
            <div class="zip" v-show="scope.row.status == 1" @click="down(scope.row)">
              <img src="../../assets/zip.png">
            </div>
            <div class="zips" v-show="scope.row.status == 0">
              <img src="../../assets/zips.png">
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      loading:false,
      tableData:[],
      total:0,
      page:1,
    }
  },
  created(){
    if (localStorage.getItem("pages")) {
      this.page = JSON.parse(localStorage.getItem("pages")).userDown  || this.page;
    }
    this.getData();
  },  
  methods:{
    down(item){
      window.location.href = item.url
    },
    showStatus(type){
      // 0表示等待下载 2表示正在下载 1表示下载完成
      if(type == 1){
        return "可下载"
      }else if(type == 0){
         return "待下载"
      }else if(type == 2){
         return "正在下载"
      }
    },
    handleCurrentChange(val){
      this.page = val;
      this.getData();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.userDown = val;
      localStorage.setItem("pages",JSON.stringify(pages));

    },
    getData(){
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "user_exit_list", {
          appid: this.$store.getters.showQuery,
          page: this.page
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
            this.total = res.data.data.total;
          } else {
            this.$message.error(res.data.message);
          }
        });
    }
  }
}
</script>

<style scoped>
.zip{
  width: 30px;height: 30px;cursor: pointer;
}
.zip img{width: 100%;height: 100%;}
.zips{
  width: 30px;height: 30px;
}
.zips img{width: 100%;height: 100%;}
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

