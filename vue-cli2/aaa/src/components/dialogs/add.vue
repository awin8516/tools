<template>
  <el-collapse v-model="activeName">
        <el-collapse-item
          :title="item.label"
          :name="item.name"
          v-for="(item,index) in dragOptions"
          :key="item.name+index"
        >
          <el-row>
            <el-col v-for="item1 in item.children" :key="item1.label" :span="3" :offset="1">
              <div class="drag-item-img" :class="item1.template" @click="addNode(item1.template)"></div>
              <div class="drag-item-label">{{item1.label}}</div>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
</template>

<script>
export default {
  data() {
    return {
      dragOptions: [
        {
          name: "1",
          label: "动作",
          children: [
            {
              label: "微信回复",
              template: "wechatreply"
            },
            {
              label: "自定义标签",
              template: "diytag"
            },
            {
              label: "微信标签",
              template: "wechattag"
            },
            {
              label: "短信",
              template: "smsreply"
            },
            {
              label: "模板消息",
              template: "templatenewsreply"
            }
          ]
        },
        {
          name: "2",
          label: "流程控制",
          children: [
            { label: "等待", template: "wait_controller" },
            { label: "结束", template: "ending_controller" }
          ]
        },
        {
          name: "3",
          label: "条件控制",
          children: [
            { label: "属性判断", template: "userattribute" },
            {
              label: "属性多分支判断",
              template: "userattr_mb_controller"
            },
            {
              label: "自定义标签多分支",
              template: "diytag_mb_controller"
            },
            {
              label: "微信标签多分支",
              template: "wechattag_mb_controller"
            },
            { label: "时间分支", template: "time_controller" },
            { label: "事件判断", template: "event_controller" }
          ]
        }
      ],
      activeName: ["1", "2", "3"],
    };
  },
  props:{
      visible: {
          type: Boolean
      },
      nodeClick: {
          type: Function
      }
  },
  methods: {
      addNode(template){
          this.$emit('nodeClick',{node_executor: template},1);
          this.$emit('update:visible', false);
      }
  }
};
</script>

<style scoped>
.drag-item-img {
  width: 45px;
  height: 45px;
  background-size: 100% 100%;
  margin: 5px auto;
}
.drag-item-label {
  text-align: center;
  color: black;
}
</style>