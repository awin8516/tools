<template>
  <div class="table">
    <div class="crumbs">
      <h2>订单详情</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" @click="back()" icon="el-icon-back">返回订单列表</el-button>
      </div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick(activeName)" v-loading='loading'>
        <el-tab-pane label="用户信息" name="1">
          <div class="area jfuser">
            <div v-if="jfuser">
              <el-divider content-position="left">用户名：</el-divider>
              <div v-if="jfuser.name">{{jfuser.name}}</div>
              <div v-else>无</div>
              <el-divider content-position="left">头像：</el-divider>
              <img :src="jfuser.avatar" v-if="jfuser.avatar">
              <div v-else>无</div>
            </div>
            <div v-if="wu_liu">
              <el-divider content-position="left">物流：</el-divider>
              <div v-if="wu_liu.name">{{wu_liu.name}}</div>
              <div v-else>无</div>
            </div>
            <div v-if="user_di_zhi">
              <el-divider content-position="left">收货人信息：</el-divider>
              <div v-if="user_di_zhi.name">姓名：{{user_di_zhi.name}}</div>
              <div v-else>无</div>
              <div class="line"></div>
              <div v-if="user_di_zhi.province">省：{{user_di_zhi.province.name}}</div>
              <div v-else>无</div>
              <div class="line"></div>
              <div v-if="user_di_zhi.city">市：{{user_di_zhi.city.name}}</div>
              <div v-else>无</div>
              <div class="line"></div>
              <div v-if="user_di_zhi.area">区：{{user_di_zhi.area.name}}</div>
              <div v-else>无</div>
              <div class="line"></div>
              <div v-if="user_di_zhi.text">具体信息：{{user_di_zhi.text}}</div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品信息" name="2">
          <div class="area">
            <div class="area good">
              <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}"="good" style="width: 100%" border>
        <el-table-column fixed label="序号" width="50" align="center" type="index"></el-table-column>
                <el-table-column prop="name" label="商品名称" width="180"></el-table-column>
                <el-table-column prop="created_at" label="创建时间" width="180"></el-table-column>
                <el-table-column prop="state" label="上架状态"></el-table-column>
                <el-table-column prop="o_price" label="原价"></el-table-column>
                <el-table-column prop="price" label="售价"></el-table-column>
                <el-table-column prop="stock" label="库存"></el-table-column>
                <el-table-column prop="sales_volume" label="销量"></el-table-column>
                <el-table-column prop="max_integral" label="商品积分使用上限"></el-table-column>
                <el-table-column prop="gice_integral" label="购买商品赠送积分"></el-table-column>
                <el-table-column prop="quota" label="限购状态"></el-table-column>
                <el-table-column prop="start" label="上架时间"></el-table-column>
                <el-table-column prop="end" label="下架时间"></el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="物流详细信息" name="3">
          <div class="refresh">
            <el-button type="primary" @click="refresh()">最新物流动态</el-button>
          </div>
          <div class="area">
            <el-timeline v-loading='wl_loading'>
              <el-timeline-item v-for="(item, index) in wl_text.data" :key="index">
                <el-card>
                  <h4>{{item.context}}</h4>
                  <div class="line"></div>
                  <p>{{item.time}}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading:false,
      wl_loading:false,
      activeName: "1",
      jfuser: {},
      good: [],
      wu_liu: {},
      wl_text: {},
      user_di_zhi: {},
      getOrder:{}
    };
  },
  created() {
    this.getOrderInfo();
  },
  // 离开当前页面
  destroyed: function() {
    if (localStorage.getItem("orderinfo")) {
      localStorage.removeItem("orderinfo");
    }
  },
  methods: {
    // 返回订单列表
    back(){
      this.$router.push({
        path: '/goodorderlist'
      })
    },
    // 刷新物流
    refresh(){
      this.wl_loading = true;
      this.$axios.post(this.GLOBAL.BASE_URL+'shop/order_wl_set',{
        appid: this.$store.getters.showQuery,
        id: this.getOrder.id
      }).then(res=>{
        if(res.data.code == 0){
          this.wl_loading=false;
          this.$message.success("物流已更新");
          this.wl_text = res.data.data;
        }else{
          this.$message.error(res.data.message)
        }
      })
    },
    // 标签页面选中
    handleClick(value) {
    },
    // 判断是否是通过修改商品进来的,从而获取详情
    getOrderInfo() {
      if (this.$route.params && this.$route.params.orderinfo) {
        this.getOrder = JSON.parse(this.$route.params.orderinfo);
      } else if (localStorage.getItem("orderinfo")) {
        this.getOrder = JSON.parse(localStorage.getItem("orderinfo"));
      } else {
      }
      if (Object.keys(this.getOrder).length) {
        this.$message({
          message: '获取数据中',
          type: 'success',
          duration:500
        });
        setTimeout(() => {
          this.get_order(this.getOrder, response => {
            // 用户信息
            if (response.jfuser) {
              this.jfuser = response.jfuser;
            }
            // 商品信息
            if (response.good) {
              this.good.push(response.good);
            }
            // 物流信息
            if (response.wu_liu) {
              this.wu_liu = response.wu_liu;
            }
            // 物流详细信息
            if (response.wl_text) {
              this.wl_text = response.wl_text;
            }
            // 用户地址
            if (response.user_di_zhi) {
              this.user_di_zhi = response.user_di_zhi;
            }
          });
        }, 100);
      }
    },
    // 订单详情
    get_order(item, cb) {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "shop/get_order", {
          appid:this.$store.getters.showQuery,
          id: item.id
        })
        .then(res => {
          if (res.data.code == 0) {
            this.loading = false;
            cb(res.data.data);
          } else {
            this.$message.error(res.data.message);
          }
        });
    }
  }
};
</script>

<style>
.line {
  margin: 8px 0;
}
/* ------- */
.area {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  margin-top: 10px;
}
.jfuser {
  width: 250px;
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

