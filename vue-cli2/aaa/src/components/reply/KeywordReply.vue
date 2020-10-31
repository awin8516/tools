<template>
  <div class>
    <div class="table">
      <div class="crumbs">
        <h2>关键词自动回复</h2>
      </div>
      <div class="container">
        <div class="handle-box">
          <el-form :inline="true">
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="新增一条关键词自动回复" placement="top">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  class="handle-del mr10"
                  @click="addkeyword()"
                >创建关键词自动回复</el-button>
              </el-tooltip>
            </el-form-item>
          </el-form>


          <el-form :inline="true">
            <el-form-item>
              <el-input v-model="select_words" placeholder="请输入搜索的关键词"></el-input>
            </el-form-item>
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="搜索关键词" placement="top">
                <el-button type="primary" @click="handleSearch(select_words)">搜索</el-button>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="重置搜索条件" placement="top">
                <el-button
                  type="primary"
                  icon="el-icon-s-tools"
                  class="handle-del mr10"
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
          :header-cell-style="{background:'#f9f9f9'}"
          class="table"
          ref="multipleTable"
          v-loading="loading"
        >
          <el-table-column fixed label="序号" width="50" align="center" type="index">
            <template slot-scope="scope">{{(scope.$index + 1) + (page- 1) *limit}}</template>
          </el-table-column>
          <el-table-column prop="words" label="触发关键词" sortable width="260"></el-table-column>
          <el-table-column prop="rule" label="匹配模式" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.rule == 1">完全匹配</span>
              <span v-if="scope.row.rule == 2">模糊匹配</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" sortable>
            <template slot-scope="scope">
              <span>{{scope.row.remark}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="tagid" label="标签" sortable width="200">
            <template slot-scope="scope">
              <p
                class="remark"
                v-for="(item,index) in showTag(scope.row.tagid)"
                :key="index"
              >{{item}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="trigger_count" label="触发次数" sortable width="120">
            <template slot-scope="scope">
              <span>{{scope.row.trigger_count}}</span>
            </template>
          </el-table-column>
          <el-table-column label width="200">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="修改关键词自动回复" placement="top">
                <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除关键词自动回复" placement="top">
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
            :current-page.sync="currentPage"
          ></el-pagination>
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
  name: "basetable",
  components: {
    vDanger
  },
  data() {
    return {
      select_words: "",
      loading: false,
      menuObject: "",
      activeName: "1",
      src:
        "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
      fit: "cover",
      dialogVisible: false,
      tableData: [],
      replayObj: {
        appid: "",
        words: "",
        rule: "",
        value: "",
        name: "",
        id: "",
        type: "1"
      },
      danger_type: "关键词自动回复",
      danger_ontent: "删除关键词自动回复，此操作会删除关键词自动回复",
      danger_item: {},
      page: 1,
      totals: 0,
      limit: 10,
      currentPage: 0
    };
  },
  created() {
    if (localStorage.getItem("pages")) {
      this.page =
        JSON.parse(localStorage.getItem("pages")).keywordReply || this.page;
      this.currentPage =
        JSON.parse(localStorage.getItem("pages")).keywordReply || this.page;
    }
    if (localStorage.getItem("gruop")) {
      localStorage.removeItem("gruop");
    }
    this.replayObj.appid = this.$store.getters.showQuery;
    this.replayObj.rule = "1";
    this.getData();
  },
  computed: {},
  methods: {
    // 重置
    reset() {
      this.select_words = "";
      this.handleSearch();
    },
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
    handleSearch(val) {
      this.getData(val);
    },
    // 删除
    dangerSure() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "keyword_del", {
          appid: this.$store.getters.showQuery,
          id: this.danger_item.id
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
    handleDelete(value) {
      this.danger_item = value;
      this.$refs.danger.showDanger();
    },
    addkeyword() {
      localStorage.removeItem("kid");
      this.$router.push({
        path: "/KeywordReplyEdit"
      });
    },
    handleEdit(item) {
      localStorage.setItem("kid", window.btoa(item.id));
      this.$router.push({
        path: "/KeywordReplyEdit"
      });
    },
    // 选择条数
    handleSizeChange(val) {
      this.page = this.currentPage;
      this.limit = val;
      this.getData();
    },
    // fanye
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.keywordReply = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    getData(name = this.select_words) {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "keyword_list", {
          appid: this.$store.getters.showQuery,
          page: this.page,
          limit: this.limit,
          name: name
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
            this.totals = res.data.data.total;
            this.currentPage = res.data.data.current_page;
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
.input {
  display: flex;
}
.remark {
  display: inline-flex;
  width: auto;
  height: auto;
  padding: 2px 4px;
  background: #79c1fb;
  margin-right: 10px;
  color: #fff;
  border-radius: 2px;
  line-height: 1;
  white-space: nowrap;
  padding: 4px;
}
.voiceBg {
  width: 100%;
  height: 100%;
  background: #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
}
.voiceBg i {
  font-size: 30px;
}
/* -------------------- */
.imgCover {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
}
.imgCover > i {
  font-size: 30px;
}
.imgItem {
  width: 100%;
  height: 100%;
}
.imgItem .img {
  display: inline-block;
  width: 150px;
  height: 170px;
  position: relative;
  border: 1px solid #ccc;
  margin-right: 20px;
  margin-bottom: 20px;
  overflow: hidden;
}
.imgItem .img img {
  width: 100%;
  height: auto;
}
.imgItem .img .imgTxt {
  width: 100%;
  height: 20px;
  position: absolute;
  left: 0;
  bottom: 0;
  border-top: 1px solid #ccc;
  text-align: center;
  line-height: 20px;
  background: #fff;
}
.imgItem .img .imgClose {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(77, 76, 76, 0.5);
  color: #fff;
}
.imgItem .img .imgClose i {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 40px;
  cursor: pointer;
}
.dialog {
  margin-top: 20px;
}
.qrcode {
  width: 60px;
  height: 60px;
  vertical-align: middle;
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
