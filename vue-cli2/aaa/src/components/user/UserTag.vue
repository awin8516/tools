<template>
  <div class="table">
    <div v-if="is_panel">
      <div class="crumbs">
        <h2>微信标签</h2>
      </div>
      <div class="container">
        <div class="tagstable">
          <div class="handle-box">
            <el-tooltip class="item" effect="dark" content="添加标签" placement="top">
              <el-button
                type="primary"
                icon="el-icon-plus"
                class="handle-del mr10"
                @click="appendtag()"
              >添加标签</el-button>
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
            <el-table-column prop="tag_name" label="名称" sortable></el-table-column>
            <el-table-column prop="ret_count" label="绑定人数" sortable></el-table-column>
            <!-- <el-table-column prop="ret_count" label="所属组" width="180"></el-table-column> -->
            <el-table-column prop label width="180">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="查看用户" placement="top">
                  <el-button type="primary" icon="el-icon-user" @click="handleUser(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="修改标签" placement="top">
                  <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除标签" placement="top">
                  <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
                </el-tooltip>
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
              :current-page.sync="currentPage1"
            ></el-pagination>
          </div>
        </div>
      </div>
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
      // 添加还是修改
      is_edit: false,
      loading: false,
      id: "",
      totals: 0,
      page: 1,
      limit: 10,
      item: "",
      danger_type: "删除微信标签",
      danger_ontent: "删除微信标签，此操作会将所有删除所有用户的微信标签",
      currentPage1: 1,
      tagAddid: ""
    };
  },
  created() {
    if (localStorage.getItem("pages")) {
      this.page =
        JSON.parse(localStorage.getItem("pages")).userTag || this.page;
      this.currentPage1 =
        JSON.parse(localStorage.getItem("pages")).userTag || this.page;
    }
    // 页面初始化显示数据
    localStorage.removeItem("uid");
    this.getData();
  },
  methods: {
    // 查看用户
    handleUser(item) {
      console.log(item);
      localStorage.setItem("tid", window.btoa(item.wx_tag_id));
      // window.open(
      //   `${this.GLOBAL.DOMAIN}home.html#/UserInfo`,
      //   "_blank"
      // );
      this.$router.push({
        path:'/UserInfo'
      })
    },
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
      this.isDisable = true;
      if (this.form.tag_name == "") {
        this.$message.warning("标签名称不能为空");
        this.isDisable = false;
      } else {
        if (this.is_edit) {
          // 标签的修改
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
      }
    },
    handleEdit(value) {
      // 修改标签。将这一行的数据取出来塞进form  以便拿到数据进行修改
      localStorage.setItem("uid", JSON.stringify(value));
      this.$router.push({
        path: "/UserTagEdit"
      });
    },
    back() {
      // 添加或者修改标签成功后的回调
      this.is_panel = true;
      // 充值
      this.is_edit = false;
      // 再次渲染页面
      this.getData();
    },
    appendtag() {
      this.$router.push({
        path: "/UserTagEdit"
      });
    },
    // 下一页。val是点击的页码  后期可新增每页显示多少条功能
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.userTag = val;
      localStorage.setItem("pages", JSON.stringify(pages));
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
</style>
