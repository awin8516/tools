<template>
  <div class="table">
    <div class="crumbs">
      <h2>轮播图管理</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" @click="addBanner()">新增轮播图</el-button>
      </div>
      <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}"="bannerData" style="width: 100%">
        <el-table-column  label="图片" width="350">
          <template slot-scope="scope">
            <div class="lunbo">
              <img :src="scope.row.img.path">
            </div>
          </template>
        </el-table-column>
        <el-table-column  label="跳转地址-小程序" width="180">
          <template slot-scope="scope">
            {{scope.row.url1}}
          </template>
        </el-table-column>
        <el-table-column  label="跳转地址-H5">
          <template slot-scope="scope">
            {{scope.row.url}}
          </template>
        </el-table-column>
        <el-table-column  label="排序">
          <template slot-scope="scope">
            {{scope.row.number}}
          </template>
        </el-table-column>
        <el-table-column  label="操作">
          <template slot-scope="scope">
            <el-button @click="viewBanner(scope.$index,scope.row)" type="success" size="small">查看</el-button>
            <el-button @click="delBanner(scope.$index,scope.row)" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      bannerObj: {
        appid: ""
      },
      bannerData: []
    };
  },
  created() {
    this.bannerObj.appid = this.$store.getters.showQuery;
    this.banner_list();
  },
  methods: {
    // 查看banner
    viewBanner(idx,item){
      localStorage.setItem("banner", JSON.stringify(item));
      this.$router.push({
        name: "addBanner",
        params: { id: item }
      });
    },
    // 删除
    delBanner(idx,item){
      this.$axios
        .post(this.GLOBAL.BASE_URL + "shop/banner_del", { 
          id:item.id,
          appid:this.$store.getters.showQuery })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success('删除成功');
            setTimeout(() => {
                this.banner_list();
            }, 100);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 新增babnner
    addBanner(){
      this.$router.push({
        name:'addBanner'
      })
    },
    // 获取banner列表
    banner_list() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "shop/banner_list",  this.bannerObj)
        .then(res => {
          if (res.data.code == 0) {
            this.loading = false;
            this.bannerData = res.data.data;
          } else {
            this.$message.error(res.data.message);
          }
        });
    }
  }
};
</script>

<style scoped>
.lunbo{
  height: 150px;
  display: flex;
  align-items: center;

}
.lunbo img{
  width: 100%;
  height: auto;
}
/* ------------------- */
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

