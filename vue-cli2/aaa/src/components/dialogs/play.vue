<template>
  <div>
    <el-form label-position="left" :model="form" :rules="rules" ref="play" label-width="110px">
       <el-form-item label="步骤名称" prop="process_name">
        <el-input v-model="form.process_name" placeholder="请填写步骤名称"></el-input>
      </el-form-item>
      <el-form-item label="客群选择" prop="peopleSelect">
        <el-select v-model="form.peopleSelect" :style="{width:'100%'}">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in people"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="tags" v-if="form.peopleSelect&&form.peopleSelect!='all'">
        <el-select multiple v-model="form.tags" :style="{width:'100%'}">
          <el-option
            v-for="item in list"
            :key="item.value"
            :label="item.tag_name"
            :value="item.tag_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设定触发条件">
        <el-radio-group v-model="form.trigger_condition">
          <el-radio label="event">事件发生</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="trigger_value">
        <el-cascader v-model="form.trigger_value" :options="wx_list" :style="{width:'100%'}"></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="8" :offset="16">
            <el-button-group>
              <el-button @click="nodeCanel">取消</el-button>
              <el-button v-if="mode" type="primary" @click="nodeModify">确定</el-button>
              <el-button v-else type="primary" @click="nodeAdd">新增</el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import API from "../../api/api";
export default {
  watch: {
    "form.peopleSelect"(newValue) {
      switch (newValue) {
        case "diytag":
          this.list = this.diytagList;
          break;
        case "wechattag":
          this.list = this.wechattagList;
          break;
      }

      //   //检测
      //   this.check(this.form.tags, this.list);
    }
  },
  data() {
    return {
      form: {
        process_name: "",
        peopleSelect: "",
        tags: [],
        trigger_condition: "event",
        trigger_value: []
      },
      diytagList: [],
      wechattagList: [],
      rules: {
        process_name: [
          { required: true, message: "请填写步骤名称", trigger: "blur" }
        ],
        peopleSelect: [
          { required: true, message: "请选择客群", trigger: "change" }
        ],
        tags: [{ required: true, message: "请选择标签", trigger: "change" }],
        trigger_value: [
          { required: true, message: "请选择触发方式", trigger: "change" }
        ]
      },
      list: [],
      people: [
        { label: "自定义标签", value: "diytag" },
        { label: "微信标签", value: "wechattag" },
        { label: "全部", value: "all" }
      ],
      wx_list: [
        {
          label: "微信事件",
          value: "wechat_event",
          children: [
            {
              label: "关注",
              value: "wechat_event.subscribe"
            },
            {
              label: "取消关注",
              value: "wechat_event.unsubscribe"
            },
            {
              label: "回复消息",
              value: "wechat_event.reply"
            },
            {
              label: "点击菜单",
              value: "wechat_event.click"
            },
            {
              label: "扫描二维码",
              value: "wechat_event.scan"
            },
            {
              label: "上报地理位置",
              value: "wechat_event.location"
            },
            {
              label: "点击菜单链接",
              value: "wechat_event.view"
            }
          ]
        }
      ],
      mode: true //true 修改  false 新增
    };
  },
  computed: {},
  created() {
    this.init();
  },
  methods: {
    //初始化
    init() {
      //根据state判断是添加还是修改
      //若为修改，则进行赋值，数据检测
      this.state == 1 ? (this.mode = false) : (this.mode = true);
      Promise.all([this.diytag(), this.wechattag()]).then(() => {
        if (this.mode) {
          this.assign();
          this.check();
        }
      });
    },
    //检测已选择的标签是否被删除
    check() {},
    //表单验证
    validate({ success, error }) {
      this.$refs['play'].validate(valid => {
        if (valid) {
          success ? success() : "";
        } else {
          error ? error() : "";
          return false;
        }
      });
    },
    //节点更新
    nodeModify() {
      this.validate({
        success: () => {
          let data = this.dataFormat();
          this.$emit("modify", data);
          this.$emit("update:visible", false);
        }
      });
    },
    //新增节点
    nodeAdd() {
      this.validate({
        success: () => {
          let data = this.dataFormat();
          this.$emit("add", data);
          this.$emit("update:visible", false);
        }
      });
    },
    //关闭弹窗
    nodeCanel() {
      this.$emit("update:visible", false);
    },
    //初始赋值
    assign() {
      Object.assign(this.form, this.data);
    },
    //数据格式化
    dataFormat() {
      let data = {};
      Object.assign(data, this.form);
      typeof data.trigger_value == "string"
        ? ""
        : (data.trigger_value = data.trigger_value[1]);
      data.node_executor = "play";
      return data;
    },

    //api --start
    diytag() {
      let data = {};
      data.page = 1;
      data.limit = 100;
      return API.getalldiytag(data).then(res => {
        window.console.log(res, "diytag");
        this.diytagList = res.data.data;
      });
    },
    wechattag() {
      let data = {};
      data.page = 1;
      data.limit = 100;
      return API.biao_qian_fen_list(data).then(res => {
        window.console.log(res, "wechattag");
        this.wechattagList = res.data.data;
      });
    }
  }
};
</script>

<style scoped>
</style>