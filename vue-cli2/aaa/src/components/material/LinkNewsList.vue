<template>
  <div class="table">
    <div class="crumbs">
      <h2>外部链接素材管理</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-tooltip class="item" effect="dark" content="创建外链图文" placement="top">
          <el-button type="primary" icon="el-icon-plus" @click="create()">创建外链图文</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="创建地理位置图文" placement="top">
          <el-button type="primary" icon="el-icon-discover" @click="createLbs()">创建地理位置图文</el-button>
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
        v-masonry
        transition-duration="0.3s"
        item-selector=".infositem"
        v-loading="loading"
        id="containerId"
      >
        <div v-masonry-tile class="infositem" v-for="(item,index) in infospanel" :key="index">
          <div v-masonry-tile v-if="item.info">
            <div class="infositem_head" v-if="item.info[0]">{{handleCut(item.info[0].title,20)}}</div>
            <div class="infositem_body">
              <a
                v-if="item.info[0].url"
                :href="item.info[0].url"
                target="view_window"
                class="active"
              >预览</a>
              <div class="infositem_body_left" v-if="item.info[0]">{{handleCut(item.info[0].description,35)}}</div>
              <div class="infositem_body_right" v-if="item.info[0]">
                <img v-if="item.info[0]" :src="showImg(item.info[0].picurl)" />
              </div>
            </div>
            <!-- <div class="infositem_head infositem_remark">
              <el-tooltip class="item" effect="dark" content="点击可修改备注" placement="top">
                <p v-if="item.remark" @click="addRemark(item)">{{item.remark}}</p>
                <p v-else @click="addRemark(item)">点击添加备注</p>
              </el-tooltip>
            </div>
            <div class="infositem_bg">
              <div class="infositem_head" v-if="item.info[0]">{{item.info[0].title}}</div>
              <div class="infositem_img">
                <img v-if="item.info[0]" :src="showImg(item.info[0].picurl)" />
              </div>
              <div class="infositem_foot" v-if="item.info[0]">{{item.info[0].description}}</div>
            </div>
            <div class="nextInfos" v-show="ishift(item.info).length">
              <div class="nextInfosbg" v-for="(list,index) in ishift(item.info)" :key="index">
                <div class="nextInfos_head">{{list.title}}</div>
                <div class="nextInfos_img">
                  <img :src="showImg(list.picurl)" />
                </div>
              </div>
            </div>-->
          </div>
          <div class="infositem_tool" v-if="item.info">
            <div
              class="infositem_tools tool_left"
              v-if="item.status == 0"
              @click="handleDdit(item)"
            >
              <!-- <i class="el-icon-edit big"></i> -->
              <i class="big"><svg-icon icon-class="edit"></svg-icon></i>
            </div>
            <div class="infositem_tools tool_left" v-else @click="handleDis()">
              <!-- <i class="el-icon-edit big"></i> -->
              <i class="big"><svg-icon icon-class="edit"></svg-icon></i>
            </div>
            <div class="infositem_tools tool_right" @click="handleDel(item.id)">
              <!-- <i class="el-icon-delete-solid big"></i> -->
              <i class="big"><svg-icon icon-class="delete"></svg-icon></i>
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

    <!-- 创建外链素材 -->
    <el-dialog
      title="外链图文编辑"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="modal"
    >
      <el-form
        :model="infospanelObj"
        :rules="rules"
        ref="infospanelObj"
        class="demo-ruleForm"
        label-width="80px"
        :label-position="labelPosition"
      >
        <el-form-item label="标题图片" prop="picurl">
          <div class="infoPanel">
            <div class="infoPanelPic" @click="chooseImg()">
              <img :src="showImg(infospanelObj.picurl)" v-show="infospanelObj.picurl" />
            </div>
            <div class="deletePanel">
              <i class="el-icon-delete-solid" @click="deletePanel()"></i>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="外链标题" prop="title">
          <el-input v-model="infospanelObj.title" placeholder="标题" maxlength="100" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="外链文案" prop="description">
          <el-input
            type="textarea"
            v-model="infospanelObj.description"
            maxlength="200"
            show-word-limit
            placeholder="简介"
            :autosize="{ minRows: 6, maxRows: 8}"
          ></el-input>
        </el-form-item>
        <el-form-item label="外链url" prop="url">
          <el-input v-model="infospanelObj.url" placeholder="链接"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- is_update -->
          <el-button type="primary" v-if="is_update" @click="save()">更新</el-button>
          <el-button type="primary" v-else @click="save()">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 选择图片 -->
    <el-dialog
      title="选择图片"
      :visible.sync="dialogVisible_img"
      width="50%"
      center
      :close-on-click-modal="modal"
    >
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
        <el-button @click="dialogVisible_img = false">取 消</el-button>
        <el-button type="primary" @click="sureImg()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BaseView from "../common/BaseView";
