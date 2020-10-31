<template>
  <div class="table">
    <div class="crumbs">
      <h2>扫码记录</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="recodeObj.name" placeholder="请输入二维码名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="recodeObj.openid" placeholder="请输入搜索openid"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="qrinfoRule" placeholder="请选择类型" @change="getType(qrinfoRule)">
              <el-option
                v-for="item in qrinfoRules"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="搜索" placement="top">
              <el-button type="primary" @click="search()">搜索</el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="重置搜索条件" placement="top">
              <el-button
                type="primary"
                icon="el-icon-refresh"
                @click="reset()"
              >重置</el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="导出当前搜索结果" placement="top">
              <el-button type="primary" icon="el-icon-upload" @click="iExport()">导出</el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 200]"
          :page-size="recodeObj.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="recodeObj.totals"
          :current-page.sync="recodeObj.currentPage1"
        ></el-pagination>
      </div>
      <el-table
        :data="tableData"
        :header-cell-style="{background:'#f9f9f9'}"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column fixed label="序号" width="50" align="center" type="index">
          <template slot-scope="scope">{{(scope.$index + 1) + (recodeObj.page- 1) *recodeObj.limit}}</template>
        </el-table-column>
        <el-table-column prop="name" label="二维码名称" sortable width="200">
          <template slot-scope="scope">
            <span v-html="(scope.row.qrcode.name)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" sortable width="150">
          <template slot-scope="scope">
            <span v-html="typeType(scope.row.type)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="用户" sortable width="200">
          <template slot-scope="scope">
            <div class="qrurl" @click="show(scope.row)">
              <img :src="scope.row.fan.headimgurl" />
              <span>{{scope.row.fan.nickname}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" sortable width="250">
          <template slot-scope="scope">
            <p>{{scope.row.mobile}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="openid" label="OpenID" sortable width="300">
          <template slot-scope="scope">
            <span v-html="(scope.row.openid)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="扫码时间" sortable>
          <template slot-scope="scope">
            <span v-html="(scope.row.created_at)"></span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 200]"
          :page-size="recodeObj.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="recodeObj.totals"
          :current-page.sync="recodeObj.currentPage1"
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
    return {
      loading: false,
      appid: "",
      tableData: [],
      qrinfoRule: "",
      qrinfoRules: [
        {
          label: "请选择",
          value: "0"
        },
        {
          label: "已关注扫码",
          value: "1"
        },
        {
          label: "扫码后关注",
          value: "2"
        }
      ],
      recodeObj: {
        appid: "",
        name: "",
        rule: "",
        time: "",
        openid: "",
        type: "",
        page: 1,
        totals: 0,
        limit: 10,
        currentPage1: 0
      },
      select_name: "",
      select_openid: ""
    };
  },
  created() {
    if (localStorage.getItem("pages")) {
      this.recodeObj.page =
        JSON.parse(localStorage.getItem("pages")).qRCodeRecord ||
        this.recodeObj.page;
      this.recodeObj.currentPage1 =
        JSON.parse(localStorage.getItem("pages")).qRCodeRecord ||
        this.recodeObj.page;
    }

    this.recodeObj.appid = this.$store.getters.showQuery;
    this.getData();
  },
  computed: {
    data() {
      return this.tableData;
    }
  },
  methods: {
    // 点击用户头像，调用user_get接口  获取用户的信息，，
    show(row) {
      if (parseInt(localStorage.getItem("status")) == 1) {
        window.open(this.GLOBAL.USEROPEN + window.btoa(row.fan._id), "_blank");
      } else if (parseInt(localStorage.getItem("status")) == 2) {
        // 管理员
      }
    },
    // 导出
    iExport() {
      var str = `${this.GLOBAL.BASE_URL}qrrecordeexport?${this.encodeUrl(
        this.recodeObj
      )}`;
      window.location.href = str;
    },
    reset() {
      this.recodeObj.name = "";
      this.recodeObj.rule = "";
      this.recodeObj.time = "";
      this.recodeObj.openid = "";
      this.recodeObj.type = "";
      this.recodeObj.page = "1";
      this.qrinfoRule = "";
      this.getData();
    },
    search() {
      this.getData();
    },
    // 转换服务类型
    typeType(value) {
      if (parseInt(value) == 1) {
        return "已关注扫码";
      } else if (parseInt(value) == 2) {
        return "扫码后关注";
      } else if (parseInt(value) == 0) {
        return "图片";
      }
    },
    getType(value) {
      this.recodeObj.page = "1";
      this.recodeObj.type = value;
      this.getData();
    },
    // 选择条数
    handleSizeChange(val) {
      this.recodeObj.page = this.recodeObj.currentPage1;
      this.recodeObj.limit = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.recodeObj.page = val;
      this.getData();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.qRCodeRecord = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    getData() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "recodelist", this.recodeObj)
        .then(res => {
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
            this.recodeObj.totals = res.data.data.total;
            this.recodeObj.currentPage1 = res.data.data.current_page;
            if (this.page > res.data.data.last_page) {
              this.page = res.data.data.last_page;
              this.getData();
            }
            this.loading = false;
          } else {
            this.$message.error(res.data.message);
          }
        });
    }
  }
};
</script>
<style scoped>
/* p---------------- */
.qrurl {
  width: auto;
  height: auto;
}
.qrurl img {
  width: 30px;
  height: auto;
  margin-right: 10px;
  cursor: pointer;
  vertical-align: middle;
}
/* ---------------- */
.select {
  width: 250px;
  display: inline-block;
  margin-right: 15px;
}
.select1 {
  margin-left: 0;
}

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
