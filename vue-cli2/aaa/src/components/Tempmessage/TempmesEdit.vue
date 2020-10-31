<template>
  <div class="table">
    <div class="crumbs">
      <h2>模板编辑</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-tooltip class="item" effect="dark" content="返回模板消息列表" placement="top">
          <el-button type="success" @click="back()" icon="el-icon-back">返回模板消息列表</el-button>
        </el-tooltip>
      </div>
      <div class="info">
        <div class="info_title">
          <p>模板标题：{{tempObj.title}}</p>
          <p>模板ID：{{tempObj.template_id}}</p>
        </div>
        <div class="info_area">
          <div class="info_content">
            <h3>模板内容：</h3>
            <div class="info_content_content">
              <pre class="preStyle">{{tempObj.example}}</pre>
            </div>
          </div>
          <div class="info_content">
            <h3>模板预览：</h3>
            <div class="info_content_content">
              <pre class="preStyle">{{newContent}}</pre>
            </div>
          </div>
          <br />
          <div class="area1">
            <div class="simple_content_item">
              <p v-for="(list,index) in simpleContentItem" :key="index">{{showKey(list)}}：</p>
            </div>
            <div class="simple_content_value">
              <el-input
                v-for="(item,index) in simpleCont"
                :key="index"
                v-model="simpleCont[index]"
                placeholder="请输入内容"
                @input="changeCon"
              ></el-input>
            </div>
          </div>
        </div>
        <div class="area">
          <p>发送内容选择</p>
          <div class="inputArea">
            <el-radio-group v-model="conType">
              <el-radio :label="1">url</el-radio>
              <el-radio :label="2">小程序</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="area" v-if="conType == 1">
          <p>url</p>
          <div class="inputArea">
            <el-input v-model="tempObj.url" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="area" v-if="conType == 2">
          <p>小程序</p>
          <div class="inputArea">
            <el-input placeholder="appid" v-model="miniprogram.appid">
              <template slot="prepend">小程序appid</template>
            </el-input>
            <div class="line"></div>
            <el-input placeholder="path" v-model="miniprogram.path">
              <template slot="prepend">页面路径</template>
            </el-input>
          </div>
        </div>
        <div class="area">
          <p>发送目标选择</p>
          <div class="inputArea">
            <el-radio-group v-model="send_type">
              <el-radio :label="1">openid</el-radio>
              <el-radio :label="2">自定义标签</el-radio>
              <el-radio :label="0">全部用户</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="area" v-if="send_type == '1'">
          <p>填写目标用户openid</p>
          <div class="inputArea">
            <el-input
              type="textarea"
              :autosize="{ minRows: 6, maxRows: 10}"
              placeholder="请填入目标用户opneid，使用英文逗号分隔"
              v-model="filter_content"
              @keyup.native="number"
              @change="changeFilterCont(filter_content)"
            ></el-input>
          </div>
        </div>
        <div class="area" v-if="send_type  == '2'">
          <p>选择目标用户标签</p>
          <div class="inputArea">
            <el-select
              v-model="diy_tagid"
              placeholder="请选择自定义标签"
              multiple
              @change="getDiyTag(diy_tagid)"
            >
              <el-option
                v-for="(item,index) in diy_tagList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="area" v-if="send_type  == '2' || send_type  == '0'">
          <p>选择过滤用户自定义标签</p>
          <div class="inputArea">
            <el-select
              v-model="drop_tagid"
              placeholder="选择过滤用户自定义标签"
              multiple
              @change="getDiyTag(drop_tagid)"
            >
              <el-option
                v-for="(item,index) in diy_tagList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="area" v-if="send_type == '3'">
          <p>选择目标用户表格</p>
          <div class="inputArea">
            <el-upload
              class="upload-demo"
              :action="fileupload"
              :data="tagfile"
              :before-upload="beforeAvatarUpload"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :multiple="multiple"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </div>
        </div>
        <div class="area">
          <p>发送时间选择</p>
          <div class="inputArea">
            <el-date-picker
              v-model="tempObj.send_time"
              type="datetime"
              :picker-options="pickerOptions"
              placeholder="选择日期时间"
              @change="changeSendTime"
            ></el-date-picker>
          </div>
        </div>
        <br />
        <div class="area">
          <p></p>
          <div class="inputArea">
            <el-tooltip class="item" effect="dark" content="批量发送模板消息" placement="top">
              <el-button type="primary" @click="submit()">确认发送消息</el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <v-danger
      ref="danger"
      @dangerSure="dangerSure"
      :danger_type="danger_type"
      :danger_ontent="danger_ontent"
    ></v-danger>
  </div>
