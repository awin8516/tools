<template>
  <div>
    <div class="step">
      <el-steps :active="active" simple>
        <el-step title="选择小程序" icon="el-icon-s-tools"></el-step>
        <el-step title="选择小程序路径" icon="el-icon-s-tools"></el-step>
      </el-steps>
    </div>
    <div class="main" v-show="active == 1">
      <el-form ref="form" :model="form">
        <el-form-item label="小程序类型" label-width="120px">
          <el-radio-group v-model="form.resource" @change="changeResource(form)">
            <el-radio label="1">选择已授权小程序</el-radio>
            <el-radio label="2">自定义小程序 （必须绑定该公众号）</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择小程序" v-show="form.resource == '1'" label-width="120px">
          <el-select v-model="form.appid" placeholder="请选择小程序" @change="changeAppid(form)">
            <el-option
              v-for="item in changeMiniData(miniprograms)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="小程序APPID"
          prop="appid"
          v-show="form.resource == '2'"
          label-width="120px"
        >
          <template slot-scope>
            <div class="input">
              <el-input v-model="form.appid" placeholder="请输入正确的AppId"></el-input>
            </div>
          </template>
        </el-form-item>
      </el-form>
    </div>
    <div class="main" v-show="active == 2">
      <p v-show="!is_choose" class="no_choose">{{needTips}}</p>
      <el-form ref="form" :model="form" v-show="is_choose">
        <el-form-item label="小程序路径" prop="path" label-width="120px">
          <template slot-scope>
            <div class="input">
              <el-input v-model="form.pagepath" placeholder="请输入正确的小程序路径"></el-input>
            </div>
          </template>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <el-tooltip class="item" effect="dark" content="下一步" placement="top">
        <el-button type="primary" v-show="active == 1" @click="next()">下一步</el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="上一步" placement="top">
        <el-button type="info" v-show="active == 2" @click="prev()">上一步</el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="取消" placement="top">
        <el-button type="info" v-show="active == 1" @click="cancel()">取消</el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="完成" placement="top">
        <el-button type="primary" v-show="active == 2" @click="save()">完成</el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  props: ["miniprograms"],
  data() {
    return {
      active: 1,
      form: {
        resource: "1",
        appid: "",
        pagepath: "",
        region: "",
        appid: "",
        qrcode_url: ""
      },

      needTips: "",
      is_choose: false,
      mini_type: "1"
    };
  },
  methods: {
    // 取消选择  传给父组件关闭弹窗
    cancel() {
      this.$emit("listenMini", {}, true); //
    },
    // 选择小程序appid
    changeAppid(item) {
      this.miniprograms.forEach(ele => {
        if (ele.appid == item.appid) {
          item.qrcode_url = ele.qrcode_url;
        }
      });
    },
    // 每次点击就将appid置空
    changeResource(item) {
      item.appid = "";
    },
    // 转化小程U型数据
    changeMiniData(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/appid/g, "value"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/name/g, "label"));
      return obj2;
    },
    // 重新选择小程序数据
    reagain(data) {
      this.active = 1;
      this.needTips = "";
      this.is_choose = false;
      this.form.appid = data.appid;
      this.form.pagepath = data.pagepath;
      this.form.resource = "1";
    },
    eliminate() {
      this.form = {
        resource: "1",
        pagepath: "",
        region: "",
        appid: "",
        qrcode_url: ""
      };
      this.active = 1;
      this.needTips = "";
      this.is_choose = false;
    },
    // 完成
    save() {
      if (this.form.pagepath == "") {
        this.$message.warning("必须填写小程序路径");
      } else {
        this.$emit("listenMini", this.form, true); //
      }
    },
    // 下一步
    next() {
      this.active++;
      if (this.form.resource == "1") {
        if (this.form.appid == "") {
          this.is_choose = false;
          this.needTips = "请选择小程序或填写小程序appid";
        } else {
          this.is_choose = true;
        }
      }
      if (this.form.resource == "2") {
        if (this.form.appid == "") {
          this.is_choose = false;
          this.needTips = "请选择小程序或填写小程序appid";
        } else {
          this.is_choose = true;
        }
      }
    },
    // 上一步
    prev() {
      this.active--;
    }
  }
};
</script>

<style scoped>
.no_choose {
  color: #333;
  margin: 100px;
  text-align: center;
}
.input {
  width: 300px;
}
.main {
  width: 100%;
  height: 300px;
  border-radius: 5px;
  margin: 20px auto;
  background: #f2f2f6;
  padding: 10px 30px;
  box-sizing: border-box;
  overflow: hidden;
}
.step {
  width: 50%;
  margin: auto;
}
.footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.footer button {
  margin-left: 10px;
}
</style>

