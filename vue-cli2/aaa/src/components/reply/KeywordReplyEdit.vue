<template>
  <div class="table">
    <div class="crumbs">
      <h2>关键词自动回复编辑</h2>
    </div>
    <div class="container">
      <el-form
        :model="keywordObj"
        :rules="rules"
        ref="keywordObj"
        label-width="100px"
        class="demo-ruleForm"
        label-position="left"
      >
        <el-form-item label="触发关键词" prop="words">
          <div class="input">
            <el-input v-model="keywordObj.words"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="匹配模式" prop="rule">
          <div class="input">
            <el-select v-model="keywordObj.rule" placeholder="请选择匹配模式">
              <el-option label="完全匹配" value="1"></el-option>
              <el-option label="模糊匹配" value="2"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="粉丝打标签" prop="tagid">
          <div class="input">
            <v-diyTagList ref="diyTagList" @listenChild="tagAdd"></v-diyTagList>
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <div class="input">
            <el-input v-model="keywordObj.remark"></el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <el-tooltip class="item" effect="dark" content="提交回复规则" placement="top">
            <el-button type="primary" @click="addGroupHandle()">提交</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="返回规则列表" placement="top">
            <el-button @click="back()" icon="el-icon-back">返回</el-button>
          </el-tooltip>
        </el-form-item>
      </el-form>
    </div>
    <br />
    <div class="container" v-if="is_edit">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-add" @click="addReply()">添加回复</el-button>
      </div>
      <div class="pagination"></div>
      <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}" style="width: 100%" v-loading="loading">
        <el-table-column fixed label="序号" width="50" align="center" type="index"></el-table-column>
        <el-table-column prop="name" label="回复类型" width="100" sortable>
          <template slot-scope="scope">
            <span v-html="handleDivision(scope.row.type)"></span>
          </template>
        </el-table-column>
        <el-table-column prop label="内容" sortable>
          <template slot-scope="scope">
            <div class v-if="scope.row.type == '1'">{{scope.row.value}}</div>
            <div class="imgCover" v-if="scope.row.type == '6'">
              <el-image :src="showImg(scope.row.url)" fit="contain"></el-image>
            </div>
            <div v-if="scope.row.type == '2'">
              <v-LinkNews v-if="scope.row.reply_content" :replyContent="scope.row.reply_content"></v-LinkNews>
            </div>
            <div class="" v-if="scope.row.type == '3'">
              <v-voice :replyContent="scope.row.reply_content"></v-voice>
            </div>
            <div v-if="scope.row.type == '4'">
              <v-NewsList v-if="scope.row.reply_content" :replyContent="scope.row.reply_content"></v-NewsList>
            </div>
            <div class="" v-if="scope.row.type == '5'">
              <v-video :replyContent="scope.row.reply_content"></v-video>
            </div>
            <div v-if="scope.row.type == '7'">
              <v-wechatapp v-if="scope.row.value" :replyContent="scope.row.value"></v-wechatapp>
            </div>
            <div v-if="scope.row.type == '10'">
              <v-voucher v-if="scope.row.reply_content" :replyContent="scope.row.reply_content"></v-voucher>
            </div>
            <div v-if="scope.row.type == '11'">
              <v-voucher v-if="scope.row.reply_content" :replyContent="scope.row.reply_content"></v-voucher>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改自动回复内容" placement="top">
              <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除自动回复内容" placement="top">
              <el-button type="danger" icon="el-icon-delete" @click="handleDelete( scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="选择素材"
      :visible.sync="dialogVisible"
      @close="handleClose()"
      :close-on-click-modal="modal"
      custom-class='dialogClass'
    >
      <v-material ref="materials" @listenChild="showChild"></v-material>
    </el-dialog>
    <v-danger
      ref="danger"
      @dangerSure="dangerSure"
      :danger_type="danger_type"
      :danger_ontent="danger_ontent"
    ></v-danger>
  </div>
</template>