</template>

<script>
import vDanger from "../dialogs/danger.vue";
export default {
  components: {
    vDanger
  },
  data() {
    return {
      multiple: false,
      fileupload: this.GLOBAL.BASE_URL + "fileupload",
      tagfile: {
        appid: ""
      },
      send_type: 1,
      conType: 1,
      send_content: [],
      filter_content: "",
      value: "",
      id: "",
      textarea2: "",
      timepicker: "",
      start_time: "",
      end_time: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e6;
        }
      },
      diy_tagList: [],
      page: 1,
      limit: 10000,
      diy_tagid: "",
      drop_tagid: "",
      tempObj: {},
      miniprogram: {
        appid: "",
        path: ""
      },
      tempnewObj: {},
      simpleContentItem: [],
      simpleCont: [],
      danger_type: "发送模板消息",
      danger_ontent: "发送模板消息，此操作会将发送模板消息",
      date_value: "",
      newContent: ""
    };
  },
  created() {
    this.id = window.atob(localStorage.getItem("tid"));
    this.tagfile.appid = this.$store.getters.showQuery;
    this.getDetail();
    this.getalldiytag();
  },
  mounted() {},
  methods: {
    changeCon(val) {
      this.showContent();
    },
    showContent(item = this.simpleCont) {
      this.newContent = JSON.parse(JSON.stringify(this.tempObj.content));
      for (let i = 0; i < this.simpleContentItem.length; i++) {
        let reg = "{{" + this.simpleContentItem[i] + ".DATA}}";
        this.newContent = this.newContent.replace(reg, item[i] || "");
      }
    },
    number() {
      // this.filter_content = this.filter_content.replace(/[^\d\,]/g, "");
      // this.filter_content = this.filter_content.replace(".", "");
    },
    changeSendTime(val) {
      var date = new Date(val);
      var hours =
        date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
      var minutes =
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
      var seconds =
        date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
      this.date_value =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;
      // console.log(this.date_value);
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
    // 上传图片成功后的回调
    uploadSuccess(res, file) {
      // console.log(res);
      if (res.code == 0) {
        this.filter_content = res.data.path;
        this.loading = false;
      } else {
        this.$message.error(res.message);
      }
    },
    // 上传图片之前的判断  判断图片的大小
    beforeAvatarUpload(file) {
      let isLt2M;
      let type = file.name.split(".")[file.name.split(".").length - 1];
      if (type == "csv") {
        isLt2M = true;
      } else {
        isLt2M = false;
      }
      this.loading = true;
      if (!isLt2M) {
        this.$message.error("请上传CSV类型的文件");
        this.loading = false;
      }
      return isLt2M;
    },
    uploadError() {},
    newItem(item) {
      return item.value;
    },
    // 组合成的模板
    getDiyTag(val) {
      // this.filter_content = val;
    },
    changeFilterCont(item) {},
    // 确认提交
    submit() {
      this.tempObj.send_content = this.simpleCont;
      this.tempObj.send_type = this.send_type;
      this.tempObj.miniprogram = this.miniprogram;
      if (this.tempObj.send_type == "3") {
        this.tempObj.filter_content = this.filter_content;
      } else if (this.tempObj.send_type == "1") {
        this.tempObj.filter_content = this.filter_content.split(",");
      } else if (this.tempObj.send_type == "2") {
        this.tempObj.filter_content = this.diy_tagid;
        this.tempObj.drop_content = this.drop_tagid;
      } else if (this.tempObj.send_type == "0") {
        this.tempObj.filter_content = [];
        this.tempObj.drop_content = this.drop_tagid;
      }

      let flag = true;
      for (var i = 0; i < this.simpleCont.length; i++) {
        if (!this.simpleCont[i]) {
          flag = false;
        }
      }
      if (this.tempObj.send_type == 1) {
        // checkURL
        if (!flag) {
          this.$message.warning("请先编辑模板内容");
          return;
        } else if (this.tempObj.filter_content == "") {
          this.$message.warning("目标用户openid不能为空");
          return;
        } else if (!this.tempObj.send_time) {
          this.$message.warning("选择发送的时间");
          return;
        }
        if (this.tempObj.url) {
          if (!this.checkURL(this.tempObj.url)) {
            this.$message.warning("url域名格式不正确");
            return;
          }
        } else {
        }
      } else if (this.tempObj.send_type == 2) {
        // checkURL
        if (!flag) {
          this.$message.warning("请先编辑模板内容");
          return;
        } else if (
          this.tempObj.filter_content == "" ||
          this.diy_tagid == "" ||
          this.drop_tagid == ""
        ) {
          this.$message.warning("目标用户标签不能为空");
          return;
        } else if (!this.tempObj.send_time) {
          this.$message.warning("选择发送的时间");
          return;
        }
        if (this.tempObj.url) {
          if (!this.checkURL(this.tempObj.url)) {
            this.$message.warning("url域名格式不正确");
            return;
          }
        } else {
        }
      } else if (this.tempObj.send_type == 0) {
        if (!this.tempObj.send_time) {
          this.$message.warning("选择发送的时间");
          return;
        }
      }
      this.$refs.danger.showDanger();
    },
    dangerSure() {
      let oldDate = new Date(this.date_value).getTime();
      let newDate = new Date().getTime();
      if (oldDate < newDate) {
        this.tempObj.send_time = "";
      } else {
        this.tempObj.send_time = this.date_value;
      }
      this.$axios
        .post(this.GLOBAL.BASE_URL + "templatesend", this.tempObj)
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("消息发送成功");
            setTimeout(() => {
              this.back();
            }, 1000);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 转化为中文标题
    showKey(item) {
      return item + ".data";
    },
    // 将json数据中的id和name转化为value和label
    changeDiyTagsList(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/tag_id/g, "value"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/tag_name/g, "label"));
      return obj2;
    },
    // 获取自定义标签
    getalldiytag() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "getalldiytag", {
          appid: this.$store.getters.showQuery,
          page: this.page,
          limit: this.limit
        })
        .then(res => {
          if (res.data.code == 0) {
            this.diy_tagList = this.changeDiyTagsList(res.data.data.data);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 返回
    back() {
      localStorage.removeItem("tid");
      this.$router.push({
        path: "/Tempmessage"
      });
    },
    // 取出换行
    ClearBr(key) {
      key = key.replace(/<\/?.+?>/g, "");
      key = key.replace(/[\r\n]/g, "");
      return key;
    },
    // 获取详情
    getDetail() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "templatedetail", {
          appid: this.$store.getters.showQuery,
          id: window.atob(localStorage.getItem("tid"))
        })
        .then(res => {
          if (res.data.code == 0) {
            if (!res.data.data) {
              this.$message.warning("没有数据，返回列表页面");
              setTimeout(() => {
                this.back();
              }, 500);
              return;
            }
            this.tempObj = res.data.data;
            this.tempObj.send_type = 1;
            this.simpleContentItem = res.data.data.simple_content;
            this.simpleCont.length = this.simpleContentItem.length;

            this.showContent();
          } else {
            this.$message.error(res.data.message);
          }
        });
    }
  }
};
</script>

