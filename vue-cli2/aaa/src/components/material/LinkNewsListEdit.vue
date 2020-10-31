<template>
  <div class="table">
    <div class="crumbs">
      <h2>外链图文编辑</h2>
    </div>
    <div class="panel">
      <div class="inputPanel">
        <el-form
          :model="infospanelObj"
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm"
          label-width="80px"
          :label-position="labelPosition"
        >
          <el-form-item label="标题图片" prop='picurl'>
            <div class="infoPanel">
              <div class="infoPanelPic" @click="chooseImg()">
                <img :src="showImg(infospanelObj.picurl)" v-show="infospanelObj.picurl" />
              </div>
              <div class="deletePanel">
                <i class="el-icon-delete-solid" @click="deletePanel(index)"></i>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="外链标题" prop='title'>
            <el-input v-model="infospanelObj.title" placeholder="标题"></el-input>
          </el-form-item>
          <el-form-item label="外链文案" prop='description'>
            <el-input type="textarea" v-model="infospanelObj.description" placeholder="简介"></el-input>
          </el-form-item>
          <el-form-item label="外链url" prop='url'>
            <el-input v-model="infospanelObj.url" placeholder="链接"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- is_update -->
            <el-button type="primary" v-if="is_update" @click="save()">更新</el-button>
            <el-button type="primary" v-else @click="save()">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog
      title="选择图片"
      :visible.sync="dialogVisible"
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
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureImg()">确 定</el-button>
      </span>
    </el-dialog>
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
      dialogVisible:false,
      modal: false,
      imgUrls:[],
      totals2: 0,
      page2: 1,
      limit2: 10,
      currentPage2: 1,
      imgUrl:''
    };
  },
  created() {},
  methods: {
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
    sureImg(){
      this.dialogVisible = false;
      this.infospanelObj.picurl = this.imgUrl;
    },
    // 选择图片
    chooseImg() {
      this.dialogVisible_img = true;
      this.getImgData();
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
  width: 200px;
  height: 200px;
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
.infos .infositem .infositem_head {
  width: 100%;
  height: 30px;
  text-align: center;
  line-height: 30px;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  height: 50px;
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
  width: 200px;
  height: 200px;
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