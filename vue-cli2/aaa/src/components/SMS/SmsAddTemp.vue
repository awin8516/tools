<template>
  <div class="table">
    <div class="crumbs">
      <h2>新建短信模板</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-tooltip class="item" effect="dark" content="返回短信列表" placement="top">
          <el-button type="primary" icon="el-icon-back" @click="back()">返回</el-button>
        </el-tooltip>
      </div>
      <div class="form">
        <el-form
          ref="form"
          :model="form"
          label-width="80px"
          :label-position="labelPosition"
          :rules="rules"
        >
          <el-form-item label="模板类型" prop="template_type">
            <el-select v-model="form.template_type" placeholder="请选择模板类型">
              <!-- 模板分类;0验证码,1短信通知,2推广短信.3国际港澳台消息 -->
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
              <!-- <el-option label="国际港澳台消息" value="3"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="模板名称" prop="template_name">
            <div class="inputArea">
              <el-input v-model="form.template_name" placeholder="请输入名称 不超过30个字符" maxlength="30"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="模板内容" prop="template_content">
            <div class="inputArea">
              <el-input
                type="textarea"
                v-model="form.template_content"
                :placeholder="placeholder"
                :autosize="{ minRows: 4, maxRows: 4}"
              ></el-input>
              <P class="tips">{{tips1}}</P>
              <p class="tips">{{tips2}}</p>
              <p class="tips">
                3、不能发送营销/贷款/借款/中奖/抽奖类短信,不支持金融理财&房产通知类短信(验证码除外)签名/模版申请规范
                <span style="color:#409EFF">
                  <a
                    style="color:#409EFF"
                    target="__blank"
                    href="https://help.aliyun.com/document_detail/55324.html"
                  >https://help.aliyun.com/document_detail/55324.html</a>
                </span>
              </p>
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
          <el-form-item v-if="!is_edit">
            <el-tooltip class="item" effect="dark" content="立即创建" placement="top">
              <el-button type="primary" @click="onSubmit('form')" :disabled="disabled">立即创建</el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item v-if="is_edit">
            <el-tooltip class="item" effect="dark" content="重新提交" placement="top">
              <el-button type="primary" @click="onSubmit('form')" :disabled="disabled">重新提交</el-button>
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
      tips1: "1、验证码模板只支持验证码作为变量；变量替换值<=6位数字或字母",
      tips2:
        "2、同一个变量在模板中仅可出现一次。例如不支持以下模板：您家宝贝${name}已经到达${name}现场！",
      placeholder: "",
      labelPosition: "left",
      form: {
        appid: this.$store.getters.showQuery,
        template_type: "",
        template_name: "",
        template_content:
          "示例：尊敬的${name}，您的快递已在飞奔的路上，将在今天${time}送达您的手里，请留意查收。",
        remark: ""
      },
      typeOptions: [
        {
          value: 0,
          label: "验证码"
        },
        {
          value: 1,
          label: "短信通知"
        },
        {
          value: 2,
          label: "推广短信"
        }
      ],
      //
      rules: {
        template_type: [
          { required: true, message: "请输入模板类型", trigger: "blur" }
        ],
        template_name: [
          { required: true, message: "请输入模板名称", trigger: "blur" }
        ],
        template_content: [
          { required: true, message: "请输入模板内容", trigger: "blur" }
        ],
        remark: [{ required: true, message: "请输入申请说明", trigger: "blur" }]
      },
      disabled: false,
      is_edit:false
    };
  },
  destroyed(){
    localStorage.removeItem('st')
  },
  created() {
    this.placeholder =
      "示例：尊敬的${name}，您的快递已在飞奔的路上，将在今天${time}送达您的手里，请留意查收。";
    if (localStorage.getItem("st")) {
      this.form = JSON.parse(localStorage.getItem("st"));
      this.is_edit = true;
    }
  },
  methods: {
    // 立即常见
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.smssignsave();
        } else {
          this.$message.error("请完整填写选项");
          return false;
        }
      });
    },
    // 保存模板
    smssignsave() {
      this.disabled = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "smssave", this.form)
        .then(res => {
          this.disabled = false;
          if (res.data.code == 0) {
            this.$message.success(res.data.message);
            setTimeout(() => {
              this.back();
            }, 100);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 返回
    back() {
      this.$router.push({
        name: "SmsTemp"
      });
    }
  }
};
</script>

<style scoped>
.tips {
  font-size: 12px;
  line-height: 16px;
  margin-top: 4px;
  color: #a9aaac;
}
.form {
  width: 600px;
}
.inputArea {
  width: 600px;
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

