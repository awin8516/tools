<template>
  <div class="table">
    <div class="crumbs">
      <h2>视频素材管理</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-tooltip class="item" effect="dark" content="点击上传视频" placement="top">
          <el-button size="small" type="primary" @click="addVideo()">点击上传</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="获取微信素材" placement="top">
          <el-button
            type="primary"
            icon="el-icon-folder-opened"
            class="handle-del mr10"
            @click="getWx()"
          >获取微信素材</el-button>
        </el-tooltip>
      </div>
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
      <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}" style="width: 100%" v-loading="loading1">
        <el-table-column label="序号" align="center" type="index">
          <template slot-scope="scope">{{(scope.$index + 1) + (page- 1) *limit}}</template>
        </el-table-column>
        <el-table-column prop="title" label="视频名称" sortable></el-table-column>
        <el-table-column prop label="播放">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="播放视频" placement="top">
              <!-- <el-button
                type="primary"
                icon="el-icon-video-play"
                round
                @click="handlePlay(scope.row)"
              ></el-button> -->
              <i class="big" @click="handlePlay(scope.row)"><svg-icon icon-class="video" ></svg-icon></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="删除">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="删除视频" placement="top">
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
      title="播放视频"
      style="100%"
      :visible.sync="dialogVisible_play"
      :close-on-click-modal="modal"
      center
    >
      <div class="videoPanel">
        <!-- <video :src="playerOptions.sources[0].src" controls></video> -->
        <video-player
          class="vjs-custom-skin"
          ref="videoPlayer"
          :options="playerOptions"
          :playsinline="true"
        ></video-player>
      </div>
    </el-dialog>

    <el-dialog
      title="添加视频"
      style="100%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="modal"
    >
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-width="100px"
        :label-position="labelPosition"
      >
        <el-form-item label="上传视频" prop="path">
          <el-upload
            ref="upload"
            class="upload-demos"
            :action="meimgadd"
            :data="uploadData"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :on-change="handleChange"
            :file-list="fileList"
            :multiple="multiple"
            :show-file-list="false"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <!-- <p>{{fileList}}</p> -->
          <div class="preview">
            <span class="delete" @click="removeUpload()">
              <i class="el-icon-delete"></i>
            </span>
            <!-- {{fileList}} -->
            {{showNewPath(fileList)}}
          </div>
        </el-form-item>
        <el-form-item label="视频名称" prop="title">
          <div class="inputArea">
            <el-input v-model="form.title"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="视频描述" prop="description">
          <div class="inputArea">
            <el-input type="textarea" v-model="form.description"></el-input>
          </div>
        </el-form-item>
        <el-form-item label>
          <div class="inputArea">
            <el-button size="small" type="primary" @click="cancel()">取消</el-button>
            <el-button size="small" type="primary" @click="sure()">确认</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";
