<template>
  <div class="home" @mouseup="flowchartMoveStop">
    <div id="a"></div>
    <div class="drag">
      <el-collapse v-model="activeName">
        <el-collapse-item
          :title="item.label"
          :name="item.name"
          v-for="(item,index) in dragOptions"
          :key="item.name+index"
        >
          <el-row>
            <el-col v-for="item1 in item.children" :key="item1.label" :span="6" :offset="1">
              <div class="drag-item-img" :class="item1.template" :data-template="item1.template"></div>
              <div class="drag-item-label">{{item1.label}}</div>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div
      class="drop"
      ref="drop"
      :class="{grabbing : switchList.is_move}"
      @mousedown.self="flowchartMoveStart"
      @mousemove.self="flowchartMove"
      @mouseleave="flowchartMoveStop"
    >
      <div class="btn-area">
        <el-button-group>
          <el-button @click="backToList">返回</el-button>
          <el-button @click="processSave" :disabled="state!=2">保存</el-button>
        </el-button-group>
      </div>
      <div class="flowchart-area" :style="flowchartStyle">
        <div class="item" v-for="item in renderArray" :key="item.id" @click="nodeClick(item,2)"
        :style="{left:item.position.x+'px',top:item.position.y+'px'}">
          <node :data="item" @nodeClick="nodeClick"></node>
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="switchList.dialogVisible" :title="dialog.title" @close="closeDialog">
      <component
        :is="dialog.content"
        :data="dialog.form"
        :state="dialog.status"
        :visible.sync="switchList.dialogVisible"
        @add="add"
        @modify="modify"
      ></component>
    </el-dialog>
    <el-dialog :visible.sync="switchList.addDialogVisible" title="节点添加">
      <add @nodeClick="nodeClick" :visible.sync="switchList.addDialogVisible"></add>
    </el-dialog>
  </div>
</template>

<script>
// import model from "../util/model";
import API from "../../api/api";
import handle from "../../utils/handle";
import play from "../dialogs/play.vue";
import add from "../dialogs/add.vue";
import node from "../dialogs/node.vue";

export default {
  name: "home",
  components: {
    play,
    add,
    node
  },
  computed: {
    //流程图样式
    flowchartStyle() {
      return {
        left: `${this.flowchartLeft}px`,
        top: `${this.flowchartTop}px`,
        transform: `scale(${this.flowchartScale})`
      };
    },
    //渲染数组
    renderArray() {
      return this.handle.renderArray;
    }
  },
  data() {
    return {
      flowchartLeft: 20,
      flowchartTop: 50,
      flowchartScale: 1,
      activeName: ["1", "2", "3"],
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
      switchList: {
        is_move: false, //是否拖动
        is_init: false, //是否已初始化
        addDialogVisible: false, //添加弹窗是否打开
        dialogVisible: false //弹窗是否打开
      },
      id: "", //流程图_id
      state: 1, //流程图状态，是修改还是查看
      data: {}, //初始数据
      handle: "", //操作方法
      dialog: {
        //弹窗属性
        id: "", //点击节点的id
        title: "", //弹窗的标题
        form: {}, //传递给弹窗的数据
        content: "", //弹窗的内容，组件名
        status: 1 //弹窗状态,1 --添加 ， 2 -- 修改
      },
      addStatus: 1 //1 --全部节点 2 --部分节点
    };
  },
  created() {
    this.init();
  },
  methods: {
    //开始拖动流程图
    flowchartMoveStart() {
      this.switchList.is_move = true;
    },
    //停止拖动流程图
    flowchartMoveStop() {
      this.switchList.is_move = false;
    },
    //流程图拖动中
    flowchartMove(e) {
      if (this.switchList.is_move) {
        this.flowchartLeft += e.movementX;
        this.flowchartTop += e.movementY;
      }
    },
    //初始化
    init() {
      //1.设置appid
      //2.获取流程图的_id和流程图的状态
      //3.请求获取该流程图的数据
      //4.根据获取的数据判断该流程图是否已初始化
      //5.若已初始化，则处理数据。反之，如果为查看状态，提示初始化，返回list，如果为修改状态，弹出play，进行初始化
      API.changeAppid("wx6027cd322f9a4d75");
      this.state = this.$route.query.state;
      this.id = this.$route.query._id;
      this.handle = handle;

      this.detail().then(res => {
        this.data = res;
        if (res.process_nodes) {
          this.switchList.is_init = true;
          this.handle.init(this.data);
        } else {
          if (this.state == 1) {
            this.$alert(
              "该流程图尚未初始化，请先点击修改按钮进行初始化后再查看！",
              "提示",
              {
                confirmButtonText: "确定",
                callback: () => {
                  this.backToList();
                }
              }
            );
          } else if (this.state == 2) {
            this.handle.getFlowchartData(this.data);
            //弹出流程开始弹窗
            this.openDialog("play");
          }
        }
      });
    },
    //保存
    processSave() {
      let data = this.handle.restore();
      window.console.log(data,'保存数据');
      this.save(data);
    },
    //返回列表
    backToList() {
      //返回列表
      this.$router.push("/flowChart");
      this.handle.clear();
    },
    //打开弹窗
    openDialog(executor, status = 1) {
      this.switchList.dialogVisible = true;
      this.dialog.content = executor;
      this.dialog.status = status;

      switch (executor) {
        case "play":
          this.dialog.title = "流程开始";
          break;
      }
    },
    //关闭弹窗
    closeDialog() {
      setTimeout(() => {
        this.dialog.content = "";
      }, 200);
    },
    //节点点击
    nodeClick(item,status) {
      let executor = item.node_executor;
      if (executor == "blank") {
        this.addStatus = 1;
        this.switchList.addDialogVisible = true;
        return;
      }
      this.dialog.id = item.id;
      this.dialog.form = item;
      this.openDialog(executor, status);
    },
    //监听是否发生改动
    // listenerHandle(e) {
    //   e.returnValue = "重新加载此网站?";
    //   return "重新加载此网站?";
    // },

    //数据操作
    //添加
    add(data) {
      this.handle.add(data, this.dialog.id);
    },
    //修改
    modify(data) {
      this.handle.modify(data);
    },
    //删除
    delete() {},
    //api --start
    //保存流程图数据
    save(data) {
      return API.save(data).then(res => {
        window.console.log(res, "save");
      });
    },
    //获取流程图数据
    detail() {
      let data = {};
      data._id = this.id;
      return API.detail(data).then(res => {
        window.console.log(res, "detail");
        return res.data;
      });
    }
  }
};
</script>

<style scoped>
.home {
  box-sizing: border-box;
  padding-left: 300px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  user-select: none;
}
.drag {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 300px;
}
.drop {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  cursor: grab;
}
.btn-area {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: default;
  z-index: 999;
}
.flowchart-area {
  width: 50px;
  height: 50px;
  position: absolute;
  cursor: default;
}
.grabbing {
  cursor: grabbing;
}
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
.item {
  width: 45px;
  height: 45px;
  position: absolute;
}
</style>
