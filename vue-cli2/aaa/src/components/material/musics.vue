<template>
  <div class="table">
    <div class="crumbs">
      <h2>音频素材管理</h2>
    </div>
    <div class="container" v-loading="loading">
      <div class="handle-box">
        <el-form :inline="true">
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="点击上传音频" placement="top">
              <el-upload
                class="upload-demos"
                :action="meimgadd"
                :data="uploadData"
                :multiple="multiple"
                :before-upload="beforeAvatarUpload"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :show-file-list="false"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="获取微信素材" placement="top">
              <el-button
                type="primary"
                icon="el-icon-folder-opened"
                class="handle-del mr10"
                @click="getWx()"
              >获取微信素材</el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>
      </div>
      <p class="tips">最大5M，最长60min，支持 mp3、 wma、 wav、 amr格式。</p>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
          :current-page.sync="currentPage"
        ></el-pagination>
      </div>
      <el-table
        :data="tableData"
        :header-cell-style="{background:'#f9f9f9'}"
        style="width: 100%"
        v-loading="loading1"
      >
        <el-table-column label="序号" align="center" type="index">
          <template slot-scope="scope">{{(scope.$index + 1) + (page- 1) *limit}}</template>
        </el-table-column>
        <el-table-column prop="real_name" label="音频名称" sortable></el-table-column>
        <el-table-column prop label="播放">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="播放音频" placement="top">
              <!-- <el-button
                type="primary"
                icon="el-icon-video-play"
                round
                @click="handlePlay(scope.row)"
              ></el-button>-->
              <i class="big" @click="handlePlay(scope.row)">
                <svg-icon icon-class="voice"></svg-icon>
              </i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="删除">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="删除音频" placement="top">
              <el-button type="danger" icon="el-icon-delete-solid" @click="handleDelete(scope.row)"></el-button>
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
          :current-page.sync="currentPage"
        ></el-pagination>
      </div>
    </div>

    <el-dialog
      title="播放音频"
      style="30%"
      :visible.sync="dialogVisible_play"
      :close-on-click-modal="modal"
      center
      @close="handleClose()"
    >
      <div class="videoPanel" v-if="flag">
        <!-- <video :src="down_url" controls></video> -->
        <aplayer :music="musicList" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BaseView from "../common/BaseView";
import Aplayer from "vue-aplayer";
export default {
  components: {
    //别忘了引入组件
    Aplayer
  },
  extends: BaseView,
  data() {
    return {
      dialogVisible_play: false,
      modal: false,
      flag: false,
      musicList: {
        title: "音频",
        src: this.GLOBAL.BASE_URL.MUSIC
      },
      multiple: false,
      loading: false,
      loading1: false,
      meimgadd: this.GLOBAL.BASE_URL + "voiceadd",
      uploadData: {
        appid: ""
      },
      path: "",
      tableData: [],
      page: 1,
      totals: 0,
      limit: 10,
      currentPage: 1
    };
  },
  created() {
    if (localStorage.getItem("pages")) {
      this.page = JSON.parse(localStorage.getItem("pages")).music || this.page;
      this.currentPage =
        JSON.parse(localStorage.getItem("pages")).music || this.page;
    }
    this.uploadData.appid = this.$store.getters.showQuery;
    this.getData();
  },
  methods: {
    // 下拉音频
    getWx() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "pullvoice", {
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("下拉成功");
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    handleClose() {
      this.flag = false;
    },
    handlePlay(item) {
      this.voiceplay(item);
    },
    voiceplay(item) {
      this.musicList = {
        title: item.real_name,
        src: item.url
      };
      this.flag = true;
      this.dialogVisible_play = true;
    },
    handleDelete(item) {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "materialdel", {
          appid: this.$store.getters.showQuery,
          media_id: item.media_id,
          type: 3,
          id: item.id
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
    // 上传图片成功后的回调
    uploadSuccess(res, file) {
      const loading = this.$loading({
        lock: true,
        text: "上传中，请稍后。。。",
        spinner: "el-icon-loading",
        background: "rgba(255,255,255, 0.7)"
      });
      this.path = res.path;
      if (res.code == 0) {
        this.$axios
          .post(this.GLOBAL.BASE_URL + "voiceupload", {
            appid: this.$store.getters.showQuery,
            path: this.path
          })
          .then(res => {
            setTimeout(() => {
              loading.close();
            }, 1000);
            if (res.data.code == 0) {
              this.getData();
            } else {
              this.$message.error(res.data.message);
            }
          });
      } else {
        this.$message.error(res.message);
        loading.close();
      }
    },
    // 上传图片之前的判断  判断图片的大小
    beforeAvatarUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error("上传音频大小不能超过 5MB!");
        return false;
      }
      return isLt5M;
    },
    uploadError() {},
    voiceupload() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "voiceupload", {
          appid: this.$store.getters.showQuery,
          path: this.path
        })
        .then(res => {
          if (res.data.code == 0) {
            this.getData();
          } else {
            this.$message.error(res.data.message);
          }
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
      pages.music = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    getData() {
      this.loading1 = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "voicelist", {
          appid: this.$store.getters.showQuery,
          page: this.page,
          limit: this.limit
        })
        .then(res => {
          this.loading1 = false;
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
            this.totals = res.data.data.total;
            this.currentPage = res.data.data.current_page;
            if (this.page > res.data.data.last_page) {
              this.page = res.data.data.last_page;
              this.getData();
            }
          } else {
          }
        });
    }
  }
};
</script>
<style>
.upload-demos .el-upload--text {
  width: auto;
  height: auto;
  border: none;
  border-radius: 0;
}
.aplayer .aplayer-body .aplayer-info .aplayer-music .aplayer-author {
  display: none;
}
.aplayer-controller .aplayer-time .aplayer-icon.inactive {
  display: none;
}
</style>
<style lang='scss' scoped>
.big {
  font-size: 24px;
  cursor: pointer;
}
.big .svg-icon {
  font-size: 40px;
  color: #41d4ae;
}
.tips {
  font-size: 12px;
  color: #818181;
  margin-top: -10px;
  margin-bottom: 20px;
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
