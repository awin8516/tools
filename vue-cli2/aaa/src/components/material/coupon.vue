<template>
  <div class="table">
    <div class="crumbs">
      <h2>优惠券管理</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-tooltip class="item" effect="dark" content="获取优惠券" placement="top">
          <el-button type="primary" @click="sureRemark()">获取优惠券</el-button>
        </el-tooltip>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 200]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
          :current-page.sync="currentPage"
        ></el-pagination>
      </div>
      <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}" style="width: 100%" v-loading="loading">
        <el-table-column fixed label="序号" width="50" align="center" type="index">
          <template slot-scope="scope">{{(scope.$index + 1) + (page- 1) *limit}}</template>
        </el-table-column>
        <el-table-column prop label="卡券类型" sortable width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.type">
              <span v-if="scope.row.type == 'gift'">兑换券</span>
              <span v-if="scope.row.type == 'groupon'">团购券</span>
              <span v-if="scope.row.type == 'cash'">代金券</span>
              <span v-if="scope.row.type == 'discount'">折扣券</span>
              <span v-if="scope.row.type == 'general_coupon'">优惠券</span>
              <span v-if="scope.row.type == 'member_card'">会员卡</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop label="卡券名称" sortable width="150">
          <template slot-scope="scope">
            <p>{{scope.row.title}}</p>
          </template>
        </el-table-column>
        <el-table-column prop label="卡券内容" sortable width="150">
          <template slot-scope="scope">
            <p>{{scope.row.brand_name}}</p>
          </template>
        </el-table-column>
        <el-table-column prop label="生效时间" sortable width="150">
          <template slot-scope="scope">
            <p>{{startTime(scope.row)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop label="有效期" sortable width="200">
          <template slot-scope="scope">
            <p>{{showTime(scope.row)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop label="核销" sortable>
          <template slot-scope="scope">
            <p>{{scope.row.write_off_num}}</p>
          </template>
        </el-table-column>
        <el-table-column prop label="领取" sortable>
          <template slot-scope="scope">
            <p>{{scope.row.receive_num}}</p>
          </template>
        </el-table-column>
        <el-table-column prop label="卡券状态" sortable width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'CARD_STATUS_NOT_VERIFY'">待审核</span>
            <span v-if="scope.row.status == 'CARD_STATUS_VERIFY_FAIL'">审核失败</span>
            <span v-if="scope.row.status == 'CARD_STATUS_VERIFY_OK'">通过审核</span>
            <span v-if="scope.row.status == 'CARD_STATUS_DELE'">卡券被商户删除</span>
            <span v-if="scope.row.status == 'CARD_STATUS_DISPATCH'">在公众平台投放过的卡券</span>
          </template>
        </el-table-column>
        <el-table-column prop label="库存" sortable>
          <template slot-scope="scope">
            <p>{{scope.row.quantity}}</p>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 200]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
          :current-page.sync="currentPage"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "../../utils/utils";
export default {
  data() {
    return {
      tableData: [],
      limit: 10,
      page: 1,
      totals: 0,
      currentPage: 0,
      loading: false
    };
  },
  created() {
    if (localStorage.getItem("pages")) {
      this.page = JSON.parse(localStorage.getItem("pages")).coupon || this.page;
      this.currentPage =
        JSON.parse(localStorage.getItem("pages")).coupon || this.page;
    }
    this.getData();
  },
  methods: {
    // 获取优惠券
    sureRemark() {
      this.getData();
    },
    handleChose(data) {
      this.$emit("listenChild", data);
    },
    startTime(item) {
      switch (item.time_type) {
        case "DATE_TYPE_FIX_TIME_RANGE":
          return utils.format(item.start_time * 1000).split(" ")[0];
        case "DATE_TYPE_FIX_TERM":
          return utils.getAfterDate(item.start_time).split(" ")[0];
        default:
          return "";
      }
    },
    showTime(item) {
      switch (item.time_type) {
        case "DATE_TYPE_FIX_TIME_RANGE":
          return this.formateRange(item);
        case "DATE_TYPE_FIX_TERM":
          return this.formateTerm(item);
        default:
          return "";
      }
    },
    // DATE_TYPE_FIX_TIME_RANGE
    formateRange(item) {
      if (item.start_time) {
        let startTime = utils.format(item.start_time * 1000).split(" ")[0];
        let endTime = utils.format(item.end_time * 1000).split(" ")[0];
        return `${startTime} 至 ${endTime}`;
      } else {
        return "";
      }
    },
    // DATE_TYPE_FIX_TERM
    formateTerm(item) {
      if (item.start_time) {
        let startTime =
          utils.getAfterDate((item.start_time)).split(" ")[0];
        let endTime = utils.getAfterDate(item.end_time).split(" ")[0];
        return `${startTime} 至 ${endTime}`;
      } else {
        return "";
      }
    },
    // 翻页
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.Coupon = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    // 选择条数
    handleSizeChange(val) {
      this.page = this.currentPage;
      this.limit = val;
      this.getData();
    },
    getData() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "pullCoupon", {
          appid: this.$store.getters.showQuery,
          page: this.page,
          limit: this.limit
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
            this.totals = res.data.data.total;
            this.currentPage = res.data.data.current_page;
            if (this.page > res.data.data.last_page) {
              this.page = res.data.data.last_page;
              this.getData();
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>

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