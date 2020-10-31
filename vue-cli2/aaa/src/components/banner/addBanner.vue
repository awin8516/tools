<template>
  <div class="table">
    <div class="crumbs">
      <h2>新增轮播图</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-back" @click="back()">返回</el-button>
      </div>
      <el-form ref="form" :model="banner" label-width="120px">
        <el-form-item label="跳转地址-小程序">
          <div class="largeinput">
            <el-input v-model="banner.url1"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="跳转地址-H5">
          <div class="largeinput">
            <el-input v-model="banner.url"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="排序">
          <div class="largeinput">
            <el-input-number
              v-model="banner.number"
              @change="handleChange()"
              :min="1"
              :max="10"
              label="描述文字"
            ></el-input-number>
          </div>
        </el-form-item>
        <el-form-item label="封面图片" prop="img">
          <template slot-scope>
            <div class="fm upload">
              <el-upload
                class="upload-demo"
                :action="img_add"
                :data="uploadData"
                :before-upload="beforeAvatarUpload"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :show-file-list="false"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
                <p style="font-size:12px;color:gray;">支持jpg、png图片格式，大小不超过2M</p>
            </div>
            <div class="imgs fm" v-for="(item,index) in fmimgData" :key="index">
              <i class="el-icon-error" @click="delImg(item,index)"></i>
              <el-image :src="showImg(item.path)" fit="cover"></el-image>
              <!-- <p class="fmid">{{item.id}}</p> -->
            </div>
          </template>
        </el-form-item>
        <el-form-item>
          <el-button v-if="is_edit" type="primary" @click="updateBanner()" :disabled="isDisable">修改</el-button>
          <el-button v-else type="primary" @click="addBanner()" :disabled="isDisable">确认</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      img_add: this.GLOBAL.BASE_URL + 'shop/img_add',
      isDisable: false,
      banner: {
        id: "",
        url: "", //h5跳转地址
        url1: "", //小程序跳转地址
        number: "1", //排序序号
        appid: "",
        img_id: "" //图篇id
      },
      uploadData: {
        appid: ""
      },
      // 封面图片
      fmimgData: [],
      is_edit: false
    };
  },
  created() {
    this.banner.appid = this.$store.getters.showQuery;
    this.uploadData.appid = this.$store.getters.showQuery;
    this.getBanner();
  },
  // 离开当前页面
  destroyed: function() {
    if (localStorage.getItem("banner")) {
      localStorage.removeItem("banner");
    }
  },
  methods: {
    // 修改
    updateBanner() {
      this.isDisable = true;
      if (this.banner.img_id == "") {
        this.$message.warning("图片不能为空");
        this.isDisable = false;
      } else {
        this.$axios
          .post(this.GLOBAL.BASE_URL + "shop/banner_update", this.banner)
          .then(res => {
            if (res.data.code == 0) {
              this.$message.success("修改成功，即将跳转");
              setTimeout(() => {
                this.$router.push({
                  path: "/lunbo"
                });
                this.isDisable = false;
              }, 100);
            } else {
              this.isDisable = false;
              this.$message.error(res.data.message);
            }
          });
      }
    },
    // 获取baner信息
    getBanner() {
      if (this.$route.params && this.$route.params.id) {
        this.banner = this.$route.params.id;
        this.is_edit = true;
        this.fmimgData.push(JSON.parse(localStorage.getItem("banner")).img);
      } else if (localStorage.getItem("banner")) {
        this.banner = JSON.parse(localStorage.getItem("banner")).id;
        this.is_edit = true;
        this.fmimgData.push(JSON.parse(localStorage.getItem("banner")).img);
      } else {
      }
    },
    // 提交banner信息
    addBanner() {
      this.isDisable = true;
      if (this.banner.img_id == "") {
        this.$message.warning("图片不能为空");
        this.isDisable = false;
      } else {
        this.$axios
          .post(this.GLOBAL.BASE_URL + "shop/banner_add", this.banner)
          .then(res => {
            if (res.data.code == 0) {
              this.$message.success("新增成功，即将跳转");
              setTimeout(() => {
                this.$router.push({
                  path: "/lunbo"
                });
                this.isDisable = false;
              }, 100);
            } else {
              this.isDisable = false;
              this.$message.error(res.data.message);
            }
          });
      }
    },
    // 排序
    handleChange() {},
    // 删除图片
    delImg(item, index) {
      this.fmimgData.splice(index, 1);
      this.banner.img_id = "";
    },
    // 返回
    back() {
      this.$router.push({
        path: "/lunbo"
      });
    },
    // 上传图片拿到id和url传进去
    uploadSuccess(res, file) {
      this.fmimgData = [];
      this.fmimgData.push(res.data);
      this.fmimgData.forEach(ele => {
        ele.path = ele.url;
      });
      this.banner.img_id = res.data.id;
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
    uploadError() {}
  }
};
</script>

<style scoped>
.largeinput {
  width: 500px;
}
/* ---------------- */
.upload .el-upload--text {
  border: none;
  width: auto;
  height: 30px;
}
</style>
<style>
.fm {
  margin-top: 0px !important;
}
/* --------------- */
.imgs {
  width: 150px;
  height: auto;
  border-radius: 5px;
  margin-top: 10px;
  overflow: hidden;
  margin-right: 10px;
  /* border: 1px solid #ddd; */
  position: relative;
}

.imgs > i {
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 20px;
  color: #fff;
  z-index: 99;
  cursor: pointer;
}
/* --------------- */
/* ------------------ */
.pagination {
  display: flex;
  justify-content: flex-end;
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

