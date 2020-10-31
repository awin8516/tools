<template>
  <div class="table">
    <div class="crumbs">
      <h2>订单管理</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" class="handle-del mr10" @click="delivery()">批量发货</el-button>
        <el-select v-model="order_state_value" placeholder="请选择" @change="getState(order_state_value)">
          <el-option
            v-for="item in order_state"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totals"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
      <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}"="orderData" style="width: 100%" v-loading="loading" @select="select" @select-all="selectAll">
        <el-table-column fixed label="序号" width="50" align="center" type="index"></el-table-column>
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="商品信息" width="200" align="left">
          <template slot-scope="scope">{{showRealData('',scope.row.good.name)}}</template>
        </el-table-column>
        <el-table-column prop="order_id" label="订单号" width="200">
          <template slot-scope="scope">{{scope.row.order_id}}</template>
        </el-table-column>
        <el-table-column prop="state" label="订单状态" width="200">
          <template slot-scope="scope">{{showRealData('state',scope.row.state)}}</template>
        </el-table-column>
        <el-table-column prop="created_at" label="下单时间" width="200">
          <template slot-scope="scope">{{showRealData('',scope.row.created_at)}}</template>
        </el-table-column>
        <el-table-column prop="wl_order" label="物流订单号" width="200">
          <template slot-scope="scope">{{showRealData('',scope.row.wl_order)}}</template>
        </el-table-column>
        <el-table-column prop="que_ren_time" label="确认收货时间">
          <template slot-scope="scope">{{showRealData('',scope.row.que_ren_time)}}</template>
        </el-table-column>
        <el-table-column prop="user_di_zhi" label="地址信息">
          <template slot-scope="scope">{{showRealData('',scope.row.user_di_zhi)}}</template>
        </el-table-column>
        <el-table-column label="查看信息">
          <template slot-scope="scope">
            <el-button type="primary" @click="getOrder(scope.$index,scope.row)">商品详情</el-button>
          </template>
        </el-table-column>
        <el-table-column label="修改订单">
          <template slot-scope="scope">
            <el-button type="primary" @click="editOrder(scope.$index,scope.row)">修改订单</el-button>
          </template>
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

    <!-- 订单详情 -->
    <el-dialog title="修改排序" :visible.sync="order_dialogVisible" width="30%">
      <el-form ref="form" :model="wlData" label-width="80px">
        <el-form-item label="物流" required="required">
          <el-select v-model="wlData.wl_id" placeholder="请选择" filterable>
            <el-option
              v-for="item in wxlist"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" required="required">
          <div class="middleinput">
            <el-input v-model="wlData.wl_order"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="订单状态" required="required">
          <el-select v-model="wlData.state" placeholder="请选择">
            <el-option
              v-for="item in order_state"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="dialogbtn">
        <el-button type="primary" @click="modi()" :disabled="isDisable1">确认</el-button>
        <el-button @click="cancel()">取消</el-button>
      </div>
    </el-dialog>

    <!-- 选择物流公司 -->
     <!-- 订单详情 -->
    <el-dialog title="批量发货" :visible.sync="wl_dialogVisible" width="30%">
      <el-form ref="form" :model="deliveryData" label-width="80px">
        <el-form-item label="物流" required="required">
          <el-select v-model="deliveryData.wl_id" placeholder="请选择" filterable>
            <el-option
              v-for="item in wxlist"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" required="required">
          <div class="middleinput">
            <el-input v-model="deliveryData.wl_order"></el-input>
          </div>
        </el-form-item>
      </el-form>
      <div class="dialogbtn">
        <el-button type="primary" @click="deliverySure()" :disabled="isDisable">确认</el-button>
        <el-button @click="deliveryCancel()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDisable:false,
      isDisable1:false,
      orderData: [],
      orderObj: {
        paginate: 10,
        page: 1,
        appid: "",
        order_id: "",
        state: "",
        crated: "",
        u_id: ""
      },
      loading: false,
      totals: 0,
      goods_dialogVisible: false,
      goodsinfo: {},
      expressinfo: {},
      express_dialogVisible: false,
      activities: {},
      order_dialogVisible: false,
      wlData: {
        state: "",
        wl_order: "",
        wl_id: "",
        idv: "",
        appid: ""
      },
      order_state_value:'',
      order_state: [
        { label: "全部", value: "" },
        { label: "代发货", value: "3" },
        { label: "已发货", value: "4" },
        { label: "已完成", value: "10" }
      ],
      paginate: 1000,
      page: 1,
      wxlist: [],
      wl_dialogVisible:false,
      deliveryData:{
        appid:'',
        ids:[],
        wl_id:'',
        wl_order:''
      }
    };
  },
  created() {
    this.orderObj.appid = this.$store.getters.showQuery;
    this.wlData.appid = this.$store.getters.showQuery;
    this.deliveryData.appid = this.$store.getters.showQuery;
    this.orderList();
    // 获取物流公司
    this.getwl();
  },
  methods: {
    // 取消弹窗
    deliveryCancel(){
      this.wl_dialogVisible = false;
    },
    // 全选
    selectAll(item){
      item.forEach(ele => {
        this.deliveryData.ids.push(ele.id)
      });
    },
    // 选择
    select(item){
      item.forEach(ele => {
        this.deliveryData.ids.push(ele.id)
      });
    },
    // 确认批量发货
    deliverySure(){
      this.isDisable = true;
      if(this.deliveryData.ids == ''){
        this.$message.warning("商品不能为空")
          this.isDisable = false;
      }else if(this.deliveryData.wl_id == ''){
        this.$message.warning("物流不能为空")
          this.isDisable = false;
      }else if(this.deliveryData.wl_order == ''){
        this.$message.warning("物流单号不能为空")
          this.isDisable = false;
      }else{
        this.$axios.post(this.GLOBAL.BASE_URL+"shop/bulk_delivery",this.deliveryData).then(res=>{
        if(res.data.code == 0){
          this.$message.success("批量发货成功")
          this.wl_dialogVisible = false;
          this.deliveryData.state=''
          this.orderObj.state=''
          this.orderList()
          this.isDisable = false;
        }else if(res.data.code == '10001'){
          this.isDisable = false;
          this.$message.error(res.data.data)
        }else{
          this.isDisable = false;
          this.$message.error(res.data.message)
        }
      })
      }
      
    },
    // 筛选出发货状态的货品
    getState(val){
      this.orderObj.state = val;
      this.orderList()
    },
    // 批量发货
    delivery(){
      this.wl_dialogVisible = true;
    },
    cancel(){
      this.order_dialogVisible = false;
    },
    // 修改订单
    modi(){
      this.isDisable1 = true;
      if(this.wlData.wl_id == ''){
        this.$message.warning("物流不能为空")
        this.isDisable1 = false;
      }else if(this.wlData.wl_order == ''){
        this.$message.warning("物流单号不能为空")
        this.isDisable1 = false;
      }else if(this.wlData.state == ''){
        this.$message.warning("订单状态不能为空")
        this.isDisable1 = false;
      }else{
        this.$axios
        .post(this.GLOBAL.BASE_URL + "shop/order_edit", this.wlData)
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("修改成功")
            this.order_dialogVisible = false;
            this.orderList();
            this.isDisable1 = false;
          } else {
            this.isDisable1 = false;
            this.$message.error(res.data.message);
          }
        });
      }
    },
    // 修改某些参数
    changeObj(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/id/g, "value"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/name/g, "label"));
      return obj2;
    },
    // 修改订单（物流状态）
    editOrder(idx, item) {
      this.wlData.wl_id = item.wl_id;
      this.wlData.wl_order = item.wl_order;
      this.wlData.id = item.id;
      this.wlData.state=String(item.state);
      this.order_dialogVisible = true;
    },
    // 获取物流公司
    getwl() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "shop/wu_liu_list", {
          appid:  this.$store.getters.showQuery,
          name: "",
          paginate: this.paginate,
          page: this.page
        })
        .then(res => {
          if (res.data.code == 0) {
            this.wxlist = this.changeObj(res.data.data.data);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 查看商品详情
    getOrder(idx, item) {
      localStorage.setItem("orderinfo", JSON.stringify(item));
      this.$router.push({
        name: "jforders",
        params: {
          orderinfo: JSON.stringify(item)
        }
      });
    },
    // 翻页
    handleCurrentChange(val) {
      this.orderObj.page = val;
      this.orderList();
    },
    // 获取订单列表
    orderList() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "shop/order_list", this.orderObj)
        .then(res => {
          if (res.data.code == 0) {
            this.loading = false;
            this.orderData = res.data.data.data;
            this.totals = res.data.data.total;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 转化数据转态用来显示
    showRealData(str, value) {
      if (str == "state") {
        switch (value) {
          case 3:
            return "代发货";
          case 4:
            return "已发货";
          case 10:
            return "已完成";
        }
      } else if (str == "fm_path") {
        return (
          "https://scrm.beats-digital.com/Ajax/Media/ShowImage?image=" + value
        );
      } else if (str == "goodsinfo_state") {
        switch (value) {
          case 1:
            return "上架";
          case 2:
            return "下架";
          case 3:
            return "回收站";
        }
      } else {
        // 不传数据类型就默认显示value
        return value;
      }
    }
  }
};
</script>

<style scoped>
.dialogbtn {
  display: flex;
  justify-content: flex-end;
  margin-top: 100px;
}
/* --------------------- */
.middleinput {
  width: 400px;
}
.line {
  height: 1px;
  margin: 4px 0;
  width: 100%;
}
/* ---------- */
.jfBtn {
  display: flex;
  justify-content: flex-end;
}
/* ----------------------- */
.img {
  width: auto;
  height: 80px;
  vertical-align: middle;
  border-radius: 5px;
}
/* ------------- */
.el-button--text {
  color: #333;
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
