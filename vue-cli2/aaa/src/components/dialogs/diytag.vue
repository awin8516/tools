<template>
  <div>
    <el-form label-position="left" :model="form" :rules="rules" :ref="name" label-width="80px">
      <el-form-item label="步骤名称" prop="process_name">
        <el-input v-model="form.process_name" placeholder="请填写步骤名称"></el-input>
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
// import API from "../api/api";
// import model from "@/util/model";

export default {
  props: {
    visible: {
      type: Boolean
    },
    data: {
      type: Object
    },
    modify: {
      type: Function
    },
    add: {
      type: Function
    },
    state: {
      type: Boolean
    }
  },
  data() {
    return {
      name: "template",
      form: {
        process_name: ""
      },
      rules: {
        process_name: [
          { required: true, message: "请填写步骤名称", trigger: "blur" }
        ]
      },
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
      //数据初始化
      //若为修改，则进行数据检测
      this.state == 1?this.mode = false:this.mode = true;
      
      if(this.mode){
        this.assign();
        this.check();
      }
    },
    //检测已选择的标签是否被删除
    check() {},
    //表单验证
    validate({ success, error }) {
      this.$refs[this.name].validate(valid => {
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
          this.$emit('update:visible',false)
        }
      });
    },
    //新增节点
    nodeAdd() {
      this.validate({
        success: () => {
          let data = this.dataFormat();
          this.$emit("add", data);
          this.$emit('update:visible',false)
        }
      });
    },
    //关闭弹窗
    nodeCanel() {
      this.$emit('update:visible',false)
    },
    //初始赋值
    assign() {
      Object.assign(this.form,this.data);
    },
    //数据格式化
    dataFormat() {
      let data = {};
        Object.assign(data,this.form);
        
        return data;
    }

    //api --start
  }
};
</script>

<style scoped>
</style>