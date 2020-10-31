<template>
  <div class="table">
    <div class="crumbs">
      <h2>订单详情</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="success" @click="back()" icon="el-icon-back">返回订单管理</el-button>
      </div>
      <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}"="ShopGood" style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="商品" width="120"></el-table-column>
        <el-table-column prop="path" label="商品图" width="120">
          <template slot-scope="scope">
            <div class="path">
              <img :src="scope.row.path" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="下单时间"></el-table-column>
        <el-table-column prop="money" label="订单价格">
          <template slot-scope="scope">{{showMoney(scope.row.money)}}</template>
        </el-table-column>
        <el-table-column prop="num" label="数量"></el-table-column>
        <el-table-column prop label="规格" >
          <template slot-scope="scope">
            <!-- <el-button
              type="primary"
              icon="el-icon-document"
              @click="showNorm(scope.row.norms)"
            >规格详情</el-button> -->
             <div v-for="(item,index) in scope.row.norms" :key="index">
              {{item.gui_ge.name}}: {{item.name}}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="规格" :visible.sync="dialogVisible" width="30%" center>
      <div v-for="(item,index) in GuiGe" :key="index">
        {{item.gui_ge.name}}: {{item.name}}
      </div>
      <!-- <div v-for="(item,index) in GUo" -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      ShopGood: [],
      dialogVisible:false,
      GuiGe:[],
    };
  },
  // 离开页面时删掉BusID
  destroyed() {},
  created() {
    if (localStorage.getItem("BusGood")) {
      this.ShopGood = JSON.parse(localStorage.getItem("BusGood"));
    } else {
      this.ShopGood = this.$route.params.good;
    }
  },
  mounted() {
    this.loading = false;
  },
  methods: {
    // 规格详情
    showNorm(item) {
      this.dialogVisible = true;
      this.GuiGe = item;
    },
    // 显示价格
    showMoney(money) {
      return money + "元";
    },
    // 返回订单详情
    back() {
      this.$router.push({
        name: "business"
      });
    }
  }
};
</script>

<style scoped>
.path {
  width: 100px;
  height: 50px;
}
.path > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

