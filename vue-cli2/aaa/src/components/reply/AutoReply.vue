<template>
  <div class="table">
    <div class="crumbs">
      <h2>消息自动回复</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-tooltip class="item" effect="dark" content="新增一条自动回复内容" placement="top">
          <el-button
            type="primary"
            icon="el-icon-plus"
            class="handle-del mr10"
            @click="addReply()"
          >添加回复</el-button>
        </el-tooltip>
        <!-- <v-diyTagList ref="diyTagList" @listenChild="tagAdd"></v-diyTagList> -->
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
              <v-LinkNews  v-if="scope.row.reply_content" :replyContent="scope.row.reply_content"></v-LinkNews>
            </div>
            <div class="" v-if="scope.row.type == '3'">
               <v-voice :replyContent="scope.row.reply_content"></v-voice>
            </div>
            <div v-if="scope.row.type == '4'">
              <v-NewsList  v-if="scope.row.reply_content" :replyContent="scope.row.reply_content"></v-NewsList>
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
import vWechatapp from "../../template/wechatapp";;
import vVoice from '../../template/voice'
import vVideo from '../../template/video'
export default {
  extends: BaseView,
  components: {
    vMaterial,
    vDiyTagList,
    vDanger,
    vLinkNews,
    vNewsList,
    vVoucher,vWechatapp,vVoice,vVideo
  },
  data() {
    return {
      modal: false,
      // 统一的url
      dialogVisible: false,
      tableData: [],
      type: "1",
      replayObj: {
        id: "",
        type: "1",
        value: "",
        appid: "",
        status: "2"
      },
      src:
        "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
      fit: "cover",
      id: "",
      tagid: "",
      tagids: [],
      tagAddid: "",
      danger_type: "消息自动回复",
      danger_ontent: "删除消息自动回复，此操作会删除消息自动回复",
      danger_item: {}
    };
  },
  created() {
    this.replayObj.appid = this.$store.getters.showQuery;
    this.getData();
    this.biao_qian_list();
  },
  computed: {},
  methods: {
    tagAdd(value) {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "autotagadd", {
          appid: this.$store.getters.showQuery,
          rule: "2",
          tagid: this.changeTagsListReagain(value),
          id: this.tagAddid
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("操作成功");
            this.getData();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    showChild(type, data, interval) {
      this.replayObj.interval = interval;
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
        case 10:
          this.replayObj.value = data.id;
          this.replayObj.url = data.logo;
          break;
        case 7:
          data.thumb_url = data.picurl;
          data.appid = data.weappid
          delete data.nickname;
          delete data.openid;
          delete data.picurl;
          this.replayObj.value = data;
          break;
        case 11:
          this.replayObj.value = data.id;
          this.replayObj.url = data.logo;
          break;
        default:
          break;
      }
      if (this.replayObj.id) {
        // 更新
        this.autoadd();
      } else {
        // 新增
        this.tableData.push(this.replayObj);
        this.autoadd();
      }

      this.dialogVisible = false;
    },
    handleDelete(value) {
      this.danger_item = value;
      this.$refs.danger.showDanger();
    },
    // 删除
    dangerSure() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "autodel", {
          appid: this.$store.getters.showQuery,
          id: this.danger_item.id
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("删除成功");
            this.getData();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    autoadd() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "autoadd", this.replayObj)
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("操作成功");
            this.getData();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    getData() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "autolist", {
          appid: this.replayObj.appid,
          status: this.replayObj.status
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
            if (res.data.data.tagid.length) {
              this.tagAddid = res.data.data.tagid[0].id;
              this.tagid = this.changeTagsList(
                JSON.parse(res.data.data.tagid[0].tagid)
              );
              if (this.$refs.diyTagList) {
                this.$refs.diyTagList.getTag(this.tagid);
              }
            }
            this.loading = false;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    addReply() {
      this.replayObj.id = "";
      this.dialogVisible = !this.dialogVisible;
    },
    handleEdit(value) {
      this.replayObj = value;
      this.replayObj.id = value.id;
      this.dialogVisible = !this.dialogVisible;
      this.$nextTick(() => {
        this.$refs.materials.editChangeData(this.replayObj);
      });
    },
    handleClose() {
      // 触发素材组件方法
      this.$refs.materials.resetData();
    },
    biao_qian_list() {},
    changeTagsList(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/id/g, "value"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/name/g, "label"));

      return obj2;
    },
    changeTagsListReagain(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/value/g, "id"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/label/g, "name"));
      return obj2;
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
.dialog {
  margin-top: -2vh;
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