<style scoped>
.info_title {
  width: 800px;
  margin: 10px 0;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 10px;
  font-size: 18px;
}
.preStyle {
  font-family: "PingFang SC", "Helvetica Neue", Helvetica, "microsoft yahei",
    arial, STHeiTi, sans-serif;
  font-size: 15px;
  white-space: normal;
}
.line {
  width: 20px;
  background: #999999;
}
.info {
  width: 100%;
}
.info_area {
  display: flex;
}
.info p {
  font-size: 18px;
  color: #2a2a2b;
  margin: 10px 0;
}
.area {
  width: 800px;
  display: flex;
  justify-content: space-between;
}
.area1 {
  width: 500px;
  display: flex;
  justify-content: space-between;
}
.area p {
  font-size: 16px;
}
.inputArea {
  width: 600px;
  display: flex;
  align-items: center;
}
.info_content {
  width: 400px;
  padding: 10px 0;
  margin-right: 40px;
}
.info_content_content {
  margin-top: 10px;
  border: 1px solid #e4e7ed;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 4px;
}
.info_contents {
  width: 800px;
  margin-top: 10px;
  background: #e4e7ed;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 4px;
}
.info_content h3 {
  flex-shrink: 1;
}
.simple_content {
  display: flex;
  justify-content: space-between;
}
.simple_content_item {
  flex-shrink: 1;
}
.simple_content_item p {
  height: 30px;
  line-height: 30px;
  margin: 0;
  margin-bottom: 20px;
}
.simple_content_value {
  width: 600px;
}
.simple_content_value .el-input {
  margin-bottom: 20px;
}
/* ------------------------------ */


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

