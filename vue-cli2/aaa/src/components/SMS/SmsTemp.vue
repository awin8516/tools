<template>
  <div class="table">
    <div class="crumbs">
      <h2>短信模板列表</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :inline="true">
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="新建短信模板" placement="top">
              <el-button type="primary" icon="el-icon-plus" @click="addSms()">新建短信模板</el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="使用公用短信模板" placement="top">
              <el-button
                type="primary"
                icon="el-icon-folder-opened"
                @click="getPubTemplate()"
              >查看公用模板</el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="签名管理" placement="top">
              <el-button type="primary" icon="el-icon-document-remove" @click="smsManage()">签名管理</el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>

        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="searchWords" placeholder="请输入模板名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="搜索" placement="top">
              <el-button type="primary" @click="search">搜索</el-button>
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
        </el-form>
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
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        :row-class-name="tableRowClassName"
        :header-cell-style="{background:'#f9f9f9'}"
      >
        <el-table-column label="序号" width="100">
          <template slot-scope="scppe">{{(scppe.$index + 1) + (page- 1) *limit}}</template>
        </el-table-column>
        <el-table-column prop="template_name" label="模板名称" width="180" sortable>
          <template slot-scope="scope">
            <p v-if="scope.row.template_code == 'SMS_13335101'">公用模板</p>
            <p v-else>{{scope.row.template_name}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="申请说明" sortable></el-table-column>
        <el-table-column prop="verify_status" label="模板申请状态" sortable>
          <template slot-scope="scope">
            <p v-if="scope.row.verify_status == 0">审核中</p>
            <p v-if="scope.row.verify_status == 1">通过</p>
            <p v-if="scope.row.verify_status == 2">失败</p>
          </template>
        </el-table-column>
        <el-table-column prop="verify_reason" label="状态说明" sortable></el-table-column>
        <el-table-column prop="created_at" label="创建时间" sortable></el-table-column>
        <el-table-column label="点击群发">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-button
              v-if="scope.row.verify_status == 1"
              type="primary"
              @click="handleEdit(scope.row)"
            >群发</el-button>
            <el-button
              v-if="scope.row.verify_status != 1"
              type="primary"
              @click="handleReEdit(scope.row)"
            >重新提交</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="删除">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete-solid" @click="handleDelete(scope.row)"></el-button>
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
    <v-danger
      ref="danger"
      @dangerSure="dangerSure"
      :danger_type="danger_type"
      :danger_ontent="danger_ontent"
    ></v-danger>

    <el-dialog
      title="公用模板"
      style="100%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="modal"
    >
      <el-table
        :data="PublicData"
        :header-cell-style="{background:'#f9f9f9'}"
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="template_name" label="模板名称" width="100" sortable>
          <template slot-scope="scope">
            <p v-if="scope.row.template_code == 'SMS_13335101'">公用模板</p>
            <p v-else>{{scope.row.template_name}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="申请说明" sortable></el-table-column>
        <el-table-column prop="verify_status" label="模板申请状态" sortable>
          <template slot-scope="scope">
            <p v-if="scope.row.verify_status == 0">审核中</p>
            <p v-if="scope.row.verify_status == 1">通过</p>
            <p v-if="scope.row.verify_status == 2">失败</p>
          </template>
        </el-table-column>
        <el-table-column prop="verify_reason" label="状态说明" sortable></el-table-column>
        <el-table-column prop="created_at" label="创建时间" sortable></el-table-column>
        <el-table-column label="点击群发">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-button
              :disabled="scope.row.verify_status != 1"
              type="primary"
              @click="handleEdit(scope.row)"
            >群发</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="删除">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete-solid" @click="handleDelete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import vDanger from "../dialogs/danger.vue";
export default {
  components: {
    vDanger
  },
  data() {
    return {
      tableData: [],
      PublicData: [],
      page: 1,
      limit: 10,
      totals: 0,
      currentPage: 1,
      loading: false,
      danger_type: "短信模板",
      danger_ontent: "删除短信模板，此操作会删除短信模板",
      item: {},
      searchWords: "",
      dialogVisible: false,
      modal: false
    };
  },
  created() {
    if (localStorage.getItem("pages")) {
      this.page =
        JSON.parse(localStorage.getItem("pages")).smsTemp || this.page;
      this.currentPage =
        JSON.parse(localStorage.getItem("pages")).smsTemp || this.page;
    }
    this.smslist();
  },
  methods: {
    smsManage() {
      this.$router.push({
        path: "/SmsList"
      });
    },
    // 重置
    reset() {
      this.searchWords = "";
      this.search();
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.template_code === "SMS_13335101") {
        return "warning-row";
      } else {
        return "";
      }
    },
    getPubTemplate() {
      this.dialogVisible = true;
      this.PublicData = [];
      this.$axios
        .post(this.GLOBAL.BASE_URL + "getpublictemplate", {
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            this.PublicData.push(res.data.data);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    handleDelete(item) {
      this.$refs.danger.showDanger();
      this.item = item;
    },
    // 删除
    dangerSure() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "smstemdel", {
          appid: this.$store.getters.showQuery,
          id: this.item.id,
          template_code: this.item.template_code
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("删除成功");
            this.smslist();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 重新提交
    handleReEdit(item) {
      localStorage.setItem("st", JSON.stringify(item));
      this.$router.push({
        path: "/SmsAddTemp"
      });
    },
    handleEdit(item) {
      localStorage.setItem("tid", window.btoa(item.id));
      this.$router.push({
        path: "/SmsTempEdit"
      });
    },
    // 新建
    addSms() {
      this.$router.push({
        path: "/SmsAddTemp"
      });
    },
    // 搜索
    search() {
      this.smslist();
    },
    // 选择条数
    handleSizeChange(val) {
      this.page = this.currentPage;
      this.limit = val;
      this.smslist();
    },
    // fanye
    handleCurrentChange(val) {
      this.page = val;
      this.smslist();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.smsTemp = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    smslist() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "smslist", {
          appid: this.$store.getters.showQuery,
          page: this.page,
          limit: this.limit,
          name: this.searchWords
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
            this.totals = res.data.data.total;
            this.currentPage = res.data.data.current_page;
            if (this.page > res.data.data.last_page) {
              this.page = res.data.data.last_page;
              this.smslist();
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    }
  }
};
</script>
<style>
.el-table .warning-row {
  background: #dafdc5;
}

.el-table .success-row {
  background: #dafdc5;
}
</style>
<style scoped>
.inputArea {
  margin-right: 15px;
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