export default {
  extends: BaseView,
  data() {
    return {
      labelPosition: "left",
      multiple: false,
      modal: false,
      meimgadd: this.GLOBAL.BASE_URL + "meimgadd",
      dialogVisible_remark: false,
      dialogVisible_img: false,
      dialogVisible: false,
      remark: "",
      have_cover: false,
      linkInfo: [],
      is_edit: true,
      is_update: false,
      uploadData: {
        appid: ""
      },
      imgUrls: [],
      loading: false,
      rules: {
        // name:[ { required: true, message: '请输入活动名称', trigger: 'blur' }]
      },
      infospanel: [
        // {id:'1',text:'11111'},
        // {id:'2',text:'22222'},
      ],
      infospanelObj: {
        picurl: "",
        title: "",
        description: "",
        url: ""
      },
      rules: {
        picurl: [{ required: true, message: "不能为空", trigger: "blur" }],
        title: [{ required: true, message: "不能为空", trigger: "blur" }],
        description: [{ required: true, message: "不能为空", trigger: "blur" }],
        url: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      addremark: {
        appid: "",
        id: "",
        remark: ""
      },
      count: 0,
      fit: "cover",
      melinkaddId: "",
      totals1: 0,
      page1: 1,
      limit1: 10,
      currentPage1: 1,

      totals2: 0,
      page2: 1,
      limit2: 10,
      currentPage2: 1,

      imgUrl: ""
    };
  },
  created() {
    if (localStorage.getItem("pages")) {
      this.page1 =
        JSON.parse(localStorage.getItem("pages")).linkNewsList || this.page;
      this.currentPage1 =
        JSON.parse(localStorage.getItem("pages")).linkNewsList || this.page;
    }

    localStorage.removeItem("lid");
    this.uploadData.appid = this.$store.getters.showQuery;
    this.melinkaddId = "";
    this.getData();
    // this.handleDel(167)
  },
  methods: {
    handleCut(str, num) {
      if (str.length < num) {
      } else {
        str = str.toString()
        str = str.substring(0, num) + "...";
      }
      return str;
    },
    // 增加备注
    addRemark(item) {
      this.dialogVisible_remark = true;
      if (!item.remark) {
        this.remark = "";
      } else {
        this.remark = item.remark;
      }
      this.addremark = item;
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
        .post(this.GLOBAL.BASE_URL + "melikremark", {
          appid: this.$store.getters.showQuery,
          id: this.addremark.id,
          remark: this.remark
        })
        .then(res => {
          if (res.data.code == 0) {
            this.getData();
          } else {
            this.$message.error(res.data.message);
          }
        });
      this.dialogVisible_remark = false;
    },
    createLbs() {
      this.$router.push({
        path: "/lbs"
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
            this.$message.success("获取成功");
            this.infospanel.push(res.data.data.data);
            this.totals = this.infospanel.length;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    toLBS() {
      this.$router.push({
        name: "lbs",
        params: {
          lbs: "lbs"
        }
      });
    },
    handleDis() {
      this.$message.warning("位置信息不可编辑");
    },
    ishift(arr) {
      let newArr = arr.map(o => Object.assign({}, o));
      newArr.shift();
      return newArr;
    },
    getInfo(item) {
      this.infospanelObj = item;
    },
    handleDel(value) {
      this.melinkaddId = value;
      this.melinkdel();
    },
    // 删除图文
    melinkdel() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "melinkdel", {
          id: this.melinkaddId,
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
    melinkadd() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "melinkadd", {
          id: this.melinkaddId,
          appid: this.$store.getters.showQuery,
          info: [this.infospanelObj]
        })
        .then(res => {
          if (res.data.code == 0) {
            this.dialogVisible = false;
            this.getData();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 保存
    save() {
      this.$refs["infospanelObj"].validate(valid => {
        if (valid) {
          if (!this.checkURL(this.infospanelObj.url)) {
            this.$message.warning("链接不合法");
            return false;
          }
          this.melinkadd();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    sureImg() {
      this.dialogVisible_img = false;
      this.infospanelObj.picurl = this.imgUrl;
    },
    // 选中状态
    handleChoose(item) {
      var _this = this;
      this.$nextTick(function() {
        this.imgUrls.forEach(function(item) {
          _this.$set(item, "active", false);
        });
        this.$set(item, "active", true);
      });
      this.imgUrl = item.url;
    },
    // 选择图片
    chooseImg() {
      this.dialogVisible_img = true;
      this.getImgData();
    },
    // 上传图片成功后的回调
    uploadSuccess(res, file) {
      this.loading = false;
      this.getImgData();
    },
    // 上传图片之前的判断
    beforeAvatarUpload(file) {
      this.loading = true;
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
        this.loading = false;
      }
      return isLt2M;
    },
    uploadError() {},
    handleClose() {},
    // 返回
    back() {
      this.infospanel = [];
      this.infospanelObj = {};
      this.is_edit = true;
      this.getData();
    },
    // 创建图文
    create() {
      this.dialogVisible = true;
      this.melinkaddId = "";
      this.infospanelObj.picurl = "";
      this.infospanelObj.title = "";
      this.infospanelObj.description = "";
      this.infospanelObj.url = "";
    },
    // 删除一个图文消息
    deletePanel(value) {
      this.infospanelObj.picurl = "";
    },
    // 添加一个图文数据
    addPanel() {
      this.count++;
      let obj = {};
      obj.id = this.count;
      obj.title = "";
      obj.description = "";
      obj.url = "";
      obj.image = "";
      this.infospanelObj = obj;
    },
    // 获取指定图文的数据
    melinkedit() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "melinkedit", {
          appid: this.$store.getters.showQuery,
          id: this.melinkaddId
        })
        .then(res => {
          if (res.data.code == 0) {
            this.is_edit = false;
            this.infospanel = res.data.data.info;
            this.infospanelObj = this.infospanel[0];
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 外链图文编辑
    handleDdit(item) {
      this.dialogVisible = true;
      this.melinkaddId = item.id;
      this.infospanelObj.picurl = item.info[0].picurl;
      this.infospanelObj.title = item.info[0].title;
      this.infospanelObj.description = item.info[0].description;
      this.infospanelObj.url = item.info[0].url;
    },
    getWx() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "pullimgtext", {
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("获取成功");
            if (res.data.data) {
              this.infospanel.push(res.data.data);
            }
            this.totals = this.infospanel.length;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 翻页
    handleCurrentChange1(val) {
      this.page1 = val;
      this.getData();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.linkNewsList = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    handleSizeChange1(val) {
      this.page1 = 1;
      this.limit1 = val;
      this.getData();
    },
    // 获取数据
    getData() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "melink", {
          appid: this.$store.getters.showQuery,
          page: this.page1,
          limit: this.limit1
        })
        .then(res => {
          if (res.data.code == 0) {
            this.infospanel = res.data.data.data;
            this.totals1 = res.data.data.total;
            this.currentPage11 = res.data.data.current_page;
            if (this.page1 > res.data.data.last_page) {
              this.page1 = res.data.data.last_page;
              this.getData();
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
      this.$axios
        .post(this.GLOBAL.BASE_URL + "meimg", {
          appid: this.$store.getters.showQuery,
          page: this.page2,
          limit: this.limit2
        })
        .then(res => {
          if (res.data.code == 0) {
            this.imgUrls = res.data.data.data;
            this.totals2 = res.data.data.total;
            this.currentPage2 = res.data.data.current_page;
            if (this.page2 > res.data.data.last_page) {
              this.page2 = res.data.data.last_page;
              this.getImgData();
            }
            this.totals1 = res.data.data.total;
          } else {
            this.$message.error(res.data.message);
          }
        });
    }
  }
};
</script>

<style scoped>
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
.panel .btn {
  display: flex;
  flex-direction: column;
}
.panel .btn button {
  margin-left: 0;
  margin-bottom: 10px;
}
.nextInfosbg {
  width: 100%;
  height: 100px;
  display: flex;
  border-top: 1px solid #ccc;
  overflow: hidden;
}
.nextInfos_head {
  width: 60%;
  height: 100px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.nextInfos_img {
  width: 40%;
  height: 100px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.infoPanelPic {
  width: 160px;
  height: 160px;
  overflow: hidden;
  border-radius: 2px;
}
.infoPanelPic img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 2px;
}
.preview {
  width: 100%;
  height: 100%;
  background: rgb(122, 121, 121, 0.7);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 14px;
  border-radius: 5px;
}
.infositem_bg {
  position: relative;
  /* border: 1px solid #ccc; */
  border-radius: 5px;
}
.imgcover {
  width: 100px;
  height: auto;
  display: flex;
  justify-content: center;
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
.infos {
  width: 100%;
  height: 100%;
}
.infositem_bg {
  position: absolute;
  top: 0;
  left: 0;
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
.infos .infositem .infositem_head {
  width: 100%;
  padding: 8px 10px;
  box-sizing: border-box;
}
.infositem_body {
  width: 100%;
  display: flex;
  max-height: 100px;
  overflow: hidden;
  position: relative;
}
.infos .infositem .infositem_body .active {
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
.infos .infositem .infositem_body:hover .active {
  display: flex;
}
.infositem_body_left {
  width: 60%;
  overflow: hidden;
  padding: 10px;
  box-sizing: border-box;
}
.infositem_body_right {
  width: 40%;
  overflow: hidden;
  padding: 10px 0;
  box-sizing: border-box;
}
.infositem_body_right img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.infos .infositem .infositem_img {
  width: 90%;
  height: 160px;
  margin: auto;
  overflow: hidden;
  position: relative;
}
.infos .infositem .infositem_img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.infos .infositem .infositem_foot {
  width: 100%;
  height: 30px;
  text-align: center;
  line-height: 30px;
  box-sizing: border-box;
  padding: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.infositem_tool {
  width: 100%;
  height: 30px;
  border-top: 1px solid rgb(230, 230, 230);
  display: flex;
}
.infositem_tools {
  width: 50%;
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
.tool_right:hover {
  background: red;
  color: #fff;
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
.addPanel {
  width: 100%;
  height: 80px;
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
.infoPanel {
  width: 160px;
  height: 160px;
  background: #ccc;
  border: 1px solid transparent;
  margin-bottom: 4px;
  position: relative;
  cursor: pointer;
}
.infoPanel.active {
  border: 1px solid #333;
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
.inputPanel {
  width: 100%;
  height: 100%;
  padding: 30px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-left: 40px;
}
.big {
  font-size: 20px;
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
.el-upload--text {
  width: auto;
  border: none;
  height: auto;
}
</style>