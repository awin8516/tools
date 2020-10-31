<template>
  <div class="table">
    <div class="crumbs">
      <h2>订单管理</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="success" @click="back()" icon="el-icon-back">返回用户列表页</el-button>
      </div>
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleChange"
          layout="prev, pager, next"
          :total="totals"
        ></el-pagination>
      </div>
      <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}"="BusData" style="width: 100%" v-loading='loading'>
        <el-table-column prop="order_number" label="订单号" width="180"></el-table-column>
        <el-table-column prop="order_create" label="下单时间"></el-table-column>
        <el-table-column prop="money" label="订单价格" >
           <template slot-scope="scope">
            {{showMoney(scope.row.money)}}
          </template>
        </el-table-column>
        <el-table-column prop="state" label="订单状态">
          <template slot-scope="scope">
            {{showState(scope.row.state)}}
          </template>
        </el-table-column>
        <el-table-column prop="" label="电商标签" >
           <template>
            <div class="remarks" v-for="(item,index) in LabelList" :key="index">
              <p class="remark">{{item.label_name}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="订单详情">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-folder-opened" @click="getShopGood(scope.row.shop_good)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleChange"
          layout="prev, pager, next"
          :total="totals"
        ></el-pagination>
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading:false,
      id: "",
      paginate: 1,
      BusData: [],
      // 订单状态
      states:['','待支付','支付失败','待发货','已发货','售后未处理','售后已处理','已取消','异常订单','回收站','已完成','退款申请中','已退款'],
      totals:0,
      LabelList:[]
    };
  },
  // 离开页面时删掉BusID
  destroyed() {
    // localStorage.removeItem("BusId");
  },
  created() {
    // 防止页面刷新时 params失效
    if (localStorage.getItem("BusId")) {
    let BusId = localStorage.getItem("BusId");
      this.id = window.atob(BusId.split("?")[0]); 
    } else {
      this.id = this.$route.params.id;
    }
    // 获取电商标签-----在请求电商数据
    this.getLabelList();
  },
  methods: {
    // 查看订单详情
    getShopGood(item){
      localStorage.setItem("BusGood",JSON.stringify(item))
      this.$router.push({
        name:'businfo',
        params:{
          good: item
        }
      })
    },
    // 显示价格
    showMoney(money){
      return money + '元'
    },
    // 翻页
    handleChange(val){
      this.paginate = val;
      this.getBusList()
    },
    // 返回订单状态
    showState(state){
      return this.states[parseInt(state)]
    },
    // 返回用户信息列表页
    back(){
      this.$router.push({
        path:'/UserInfo'
      })
    },
    // 获取用户的电商数据
    getBusList() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "shop_order_list", {
           appid: this.$store.getters.showQuery,
          u_id: this.id,
          paginate: this.paginate
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            if (res.data.data.data && res.data.data.data.length > 0) {
              this.BusData = res.data.data.data;
              this.totals = res.data.data.total;
            }
            
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 电商标签
    getLabelList(){
      this.$axios
        .post(this.GLOBAL.BASE_URL + "shop_label_list", {
           appid: this.$store.getters.showQuery,
          u_id: this.id,
        })
        .then(res => {
          if (res.data.code == 0) {
            this.LabelList = res.data.data;
            this.getBusList()
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
  background:  $--color-primary;
  border: 1px solid  $--color-primary;
  border-radius: 2px;
  margin: auto;
  color: #fff;
  margin-bottom: 4px;
  display: inline-block;
  padding: 4px;;
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

