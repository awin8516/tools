<template>
  <div class="table">
    <div class="crumbs">
      <h2>微信标签编辑</h2>
    </div>
    <div class="container">
      <el-form
        :model="form"
        ref="form"
        label-width="60px"
        @submit.native.prevent
        :rules="rules"
        label-position="left"
      >
        <el-form-item label="名称" prop="tag_name">
          <div class="select">
            <el-input type="text" v-model="form.tag_name"></el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(form)" :disabled="isDisable">提交</el-button>
          <el-button @click="back()" icon="el-icon-back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
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
      // 统一的url
      isDisable: false,
      tableData: [],
      is_panel: true,
      // 标签
      form: {
        tag_name: "",
        gruop: ""
      },
      rules: {
        tag_name: [{ required: true, message: "请输入名称", trigger: "blur" }]
      },
      // 添加还是修改
      is_edit: false,
      loading: false,
      id: "",
      totals: 0,
      page: 1,
      limit: 10,
      item: "",
      danger_type: "删除标签",
      danger_ontent: "删除客户组标签，此操作会将所有删除所有用户的客户组标签",
      currentPage1: 1,
      tagAddid: ""
    };
  },
  created() {
    // 页面初始化显示数据
    let uid;
    if (localStorage.getItem("uid")) {
      uid = JSON.parse(localStorage.getItem("uid"));
      this.form = uid;
      this.is_edit = true;
    }
    this.getData();
  },
  methods: {
    // 选择标签
    tagAdd(value) {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "autotagadd", {
          appid: this.$store.getters.showQuery,
          rule: "1",
          tagid: this.changeTagsListReagain(value),
          id: this.tagAddid
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("操作成功");
            this.getData();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    dangerSure() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "biao_qian_del", {
          id: this.item.wx_tag_id,
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("删除成功");
            this.getData();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 删除标签
    handleDelete(value) {
      this.item = value;
      this.$refs.danger.showDanger();
    },
    // 提交标签
    onSubmit(value) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.isDisable = true;
          if (this.is_edit) {
            this.$axios
              .post(this.GLOBAL.BASE_URL + "biao_qian_edit", {
                name: value.tag_name,
                id: value.wx_tag_id,
                appid: this.$store.getters.showQuery
              })
              .then(res => {
                if (res.data.code == 0) {
                  this.$message.success("修改成功");
                  // 成功后回调到列表页面
                  setTimeout(() => {
                    this.back();
                    this.isDisable = false;
                  }, 100);
                } else {
                  this.isDisable = false;
                  this.$message.error(res.data.message);
                }
              });
          } else {
            // 标签的添加
            this.$axios
              .post(this.GLOBAL.BASE_URL + "biao_qian_create", {
                name: this.form.tag_name,
                appid: this.$store.getters.showQuery,
                id: ""
              })
              .then(res => {
                if (res.data.code == 0) {
                  this.$message.success("操作成功");
                  // 成功后回调到列表页面
                  setTimeout(() => {
                    this.back();
                    this.isDisable = false;
                  }, 100);
                } else {
                  this.isDisable = false;
                  this.$message.error(res.data.message);
                }
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    back() {
      localStorage.removeItem("uid");
      this.$router.push({
        path: "/UserTag"
      });
    },
    appendtag() {},
    // 下一页。val是点击的页码  后期可新增每页显示多少条功能
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    },
    // 选择条数
    handleSizeChange(val) {
      this.page = this.currentPage1;
      this.limit = val;
      this.getData();
    },
    getData() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "biao_qian_fen_list", {
          appid: this.$store.getters.showQuery,
          page: this.page,
          limit: this.limit
        })
        .then(res => {
          if (res.data.code == 0) {
            // this.tagAddid = res.data.data.tagid[0].id;
            this.tableData = res.data.data.data;
            this.totals = res.data.data.total;
            this.loading = false;
            this.currentPage1 = res.data.data.current_page;
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

<style scoped>
.select {
  width: 300px;
}




.toptag {
  background: #337ab7 !important;
  border-radius: 5px 5px 0 0;
}

.toptag a {
  color: #fff !important;
}

.tips {
  font-size: 14px;
  color: #ccc;
}

.qtags {
  width: 100%;
  display: flex;
}

.panel {
  width: 250px;
  height: 100%;
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  display: block;
}

.tagPanel {
  display: flex;
}

.line {
  width: 20px;
}

.tagItem {
  width: 250px;
  margin-top: 20px;
}

.tagItem ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.tagItem ul li {
  width: 100%;
  height: 35px;
  position: relative;
}

.tagItem ul li:hover {
  background: rgb(233, 231, 231);
}

.tagItem ul li i {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 10;
}

.tagItem ul li a {
  display: flex;
  align-items: center;
  color: #333;
  padding-left: 10px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #ddd;
  z-index: 9;
}

.tagItem ul li:last-child a {
  border-bottom: none;
}

.tagstable {
  width: 100%;
  height: 100%;
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
