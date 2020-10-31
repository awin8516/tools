<template>
  <div class="table">
    <div class="crumbs">
      <h2>兑换券列表</h2>
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
      <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}"="couponData" style="width: 100%" v-loading="loading">
        <el-table-column fixed label="序号" width="50" align="center" type="index"></el-table-column>
        <el-table-column label="商品信息" width="200" align="left">
          <template slot-scope="scope">{{scope.row.good.name}}</template>
        </el-table-column>
        <el-table-column label="开始时间" width="200" align="left">
          <template slot-scope="scope">{{scope.row.start}}</template>
        </el-table-column>
        <el-table-column label="结束时间" width="200" align="left">
          <template slot-scope="scope">{{scope.row.end}}</template>
        </el-table-column>
        <el-table-column label="唯一标示"  align="left">
          <template slot-scope="scope">{{scope.row.un_order}}</template>
        </el-table-column>
        <el-table-column label="状态"  align="left">
          <template slot-scope="scope">{{showRealData('state',scope.row.state)}}</template>
        </el-table-column>
        <el-table-column label="购买时间"  align="left">
          <template slot-scope="scope">{{showRealData('',scope.row.state_2_time)}}</template>
        </el-table-column>
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
      couponData: [],
      couponObj: {
        appid: "",
        id: "",
        u_id: "",
        paginate: 10,
        un_order: "",
      },
      totals:0,
      couponObj:{}
    };
  },
  created() {
    this.couponObj.appid = this.$store.getters.showQuery;
    this.getCoupon();
  },
  // 离开当前页面
  destroyed: function(){
    if(localStorage.getItem('couponinfo')){
      localStorage.removeItem("couponinfo")
    }
  },
  methods: {
    // 判断是否是通过修改商品进来的,从而获取详情
    getCoupon(){
      if(this.$route.params && this.$route.params.id){
        this.couponObj.id = this.$route.params.id
      }else if(localStorage.getItem('couponinfo')){
        this.couponObj.id = (JSON.parse(localStorage.getItem('couponinfo'))).id;
      }else{

      }
      this.coupon_de_list();
    },
    // 转化数据显示形态
    showRealData(str,value){
      if(str == 'state'){
        switch (value){
          case 1:
            return '正常'
          case 2:
            return '被购买'
          case 3:
            return '关闭'
        }
      }else{
        return value
      }
    },
    // 翻页
    handleCurrentChange(val){
      this.couponObj.page = val;
      this.coupon_de_list();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.couponList = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    // 获取积分列表
    coupon_de_list() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "shop/coupon_de_list", this.couponObj)
        .then(res => {
          if (res.data.code == 0) {
            this.loading = false;
            this.couponData = res.data.data;
            this.totals = res.data.data.total;
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

