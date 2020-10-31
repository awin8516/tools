<template>
  <div class="table">
    <div class="crumbs">
      <h2>查看统计</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :inline="true">
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="返回二维码列表" placement="top">
              <el-button type="success" @click="back()" icon="el-icon-back">返回二维码列表</el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="导出搜索结果" placement="top">
              <el-button
                type="primary"
                icon="el-icon-upload"
                class="handle-del mr10"
                @click="exportData()"
              >导出</el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>

        <el-form :inline="true">
          <el-form-item>
            <el-select v-model="tineQuantum" placeholder="请选择时间段" @change="getTimes(tineQuantum)">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                size="mini"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="timepicker"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              type="datetimerange"
              :picker-options="pickerOptions"
              @change="getpickerTimes(timepicker)"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="line">
        <ve-line :data="chartData" height="400px" width="100%" :extend="extend" v-loading="loading"></ve-line>
      </div>
      <div class="lines"></div>

      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="selectObj.openid" placeholder="请输入搜索的openid"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="selectObj.nickname" placeholder="请输入搜索的昵称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-tooltip class="item" effect="dark" content="搜索" placement="top">
            <el-button type="primary" @click="handleSearch(selectObj)">搜索</el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-tooltip class="item" effect="dark" content="重置搜索条件" placement="top">
            <el-button
              type="primary"
              icon="el-icon-refresh"
              class="handle-del mr10"
              @click="reset()"
            >重置</el-button>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 200]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
          :current-page.sync="currentPage1"
        ></el-pagination>
      </div>
      <el-table
        :data="tableData"
        :header-cell-style="{background:'#f9f9f9'}"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column fixed label="序号" width="50" align="center" type="index">
          <template slot-scope="scope">{{(scope.$index + 1) + (page- 1) *limit}}</template>
        </el-table-column>
        <el-table-column prop="openid" label="Openid" sortable></el-table-column>
        <el-table-column prop="type" label="操作类型" sortable>
          <template slot-scope="scope">
            <!-- 1表示扫码2表示扫码关注 -->
            <p v-if="scope.row.type ==1">扫码</p>
            <p v-if="scope.row.type ==2">扫码关注</p>
          </template>
        </el-table-column>
        <el-table-column prop="filter_content" label="头像昵称" sortable>
          <template slot-scope="scope">
            <div class="headerImg" v-if="scope.row.fan" @click="navUserInfo(scope.row)">
              <img :src="scope.row.fan.headimgurl" />
              <p style="margin-left:30px">{{scope.row.fan.nickname}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="扫码时间" sortable></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 200]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
          :current-page.sync="currentPage1"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import BaseView from "../common/BaseView";
export default {
  extends: BaseView,
  data() {
    this.extend = {
      series: {
        // label: { show: true, position: "top" }
      }
    };
    return {
      start_time: "",
      end_time: "",
      tableData: [],
      curveData: [],
      timepicker: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      tineQuantum: "1",
      qrcode: true,
      id: "",
      start_time: "",
      end_time: "",
      qrobj: {},
      options: [
        { label: "最近30天", value: "3" },
        { label: "最近20天", value: "2" },
        { label: "最近10天", value: "1" }
      ],
      chartData: {
        columns: ["日期", "每日总关注人数"],
        rows: [
          // { 日期: "2020/10/10", 每日总关注人数: 100 }
        ]
      },
      loading: false,
      totals: 0,
      page: 1,
      limit: 10,
      currentPage1: 0,
      selectObj: {
        openid: "",
        nickname: ""
      }
    };
  },
  created() {
    if (localStorage.getItem("pages")) {
      this.page =
        JSON.parse(localStorage.getItem("pages")).qrcodeData || this.page;
      this.currentPage1 =
        JSON.parse(localStorage.getItem("pages")).qrcodeData || this.page;
    }
    this.id = window.atob(localStorage.getItem("qid"));
    this.getQrdata();
  },
  methods: {
    // 重置
    reset() {
      this.selectObj.openid = "";
      this.selectObj.nickname = "";
      this.handleSearch();
    },
    handleSearch(val) {
      this.getQrdata(val);
    },
    navUserInfo(item) {
      window.open(this.GLOBAL.USEROPEN + window.btoa(item.fan._id), "_blank");
    },
    getTimes(val) {
      this.end_time = parseInt(new Date().getTime() / 1000);
      this.start_time =
        parseInt(new Date().getTime() / 1000) - val * 10 * 24 * 60 * 60;
      if (this.qrcode) {
        this.getQrdata();
      } else {
        this.getDailyData();
      }
      this.timepicker = "";
    },
    // 转化成echat需要的时间格式
    changeQrcodeData(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/updated_at/g, "日期"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/scan/g, "扫码数量"));
      let obj3 = JSON.parse(
        JSON.stringify(obj2).replace(/subscribe/g, "扫码后关注的数量")
      );
      return obj3;
    },
    // 选择条数
    handleSizeChange(val) {
      this.page = this.currentPage1;
      this.limit = val;
      this.getQrdata();
    },
    // fanye
    handleCurrentChange(val) {
      this.page = val;
      this.getQrdata();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.qrcodeData = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    getQrdata(selectObj = this.selectObj) {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "qrdata", {
          appid: this.$store.getters.showQuery,
          id: this.id,
          start_time: this.start_time,
          end_time: this.end_time,
          page: this.page,
          limit: this.limit,
          openid: selectObj.openid.trim(),
          nickname: selectObj.nickname.trim()
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            if (res.data.data.length == 0) {
              var toDay = `${new Date().getFullYear()}/${new Date().getMonth() +
                1}/${new Date().getDate()}`;
              this.chartData.columns = ["日期", "扫码数量", "扫码后关注的数量"];
              let time = [{ 日期: toDay, 扫码数量: 0, 每日总关注人数: 0 }];
              this.chartData.rows = time;
            } else {
              this.tableData = res.data.data.userdata.data;
              this.totals = res.data.data.userdata.total;
              this.currentPage1 = res.data.data.userdata.current_page;
              this.chartData.rows = [];
              this.curveData = this.changeQrcodeData(res.data.data.qrdata);
              this.chartData.columns = ["日期", "扫码数量", "扫码后关注的数量"];
              this.chartData.rows = this.curveData;
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 返回用户信息列表页
    back() {
      localStorage.removeItem("qid");
      this.$router.push({
        path: "/qrcode"
      });
    },
    exportData() {
      this.qrobj = {
        appid: this.$store.getters.showQuery,
        id: this.id,
        start_time: this.start_time,
        end_time: this.end_time
      };
      window.location.href =
        this.GLOBAL.BASE_URL + "qrexport?" + this.encodeUrl(this.qrobj);
    }
  }
};
</script>

<style scoped>
.lines {
  width: 100%;
  height: 1px;
  background: #c0c4cc;
  margin-bottom: 15px;
}
/* --------------- */
.headerImg {
  width: 200px;
  height: 30px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
}
.headerImg img {
  height: 100%;
  width: auto;
}
.headerImg p {
  margin-right: 10px;
}
.timepicker {
  width: auto;
  display: inline-block;
}
.selectArea {
  width: 130px;
  display: inline-block;
}
.echats-filter {
  width: 100%;
  height: auto;
  border-radius: 5px;
  margin-bottom: 5px;
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

