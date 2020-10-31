<template>
  <div class="table">
    <div v-if="naveidt">
      <div class="crumbs">
        <h2>生成二维码</h2>
      </div>
      <div class="container">
        <div class="handle-box">
          <el-form :inline="true">
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="添加新的推广二维码" placement="top">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  class="handle-del mr10"
                  @click="addReply()"
                >添加</el-button>
              </el-tooltip>
            </el-form-item>
          </el-form>

          <el-form :inline="true">
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
              <el-input v-model="select_words" placeholder="请输入搜索的推广二维码名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="搜索" placement="top">
                <el-button type="primary" @click="handleSearch(select_words)">搜索</el-button>
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
          <el-table-column prop="name" label="名称" width="100" sortable>
            <template slot-scope="scope">
              <span v-html="(scope.row.name)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="rule" label="类型" width="100" sortable>
            <template slot-scope="scope">
              <span v-html="ruleType(scope.row.rule)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="final" label="标签" sortable>
            <template slot-scope="scope">
              <div class="remarks" v-for="(item,index) in showTag(scope.row.tagid)" :key="index">
                <p class="remark">{{item.name}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="final" label="到期时间" width="100" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.expire == 0">永久</span>
              <span v-else>{{scope.row.final}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="url" label="链接" sortable width="400">
            <template slot-scope="scope">
              <span v-html="(scope.row.url)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="url" label="二维码" width="80">
            <template slot-scope="scope">
              <div class="qrurl" @click="viewImg(scope.row.url)">
                <img :src="scope.row.url" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="has_log_url" label="Logo二维码" width="100">
            <template slot-scope="scope">
              <div
                class="avatarUrl"
                ref="imageWrapper"
                @click="viewImg(scope.row.has_log_url,'avatar')"
              >
                <img :src="scope.row.has_log_url" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop label="查看统计">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="查看数据" placement="top">
                <!-- <el-button type="info" icon="el-icon-s-data" @click="handleData(scope.row)"></el-button> -->
                <!-- count -->
                <i class="count" @click="handleData(scope.row)">
                  <svg-icon icon-class="count"></svg-icon>
                </i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop label="操作" width="180">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="修改二维码回复" placement="top">
                <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除推广二维码" placement="top">
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
    <v-danger
      ref="danger"
      @dangerSure="dangerSure"
      :danger_type="danger_type"
      :danger_ontent="danger_ontent"
    ></v-danger>
  </div>
</template>

<script>
import vMaterial from "../dialogs/materials";
import vDiyTagList from "../dialogs/diyTagList";
import vDanger from "../dialogs/danger.vue";
import BaseView from "../common/BaseView";
export default {
  extends: BaseView,
  components: {
    vMaterial,
    vDiyTagList,
    vDanger
  },
  data() {
    return {
      avatar: localStorage.getItem("avatar"),
      select_words: "",
      modal: false,
      isDisable: false,
      page: 1,
      totals: 0,
      limit: 10,
      currentPage1: 0,
      is_add: false,
      loading: false,
      replay_loading: false,
      naveidt: true,
      disabled: false,
      showDate: "",
      qrinfoRule: "",
      qrinfoRules: [
        {
          label: "所有",
          value: "0"
        },
        {
          label: "永久",
          value: "1"
        },
        {
          label: "临时",
          value: "2"
        }
      ],
      tableData: [],
      replayObj: {
        appid: "",
        qrcode_id: "",
        url: "",
        type: "",
        value: ""
      },
      replayData: [],
      qrData: {
        appid: "",
        type: ""
      },
      fit: "cover",
      form: {
        id: "",
        name: "",
        rule: "",
        date: ""
      },
      dialogVisible: false,
      src:
        "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
      fit: "cover",
      eventkey: "",
      tagid_lists: [],
      tagid_list: "",
      page: 1,
      danger_type: "推广二维码",
      danger_ontent: "删除推广二维码，此操作会将所有删除所有用户的推广二维码",
      item: "",
      afterDate: 0
    };
  },
  computed: {},
  created() {
    if (localStorage.getItem("pages")) {
      this.page = JSON.parse(localStorage.getItem("pages")).qRCode || this.page;
      this.currentPage1 =
        JSON.parse(localStorage.getItem("pages")).qRCode || this.page;
    }
    localStorage.removeItem("qid");
    this.replayObj.appid = this.$store.getters.showQuery;
    this.getData();
  },
  methods: {
    // 合成图片
    // 重置
    reset() {
      this.qrinfoRule = "";
      this.select_words = "";
      this.handleSearch();
    },
    // 查看大图
    viewImg(url, str) {
      window.open(url, "_blank");
    },
    handleSearch(val) {
      this.getData(val);
    },
    handleClose() {
      // 触发素材组件方法
      this.$refs.materials.resetData();
    },
    // 查看数据统计
    handleData(item) {
      localStorage.setItem("qid", window.btoa(item.id));
      this.$router.push({
        path: "/qrcodeData"
      });
    },
    dangerSure() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "qrcodedel", {
          id: this.item.id,
          appid: this.$store.getters.showQuery
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
    handleDelete(value) {
      this.item = value;
      this.$refs.danger.showDanger();
    },
    getType(value) {
      this.qrinfoRule = value;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.qRCode = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    // 选择条数
    handleSizeChange(val) {
      this.page = this.currentPage1;
      this.limit = val;
      this.getData();
    },
    getData(name = this.select_words) {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "qrcodelist", {
          appid: this.$store.getters.showQuery,
          rule: this.qrinfoRule,
          page: this.page,
          limit: this.limit,
          name: name
        })
        .then(res => {
          if (res.data.code == 0) {
            this.biao_qian_list();
            this.tableData = res.data.data.data;
            this.totals = res.data.data.total;
            this.currentPage1 = res.data.data.current_page;
            if (this.page > res.data.data.last_page) {
              this.page = res.data.data.last_page;
              this.getData();
            }
            this.loading = false;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    ruleType(value) {
      if (parseInt(value) == 1) {
        return "永久";
      } else if (parseInt(value) == 2) {
        return "临时";
      }
    },
    handleEdit(item) {
      localStorage.setItem("qid", JSON.stringify(item));
      this.$router.push({
        path: "/qrcodeEdit"
      });
    },
    addReply() {
      this.$router.push({
        path: "/qrcodeEdit"
      });
    },
    biao_qian_list() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "diytaglist", {
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tagid_lists = this.changeTagsList(res.data.data);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    showTag(value) {
      value = value ? value : [];
      let result = [];
      if (this.tagid_lists.length) {
        for (let i = 0; i < this.tagid_lists.length; i++) {
          for (let j = 0; j < value.length; j++) {
            if (value[j].id == this.tagid_lists[i].tag_value) {
              result.push(value[j]);
            }
          }
        }
      }
      if (result.length) {
        return result;
      }
    },
    changeTagsList(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/id/g, "value"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/name/g, "label"));
      return obj2;
    },
    changeTagsListReagain(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/value/g, "id"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/label/g, "name"));
      return obj2;
    }
  }
};
</script>

<style lang='scss' scoped>
.count {
  font-size: 26px;
  cursor: pointer;
}
.avatarUrl {
  position: relative;
  width: 60px;
  height: 60px;
  cursor: pointer;
}
.avatarUrl img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.avatarUrl .avatar {
  width: 30px;
  height: 30px;
  position: absolute;
  right: 0;
  bottom: 0;
  margin: auto;
  border: 2px solid rgb(255, 255, 255);
  border-radius: 4px;
  box-sizing: border-box;
  overflow: hidden;
}
// -----------------------------------
.inputArea {
  width: 215px;
}
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
  padding: 2px 4px;
}
.remarks {
  display: inline-block;
  margin-right: 5px;
}
.input {
  width: 215px;
}
/* ---------------------------------- */
.imgCover {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
}
.imgCover > i {
  font-size: 30px;
}
.line {
  width: 100%;
  height: 20px;
}
.dialog {
  margin-top: -2vh;
}
.qrurl {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
}
.qrurl img {
  width: 100%;
  height: 100%;
  cursor: pointer;
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
