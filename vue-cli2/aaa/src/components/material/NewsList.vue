<template>
  <div class="table">
    <div class="crumbs">
      <h2>图文素材管理</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-tooltip class="item" effect="dark" content="创建图文消息" placement="top">
          <el-button
            type="primary"
            icon="el-icon-plus"
            class="handle-del mr10"
            @click="create()"
          >创建图文消息</el-button>
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
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :page-sizes="[10, 20, 50, 200]"
          :page-size="limit1"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals1"
          :current-page.sync="currentPage1"
        ></el-pagination>
      </div>
      <div
        class="infos"
        v-masonry="containerId"
        transition-duration="0.3s"
        item-selector=".infositem"
        v-loading="loading"
        v-if="infospanel.length"
        id="containerId"
      >
        <div v-masonry-tile class="infositem" v-for="(item,index) in infospanel" :key="index">
          <div v-masonry-tile v-if="item.info">
            <div class="infositem_head infositem_remark">
              <el-tooltip class="item" effect="dark" content="点击可修改备注" placement="top">
                <p v-if="item.remark" @click="addRemark(item)">{{item.remark}}</p>
                <p v-else @click="addRemark(item)">点击添加备注</p>
              </el-tooltip>
            </div>
            <div class="infositem_bg" v-if="item.info.news_item">
              <div :class="{'infoPush':true,'isActive':item.is_push == 1}">
                <span v-if="item.is_push == 0">
                  未同步
                  <i class="el-icon-close"></i>
                </span>
                <span v-if="item.is_push == 1">
                  同步
                  <i class="el-icon-check"></i>
                </span>
              </div>
              <a
                v-if="item.info.news_item[0].url"
                :href="item.info.news_item[0].url"
                target="view_window"
                class="active"
              >预览文章</a>
              <div class="infositem_head">{{item.info.news_item[0].title}}</div>
              <div class="infositem_img">
                <img :src="showImg((item.info.news_item[0].thumb_url))" />
              </div>
              <div class="infositem_foot">{{item.info.news_item[0].digest}}</div>
            </div>
            <!-- 后续的图文 -->
            <div class="nextInfos" v-show="ishift(item.info.news_item).length">
              <div
                class="nextInfosbg"
                v-for="(list,index) in ishift(item.info.news_item)"
                :key="index"
              >
                <a v-if="list.url" :href="list.url" target="view_window" class="active">预览文章</a>
                <div class="nextInfos_head">{{handleCut(list.title,30)}}</div>
                <div class="nextInfos_img">
                  <!-- <el-image :src="showImg(list.thumb_url)" fit="fit"></el-image> -->
                  <img :src="showImg(list.thumb_url)" />
                </div>
              </div>
            </div>
          </div>
          <div class="infositem_time" v-if="item.info">
            <div class="infositem_time_left">
              <p>更新于{{item.updated_at | filterTime}}</p>
            </div>
            <div class="infositem_time_right">
              <!-- <i class="el-icon-edit middle" @click="handleDdit(item)"></i> -->
              <el-tooltip class="item" effect="dark" content="编辑图文" placement="top">
                <i class="middle" @click="handleDdit(item)">
                  <svg-icon icon-class="edit"></svg-icon>
                </i>
              </el-tooltip>
              <!-- <i
                class="el-icon-upload2 middle"
                v-if="item.is_push == 0"
                @click="handleTextadd(item)"
              ></i>-->
              <el-tooltip class="item" effect="dark" content="推送图文" placement="top">
                <i v-if="item.is_push == 0" class="middle" @click="handleTextadd(item)">
                  <svg-icon icon-class="push"></svg-icon>
                </i>
              </el-tooltip>
              <!-- <i class="el-icon-delete-solid middle" @click="handleDel(item)"></i> -->
              <el-tooltip class="item" effect="dark" content="删除图文" placement="top">
                <i class="middle" @click="handleDel(item)">
                  <svg-icon icon-class="delete"></svg-icon>
                </i>
              </el-tooltip>
            </div>
          </div>
          <div class="infositem_tool" style="display:none" v-if="item.info">
            <div class="infositem_tools tool_left" @click="handleDdit(item)">
              <!-- <i class="el-icon-edit big"></i> -->
              <el-tooltip class="item" effect="dark" content="编辑图文" placement="top">
                <svg-icon icon-class="edit"></svg-icon>
              </el-tooltip>
            </div>
            <div
              class="infositem_tools tool_middle"
              v-if="item.is_push == 0"
              @click="handleTextadd(item)"
            >
              <el-tooltip class="item" effect="dark" content="点击推送" placement="top">
                <i class="el-icon-upload2 big"></i>
              </el-tooltip>
            </div>
            <div class="infositem_tools tool_right" @click="handleDel(item)">
              <i class="el-icon-delete-solid big"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :page-sizes="[10, 20, 50, 200]"
          :page-size="limit1"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals1"
          :current-page.sync="currentPage1"
        ></el-pagination>
      </div>
    </div>
    <!-- 备注 -->
    <el-dialog
      title="素材备注"
      :visible.sync="dialogVisible_remark"
      width="30%"
      :close-on-click-modal="modal"
    >
      <el-input v-model="remark" placeholder="请输入内容" maxlength="18" show-word-limit></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="sureRemark()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import editor from "./Quilleditor.vue";
