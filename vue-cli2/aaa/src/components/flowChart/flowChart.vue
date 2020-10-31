<template>
  <div class="table">
    <div class="crumbs">
      <h2>流程图</h2>
    </div>
    <div class="container">
      <!-- 顶栏 -->
      <!-- <el-row>
        <el-col :span="10">
          <el-input v-model="searchInput" clearable @clear="list({})" placeholder="请输入流程名称搜索">
            <el-button slot="append" icon="el-icon-search" @click="searchProcessName"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3" :offset="1">
          <el-button icon="el-icon-plus" type="primary" @click="newProcess">新增流程</el-button>
        </el-col>
      </el-row>-->
      <div class="handle-box">
        <el-form :inline="true">
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="新增流程" placement="top">
              <el-button icon="el-icon-plus" type="primary" @click="newProcess">新增流程</el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="searchInput" clearable @clear="list({})" placeholder="请输入流程名称搜索"></el-input>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="搜索" placement="top">
              <el-button type="primary" @click="searchProcessName">搜索</el-button>
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
      </div>
      <!-- 表格数据 -->
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}" border>
        <el-table-column prop="process_name" label="名称">
          <template slot-scope="scope">
            <div v-if="index != scope.$index">
              <el-link
                type="primary"
                @click="enterFlowchart($event,scope.row)"
              >{{scope.row.process_name}}</el-link>
              <i class="el-icon-edit remarkIcon" @click="nameModify(scope)"></i>
            </div>
            <el-input
              v-model="scope.row.process_name"
              v-else
              @blur="finished"
              :ref="`input${scope.$index}`"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop label="最后更新"></el-table-column>
        <el-table-column
          prop="process_status"
          label="状态"
          :filters="[{text:'进行中',value:'running'},{text:'停止',value:'stop'},{text:'草稿',value:'draft'}]"
          :filter-method="filterHandler"
        >
          <template slot-scope="scope">
            <div>
              <i
                class="el-icon-bell"
                :class="{stop:scope.row.process_status=='stop',running:scope.row.process_status=='running'}"
              ></i>
              <span v-if="scope.row.process_status=='draft'">草稿</span>
              <span v-else-if="scope.row.process_status=='running'">进行中</span>
              <span v-else-if="scope.row.process_status=='stop'">停止</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注">
          <template slot-scope="scope">
            <div class="remark">{{scope.row.remark}}</div>
            <i class="el-icon-edit remarkIcon" @click="remarkModify(scope.row)"></i>
          </template>
        </el-table-column>
        <el-table-column prop label="累计进入"></el-table-column>
        <el-table-column prop label="进行中"></el-table-column>
        <el-table-column prop label="结束"></el-table-column>
        <el-table-column label="操作" width="350">
          <template slot-scope="scope">
            <el-button type="primary" @click="enterFlowchart($event,scope.row)">修改</el-button>
            <el-button @click="enterFlowchart($event,scope.row)">详情</el-button>
            <el-button
              type="warning"
              v-if="scope.row.process_status == 'running'"
              @click="changeProcessStatus($event,scope.row)"
            >停止</el-button>
            <el-button v-else type="success" @click="changeProcessStatus($event,scope.row)">启动</el-button>
            <el-button type="danger" @click="changeProcessStatus($event,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>

    <el-dialog :visible.sync="is_showAdd" title="新增流程">
      <el-form label-position="left" ref="process" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="流程名称:" prop="processName">
          <el-input v-model="form.processName" placeholder="请输入流程名称"></el-input>
        </el-form-item>
        <el-form-item label="备注信息:" prop="processRemark">
          <el-input type="textarea" :rows="4" v-model="form.processRemark" placeholder="请输入流程备注信息"></el-input>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="8" :offset="16">
              <el-button-group>
                <el-button @click="is_showAdd = false">取消</el-button>
                <el-button type="primary" @click="addProcess">新增</el-button>
              </el-button-group>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="is_showRemark" title="备注信息">
      <div>
        <el-row>
          <el-col :span="24">
            <el-input type="textarea" :rows="10" v-model="row.remark"></el-input>
          </el-col>
        </el-row>
        <el-row class="btns">
          <el-col :span="6" :offset="18">
            <el-button-group>
              <el-button @click="is_showRemark = false">取消</el-button>
              <el-button type="primary" @click="modifyRemark">修改</el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import API from "@/api/api";