<script>
import vMaterial from "../dialogs/materials";
import vDiyTagList from "../dialogs/diyTagList";
import BaseView from "../common/BaseView";
import vDanger from "../dialogs/danger.vue";
import vLinkNews from "../../template/LinkNews";
import vNewsList from "../../template/NewsList";
import vVoucher from "../../template/voucher";
import vWechatapp from "../../template/wechatapp";
import vVoice from "../../template/voice";
import vVideo from "../../template/video";
export default {
  extends: BaseView,
  components: {
    vMaterial,
    vDiyTagList,
    vDanger,
    vLinkNews,
    vNewsList,
    vVoucher,
    vWechatapp,
    vVoice,
    vVideo
  },
  data() {
    return {
      modal: false,
      keywordObj: {
        id: "",
        tagid: ""
      },
      rules: {
        words: [
          { required: true, message: "请输入触发关键词", trigger: "blur" }
        ],
        rule: [{ required: true, message: "请选择匹配模式", trigger: "blur" }],
        remark: [{ required: true, message: "请填写备注", trigger: "blur" }]
      },
      is_edit: false,
      tableData: [],
      dialogVisible: false,
      replayObj: {
        appid: "",
        rule: "",
        word_id: "",
        type: "",
        value: "",
        url: ""
      },
      loading: false,

      danger_type: "关键词自动回复",
      danger_ontent: "删除关键词自动回复，此操作会删除关键词自动回复",
      danger_item: {},

      replyStatus: "add"
    };
  },
  created() {
    if (localStorage.getItem("kid")) {
      this.getKeywordsDetail();
      this.is_edit = true;
    }
  },
  methods: {
    // 删回复
    dangerSure() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "greply_del", {
          appid: this.$store.getters.showQuery,
          id: this.danger_item.id
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("删除成功");
            this.getKeywordsDetail();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 删除回复内容
    handleDelete(value) {
      this.danger_item = value;
      this.$refs.danger.showDanger();
    },
    // 修改回复内容
    handleEdit(value) {
      this.replayObj = value;
      this.replayObj.word_id = value.id;
      this.dialogVisible = !this.dialogVisible;
      this.$nextTick(() => {
        this.$refs.materials.editChangeData(this.replayObj);
      });
      this.replyStatus = "update";
    },
    handleClose() {
      // 触发素材组件方法
      this.$refs.materials.resetData();
    },
    // 获取回复具体内容
    showChild(type, data, interval) {
      this.replayObj.type = type;
      switch (parseInt(type)) {
        case 1:
          this.replayObj.value = data;
          break;
        case 2:
          this.replayObj.value = data.id;
          this.replayObj.url = data.info[0].picurl;
          break;
        case 3:
          this.replayObj.value = data.id;
          break;
        case 4:
          this.replayObj.value = data.id;
          this.replayObj.url = data.info.news_item[0].thumb_url;
          break;
        case 5:
          this.replayObj.value = data.id;
          break;
        case 6:
          this.replayObj.value = data.id;
          this.replayObj.url = data.url;
          break;
        case 7:
          // 图片就接收media_id;
          data.thumb_url = data.picurl;
          data.appid = data.weappid;
          delete data.nickname;
          delete data.openid;
          delete data.picurl;
          this.replayObj.value = data;
          break;
        case 10:
          this.replayObj.value = data.id;
          this.replayObj.url = data.logo;
          break;
        case 11:
          this.replayObj.value = data.id;
          this.replayObj.url = data.logo;
          break;
        default:
          break;
      }
      this.dialogVisible = !this.dialogVisible;
      this.greply_edit();
    },
    // 回复内内容的接口
    greply_edit() {
      if (this.replyStatus == "add") {
        delete this.replayObj.id;
      }
      if (this.replyStatus == "update") {
      }
      this.$axios
        .post(this.GLOBAL.BASE_URL + "greply_edit", this.replayObj)
        .then(res => {
          if (res.data.code == 0) {
            this.getKeywordsDetail();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 添加回复
    addReply() {
      this.dialogVisible = !this.dialogVisible;
      this.replyStatus = "add";
    },
    // 获取详细信息
    getKeywordsDetail() {
      // keyword_detail
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "keyword_detail", {
          appid: this.$store.getters.showQuery,
          id: window.atob(localStorage.getItem("kid"))
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.tableData = res.data.data.reply;
            this.keywordObj = res.data.data.keywords;
            this.keywordObj.rule = this.keywordObj.rule.toString();
            this.keywordObj.tagid = this.changeTagsList(
              JSON.parse(res.data.data.keywords.tagid)
            );
            if (this.$refs.diyTagList) {
              this.$refs.diyTagList.getTag(this.keywordObj.tagid);
            }
            // -------------------------------
            this.replayObj = res.data.data.keywords;
            this.replayObj.word_id = res.data.data.keywords.id;
            this.keywordObj.id = this.keywordObj.word_id;
            // ----------------------------------
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    changeTagsList(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/id/g, "value"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/name/g, "label"));

      return obj2;
    },
    // 提交
    addGroupHandle() {
      this.$refs["keywordObj"].validate(valid => {
        if (valid) {
          this.keyword_edit();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 提交关键词信息接口
    keyword_edit() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "keyword_edit", {
          appid: this.$store.getters.showQuery,
          id: this.keywordObj.id,
          words: this.keywordObj.words,
          rule: this.keywordObj.rule,
          remark: this.keywordObj.remark,
          tagid: this.changeTagsListReagain(this.keywordObj.tagid)
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("提交成功");
            setTimeout(() => {
              this.back();
            }, 1000);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 数据处理
    changeTagsListReagain(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/value/g, "id"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/label/g, "name"));
      return obj2;
    },
    tagAdd(value) {
      this.keywordObj.tagid = value;
    },
    // 返回
    back() {
      localStorage.removeItem("kid");
      this.$router.push({
        path: "/keywordreply"
      });
    }
  }
};
</script>
<style>
.dialogClass{
  min-width: 1280px;
}
</style>
<style scoped>
.imgCover {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
}
.imgCover > i {
  font-size: 30px;
}
/* -------------- */
.input {
  width: 300px;
}
/* ---------------------- */

/* ----------------------------- */
.dialog {
  margin-top: -20px;
}
.qrcode {
  width: 60px;
  height: 60px;
  vertical-align: middle;
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