<template>
  <div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totals"
        :current-page.sync="currentPage1"
      ></el-pagination>
    </div>
    <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}" border class="table" ref="multipleTable">
      <el-table-column fixed label="序号" width="50" align="center" type="index">
        <template slot-scope="scope">{{(scope.$index + 1) + (page- 1) *limit}}</template>
      </el-table-column>
      <el-table-column prop="words" label="触发关键词" sortable width="260"></el-table-column>
      <el-table-column prop="remark" label="备注" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tagid" label="标签" sortable width="200">
        <template slot-scope="scope">
          <p class="remark" v-for="(item,index) in showTag(scope.row.tagid)" :key="index">{{item}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="trigger_count" label="触发次数" sortable width="120">
        <template slot-scope="scope">
          <span>{{scope.row.trigger_count}}</span>
        </template>
      </el-table-column>
      <el-table-column label="选择">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="选择" placement="top">
            <el-button type="primary" icon="el-icon-check" @click="handleSure(scope.row)">点击选取</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totals"
        :current-page.sync="currentPage1"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      page: 1,
      limit: 10,
      totals: 0,
      currentPage1: 1
    };
  },
  created() {
    if (localStorage.getItem("pages")) {
      this.page =
        JSON.parse(localStorage.getItem("pages")).keywordData || this.page;
      this.currentPage1 =
        JSON.parse(localStorage.getItem("pages")).keywordData || this.page;
    }
  },
  methods: {
    // 标签
    showTag(item) {
      item = JSON.parse(item);
      item = item || [];
      let result = [];
      item.forEach(ele => {
        result.push(ele.name);
      });
      return result;
    },
    handleSizeChange(val) {
      this.page = this.currentPage1;
      this.limit = val;
      this.keygroup();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.keygroup();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.keywordData = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    keygroup() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "keyword_list", {
          appid: this.$store.getters.showQuery,
          page: this.page,
          limit: this.limit
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
            this.totals = res.data.data.total;
            this.currentPage1 = res.data.data.current_page;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    handleSure(item) {
      this.$emit("listenKeyWord", item, true); //
    }
  }
};
</script>
<style scoped>
.remark {
  display: inline-flex;
  width: auto;
  height: auto;
  padding: 2px 4px;
  background: #79c1fb;
  margin-right: 10px;
  color: #fff;
  line-height: 1;
  border-radius: 2px;
  line-height: 1;
  white-space: nowrap;
  padding: 4px;;
}
</style>