import BaseView from "../common/BaseView";
export default {
  components: {
    videoPlayer
  },
  extends: BaseView,
  data() {
    return {
      multiple: false,
      loading: "",
      meimgadd: this.GLOBAL.BASE_URL + "videoadd",
      uploadData: {
        appid: ""
      },
      path: "",
      tableData: [],
      page: 1,
      limit: 10,
      totals: 0,
      currentPage: 1,
      modal: false,
      dialogVisible: false,
      labelPosition: "left",
      rules: {
        path: [
          { required: true, message: "视频源文件不能为空", trigger: "blur" }
        ],
        title: [{ required: true, message: "请输入视频名称", trigger: "blur" }],
        description: [
          { required: true, message: "请输入视频描述", trigger: "blur" }
        ]
      },
      form: {
        appid: this.$store.getters.showQuery,
        path: "",
        title: "",
        description: ""
      },
      fileList: [],
      dialogVisible_play: false,
      down_url: "",
      playerOptions: {
        height: "360",
        autoplay: false,
        muted: true,
        language: "en",
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [
          {
            type: "video/mp4",
            // mp4
            src: "http://vjs.zencdn.net/v/oceans.mp4"
            // webm
            // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
          }
        ],
        controlBar: {
          timeDivider: true,
          durationDisplay: true
        },
        poster: "",
        is_upload: true
      }
    };
  },
  created() {
    if (localStorage.getItem("pages")) {
      this.page = JSON.parse(localStorage.getItem("pages")).videos  || this.page;
      this.currentPage = JSON.parse(localStorage.getItem("pages")).videos  || this.page;
    }

    this.uploadData.appid = this.$store.getters.showQuery;
    this.getData();
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    }
  },
  methods: {
    getWx() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "pullimgtext", {
          appid: this.$store.getters.showQuery,
          page: this.current_page,
          type: 'video'
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success(res.data.message);
            this.loading = false;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    showNewPath(files) {
      if (files.length) {
        return files[0].name;
      } else {
        return "";
      }
    },
    handleDelete(item) {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "materialdel", {
          appid: this.$store.getters.showQuery,
          media_id: item.media_id,
          type: 5,
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
    handlePlay(item) {
      this.dialogVisible_play = true;
      this.playerOptions.sources[0].src = item.url;;
    },
    cancel() {
      this.dialogVisible = false;
      this.form = {
        appid: this.$store.getters.showQuery,
        path: "",
        title: "",
        description: ""
      };
      this.fileList = [];
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
      });
    },
    sure() {
      if (this.form.path == "") {
        this.$message.warning("视频源文件不能为空");
      } else if (this.form.title == "") {
        this.$message.warning("视频名称不能为空");
      } else if (this.form.description == "") {
        this.$message.warning("视频描述不能为空");
      } else {
        this.dialogVisible = false;
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(255,255,255, 0.7)"
        });
        this.$axios
          .post(this.GLOBAL.BASE_URL + "videoupload", this.form)
          .then(res => {
            loading.close();
            if (res.data.code == 0) {
              this.getData();
              this.form = {
                appid: this.$store.getters.showQuery,
                path: "",
                title: "",
                description: ""
              };
              this.fileList = [];
            } else {
              this.$message.error(res.data.message);
            }
          });
      }
    },
    addVideo() {
      this.dialogVisible = true;
      this.form.path = [];
      this.fileList = [];
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
      });
    },
    removeUpload() {
      this.form.path = "";
      this.fileList = [];
    },
    handleChange(file, fileList) {},
    // 上传图片成功后的回调
    uploadSuccess(res, file) {
      this.loading.close();
      this.fileList.push(file);
      if (res.code == 0) {
        this.form.path = res.path;
      } else {
        this.form.path = [];
        this.fileList = [];
        this.$message.error(res.message);
      }
    },
    // 上传图片之前的判断  判断图片的大小
    beforeAvatarUpload(file) {
      this.loading = this.$loading({
        lock: true,
        text: "上传中，请稍后。。。",
        spinner: "el-icon-loading",
        background: "rgba(255,255,255, 0.7)"
      });
    },
    uploadError() {},
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
      pages.videos = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    getData() {
      this.loading1 = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "videolist", {
          appid: this.$store.getters.showQuery,
          page: this.page,
          limit: this.limit,
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
.vjs-custom-skin > .video-js .vjs-big-play-button {
  top: 50%;
  left: 50%;
  margin-left: -1.5em;
  margin-top: -1em;
  background-color: rgba(0, 0, 0, 0.45);
  font-size: 3.5em;
  height: 2em !important;
  line-height: 2em !important;
  margin-top: -1em !important;
}
</style>
<style lang='scss' scoped>
.big{
  font-size: 24px;
  cursor: pointer;
}
.big .svg-icon{
  font-size: 40px;;
  color: #63d6ff;
}
.preview {
  width: 200px;
  height: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  position: relative;
}
.delete {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  cursor: pointer;
  display: none;
  justify-content: center;
  align-items: center;
}
.delete i {
  color: #fff;
}
.preview:hover .delete {
  display: flex;
}
.preview .close {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(216, 211, 211, 0.5);
}
.videoPanel {
  width: 100%;
  display: flex;
  justify-content: center;
}
video {
  width: 480px;
  height: 270px;
}
.inputArea {
  width: 400px;
}
.panel {
  width: 100%;
  height: 400px;
  border: 1px solid red;
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
