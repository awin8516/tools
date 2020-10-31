<template>
  <div>
    <div class="handle-box upload">
      <el-upload
        class="upload-demo"
        :action="img_add"
        :data="uploadData"
        multiple
        :before-upload="beforeAvatarUpload"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :show-file-list="false"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        
                <p style="font-size:12px;color:gray;">支持jpg、png图片格式，大小不超过2M</p>
      </el-upload>
    </div>
    <div class="imgItem">
      <div class="img" v-for="(item,index) in imgUrls" :key="index" @click="handleChoose(item)">
        <el-image :src="showImg(item.url)" fit="fit"></el-image>
        <span class="imgTxt">{{item.name}}</span>
        <div class="imgClose" v-show="item.active">
          <i class="el-icon-check" @click="deleteImg(item)"></i>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="sureImg()">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
  </div>
</template>

<script>
import BaseView from "../common/BaseView";
export default {
  extends: BaseView,
  data(){
    return{
      img_add: this.GLOBAL.BASE_URL + 'shop/img_add',
      imgUrls:[],
      uploadData: {
        appid: ""
      },
      page:1,
      imgData:{}
    }
  },
  created(){
    this.uploadData.appid = this.$store.getters.showQuery
  },
  methods:{
    // 确定选中的图片
    sureImg() {
      this.$emit("listenChild",this.imgData); //
    },
    // 确定选择
    handleChoose(item) {
      this.imgData = item;
      var _this = this;
      this.$nextTick(function() {
        this.imgUrls.forEach(function(item) {
          _this.$set(item, "active", false);
        });
        this.$set(item, "active", true);
      });
    },
    // 分页
    handleCurrentChange(val){
      this.page = val;
      this.getImgData()
    },
    // 获取图片数据
    getImgData() {
      this.uploadData.appid = this.$store.getters.showQuery
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "meimg", {
          appid: this.$store.getters.showQuery,
          page:this.page
        })
        .then(res => {
          if (res.data.code == 0) {
            this.loading = false;
            this.imgUrls = res.data.data;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 上传成功
    uploadSuccess(res, file) {
      this.loading = false;
      this.getImgData();
    },
    // 上传之前判断数据大小
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
  }
};
</script>
<style>
.upload .el-upload--text{
  border: none;
  width: auto;
  height: 30px;
}
</style>

<style scoped>
.upload-demo {
  width: 360px;
}
.upload{
  width: 0px;
  height: auto;
  border: none;
}
.upload .upload-demo .el-upload--text {
  width: 0px;
  height: 0px;
  border: none;
}
.imgItem {
  width: 100%;
  height: 100%;
}
.imgItem .img {
  display: inline-block;
  width: 120px;
  height: 140px;
  position: relative;
  border: 1px solid #ccc;
  margin-right: 20px;
  margin-bottom: 20px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 5px;
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
}
.imgItem .img .imgClose i {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 40px;
  color: #fff;
}
</style>

