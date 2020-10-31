<template>
  <div class="table">
    <div class="crumbs">
      <h2>粉丝自定义资料</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-tooltip class="item" effect="dark" content="返回用户详情" placement="top">
          <el-button type="success" @click="back()" icon="el-icon-back">返回用户详情</el-button>
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
        <el-table-column fixed label="序号" width="50" align="center" type="index"></el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="district" label="地址" width="180"></el-table-column>
        <el-table-column prop="key" label="key" width="180"></el-table-column>
        <el-table-column prop="name" label="name" width="180"></el-table-column>
        <el-table-column prop="openid" label="openid" width="180"></el-table-column>
        <el-table-column prop="phone" label="联系方式" width="180"></el-table-column>
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">{{scope.row.sex == 0 ? "男士" : "女士"}}</template>
        </el-table-column>
        <el-table-column label="活动名称">
          <template slot-scope="scope">{{scope.row.weboath.name}}</template>
        </el-table-column>
        <!-- <el-table-column prop label="消息管理">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" @click="message(scope.row)"></el-button>
            </template>
          </el-table-column>
          <el-table-column prop label="电商信息">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-data-line" @click="getBusiness(scope.row)"></el-button>
            </template>
        </el-table-column>-->
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
export default {
  data() {
    return {
      limit:10,
      totals:0,
      currentPage:0,
      page: 1,
      uid: "",
      tableData: [],
      loading: false,
      total: 0,
      tagList: [],
      fit: "cover"
    };
  },
  created() {
    if (localStorage.getItem("pages")) {
      this.page = JSON.parse(localStorage.getItem("pages")).fansData  || this.page;
    }


    this.uid = window.btoa(localStorage.getItem("uid").split("?")[0]);
    this.useractivity();
  },
  methods: {
    // 获取粉丝资料列表
    useractivity() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "useractivity", {
          appid: this.$store.getters.showQuery,
          id: this.uid
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 返回用户信息列表页
    back() {
      this.$router.push({
        path: "/UserPortrait"
      });
    },
    // 显示标签名称
    showTag(value) {
      // console.log(value)
      let result = [];
      for (var j = 0; j < value.length; j++) {
        for (var i = 0; i < this.tagList.length; i++) {
          if (value[j] == this.tagList[i].value) {
            result.push(this.tagList[i].label);
          }
        }
      }
      return result;
    },
    // 获取朋友列表
    friendlist() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "friendlist", {
          appid: this.$store.getters.showQuery,
          page: this.page,
          id: this.uid
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
            this.total = res.data.data.total;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 获取微信标签
    biao_qian_list() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "biao_qian_list", {
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tagList = this.changeTagsList(res.data.data);
            this.friendlist();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 将json数据中的id和name转化为value和label
    changeTagsList(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/id/g, "value"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/name/g, "label"));
      return obj2;
    },
    // 翻页
    handleCurrentChange(val) {
      this.page = val;
      this.getalldiytag();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.fansData = val;
      localStorage.setItem("pages",JSON.stringify(pages));
    },
    handleSizeChange(val) {
      this.searchObj.page = this.searchObj.currentPage;
      this.searchObj.limit = val;
      this.getList();
    },
    // 获取自定义标签
    getalldiytag() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "getalldiytag", {
          appid: this.$store.getters.showQuery,
          page: this.page,
          limit: this.limit
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tagList = this.tagList.concat(
              this.changeDiyTagsList(res.data.data.data)
            );
            this.totals = res.data.data.total;
            this.currentPage = res.data.data.current_page;
            if (this.page > res.data.data.last_page) {
              this.page = res.data.data.last_page;
              this.getList();
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    }
  }
};
</script>

<style lang='scss' scoped>
.remark {
  text-align: center;
  background: #79c1fb;
  border-radius: 2px;
  margin: auto;
  color: #fff;
  margin-bottom: 4px;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  padding: 4px;;
}
.remarks {
  display: inline-block;
  margin-right: 5px;
}
.qrurl {
  width: 50px;
  height: 50px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}
.qrurl .getheadimg {
  width: 60px;
  height: 50px;
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