import toolkit from "@/utils/toolkit";
export default {
  data() {
    return {
      searchInput: "",
      total: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      index: -1,
      is_showAdd: false,
      is_showRemark: false,
      is_showinput: true,
      row: "",
      form: {
        processName: "",
        processRemark: ""
      },
      processRemark: "",
      rules: {
        processName: [
          { required: true, message: "请填写流程名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    API.changeAppid("wx6027cd322f9a4d75");
    this.list({});

    this.cantdelete = toolkit.debounce(
      () => {
        this.$message({
          message: "不能删除进行中的流程，请先停止流程！",
          type: "warning"
        });
      },
      3000,
      true
    );
    this.cantenter = toolkit.debounce(
      () => {
        this.$message({
          message: "不能进入进行中的流程，请先停止流程！",
          type: "warning"
        });
      },
      300,
      true
    );
  },
  methods: {
    reset() {
      this.searchInput = "";
      this.list({});
    },
    searchProcessName() {
      this.currentPage = 1;
      this.searchInput ? this.list({}) : "";
    },
    handleCurrentChange(e) {
      this.currentPage = e;
      this.list({});
    },
    handleSizeChange(e) {
      this.pageSize = e;
      this.list({});
    },
    cantdelete() {},
    cantenter() {},
    changeProcessStatus(e, row) {
      let text = e.target.innerText,
        name = row.process_name;
      this.row = row;

      switch (text) {
        case "停止":
          this.$confirm("此操作将停止[" + name + "]流程, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.row.process_status = "stop";
              this.edit(this.row).then(() => {
                this.$message({
                  type: "success",
                  message: "流程图停止成功!"
                });
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消操作"
              });
            });

          break;
        case "启动":
          this.$confirm("此操作将启动[" + name + "]流程, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.row.process_status = "running";
              this.edit(this.row).then(() => {
                this.$message({
                  type: "success",
                  message: "流程图启动成功!"
                });
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消操作"
              });
            });

          break;
        case "删除":
          if (this.row.process_status == "running") {
            this.cantdelete();
            return;
          }
          this.$confirm("此操作将删除[" + name + "]流程, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.row.process_status = "deleted";
              this.edit(this.row).then(() => {
                if (
                  this.tableData.length === 1 &&
                  this.currentPage > 1
                ) {
                  --this.currentPage;
                }
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.list({});
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });

          break;
      }
    },
    enterFlowchart(e, row) {
      let text = e.target.innerText,
        state = 1,
        id = row._id,
        status = row.process_status;

      if (status == "running") {
        this.cantenter();
        return;
      }

      if (text == "修改") {
        state = 2;
      }
      this.$router.push({
        path: "/flowChartEdit",
        query: { _id: id, state: state }
      });
    },
    addProcess() {
      this.add({
        process_name: this.form.processName,
        remark: this.form.processRemark
      });
    },
    newProcess() {
      this.form.processName = "";
      this.form.processRemark = "";
      this.is_showAdd = true;
    },
    remarkModify(row) {
      this.is_showRemark = true;
      this.row = row;
    },
    nameModify(scope) {
      this.row = scope.row;
      this.index = scope.$index;
      this.$nextTick(() => {
        this.$refs[`input${this.index}`].focus();
      });
    },
    modifyRemark() {
      this.edit(this.row).then(() => {
        this.is_showRemark = false;
        this.list({});
      });
    },
    finished() {
      this.edit(this.row).then(() => {
        this.index = -1;
        this.list({});
      });
    },
    filterHandler(value, row, column) {
      let property = column["property"];
      return row[property] == value;
    },
    //api --start
    edit({ process_status, process_name, remark, _id }) {
      let data = {};
      data._id = _id;
      data.process_status = process_status;
      data.process_name = process_name;
      data.remark = remark;
      return API.edit(data).then(res => {
      });
    },
    list({
      process_name = this.searchInput,
      page = this.currentPage,
      limit = this.pageSize
    }) {
      let data = {};
      data.limit = limit;
      data.page = page;
      data.process_name = process_name;
      return API.list(data).then(res => {
        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    },
    add({ process_name, remark, process_status = "draft" }) {
      let data = {};
      data.process_name = process_name;
      data.process_status = process_status;
      data.remark = remark;
      return API.add(data).then(res => {
        this.list({});
        this.is_showAdd = false;
      });
    }
  }
};
</script>

<style scoped>
.el-icon-bell {
  margin-right: 8px;
}
.el-icon-bell.stop {
  color: red;
}
.el-icon-bell.running {
  color: #67c23a;
}
.remark {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.remarkIcon {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  color: #409eff;
}
.remarkIcon:hover {
  color: #67c23a;
}
.btns {
  margin-top: 10px;
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

