<template>
  <div class="table">
    <div class="crumbs">
      <h2>短信签名编辑</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-tooltip class="item" effect="dark" content="返回签名列表" placement="top">
          <el-button type="primary" icon="el-icon-back" @click="back()">返回</el-button>
        </el-tooltip>
      </div>
      <div class="form">
        <el-form
          ref="form"
          :model="form"
          label-width="120px"
          :label-position="labelPosition"
          :rules="rules"
        >
          <el-form-item label="签名名称" prop="sign_name">
            <div class="inputArea">
              <el-input type="text" v-model="form.sign_name" placeholder="请输入签名"></el-input>
              <p class="uploadTips">长度限2－12个字符，建议为用户真实应用名/网站名/公司名无须添加【】、()、[]符号，签名发送会自带【】符号，避免重复</p>
            </div>
          </el-form-item>
          <el-form-item label="签名来源" prop="sign_source">
            <el-select v-model="form.sign_source" placeholder="请选择签名来源">
              <el-option label="企事业单位的全称或简称" value="0"></el-option>
              <el-option label="个人" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传营业执照">
            <el-tooltip class="item" effect="dark" content="点击上传营业执照" placement="top">
              <el-upload
                class="upload-demo1"
                :action="fileupload"
                :data="tagfile"
                :before-upload="beforeAvatarUpload"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :file-list="total_files.fileList"
                :show-file-list="false"
                :on-remove="handleRemove"
                :multiple="multiple"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-tooltip>

            <p
              class="uploadTips"
            >请上传签名归属方的企事业单位的企业营业执照、组织机构代码证、税务登记证三证合一的证件签名发送会自带【】符号，避免重复,图片不能大于2M</p>
            <!-- 预览图片 -->
            <div class="preview" v-if="total_files.fileList.length != 0">
              <viewer :images="total_files.fileList">
                <img
                  v-for="item in total_files.fileList"
                  :src="showPath(item.response.data.path)"
                  :key="item.title"
                />
              </viewer>
            </div>
          </el-form-item>
          <el-form-item label="上传授权委托书">
            <el-tooltip class="item" effect="dark" content="点击上传授权委托书" placement="top">
              <el-upload
                class="upload-demo2"
                :action="de_fileupload"
                :data="de_tagfile"
                :before-upload="de_beforeAvatarUpload"
                :on-success="de_uploadSuccess"
                :on-error="de_uploadError"
                :file-list="total_files.de_fileLists"
                :on-remove="de_handleRemove"
                :show-file-list="false"
                :multiple="multiple"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-tooltip>

            <p class="uploadTips">
              请
              <span style="cursor:pointer;color:#409EFF;" @click="downHandle()">点击此处下载</span>授权委托书填写盖章后上传
            </p>
            <!-- 预览图片 -->
            <div class="preview" v-if="total_files.de_fileLists.length != 0">
              <viewer :images="total_files.de_fileLists">
                <img
                  v-for="item in total_files.de_fileLists"
                  :src="showPath(item.response.data.path)"
                  :key="item.title"
                />
              </viewer>
            </div>
          </el-form-item>
          <el-form-item label="申请说明" prop="remark">
            <div class="inputArea">
              <el-input
                type="textarea"
                v-model="form.remark"
                placeholder="请描述您的业务使用场景"
                :autosize="{ minRows: 4, maxRows: 4}"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item>
            <el-tooltip
              class="item"
              effect="dark"
              content="重新提交审核"
              placement="top"
              v-if="is_resubmit"
            >
              <el-button type="primary" @click="onSubmit('form')" :disabled="disabled">重新提交审核</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="立即创建签名" placement="top" v-else>
              <el-button type="primary" @click="onSubmit('form')" :disabled="disabled">立即创建</el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      multiple: false,
      loading: false,
      fileupload: this.GLOBAL.BASE_URL + "fileupload",
      de_fileupload: this.GLOBAL.BASE_URL + "fileupload",
      tagfile: {
        appid: this.$store.getters.showQuery,
        type: 1
      },
      de_tagfile: {
        appid: this.$store.getters.showQuery,
        type: 1
      },
      labelPosition: "left",
      form: {
        appid: this.$store.getters.showQuery,
        sign_name: "",
        sign_source: "",
        remark: "",
        file: []
      },
      rules: {
        sign_name: [
          { required: true, message: "请输入签名名称", trigger: "blur" },
          { min: 2, max: 12, message: "长度在 2 到 12 个字符", trigger: "blur" }
        ],
        sign_source: [
          { required: true, message: "请输入签名来源", trigger: "blur" }
        ],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }]
      },
      disabled: false,
      smsObj: {},
      total_files: {
        fileList: [],
        de_fileLists: []
      },
      is_resubmit: false
    };
  },
  created() {
    if (localStorage.getItem("smsobj")) {
      this.is_resubmit = true;
      this.form = JSON.parse(localStorage.getItem("smsobj"));
      this.form.sign_source = this.form.sign_source.toString();
      if (this.form.total_files) {
        this.total_files = this.form.total_files;
        this.form.total_files.fileList.forEach((ele, index) => {
          ele.url = this.GLOBAL.URL + ele.response.data.path;
        });
        this.form.total_files.de_fileLists.forEach((ele, index) => {
          ele.url = this.GLOBAL.URL + ele.response.data.path;
        });
      }
    }
  },
  methods: {
    hanldePreview(url) {
    },
    showPath(str) {
      return  this.GLOBAL.URL+str;
    },
    downHandle() {
      window.location.href = this.GLOBAL.CERTIFICATE;
    },
    de_handleRemove(file, fileList) {
      this.total_files.de_fileLists = fileList;
    },
    handleRemove(file, fileList) {
      this.total_files.fileList = fileList;
    },
    // 山川托片
    // 上传图片成功后的回调
    uploadSuccess(res, file, fileList) {
      if (res.code == 0) {
        this.loading = false;
        this.total_files.fileList = fileList;
      } else {
        this.$message.error(res.message);
      }
    },
    // 上传图片之前的判断  判断图片的大小
    beforeAvatarUpload(file) {
      let isJPG = false;
      if (
        file.type == "image/jpeg" ||
        file.type == "image/jpg" ||
        file.type == "image/png" ||
        file.type == "image/gif"
      ) {
        isJPG = true;
      }
      let isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG、jpeg、png、gif 格式!");
        return false;
      }
      if (!(file.size / 1024 / 1024 < 2)) {
        this.$message.error("上传图片大小不能超过 2MB!");
        return false;
      } else {
      }
    },
    uploadError() {
    },
    // 上传图片成功后的回调
    de_uploadSuccess(res, file, fileList) {
      if (res.code == 0) {
        this.loading = false;
        this.total_files.de_fileLists = fileList;
      } else {
        this.$message.error(res.message);
      }
    },
    // 上传图片之前的判断  判断图片的大小
    de_beforeAvatarUpload(file) {
      let isJPG = false;
      if (
        file.type == "image/jpeg" ||
        file.type == "image/jpg" ||
        file.type == "image/png" ||
        file.type == "image/gif"
      ) {
        isJPG = true;
      }
      let isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG、jpeg、png、gif 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
        return false;
      }

      // console.log(file);
    },
    de_uploadError() {
    },
    // 立即常见
    onSubmit(formName) {
      this.loading = true;
      let files = [];
      this.total_files.fileList.forEach(ele => {
        if (!ele.response) {
          files.push(ele.url);
        } else {
          files.push(ele.response.data.path);
        }
      });
      this.total_files.de_fileLists.forEach(ele => {
        if (!ele.response) {
          files.push(ele.url);
        } else {
          files.push(ele.response.data.path);
        }
      });

      if (files.length == 0) {
        this.$message.warning("请上传文件");
        return false;
      }
      this.form.file = files;
      this.form.total_files = this.total_files;

      this.$refs['form'].validate(valid => {
        if (valid) {
          if (localStorage.getItem("smsobj")) {
            this.signresubmit();
          } else {
            this.smssignsave();
          }
        } else {
          this.loading = false;
          this.$message.warning("请完整填写选项");
          return false;
        }
      });
    },
    // 重新提交审核
    signresubmit() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(255,255,255, 0.7)"
      });
      this.disabled = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "signresubmit", this.form)
        .then(res => {
          loading.close();
          this.disabled = false;
          if (res.data.code == 0) {
            this.$message.success("操作成功");
            setTimeout(() => {
              this.back();
            }, 100);
          } else {
            this.$message.error(res.data.message);
            setTimeout(() => {
              this.back();
            }, 100);
          }
        });
    },
    // 保存签名
    smssignsave() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(255,255,255, 0.7)"
      });
      this.disabled = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "smssignsave", this.form)
        .then(res => {
          loading.close();
          this.disabled = false;
          if (res.data.code == 0) {
            this.$message.success("操作成功");
            setTimeout(() => {
              this.back();
            }, 100);
          } else {
            this.$message.error(res.data.message);
            setTimeout(() => {
              this.back();
            }, 100);
          }
        });
    },
    // 返回
    back() {
      if (localStorage.getItem("smsobj")) {
        localStorage.removeItem("smsobj");
      }
      this.$router.push({
        name: "SmsList"
      });
    }
  }
};
</script>

<style>
.upload-demo1 {
  width: 80px;
  margin-right: 10px;
}
.upload-demo1 .el-upload--text {
  width: auto;
  height: auto;
  border: none;
}
.upload-demo2 {
  width: 80px;
  margin-right: 10px;
}
.upload-demo2 .el-upload--text {
  width: auto;
  height: auto;
  border: none;
}
.el-upload-list--picture .el-upload-list__item-thumbnail {
  object-fit: cover;
}
</style>
<style scoped>
.preview {
  width: 100%;
  height: auto;
  margin-top: 10px;
}
.preview > div {
  width: 100px;
  height: 100px;
  cursor: pointer;
  display: inline-flex;
  border-radius: 4px;
}
.preview > div img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin-right: 10px;
}
.uploadTips {
  font-size: 12px;
  color: rgb(173, 173, 180);
  margin-top: 10px;
  line-height: 16px;
}
.form {
  width: 600px;
}
.inputArea {
  width: 400px;
}
/* -------------- */


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