import BaseView from "../common/BaseView";
export default {
  extends: BaseView,
  components: {
    editor
  },
  data() {
    return {
      containerId: "containerId",
      modal: false,
      multiple: false,
      canCrop: false,
      /*测试上传图片的接口，返回结构为{url:''}*/
      uploadUrl: this.GLOBAL.BASE_URL + "meimgadd",
      content: "",
      loading: false,
      msg:
        '<h2><img src="http://img.baidu.com/hi/jx2/j_0003.gif"/>Vue + UEditor + v-model双向绑定</h2>',
      have_cover: false,
      fit: "cover",
      is_edit: true,
      is_update: false,
      count: 0,
      infospanel: ["1"],
      infospanelObj: {},
      ruleForm: {},
      dialogVisible: false,
      uploadData: {
        appid: ""
      },
      imgUrls: [],
      editor: "",
      meimgtextaddId: "",
      meimgtexteditId: "",
      meimgtextdelId: "",
      thumb_media_id: "",
      editorOption: {},

      // 多图文再次编辑参数
      meimgtextInfo: {},
      is_save: true,

      // 保存图文原来的信息
      newsLen: 0,
      totals1: 0,
      page1: 1,
      limit1: 10,
      currentPage1: 1,

      totals2: 0,
      page2: 1,
      limit2: 10,
      currentPage2: 1,
      // 是否推送
      is_push: 0,
      loading: false,
      is_produce: false,
      addremark: {
        appid: "",
        id: "",
        remark: ""
      },
      remark: "",
      dialogVisible_remark: false
    };
  },
  created() {
    if (localStorage.getItem("pages")) {
      this.page1 =
        JSON.parse(localStorage.getItem("pages")).NewsList || this.page;
      this.currentPage1 =
        JSON.parse(localStorage.getItem("pages")).NewsList || this.page;
    }
    localStorage.removeItem("nid");
    this.uploadData.appid = this.$store.getters.showQuery;
    this.meimgtextaddId = "";
    this.meimgtext();
  },
  filters: {
    filterTime: function(value) {
      if (value) {
        value = value.split(" ")[0];
        return value;
      }
    }
  },
  mounted() {},
  methods: {
    handleCut(str, num) {
      if (str.length < num) {
      } else {
        str = str.toString()
        str = str.substring(0, num) + "...";
      }
      return str;
    },
    getiframe(data) {
      this.infospanelObj.content = this.infospanelObj.content + data;
    },
    cancel() {
      this.dialogVisible_remark = false;
    },
    sureRemark() {
      if (this.remark == "") {
        this.$message.warning("备注不能为空");
        return false;
      }
      this.$axios
        .post(this.GLOBAL.BASE_URL + "addremark", {
          appid: this.$store.getters.showQuery,
          id: this.addremark.id,
          remark: this.remark
        })
        .then(res => {
          if (res.data.code == 0) {
            this.meimgtext();
          } else {
            this.$message.error(res.data.message);
          }
        });
      this.dialogVisible_remark = false;
    },
    // 增加备注
    addRemark(item) {
      if (!item.remark) {
        this.remark = "";
      } else {
        this.remark = item.remark;
      }
      this.addremark = item;
      this.dialogVisible_remark = true;
    },
    // 推送
    handleTextadd(item) {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "textadd", {
          appid: this.$store.getters.showQuery,
          id: item.id
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("推送成功");
            this.meimgtext();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 删除图文
    handleDel(item) {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "meimgtextdel", {
          appid: this.$store.getters.showQuery,
          media_id: item.media_id,
          id: item.id
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("删除成功");
            this.meimgtext();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 编辑
    handleDdit(item) {
      localStorage.setItem("nid", JSON.stringify(item));
      this.$router.push({
        path: "/NewsListEdit"
      });
    },
    // 处理数据
    ishift(arr) {
      let newArr = arr.map(o => Object.assign({}, o));
      newArr.shift();
      return newArr;
    },
    initEditor() {},
    // 创建图片信息
    create() {
      this.$router.push({
        path: "/NewsListEdit"
      });
    },

    // 正则表达式判断url是否真确
    checkURL(URL) {
      var str = URL;
      var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
      var objExp = new RegExp(Expression);
      if (objExp.test(str) == true) {
        return true;
      } else {
        return false;
      }
    },
    getWx() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "pullimgtext", {
          appid: this.$store.getters.showQuery,
          page: this.current_page,
          type: "news"
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success(res.data.message);
            if (res.data.data) {
              this.infospanel.push(res.data.data.data);
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 翻页
    handleCurrentChange1(val) {
      this.page1 = val;
      this.meimgtext();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.newsList = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    handleSizeChange1(val) {
      this.page1 = 1;
      this.limit1 = val;
      this.meimgtext();
    },
    // 获取数据
    meimgtext() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "meimgtext", {
          appid: this.$store.getters.showQuery,
          page: this.page1,
          limit: this.limit1,
          is_push: "all"
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.infospanel = res.data.data.data;
            this.totals1 = res.data.data.total;
            this.currentPage1 = res.data.data.current_page;
            if (this.page1 > res.data.data.last_page) {
              this.page1 = res.data.data.last_page;
              this.meimgtext();
            }
            this.$nextTick(() => {
              this.$redrawVueMasonry("containerId");
            });
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 翻页
    handleCurrentChange2(val) {
      this.page2 = val;
      this.getImgData();
      // this.$redrawVueMasonry('containerId')
    },
    handleSizeChange2(val) {
      this.page2 = 1;
      this.limit2 = val;
      this.getImgData();
    },
    // 获取数据
    getImgData() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "meimg", {
          appid: this.$store.getters.showQuery,
          page: this.page2,
          limit: this.limit2
        })
        .then(res => {
          if (res.data.code == 0) {
            this.loading = false;
            this.imgUrls = res.data.data.data;
            this.totals2 = res.data.data.total;
            this.currentPage2 = res.data.data.current_page;
            if (this.page2 > res.data.data.last_page) {
              this.page2 = res.data.data.last_page;
              this.getImgData();
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    uploadSuccess(res, file) {
      this.loading = false;
      this.getImgData();
    },
    beforeAvatarUpload(file) {
      this.loading = true;
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
        this.loading = false;
      }
      return isLt2M;
    },
    handleChoose(item) {
      var _this = this;
      this.$nextTick(function() {
        this.imgUrls.forEach(function(item) {
          _this.$set(item, "active", false);
        });
        this.$set(item, "active", true);
      });
      this.infospanelObj.thumb_url = item.url;
      this.infospanelObj.thumb_media_id = item.media_id;
    }
  },
  destroyed() {}
};
</script>


<style lang='scss' scoped>
iframe {
  width: 304px !important;
  border: 0;
}
.infoPush {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 30px;
  background: grey;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}
.infoPush.isActive {
  background: $--color-primary;
}
/* ----------------- */
.infos .infositem .infositem_head.infositem_remark {
  width: 100%;
  background: #a8a8a8;
  color: #fff;
  display: flex;
  justify-content: center;
}
.infos .infositem .infositem_head.infositem_remark p {
  width: 100%;
  margin: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
/* ------------- */
.middle {
  font-size: 18px;
  color: rgb(78, 78, 78);
  margin-left: 6px;
}
.panel .btn {
  display: flex;
  flex-direction: column;
}
.panel .btn button {
  margin-left: 0;
  margin-bottom: 10px;
}
/* -------------- */

.infositem_time {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
}
.infositem_time_left {
  width: 50%;
}
.infositem_time_left p {
  color: rgb(136, 132, 132);
  font-size: 12px;
  white-space: nowrap;
}
.infositem_time_right {
  width: 50%;
  display: flex;
  justify-content: flex-end;
}
.nextInfosbg:hover .active {
  display: flex;
}
/* -------------------- */
.big {
  font-size: 20px;
}
.nextInfosbg {
  width: 100%;
  height: 100px;
  display: flex;
  border-top: 1px solid rgb(230, 230, 230);
  overflow: hidden;
  position: relative;
  padding: 10px 0;
  box-sizing: border-box;
}
.nextInfosbg .active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 16px;
  z-index: 10;
}
.nextInfosbg:hover .active {
  display: flex;
}
.nextInfos_head {
  width: 60%;
  height: 100%;
  display: inline-block;
  box-sizing: border-box;
  padding: 0 10px 0 10px;
}
.nextInfos_img {
  width: 40%;
  height: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.nextInfos_img > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.infos {
  width: 100%;
  height: 100%;
}
.infos .infositem {
  width: 250px;
  height: auto;
  position: relative;
  cursor: pointer;
  display: inline-flex;
  margin: 0 20px 20px 0;
  flex-direction: column;
  border-radius: 5px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 1px 10px 0 #e4e8eb;
  border-radius: 2px;
}
.infositem_bg {
  position: relative;
}
.infos .infositem .infositem_head {
  width: 80%;
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.infos .infositem .infositem_img {
  width: 100%;
  height: 140px;
  margin: auto;
  overflow: hidden;
  position: relative;
}
.infos .infositem .infositem_bg .active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 16px;
  z-index: 10;
}
.infos .infositem .infositem_bg:hover .active {
  display: flex;
}
.infos .infositem .infositem_img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.infos .infositem .infositem_foot {
  width: 100%;
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
  padding: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: absolute;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
}
.infositem_tool {
  width: 100%;
  height: 50px;
  border-top: 1px solid rgb(230, 230, 230);
  display: flex;
}
.infositem_tools {
  width: 100%;
  height: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.tool_left {
  border-right: 1px solid rgb(230, 230, 230);
}
.tool_left:hover {
  background: #618ad8;
  color: #fff;
}
.tool_middle {
  border-right: 1px solid rgb(230, 230, 230);
}
.tool_middle:hover {
  background: #d4ca3d;
  color: #fff;
}
.tool_right:hover {
  background: red;
  color: #fff;
}
.imgcover {
  width: 100px;
  height: auto;
  display: flex;
  justify-content: center;
}
.iedit {
  width: 100%;
  height: auto;
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
  cursor: pointer;
}
.imgItem .img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
}
.imgItem .img .imgClose i {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 40px;
  color: #fff;
}

.upload-demo {
  width: 360px;
}
.upload-demo .el-upload--text {
  width: auto;
  height: auto;
  border: none;
}
.panel {
  width: 100%;
  display: flex;
}
.eidtPanel {
  width: 250px;
  height: 100%;
  padding: 30px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
}
.infoPanel {
  width: 100%;
  height: 140px;
  background: #ccc;
  border: 1px solid transparent;
  margin-bottom: 4px;
  position: relative;
  cursor: pointer;
}
.infoPanelPic {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.infoPanelPic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.deletePanel {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 25px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  padding-right: 20px;
  color: #fff;
}
.deletePanel i {
  cursor: pointer;
}
.addPanel {
  width: 100%;
  height: 100px;
  border: 1px dashed #ccc;
  margin-bottom: 10px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.addPanel > i {
  font-size: 25px;
}
.inputPanel {
  width: 100%;
  height: 100%;
  padding: 30px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-left: 40px;
}
.dialog {
  margin-top: -2vh;
}
.qrurl {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
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

<style>
.panel .el-upload--text {
  width: auto;
  border: none;
  height: auto;
}
</style>