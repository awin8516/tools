<template>
  <div class="wrapper">
    <div class="slide">
      <div class="icon" @click="showDown()">
        <!-- <img src="../../assets/down.png" /> -->
        <el-tooltip class="item" effect="dark" content="预约下载中心" placement="top">
          <svg-icon icon-class="download"></svg-icon>
        </el-tooltip>
      </div>
    </div>
    <el-dialog
      title="预约下载中心"
      :visible.sync="dialogVisible"
      width="40%"
      center
      :lock-scroll="lock_scroll"
    >
      <el-table
        :data="tableData"
        :header-cell-style="{background:'#f9f9f9'}"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column fixed label="序号" width="50" align="center" type="index">
          <template slot-scope="scope">{{(scope.$index + 1) + (page- 1) *limit}}</template>
        </el-table-column>
        <el-table-column prop="name" label="表格名称" sortable></el-table-column>
        <el-table-column prop="status" label="状态" sortable>
          <template slot-scope="scope">
            <p v-if="scope.row.status == 1">可下载</p>
            <p v-if="scope.row.status == 2">待下载</p>
            <p v-if="scope.row.status == 3">正在下载</p>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" sortable></el-table-column>
        <el-table-column prop="url" label="操作">
          <template slot-scope="scope">
            <!-- <el-button type="primary" v-if="scope.row.status == '1'"  icon="el-icon-upload" @click="iexport(scope.row)">导出数据</el-button> -->
            <div class="zip" v-show="scope.row.status == 1" @click="down(scope.row)">
              <!-- <img src="../../assets/zip.png" /> -->
              <svg-icon icon-class="export"></svg-icon>
            </div>
            <div class="zips" v-show="scope.row.status == 0">
              <!-- <img src="../../assets/zip.png" /> -->
              <svg-icon icon-class="export"></svg-icon>
            </div>
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
    </el-dialog>

    <!-- ----------------------------------------------------------------------------------------------------- -->
    <v-head></v-head>
    <v-sidebar></v-sidebar>
    <div class="content-box" :class="{'content-collapse':collapse}">
      <v-breadcrumb v-if="onRoutes !== 'echarts'"></v-breadcrumb>
      <div :class="[{ echarts: onRoutes == 'echarts' }, 'content']">
        <transition name="el-fade-in-linear" mode="out-in">
          <keep-alive :include="tagsList">
            <router-view></router-view>
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import vHead from "./Header.vue";
import vSidebar from "./Sidebar.vue";
import vBreadcrumb from "./breadcrumb.vue";
import bus from "./bus";
export default {
  data() {
    return {
      lock_scroll: true,
      tagsList: [],
      collapse: false,
      dialogVisible: false,
      tableData: [],
      page: 1,
      totals: 0,
      limit: 10,
      currentPage1: 1,
      loading: false
    };
  },
  components: {
    vHead,
    vSidebar,
    vBreadcrumb
  },
  computed: {
    // menu事件
    onRoutes() {
      let name = this.$route.name;
      return name;
    }
  },
  created() {
    // bus  兄弟组件之间的传参  也可以使用vuex
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });

    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on("tags", msg => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
    if (localStorage.getItem("pages")) {
      this.page = JSON.parse(localStorage.getItem("pages")).home || this.page;
      this.currentPage1 =
        JSON.parse(localStorage.getItem("pages")).home || this.page;
    }
  },
  methods: {
    showDown() {
      this.dialogVisible = true;
      this.getData();
    },
    getData() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "user_exit_list", {
          appid: this.$store.getters.showQuery,
          page: this.page,
          limit: this.limit
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
            this.totals = res.data.data.total;
            this.currentPage1 = res.data.data.current_page;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    handleSizeChange(val) {
      this.page = this.currentPage1;
      this.limit = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.home = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    down(item) {
      window.location.href = item.url;
    }
  }
};
</script>
<style lang='scss' scoped>
.wrapper {
  background: #f8f9fb;
}
.zip {
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 24px;
  color: #409eff;
}
.zip img {
  width: 100%;
  height: 100%;
}
.zips {
  width: 30px;
  height: 30px;
}
.zips img {
  width: 100%;
  height: 100%;
}
/* 滚动槽 */
.content::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.content::-webkit-scrollbar-track {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.06);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.08);
}
.content::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.12);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
}
.slide {
  width: 40px;
  position: fixed;
  bottom: 100px;
  right: 20px;
  z-index: 999999999;
}
.icon {
  width: 40px;
  height: 40px;
  background: $--color-primary;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  color: #fff;
  font-size: 24px;
}
.icon .svg-icon {
  color: #fff;
}
</style>
