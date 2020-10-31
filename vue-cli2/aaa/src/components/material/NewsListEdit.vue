<template>
  <div class="table">
    <div class="crumbs">
      <h2>图文消息编辑</h2>
    </div>
    <div class="panel">
      <div class="eidtPanel">
        <div class="infoPanel" v-for="(item,index) in infospanel" :key="index">
          <div class="infoPanelPic" @click="getInfo(item)" :class="{'active': item.active}">
            <img :src="showImg(item.thumb_url)" v-show="item.thumb_url" />
          </div>
          <div class="deletePanel">
            <i class="el-icon-delete-solid" @click="deletePanel(index)"></i>
          </div>
        </div>
        <div class="addPanel" @click="addPanel()">
          <i class="el-icon-plus"></i>
        </div>
        <div class="btn" v-if="is_push == 1">
          <el-tooltip class="item" effect="dark" content="更新全部" placement="top" v-if="is_update">
            <el-button type="primary" @click="update()">更新全部</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="保存全部" placement="top" v-else>
            <el-button type="primary" @click="save()">保存全部</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="返回" placement="top">
            <el-button type="primary" @click="back()" icon="el-icon-back">返回</el-button>
          </el-tooltip>
        </div>
        <div class="btn" v-if="is_push == 0">
          <el-tooltip class="item" effect="dark" content="保存全部" placement="top">
            <el-button type="primary" @click="savePush()">保存全部</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="返回" placement="top">
            <el-button type="primary" @click="back()" icon="el-icon-back">返回</el-button>
          </el-tooltip>
        </div>
      </div>
      <div class="inputPanel">
        <el-form :model="infospanelObj" ref="ruleForm" class="demo-ruleForm">
          <el-form-item label prop>
            <el-input maxlength="64" show-word-limit v-model="infospanelObj.title" placeholder="标题"></el-input>
          </el-form-item>
          <el-form-item label prop>
            <el-input v-model="infospanelObj.author" placeholder="作者"></el-input>
          </el-form-item>
          <el-form-item label prop>
            <div class="iedit">
              <editor
                ref="myTextEditor"
                :fileName="'myFile'"
                :canCrop="canCrop"
                :uploadUrl="uploadUrl"
                @iframe="getiframe"
                v-model="infospanelObj.content"
              ></editor>
            </div>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="选择封面" placement="top">
              <el-button type="primary" @click="chooseImg()">选择封面</el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item label prop>
            <div class="imgcover" v-show="infospanelObj.thumb_url">
              <el-image :src="showImg(infospanelObj.thumb_url)" fit="fit"></el-image>
            </div>
          </el-form-item>
          <el-form-item label prop>
            <el-input v-model="infospanelObj.content_source_url" placeholder="原文链接,不填写，则不显示阅读原文"></el-input>
          </el-form-item>
          <el-form-item label prop>
            <el-input
              type="textarea"
              v-model="infospanelObj.digest"
              placeholder="摘要"
              maxlength="50"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button plain>如果你的公众号有留言功能，可以选择开放留言功能</el-button>
            <br />
            <el-radio v-model="infospanelObj.need_open_comment" label="1">开放</el-radio>
            <el-radio v-model="infospanelObj.need_open_comment" label="0">不开放</el-radio>
          </el-form-item>
          <el-form-item v-if="is_push == 1">
            <el-tooltip class="item" effect="dark" content="更新" placement="top" v-if="is_update">
              <el-button type="primary" @click="update()">更新</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="保存" placement="top" v-else>
              <el-button type="primary" @click="save()">保存</el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item v-if="is_push == 0">
            <el-tooltip class="item" effect="dark" content="保存" placement="top">
              <el-button type="primary" @click="savePush()">保存</el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>
      </div>
      <el-dialog title="选择图片" :visible.sync="dialogVisible" width="50%" center>
        <div class="handle-box">
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :data="uploadData"
            :multiple="multiple"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSuccess"
            :show-file-list="false"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <!-- <p style="font-size:12px;color:gray;white-space:nowrap;">支持jpg、png图片格式，大小不超过2M</p> -->
        </div>
        <div class="imgItem">
          <div class="img" v-for="(item,index) in imgUrls" :key="index" @click="handleChoose(item)">
            <img :src="showImg(item.url)" />
            <span class="imgTxt">{{item.name}}</span>
            <div class="imgClose" v-show="item.active">
              <i class="el-icon-check" @click="deleteImg(item)"></i>
            </div>
          </div>
        </div>

        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :page-sizes="[10, 20, 50, 200]"
            :page-size="limit2"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totals2"
            :current-page.sync="currentPage2"
          ></el-pagination>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureImg()">确 定</el-button>
        </span>
      </el-dialog>
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
      infospanel: [],
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
    this.uploadData.appid = this.$store.getters.showQuery;
    if (localStorage.getItem("nid")) {
      this.meimgtexteditId = JSON.parse(localStorage.getItem("nid")).id;
      this.meimgtextedit();
    } else {
      this.addPanel();
    }
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
    showProduce() {
      this.is_produce = true;
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
    // 转换
    NumToStr(num) {
      return num.toString();
    },
    // 富文本编辑
    onEditorBlur() {},
    onEditorFocus() {},
    onEditorChange() {},
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
    // 获取消息数据
    meimgtextedit() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "meimgtextedit", {
          appid: this.$store.getters.showQuery,
          id: this.meimgtexteditId
        })
        .then(res => {
          if (res.data.code == 0) {
            this.meimgtextInfo = res.data.data;
            this.infospanel = res.data.data.info.news_item;
            // console.log(this.infospanel);
            var dataSTr = "data-src";
            this.infospanel.forEach(ele => {
              // ele.content = ele.content.replace("data", "src");
              ele.contents = ele.content;
            });
            this.newsLen = this.infospanel.length;
            this.infospanelObj = this.infospanel[0];
            this.infospanel.forEach(item => {
              this.$set(item, "active", false);
            });
            this.$set(this.infospanelObj, "active", true);
            if (
              parseInt(this.infospanelObj.need_open_comment) == 0 ||
              parseInt(this.infospanelObj.need_open_comment) == 1
            ) {
              this.infospanelObj.need_open_comment = this.infospanelObj.need_open_comment.toString();
            }
            this.is_edit = false;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 编辑
    handleDdit(item) {
      this.is_save = true;
      this.is_update = false;
      // console.log(this.is_save);
      this.is_push = item.is_push;

      this.meimgtexteditId = item.id;
      this.meimgtextedit();
    },
    // 处理数据
    ishift(arr) {
      let newArr = arr.map(o => Object.assign({}, o));
      newArr.shift();
      return newArr;
    },
    // 获取数据
    getInfo(item) {
      this.infospanel.forEach(item => {
        this.$set(item, "active", false);
      });
      this.$set(item, "active", true);
      this.infospanelObj = item;
    },
    // 返回
    back() {
      this.$router.push({
        path: "/newslist"
      });
    },
    initEditor() {},
    // 打开选择图片弹窗
    chooseImg() {
      this.dialogVisible = true;
      this.getImgData();
    },
    // 创建图片信息
    create() {
      this.is_push = 0;
      this.is_save = false;
      this.is_update = false;
      this.is_edit = false;
      this.infospanel = [];
      this.infospanelObj = {
        content: "1222222"
      };
      this.addPanel();
    },
    // 删除图片数据
    deletePanel(value) {
      this.infospanel.splice(value, 1);
      if (this.meimgtexteditId) {
        if (this.infospanel.length == this.newsLen) {
          // 未改变数目
          this.is_save = true;
          this.is_update = false;
          you;
        } else {
          this.is_save = true;
          this.is_update = true;
        }
      } else {
        this.is_save = false;
        this.is_update = false;
      }
      if (this.infospanel.length != 0) {
        this.infospanelObj = this.infospanel[0];
      } else {
        this.infospanelObj = {};
      }
    },
    // 选中图片
    sureImg() {
      this.dialogVisible = false;
      this.have_cover = true;
    },
    // 添加消息数据
    addPanel() {
      if (this.meimgtexteditId) {
        this.is_save = true;
        this.is_update = true;
      } else {
        this.is_save = false;
        this.is_update = false;
      }
      // console.log(this.is_save);
      this.count++;
      let obj = {};
      obj.id = this.count;
      obj.title = "";
      obj.author = "";
      obj.digest = "";
      obj.content = "";
      obj.content_source_url = "";
      obj.thumb_url = "";
      obj.show_cover_pic = "0";
      obj.show_cover = "0";
      obj.url = "";
      obj.url = "";
      this.infospanelObj = obj;
      this.infospanel.push(obj);
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
    update() {
      // console.log("update-----", this.is_push);
      // 逻辑是先保存----后删除-----就达到新增的效果---也就是去掉旧的medie_id
      // 先保存
      let flag = true;
      if (this.infospanel.length != 0) {
        for (var i = 0; i < this.infospanel.length; i++) {
          if (this.infospanel[i].title == "") {
            this.$message.warning("标题不能为空");
            flag = false;
          } else if (this.infospanel[i].content == "") {
            this.$message.warning("内容不能为空");
            flag = false;
          } else if (this.infospanel[i].thumb_media_id == "") {
            this.$message.warning("封面不能为空");
            flag = false;
          }
        }
        if (flag) {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(255,255,255, 0.7)"
          });
          this.$axios
            .post(this.GLOBAL.BASE_URL + "meimgtextadd", {
              appid: this.$store.getters.showQuery,
              newlists: this.infospanel,
              id: this.meimgtextaddId,
              is_push: 0
            })
            .then(res => {
              if (res.data.code == 0) {
                // this.meimgtextdel();
                this.meimgtextsave();
              } else {
                this.$message.error(res.data.message);
              }
            });
        }
      } else {
        this.$message.warning("内容不能为空");
      }
    },
    // 删除消息
    meimgtextdel() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(255,255,255, 0.7)"
      });
      this.$axios
        .post(this.GLOBAL.BASE_URL + "meimgtextdel", {
          appid: this.$store.getters.showQuery,
          media_id: this.meimgtextInfo.media_id,
          id: this.meimgtextInfo.id,
          is_push: this.is_push
        })
        .then(res => {
          if (res.data.code == 0) {
            loading.close();
            this.$message.success("更新成功");
            this.is_push = 0;
            setTimeout(() => {
              this.back();
            }, 500);
            this.$message.success("更新成功");
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 保存消息
    meimgtextsave() {
      // console.log("update-----", this.is_push);
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(255,255,255, 0.7)"
      });
      this.infospanel.forEach((ele, index) => {
        this.$axios
          .post(this.GLOBAL.BASE_URL + "meimgtextsave", {
            index: index,
            appid: this.$store.getters.showQuery,
            news: ele,
            media_id: this.meimgtextInfo.media_id,
            id: this.meimgtextInfo.id,
            is_push: this.is_push
          })
          .then(res => {
            if (res.data.code == 0) {
              loading.close();
              this.$message.success("更新成功");
              this.is_push = 0;
              setTimeout(() => {
                this.back();
              }, 500);
              this.$message.success("更新成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
      });
    },
    // 添加图文消息
    meimgtextadd() {
      let flag = true;
      if (this.infospanel.length != 0) {
        for (var i = 0; i < this.infospanel.length; i++) {
          if (this.infospanel[i].title == "") {
            this.$message.warning("标题不能为空");
            flag = false;
          } else if (this.infospanel[i].content == "") {
            this.$message.warning("内容不能为空");
            flag = false;
          } else if (this.infospanel[i].thumb_media_id == "") {
            this.$message.warning("封面不能为空");
            flag = false;
          }
          if (this.infospanel[i].content_source_url) {
            if (!this.checkURL(this.infospanel[i].content_source_url)) {
              this.$message.warning("域名格式不正确");
              flag = false;
            }
          }
        }

        this.infospanel.forEach(ele => {
          ele.content = ele.content.replace("&lt;iframe", "<iframe");
          ele.content = ele.content.replace(
            "&gt;&lt;/iframe&gt;",
            "></iframe>"
          );
          ele.content = ele.content.replace(
            'allowfullscreen="true" src',
            'allowfullscreen="true" data-src'
          );
        });

        if (flag) {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(255,255,255, 0.7)"
          });
          this.$axios
            .post(this.GLOBAL.BASE_URL + "meimgtextadd", {
              appid: this.$store.getters.showQuery,
              newlists: this.infospanel,
              id: this.meimgtextaddId,
              is_push: this.is_push
            })
            .then(res => {
              if (res.data.code == 0) {
                // 新增图文素材
                loading.close();
                this.$message.success("操作成功");
                this.is_push = 0;
                setTimeout(() => {
                  this.back();
                }, 1000);
              } else {
                this.$message.error(res.data.message);
              }
            });
        }
      } else {
        this.$message.warning("内容不能为空");
      }
    },
    // 保存
    save() {
      // console.log(this.is_save);
      if (this.is_edit) {
      } else {
        if (this.is_save) {
          // this.meimgtextsave();
          this.meimgtextsavePush();
        } else {
          this.meimgtextadd();
        }
      }
    },
    // 保存没有推送的消息
    savePush() {
      let flag = true;
      if (this.infospanel.length != 0) {
        for (var i = 0; i < this.infospanel.length; i++) {
          if (this.infospanel[i].title == "") {
            this.$message.warning("标题不能为空");
            flag = false;
          } else if (this.infospanel[i].content == "") {
            this.$message.warning("内容不能为空");
            flag = false;
          } else if (this.infospanel[i].thumb_media_id == "") {
            this.$message.warning("封面不能为空");
            flag = false;
          }
        }
        if (flag) {
          if (this.is_save) {
            this.meimgtextsavePush();
            // this.meimgtextsave()
          } else {
            this.meimgtextadd();
          }
        }
      }
    },
    // 保存消息
    meimgtextsavePush() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(255,255,255, 0.7)"
      });
      this.$axios
        .post(this.GLOBAL.BASE_URL + "meimgtextsave", {
          appid: this.$store.getters.showQuery,
          news: this.infospanel,
          media_id: this.meimgtextInfo.media_id,
          id: this.meimgtextInfo.id,
          is_push: this.is_push
        })
        .then(res => {
          if (res.data.code == 0) {
            loading.close();
            this.$message.success("更新成功");
            this.is_push = 0;
            setTimeout(() => {
              this.back();
            }, 500);
            this.$message.success("更新成功");
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    getWx() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "pullimgtext", {
          appid: this.$store.getters.showQuery,
          page: this.current_page
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
      // this.$redrawVueMasonry('containerId')
    },
    handleSizeChange1(val) {
      this.page1 = 1;
      this.limit1 = val;
      this.meimgtext();
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
.handle-box {
  margin-bottom: 10px;
}
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
.infositem_remark {
  background: #a8a8a8;
  color: #fff;
  display: flex;
  justify-content: center;
}
.infositem_remark p {
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
  line-height: 100px;
  box-sizing: border-box;
  padding: 0 10px 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  width: 270px;
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
  width: 100%;
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 10px;
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
  margin-bottom: 4px;
  position: relative;
  cursor: pointer;
}
.infoPanelPic {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 2px solid transparent;
  box-sizing: border-box;
  border-radius: 4px;
}
.infoPanelPic.active {
  border: 2px solid #409eff;
  box-sizing: border-box;
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
  border-radius: 0;
  overflow: hidden;
}
</style>