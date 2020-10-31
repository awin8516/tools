<template>
  <div class="table">
    <div class="crumbs">
      <h2>子账号管理</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="handle-del mr10"
          @click="addAccount()"
        >新建</el-button>
      </div>
      <div class="pagination"></div>
      <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="100"></el-table-column>
        <el-table-column prop="name" label="子账户" width="180"></el-table-column>
        <el-table-column prop="remark" label="备注">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="点击修改备注"
              placement="top-start"
              v-if="scope.row.remark"
            >
              <div class @click="editRemark(scope.row)">{{scope.row.remark}}</div>
            </el-tooltip>
            <el-button v-else @click="editRemark(scope.row)">添加备注</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间"></el-table-column>
        <el-table-column prop="name" label="状态" width="100">
          <template slot-scope="scope">
            <p v-if="scope.row.status == 1">不可用</p>
            <p v-if="scope.row.status == 0">可用</p>
          </template>
        </el-table-column>
        <el-table-column prop="id5" label="权限管理">
          <template slot-scope="scope">
            <el-button type="primary" @click="RightMana(scope.row)">权限管理</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="id6" label="账号记录">
          <template slot-scope="scope">
            <el-button type="primary" @click="ChildOpertion(scope.row)">账号记录</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="id7" label="修改密码">
          <template slot-scope="scope">
            <el-button type="primary" @click="changePas(scope.row)">修改密码</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="id8" label="删除">
          <template slot-scope="scope">
            <el-button type="danger" @click="deleteHandle(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="id9" label="停用">
          <template slot-scope="scope">
            <el-button
              type="success"
              @click="useHandle('on',scope.row)"
              v-if="scope.row.status == 1"
            >启用</el-button>
            <el-button
              type="info"
              @click="useHandle('off',scope.row)"
              v-if="scope.row.status == 0"
            >停用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20,50,100,200]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
        ></el-pagination>
      </div>
    </div>

    <el-dialog
      title="新建子账号"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="modal"
    >
      <el-form ref="form" :model="form" label-width="100px" :rules="rules" label-position="left">
        <el-form-item label="子账号" prop="name">
          <div class="inputarea">
            <el-input v-model="form.name" placeholder="请输入账号"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="子账号密码" prop="password">
          <div class="inputarea">
            <el-input v-model="form.password" placeholder="请输入6位密码"></el-input>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close('cancel')">取 消</el-button>
        <el-button type="primary" @click="close('sure')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改子账户密码"
      :visible.sync="dialogVisible_ps"
      width="30%"
      :close-on-click-modal="modal"
      v-if="dialogVisible_ps"
    >
      <el-form ref="form" :model="form_ps" label-width="150px" :rules="rules" label-position="left">
        <el-form-item label="账号" prop="name">
          <div class="inputarea">
            <el-input v-model="form_ps.name" disabled="disabled"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="请输入新密码" prop="password">
          <div class="inputarea">
            <el-input v-model="form_ps.password" placeholder="请输入6位密码"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="请再次输入新密码" prop="repassword">
          <div class="inputarea">
            <el-input v-model="form_ps.repassword" placeholder="请重新输入6位密码"></el-input>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeClose('cancel')">取 消</el-button>
        <el-button type="primary" @click="changeClose('sure')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="备注"
      :visible.sync="dialogVisible_remakr"
      width="30%"
      v-if="dialogVisible_remakr"
      :close-on-click-modal="modal"
    >
      <el-form
        ref="form_remark"
        :model="form_remark"
        label-width="100px"
        :rules="rules"
        label-position="left"
      >
        <el-form-item label="请输入备注" prop="remark">
          <div class>
            <el-input v-model="form_remark.remark" placeholder="请输入备注" require></el-input>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_remakr = false">取 消</el-button>
        <el-button type="primary" @click="addRemark()">确 定</el-button>
      </span>
    </el-dialog>
    <v-danger
      ref="danger"
      @dangerSure="dangerSure"
      :danger_type="danger_type"
      :danger_ontent="danger_ontent"
    ></v-danger>
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
      modal: false,
      tableData: [],
      loading: false,
      totals: 0,
      page: 1,
      limit: 10,
      currentPage: 1,
      dialogVisible: false,
      dialogVisible_ps: false,
      dialogVisible_remakr: false,
      form: {
        name: "",
        password: ""
      },
      form_ps_name: "admin",
      form_ps: {
        password: "",
        repassword: ""
      },
      form_remark: {
        remark: ""
      },
      rules: {
        name: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码不能小于6位", trigger: "blur" }
        ],
        repassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { min: 6, message: "密码不能小于6位", trigger: "blur" }
        ],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }]
      },
      labelPosition: "left",
      danger_type: "子账号",
      danger_ontent: "删除子账号，此操作会将所有删除所有用户的子账号",
      item: "",
      remark: ""
    };
  },
  created() {
    this.getList();
  },
  methods: {
    addRemark() {
      this.$refs["form_remark"].validate(valid => {
        if (valid) {
          this.$axios
            .post(this.GLOBAL.BASE_URL + "editechildremark", {
              id: this.item.id,
              remark: this.form_remark.remark
            })
            .then(res => {
              this.dialogVisible_remakr = false;
              if (res.data.code == 0) {
                this.$message.success("操作成功");
                this.getList();
                this.form_remark.remark='';
                this.$refs["form_remark"].resetFields();
              } else {
                this.$message.error(res.data.message);
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 修改备注
    editRemark(item) {
      this.item = item;
      this.form_remark.remark = item.remark || "";
      this.dialogVisible_remakr = true;
    },
    RightMana(row) {
      localStorage.setItem("pid", window.btoa(row.id));
      this.$router.push({
        name: "RightsMana"
      });
    },
    // 账号记录
    ChildOpertion(row) {
      localStorage.setItem("cid", window.btoa(row.id));
      this.$router.push({
        name: "ChildOpertion"
      });
    },
    useHandle(type, row) {
      let status;
      if (type == "on") {
        status = 0;
      } else if (type == "off") {
        status = 1;
      }
      this.$axios
        .post(this.GLOBAL.BASE_URL + "stopchild", {
          id: row.id,
          status: status
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("操作成功");
            this.getList();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 删除
    dangerSure() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "delechild", {
          id: this.item.id,
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("操作成功");
            this.getList();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 删除
    deleteHandle(value) {
      this.item = value;
      this.$refs.danger.showDanger();
    },
    changeClose(type) {
      if (type == "cancel") {
        this.dialogVisible_ps = false;
      } else if (type == "sure") {
        if (this.form_ps.password == "") {
          this.$message.warning("密码不能为空");
          return;
        } else if (this.form_ps.repassword == "") {
          this.$message.warning("密码不能为空");
          return;
        }
        delete this.form_ps.name;
        if (this.form_ps.password != this.form_ps.repassword) {
          this.$message.warning("两次密码输入不一致，请重新输入");
          return;
        }
        if (
          this.form_ps.password.length < 6 ||
          this.form_ps.repassword.length < 6
        ) {
          this.$message.warning("密码不能小于6位");
          return;
        }
        this.$axios
          .post(this.GLOBAL.BASE_URL + "editechild", this.form_ps)
          .then(res => {
            if (res.data.code == 0) {
              this.dialogVisible_ps = false;
              this.getList();
            } else {
              this.$message.error(res.data.message);
            }
          });
      }
    },
    // 修改密码
    changePas(item) {
      this.form_ps.password = "";
      this.form_ps.repassword = "";
      this.form_ps.name = item.name;
      this.form_ps.id = item.id;
      this.dialogVisible_ps = true;
    },
    // 选择条数
    handleSizeChange(val) {
      this.page = this.currentPage;
      this.limit = val;
      this.getList();
    },
    // fanye
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.account = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    // 获取列表
    getList() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "getchildlist", {
          page: this.page,
          limit: this.limit
        })
        .then(res => {
          if (res.data.code == 0) {
            this.loading = false;
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
    },
    addAccount() {
      this.form = {
        name: "",
        password: ""
      };
      this.dialogVisible = true;
    },
    // 关闭弹窗
    close(type) {
      if (type == "cancel") {
        this.dialogVisible = false;
      } else if (type == "sure") {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.$axios
              .post(this.GLOBAL.BASE_URL + "addchild", this.form)
              .then(res => {
                if (res.data.code == 0) {
                  this.dialogVisible = false;
                  this.getList();
                } else {
                  this.$message.error(res.data.message);
                }
              });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.inputarea {
  width: 200px;
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