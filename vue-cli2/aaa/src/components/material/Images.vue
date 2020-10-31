<template>
  <div class="table">
    <div class="crumbs">
      <h2>图片素材管理</h2>
    </div>
    <div class="container" v-loading="loading">
      <div class="handle-box">
        <el-form :inline="true">
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="点击上传图片" placement="top">
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
              <el-button type="primary" icon="el-icon-folder-opened" @click="getWx()">获取微信素材</el-button>
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
      <div class="imgItem">
        <div
          class="img"
          v-for="(item,index) in imgUrls"
          :key="index"
          @mouseover="selectStyle(item) "
          @mouseout="outStyle(item)"
        >
          <div class="infositem_head infositem_remark">
            <el-tooltip class="item" effect="dark" content="点击可修改备注" placement="top">
              <p v-if="item.remark" @click="addRemark(item)">{{item.remark}}</p>
              <p v-else @click="addRemark(item)">点击添加备注</p>
            </el-tooltip>
          </div>

          <!-- <el-image :src="showImg(item.url)" :fit="fit"></el-image> -->
          <img :src="showImg(item.url)" />
          <span class="imgTxt">{{item.name}}</span>
          <div class="imgDelete" v-show="item.active">
            <i class="el-icon-close" @click="deleteImg(item)"></i>
          </div>
        </div>
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
import BaseView from "../common/BaseView";
export default {
  extends: BaseView,
  data() {
    return {
      multiple: false,
      modal: false,
      meimgadd: this.GLOBAL.BASE_URL + "meimgadd",
      uploadData: {
        appid: ""
      },
      imgUrls: [],
      loading: false,
      fit: "fill",
      totals: 0,
      page: 1,
      limit: 10,
      currentPage: 1,
      dialogVisible_remark: false,
      addremark: {
        appid: "",
        id: "",
        remark: ""
      },
      remark: ""
    };
  },
  created() {
    if (localStorage.getItem("pages")) {
      this.page = JSON.parse(localStorage.getItem("pages")).images || this.page;
      this.currentPage =
        JSON.parse(localStorage.getItem("pages")).images || this.page;
    }
    this.uploadData.appid = this.$store.getters.showQuery;
    this.getData();
  },
  methods: {
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
        .post(this.GLOBAL.BASE_URL + "meimgremark", {
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
    getWx() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "pullimgtext", {
          appid: this.$store.getters.showQuery,
          page: this.current_page,
          type: "image"
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
    // 上传图片成功后的回调
    uploadSuccess(res, file) {
      this.loading = false;
      if (res.code == 0) {
        this.getData();
      } else {
        this.$message.error(res.message);
      }
    },
    // 上传图片之前的判断  判断图片的大小
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
    // 删除图片
    deleteImg(value) {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "meimgdel", {
          appid: this.$store.getters.showQuery,
          id: value.id,
          media_id: value.media_id
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("操作成功");
            // this.current_page = 1;
            this.getData();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 翻页
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.images = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    // 翻页
    handleSizeChange(val) {
      this.page = this.currentPage;
      this.limit = val;
      this.getData();
    },
    // 获取数据
    getData() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "meimg", {
          appid: this.$store.getters.showQuery,
          page: this.page,
          limit: this.limit
        })
        .then(res => {
          if (res.data.code == 0) {
            this.loading = false;
            this.imgUrls = res.data.data.data;
            this.totals = res.data.data.total;
            this.currentPage = res.data.data.current_page;
            if (this.page > res.data.data.last_page) {
              this.page = res.data.data.last_page;
              this.getData();
            }
            this.totals = res.data.data.total;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 选中
    selectStyle(item) {
      var _this = this;
      this.$nextTick(function() {
        this.imgUrls.forEach(function(item) {
          _this.$set(item, "active", false);
        });
        this.$set(item, "active", true);
      });
    },
    outStyle(item) {
      this.$set(item, "active", false);
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
</style>
<style scoped>
.infositem_remark {
  background: #a8a8a8;
  color: #fff;
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0;
}
.infositem_remark p {
  width: 100%;
  margin: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
.infositem_head {
  width: 100%;
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.imgItem {
  width: 100%;
  height: 100%;
}
.imgItem .img {
  display: inline-block;
  width: 250px;
  height: 170px;
  position: relative;
  border: 1px solid #ccc;
  margin-right: 20px;
  margin-bottom: 20px;
  overflow: hidden;
  border-radius: 5px;
  overflow: hidden;
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
.imgItem .img .imgDelete {
  position: absolute;
  top: 30px;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(77, 76, 76, 0.5);
}
.imgItem .img .imgDelete i {
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 20px;
  cursor: pointer;
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
