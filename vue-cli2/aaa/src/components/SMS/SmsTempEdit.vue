<template>
  <div class="table">
    <div class="crumbs">
      <h2>短信模板编辑</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-tooltip class="item" effect="dark" content="返回短信模板列表" placement="top">
          <el-button type="success" @click="back()" icon="el-icon-back">返回短信模板列表</el-button>
        </el-tooltip>
      </div>
      <div class="info">
        <div class="info_title">
          <p>模板标题：{{tempObj.template_name}}</p>
        </div>
        <div class="info_area">
          <div class="info_content">
            <h3>模板内容：</h3>
            <p class="info_content_p">{{tempObj.template_content}}</p>
          </div>
          <br />
          <div class="info_content">
            <h3>模板预览：</h3>
            <div class="info_example_p">
              <pre class="preStyle">{{newContent}}</pre>
            </div>
          </div>
          <div class="info_input">
            <div class="info_input_left">
              <p v-for="(item,index) in tempObj.num" :key="index">${{"{"+item+"}"}}</p>
            </div>
            <div class="info_input_right">
              <div class="inputArea" style="height: 60px;" v-for="(item,index) in simpleCont" :key="index">
                <el-input v-model="simpleCont[index]" placeholder="请输入内容" @input="changeCon"></el-input>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <el-form :model="sendsmsObj" label-position="left" label-width="200px">
          <el-form-item label="选择短信签名">
            <el-select v-model="sendsmsObj.smssign_id" placeholder="请选择选择短信签名" @change="getSign">
              <el-option
                v-for="(item,index) in signs"
                :key="index"
                :label="item.label"
                :value="item.value"
              >{{item.label}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发送目标选择">
            <el-radio-group v-model="sendsmsObj.send_type" @change="handleSendType()">
              <el-radio :label="1">手机号</el-radio>
              <el-radio :label="2">自定义标签</el-radio>
              <el-radio :label="3">全部用户</el-radio>
              <el-radio :label="4">发送文件</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="填写目标用户手机号" v-if="sendsmsObj.send_type == 1">
            <div class="inputArea">
              <el-input
                type="textarea"
                :autosize="{ minRows: 6, maxRows: 10}"
                placeholder="请输入发送目标手机号码，使用英文逗号分隔"
                v-model="filter_content"
                @keyup.native="number"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="选择目标用户标签" v-if="sendsmsObj.send_type == 2">
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
          </el-form-item>
          <el-form-item
            label="选择过滤用户自定义标签"
            v-if="sendsmsObj.send_type == 2 || sendsmsObj.send_type == 3"
          >
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
          </el-form-item>
          <el-form-item label="上传文件" v-if="sendsmsObj.send_type == 4">
            <el-button type="primary" @click="handleDown()">下载模板</el-button>
            <el-upload
              class="upload-demo"
              :data="uploadData"
              :action="fileupload"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :show-file-list="show_file_list"
              :on-exceed="handleExceed"
              :on-change="handleChange"
              :file-list="fileList"
              :multiple="multiple"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="发送时间选择">
            <div class="inputArea">
              <el-date-picker
                v-model="sendsmsObj.send_time"
                type="datetime"
                placeholder="选择日期时间"
                @change="changeSendTime"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label>
            <el-tooltip class="item" effect="dark" content="确认发送" placement="top">
              <el-button type="primary" @click="submit()">确认发送消息</el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>
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
      show_file_list: false,
      multiple: false,
      fileupload: this.GLOBAL.BASE_URL + "fileupload",
      uploadData: {
        appid: this.$store.getters.showQuery,
        type: 2
      },
      fileList: [],
      input: "",
      tempObj: {},
      filter_content: "",
      simpleCont: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e6;
        }
      },
      diy_tagList: [],
      sendsmsObj: {
        appid: this.$store.getters.showQuery,
        smstemplate_id: "",
        smstemplate_name: "",
        smssign_id: "",
        smssign_name: "",
        send_type: 1,
        send_time: "",
        send_content: "",
        smstemplate_code: "",
        filter_content: ""
      },
      diy_tagid: "",
      drop_tagid: "",
      page: 1,
      limit: 10000,
      signs: [],
      danger_type: "发送短信模板消息",
      danger_ontent: "发送短信模板消息，此操作会将发送短信模板消息",
      date_value: "",
      newContent: ""
    };
  },
  created() {
    this.selectTemplate();
    this.getalldiytag();
    this.smslist();
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1);
    },
    handleAvatarSuccess(res, file) {
      this.show_file_list = true;
      if (this.sendsmsObj.send_type == "4") {
        this.sendsmsObj.filter_content =res.data.path;
        this.sendsmsObj.drop_content =[ ];
      }
    },
    beforeAvatarUpload(file) {
      let type = file.name.split(".")[file.name.split(".").length - 1];
      if (type === "csv") {
        return true;
      } else {
        this.$message.error("请上传scv文件");
        return false; 
      }
    },
    handleExceed() {
    },
    handleDown() {
      window.location.href =
        "https://scrmcdn.beats-digital.com/scrm/files/2020/03/11/批量发送手机号.csv";
    },
    changeCon() {
      this.showContent();
    },
    showContent(item = this.simpleCont) {
      let flag = true;
      for (let i = 0; i < item.length; i++) {
        if (!item[i]) {
          flag = false;
        }
      }
      this.newContent = JSON.parse(
        JSON.stringify(this.tempObj.template_content)
      );
      for (let i = 0; i < this.tempObj.num.length; i++) {
        let reg = "${" + this.tempObj.num[i] + "}";
        this.newContent = this.newContent.replace(reg, item[i] || "");
      }
    },
    changeSendTime(val) {
      this.tempObj.send_time = val;
    },
    number() {
      // this.filter_content = this.filter_content.replace(/[^\d\,]/g, "");
      // this.filter_content = this.filter_content.replace(".", "");
    },
    // handleSendType
    handleSendType() {},
    // 检查手机号是否符合关于i反
    checkPhone(phone) {
      if (!/^1[3456789]\d{9}$/.test(phone)) {
        return false;
      } else {
        return true;
      }
    },
    // tijiao
    submit() {
      this.filter_content = this.filter_content.replace("，", ",");
      let obj = {};
      this.simpleCont.forEach((ele, index) => {
        obj[this.tempObj.num[index]] = ele;
      });
      this.sendsmsObj.send_content = obj;
      let is_phone = true;
      if (this.sendsmsObj.send_type == "3") {
        this.sendsmsObj.filter_content = [];
        this.sendsmsObj.drop_content = this.drop_tagid;
        this.sendsmsObj.filter_content = this.filter_content;
      } else if (this.sendsmsObj.send_type == "1") {
        this.filter_content.split(",").forEach((ele, index, arr) => {
          if (!this.checkPhone(ele)) {
            this.$message.warning(`${arr[index]} 手机号不正确`);
            is_phone = false;
          }
        });
        this.sendsmsObj.filter_content = this.filter_content.split(",");
        this.sendsmsObj.drop_content = [];
      } else if (this.sendsmsObj.send_type == "2") {
        this.sendsmsObj.filter_content = this.diy_tagid;
        this.sendsmsObj.drop_content = this.drop_tagid;
      }

      this.signs.forEach(ele => {
        if (ele.value == this.sendsmsObj.smssign_id) {
          this.sendsmsObj.smssign_name = ele.label;
        }
      });

      let flag = true;
      for (var i = 0; i < this.simpleCont.length; i++) {
        if (!this.simpleCont[i]) {
          flag = false;
        }
      }
      if (this.sendsmsObj.send_type == 1) {
        if (this.sendsmsObj.smssign_id == "") {
          this.$message.warning("短信签名不能为空");
          return;
        }
        if (!flag) {
          this.$message.warning("请先编辑模板内容");
          return;
        } else if (this.sendsmsObj.filter_content == "") {
          this.$message.warning("目标用户手机号能为空");
          return;
        } else if (!is_phone) {
          this.$message.warning("目标用户手机号格式不正确");
          return;
        } else if (!this.sendsmsObj.send_time) {
          this.$message.warning("选择发送的时间");
          return;
        }
      } else if (this.sendsmsObj.send_type == 2) {
        // checkURL
        if (!flag) {
          this.$message.warning("请先编辑模板内容");
          return;
        } else if (
          this.sendsmsObj.filter_content == "" ||
          this.diy_tagid == "" ||
          this.drop_tagid == ""
        ) {
          this.$message.warning("目标用户标签不能为空");
          return;
        } else if (!this.sendsmsObj.send_time) {
          this.$message.warning("选择发送的时间");
          return;
        }
      }
      // console.log(this.sendsmsObj);
      this.$refs.danger.showDanger();
    },
    // 阿松给别人
    dangerSure() {
      let oldDate = new Date(this.sendsmsObj.send_time).getTime();
      let newDate = new Date().getTime();
      if (oldDate < newDate) {
        this.sendsmsObj.send_time = "";
      } else {
        var date = new Date(this.sendsmsObj.send_time);
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
        this.sendsmsObj.send_time = this.date_value;
      }
      this.$axios
        .post(this.GLOBAL.BASE_URL + "sendsms", this.sendsmsObj)
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
    // 组合成的模板
    getDiyTag(val) {
      // this.filter_content = val;
    },
    // 获取短信
    getSign(item) {
      // this.sendsmsObj.smssign_id = item.value;
      // this.sendsmsObj.smssign_name = item.label;
    },
    // 返回
    back() {
      localStorage.removeItem("tid");
      this.$router.push({
        name: "SmsTemp"
      });
    },
    // 获取模板
    selectTemplate() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "selectTemplate", {
          appid: this.$store.getters.showQuery,
          template_id: window.atob(localStorage.getItem("tid"))
        })
        .then(res => {
          if (res.data.code == 0) {
            let data = res.data.data;
            this.tempObj = res.data.data;
            this.simpleCont.length = this.tempObj.num.length || 0;
            this.sendsmsObj.smstemplate_id = this.tempObj.id;
            this.sendsmsObj.smstemplate_name = this.tempObj.template_name;
            this.sendsmsObj.smstemplate_code = this.tempObj.template_code;

            this.showContent();
          } else {
            this.$message.warning("没有数据，返回列表页面");
            setTimeout(() => {
              this.back();
            }, 500);
          }
        });
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
    smslist() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "smssign", {
          appid: this.$store.getters.showQuery,
          page: this.page,
          limt: 10000,
          status: 1
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.signs = res.data.data;
            this.signs = JSON.parse(
              JSON.stringify(this.signs).replace(/id/g, "value")
            );
            this.signs = JSON.parse(
              JSON.stringify(this.signs).replace(/sign_name/g, "label")
            );
          } else {
            this.$message.error(res.data.message);
          }
        });
    }
  }
};
</script>
<style scoped>
.preStyle {
  white-space: normal;
}
.info_area {
  display: flex;
}
.info_sign {
  width: 500px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.info_sign .inputArea {
  height: 50px;
  align-items: center;
}
.info_title {
  width: 800px;
  margin: 10px 0;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 10px;
  font-size: 18px;
}
.info_example {
  margin: 10px 0;
}
.info_example p {
  line-height: 26px;
}
.info_example_p {
  width: 400px;
  margin-top: 10px;
  border: 1px solid #e4e7ed;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 4px;
}
.info_content {
  width: 400px;
  margin-right: 40px;
}
.info_content_p {
  width: 400px;
  margin-top: 10px;
  border: 1px solid #e4e7ed;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 4px;
}
.info_input {
  width: 500px;
  display: flex;
  justify-content: space-between;
}
.info_input p {
  height: 60px;
  font-size: 16px;
  display: flex;
  align-items: center;
}
.inputArea {
  width: 300px;
  display: flex;
  align-items: center;
}
.info_check {
  width: 650px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.info_textarea {
  width: 500px;
  height: 150px;
  display: flex;
  justify-content: space-between;
}
.info_textarea .inputArea {
  height: 150px;
  align-items: flex-start;
}
.info_time {
  width: 500px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.info_time .inputArea {
  height: 50px;
  align-items: center;
}
.info_select {
  width: 500px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.info_select .inputArea {
  height: 50px;
  align-items: center;
}
.info_submit {
  width: 500px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
.upload-demo {
  width: auto;
  margin-right: 10px;
  margin-top: 10px;
}
</style>

<style>
.el-upload--text {
  width: auto;
  height: auto;
  border: none;
  border-radius: 0;
}
</style>