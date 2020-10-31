<template>
  <div class="table">
    <div class="crumbs">
      <h2>全部商品</h2>
    </div>
    <!-- {{tableData}} -->
    <div class="container">
      
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totals"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column fixed label="序号" width="50" align="center" type="index"></el-table-column>
        <el-table-column prop="name" label="商品名称" width="250">
          <template slot-scope="scope">
            <img v-if="scope.row.fm_path" :src="scope.row.fm_path.path" class="img">
            <el-tooltip class="item" effect="dark" content="点击修改商品名称" placement="top-start">
              <el-button type="text" @click="showPrice(scope.$index,scope.row)"><div class="showName">{{scope.row.name}}</div></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column  prop="price" label="价格" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="点击修改价格/库存" placement="top-start">
              <el-button type="text" @click="showPrice(scope.$index,scope.row)">{{scope.row.price}}</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column  prop="stock" label="总库存" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="点击修改价格/库存" placement="top-start">
              <el-button type="text" @click="showPrice(scope.$index,scope.row)">{{scope.row.stock}}</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="商品类型" prop="currentInventory" width="100">
          <template slot-scope="scope">
            {{showRealData('type',scope.row.type)}}<span class="grid"></span>
            <!--  -->
          </template>
        </el-table-column>
        <el-table-column  prop="sales_volume" label="实际销量" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="点击修改实际销量" placement="top-start">
              <el-button
                type="text"
                @click="showPrice(scope.$index,scope.row)"
              >{{scope.row.sales_volume}}</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column  prop="created_at" label="上下架时间" width="200">
          <template slot-scope="scope">{{scope.row.created_at}}</template>
        </el-table-column>
        <el-table-column prop="state" label="上架状态" width="100">
          <template slot-scope="scope">
            <!-- <el-switch
              v-model="scope.row.state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="shopEditHandle('state',scope.row)"
            ></el-switch> -->
            <span class="showState">{{showState(scope.row.state)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="success" v-if="scope.row.state != '1'" size="mini" @click.native.prevent="goodUp(scope.$index,scope.row)">上架</el-button>
            <el-button type="info" size="mini"  v-if="scope.row.state != '2'" @click.native.prevent="goodDown(scope.$index,scope.row)">下架</el-button>
            <el-button  type="danger"  v-if="scope.row.state != '3'"  @click.native.prevent="goodsDel(scope.$index,scope.row)">存入回收站</el-button>
            <el-button icon="el-icon-edit" type="text"  @click.native.prevent="goodsEdit(scope.$index,scope.row)">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column label="查看兑换券">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.type == '2'" class="item" effect="dark" content="点击查看兑换券" placement="top-start">
              <el-button icon="el-icon-view"  type="text" @click.native.prevent="showCoup(scope.$index,scope.row)">查看</el-button>
            </el-tooltip>
            <el-tooltip v-if="scope.row.state == '1' && scope.row.type == '2'" class="item" effect="dark" content="批量添加兑换券" placement="top-start">
              <el-button icon="el-icon-plus"  type="text" @click.native.prevent="addCoupn(scope.$index,scope.row)">批量添加</el-button>
            </el-tooltip>
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

    <!-- 以下是各种弹窗 -->
    <!-- 修改价格和库存 -->
    <el-dialog title="修改价格和库存" :visible.sync="price_dialogVisible" width="60%">
      <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}"="priceData" style="width: 100%">
        <el-table-column label="名称" prop>
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" placeholder="请输入内容"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="原价" prop>
          <template slot-scope="scope">
            <el-input v-model="scope.row.o_price" placeholder="请输入内容"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="售价" prop>
          <template slot-scope="scope">
            <el-input v-model="scope.row.price" placeholder="请输入内容"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="当前库存" prop="currentInventory">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stock" placeholder="请输入内容"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="实际销量" prop>
          <template slot-scope="scope">
            <el-input v-model="scope.row.sales_volume" placeholder="请输入内容"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div class="dialogbtn">
        <el-button type="primary" @click="submitForm(priceData[0])" :disabled="isDisable1">确认</el-button>
        <el-button @click="close('price')">取消</el-button>
      </div>
    </el-dialog>
    <!-- 批量添加兑换券 -->
    <el-dialog title="批量添加兑换券" :visible.sync="addCoupn_dialogVisible" width="30%">
      <el-input-number v-model="CoupnObj.num"  :min="1" :max="999" label="描述文字"></el-input-number>
      <div class="dialogbtn">
        <el-button type="primary" @click="coupon_de_b_add()" :disabled="isDisable2">确认</el-button>
        <el-button @click="close('CoupnNum')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isDisable1:false,
      isDisable2:false,
      loading: false,
      tableData:[],
      goodstype:[
        {value:'',label:"商品类型"},
        {value:'1',label:"实体商品"},
        {value:'2',label:"虚拟商品"},
      ],
      goodstype_value:'',
      // 控制弹窗显示参数
      price_dialogVisible: false,
      priceData: [
        {
          salesPrice: "1",
          marketPrice: "1",
          costPprice: "1",
          currentInventory: "2",
          addRemove: "1",
          realityInventory: "3"
        }
      ],
      sort_dialogVisible: false,
      sort_form: {},
      share_dialogVisible: false,

      // 商品请求参数
      GoodsObj: {
        appid: "",
        paginate: 10,
        name: "",
        state: "",
        page: 1
      },
      totals: 0,
      shopEditObj: {},
      addCoupn_dialogVisible:false,
      CoupnObj:{
        id:'',
        num:0,
        appid:''
      }
    };
  },
  created() {
    this.GoodsObj.appid = this.$store.getters.showQuery;
    this.CoupnObj.appid = this.$store.getters.showQuery;
    this.getGood_list();
  },
  methods: {
    // 批量添加接口
    coupon_de_b_add(){
      this.isDisable2 = true;
      this.$axios.post(this.GLOBAL.BASE_URL+'shop/coupon_de_b_add',this.CoupnObj).then(res=>{
        if(res.data.code == 0){
          this.$message.success("修改成功");
          this.addCoupn_dialogVisible = false;
          this.getGood_list()
          this.isDisable2 = false;
          setTimeout(() => {
              this.CoupnObj.num=0; 
          }, 1000);
          
        }else{
          if(res.data.code == '10001'){
              this.isDisable2 = false;
             this.$message.error(res.data.data);
          }
          this.isDisable2 = false;
          this.$message.error(res.data.data);
        }
      })
    },
    // 关闭弹窗
    close(str){
      if(str == 'price'){
        this.price_dialogVisible = false;
      }else if(str == 'CoupnNum'){
        this.addCoupn_dialogVisible = false;
      }
    },
    // 批量添加
    addCoupn(idx,item){
      this.CoupnObj.id = item.id;
      this.addCoupn_dialogVisible = true;
    },
    // 进入积分类表页面
    showCoup(idx,item){
      localStorage.setItem("couponinfo", JSON.stringify(item));
      this.$router.push({
        name: "couponListCopy",
        params: { id: item.id }
      });
    },
    // 转化数据显示形态
    showRealData(str,value){
      if(str == 'type'){
        switch (value){
          case 0:
            return '无'
          case 1:
            return '实体商品'
          case 2:
            return '虚拟商品'
        }
      }
      if(str == 'gender'){
        switch (value){
          case 0:
            return '女'
          case 1:
            return '男'
        }
      }else{
        return value;
      }
    },
    // 搜索
    GoodsHanle(val){
      this.GoodsObj.type = val;
      this.getGood_list();
    },
    // 翻页
    handleCurrentChange(val) {
      this.GoodsObj.page = val;
      this.getGood_list();
    },
    // 编辑商品当前积分
    goodsEdit(idx, item) {
      localStorage.setItem("addGoods", JSON.stringify(item));
      this.$router.push({
        name: "addgoods",
        params: { id: encodeURIComponent(item.id) }
      });
    },

    // 删除商品
    goodsDel(idx, item) {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "shop/good_del", {
          id: item.id,
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("存入成功");
            this.getGood_list();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 修改上下架转态
    shopEditHandle(type, obj) {
      this.isDisable1 = true;
      if (type == "state") {
        this.get_good(obj, item => {
          item.state = parseInt(obj.state);
          this.submitForm(item);
        });
      }
    },
    // 下架
    goodUp(idx,row){
      this.isDisable1 = true;
       this.get_good(row, item => {
          item.state = 1
          this.submitForm(item);
        });
    },
    // 下架
    goodDown(idx,row){
      this.isDisable1 = true;
       this.get_good(row, item => {
          item.state = 2
          this.submitForm(item);
        });
    },
    // 修改价格
    submitForm(item) {
      this.$axios.post(this.GLOBAL.BASE_URL + "shop/good_edit", item).then(res => {
        if (res.data.code == 0) {
          this.$message.success("修改成功");
          this.price_dialogVisible = false;
          this.getGood_list();
          this.isDisable1 = false;
        } else {
          this.$message.error(res.data.message);
          this.isDisable1 = false;
        }
      });
    },
    // 上下架状态
    showState(value) {
      // console.log(value)
      if (parseInt(value) == 1) {
        // 上架
        return "上架";
      } else if (parseInt(value) == 2) {
        // 下架
        return "下架";
      } else if (parseInt(value) == 3) {
        // 回收站
        return "回收站";
      }
    },
    // 修改排序
    setSort() {
      this.sort_dialogVisible = true;
    },
    // 修改价格和库存
    showPrice(idx, item) {
      // 提取修改价格需要的参数，不需要全部传
      this.get_good(item, response => {
        // 价格--库存--销量--名称的修改
        this.priceData = [];
        this.priceData.push(response);
      });
      this.price_dialogVisible = true;
    },
    // 商品列表
    getGood_list() {
      this.loading = true;
      this.$axios.post(this.GLOBAL.BASE_URL + "shop/good_list", this.GoodsObj).then(res => {
        if (res.data.code == 0) {
          this.loading = false;
          this.tableData = (res.data.data.data);
          this.totals = res.data.data.total;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 商品详情
    get_good(item, cb) {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "shop/get_good", {
          id: item.id
        })
        .then(res => {
          if (res.data.code == 0) {
            cb(res.data.data);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
  }
};
</script>

<style scoped>
.grid{
  width: 10px;
  display: inline-block;
}
/* ----------------- */
.showState {
  margin-left: 10px;
}
/* ----------------------- */
.img {
  width: auto;
  height: 40px;
  vertical-align: middle;
  border-radius: 5px;
  float: left;
}
.showName{
  float: left;
  width: 130px;
  overflow: hidden;
  text-overflow:ellipsis; 
  white-space: nowrap;
}
/* ------------------ */
.pagination {
  display: flex;
  justify-content: flex-end;
}
/* ------------- */
.dialogbtn {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
/* --------------- */
.tips {
  color: rgb(99, 97, 97);
  font-size: 12px;
}
/* ------------- */
.el-button--text {
  color: #333;
}
/* ------------ */
.line {
  height: 1px;
  width: 100%;
  background: transparent;
  margin: 10px 0;
}
/* ----------------- */
.search {
  width: 300px;
  display: inline-block;
}
/* -------------------- */
.input {
  width: 160px;
  display: inline-block;
  margin-right: 10px;
}
.btn {
  display: inline-block;
  margin-right: 10px;
}
/* -------------------------- */
.container {
  padding: 20px;
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
