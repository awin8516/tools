<template>
  <div class="table">
    <div>
      <div class="crumbs">
        <h2>生成二维码</h2>
      </div>
      <div class="container">
        <el-form ref="form" :model="form" label-width="110px" :rules="rules">
          <el-form-item label="二维码名称" prop="name">
            <div class="input">
              <el-input v-model="form.name"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="二维码类型" prop="rule">
            <el-select
              v-model="form.rule"
              placeholder="请选择二维码类型"
              @change="handleTYpe(form.rule)"
              :disabled="disabled"
            >
              <el-option label="永久" value="1"></el-option>
              <el-option label="临时" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签" prop="tagid">
            <v-diyTagList ref="diyTagList" @listenChild="tagAdd"></v-diyTagList>
          </el-form-item>
          <el-form-item label="临时二维码天数" v-show="showDate" :disabled="disabled">
            <div class="inputArea">
              <el-input
                v-model.number="form.date"
                :disabled="disabled"
                @input="changeAfterDate"
                maxlength="7"
                show-word-limit
              >
                <template slot="prepend">
                  <i class="el-icon-date"></i>
                </template>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="到期时间" v-show="showDate" :disabled="disabled">
            <div class="inputArea">
              <el-input v-model="afterDate" disabled></el-input>
            </div>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="提交二维码回复内容" placement="top">
              <el-button type="primary" @click="onSubmit(form.id)" :disabled="isDisable">提交</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="返回二维码列表" placement="top">
              <el-button type @click="back()" icon="el-icon-back">返回</el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>
      </div>
      <br />
      <div class="container" v-if="is_add">
        <div class="handle-box">
          <el-tooltip class="item" effect="dark" content="添加扫码自动回复" placement="top">
            <el-button
              type="primary"
              icon="el-icon-plus"
              class="handle-del mr10"
              @click="handlereplay()"
            >添加扫码回复</el-button>
          </el-tooltip>
        </div>
        <div class="pagination"></div>
        <el-table :data="replayData" :header-cell-style="{background:'#f9f9f9'}" style="width: 100%" v-loading="replay_loading">
          <el-table-column fixed label="序号" width="50" align="center" type="index"></el-table-column>
          <el-table-column prop="type" label="回复类型">
            <template slot-scope="scope">
              <span v-html="handleDivision(scope.row.type)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="内容">
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
          <el-table-column prop label align>
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="删除自动回复" placement="top">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="qrreplydel(scope.$index,scope.row.id)"
                ></el-button>
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
import vMaterial from "../dialogs/materials";
import vDiyTagList from "../dialogs/diyTagList";
import vDanger from "../dialogs/danger.vue";
import BaseView from "../common/BaseView";
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
      select_words: "",
      modal: false,
      isDisable: false,
      page: 1,
      totals: 0,
      limit: 10,
      currentPage1: 0,
      is_add: false,
      loading: false,
      replay_loading: false,
      naveidt: true,
      disabled: false,
      showDate: "",
      qrinfoRule: "",
      qrinfoRules: [
        {
          label: "所有",
          value: "0"
        },
        {
          label: "永久",
          value: "1"
        },
        {
          label: "临时",
          value: "2"
        }
      ],
      tableData: [],
      replayObj: {
        appid: "",
        qrcode_id: "",
        url: "",
        type: "",
        value: ""
      },
      replayData: [],
      qrData: {
        appid: "",
        type: ""
      },
      fit: "cover",
      form: {
        id: "",
        name: "",
        rule: "",
        date: "",
        tagid: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入二维码名称", trigger: "blur" }
        ],
        rule: [{ required: true, message: "请选择二维码类型", trigger: "blur" }]
      },
      dialogVisible: false,
      src:
        "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
      fit: "cover",
      eventkey: "",
      tagid_lists: [],
      tagid_list: "",
      page: 1,
      danger_type: "带参二维码",
      danger_ontent: "删除带参二维码，此操作会将所有删除所有用户的带参二维码",
      item: "",
      afterDate: 0
    };
  },
  computed: {},
  created() {
    if (localStorage.getItem("qid")) {
      this.is_add = true;
    }
    this.replayObj.appid = this.$store.getters.showQuery;
    this.getData();
  },
  methods: {
    handleSearch(val) {
      this.getData(val);
    },
    changeAfterDate(val) {
      this.afterDate = this.$utils.getAfterDate(Number(this.form.date));
    },
    handleClose() {
      // 触发素材组件方法
      this.$refs.materials.resetData();
    },
    // 查看数据统计
    handleData(item) {
      localStorage.setItem("qid", window.btoa(item.id));
      this.$router.push({
        name: "qrcodeData"
      });
    },
    tagAdd(value) {
      this.form.tagid = value;
      this.tagid_list = value;
    },
    qrreplydel(idx, value) {
      this.replay_loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "qrreplydel", {
          appid: this.$store.getters.showQuery,
          id: value
        })
        .then(res => {
          this.replay_loading = false;
          if (res.data.code == 0) {
            this.$message.success("删除成功");
            this.replayData.splice(idx, 1);
            this.getData();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    showChild(type, data, interval) {
      let obj = {};
      this.replayObj.interval = interval;
      this.replayObj.type = type;
      switch (parseInt(type)) {
        case 1:
          this.replayObj.value = data;
          break;
        case 2:
          this.replayObj.value = data.id;
          this.replayObj.url = data.info[0].picurl;
          obj.url = data.info[0].picurl;
          break;
        case 3:
          this.replayObj.value = data.id;
          break;
        case 4:
          this.replayObj.value = data.id;
          this.replayObj.url = data.info.news_item[0].thumb_url;
          obj.url = data.info.news_item[0].thumb_url;
          break;
        case 5:
          this.replayObj.value = data.id;
          break;
        case 6:
          this.replayObj.value = data.id;
          this.replayObj.url = data.url;
          obj.url = data.url;
          break;
        case 10:
          this.replayObj.value = data.id;
          this.replayObj.url = data.url;
          this.replayObj.url = data.logo;
          break;
        case 7:
          this.replayObj.value = data;
          break;
        case 11:
          this.replayObj.value = data.id;
          this.replayObj.url = data.url;
          this.replayObj.url = data.logo;
          break;
        default:
          break;
      }
      obj.type = type;
      if (obj.type == 7) {
        obj.type = 10;
      }
      obj.content = data;
      this.replayData.push(obj);
      this.dialogVisible = false;
      this.qraddreply();
    },
    qraddreply() {
      this.replay_loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "qraddreply", this.replayObj)
        .then(res => {
          this.replay_loading = false;
          if (res.data.code == 0) {
            this.$message.success("操作成功");
            this.replayData = res.data.data;
            this.getData();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    dangerSure() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "qrcodedel", {
          id: this.item.id,
          appid: this.$store.getters.showQuery
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
    handleDelete(value) {
      this.item = value;
      this.$refs.danger.showDanger();
    },
    getType(value) {
      this.qrinfoRule = value;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
    },
    // 选择条数
    handleSizeChange(val) {
      this.page = this.currentPage1;
      this.limit = val;
      this.getData();
    },
    getData(name = this.select_words) {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "qrcodelist", {
          appid: this.$store.getters.showQuery,
          rule: this.qrinfoRule,
          page: this.page,
          limit: this.limit,
          name: name
        })
        .then(res => {
          if (res.data.code == 0) {
            this.biao_qian_list();
            this.tableData = res.data.data.data;
            this.totals = res.data.data.total;
            this.currentPage1 = res.data.data.current_page;
            if (this.page > res.data.data.last_page) {
              this.page = res.data.data.last_page;
              this.getData();
            }
            this.loading = false;
            let qid;
            if (localStorage.getItem("qid")) {
              qid = JSON.parse(localStorage.getItem("qid"));
              this.handleEdit(qid);
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    ruleType(value) {
      if (parseInt(value) == 1) {
        return "永久";
      } else if (parseInt(value) == 2) {
        return "临时";
      }
    },
    expireType(value) {
      if (!parseInt(value)) {
        return "永久";
      } else {
        return value;
      }
    },
    typeType(value) {
      if (parseInt(value) == 1) {
        return "文本";
      } else if (parseInt(value) == 2) {
        return "语音";
      }
    },
    handleEdit(item) {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "qredit", {
          appid: this.$store.getters.showQuery,
          id: item.id
        })
        .then(res => {
          if (res.data.code == 0) {
            let qrcode = res.data.data.qrcode[0];
            let replay = res.data.data.reply;

            this.replayObj.qrcode_id = qrcode.id;
            this.replayData = res.data.data.reply;
            this.is_add = true;
            this.tagid_list = this.changeTagsList(qrcode.tagid);
            this.disabled = true;
            this.form.id = qrcode.id;
            this.form.name = qrcode.name;
            this.form.rule = qrcode.rule;
            this.form.date = qrcode.expire;
            this.form.date ? (this.showDate = true) : (this.showDate = false);
            this.naveidt = !this.naveidt;
            this.have_replay = false;
            this.$nextTick(() => {
              // console.log(this.tagid_list);
              this.$refs.diyTagList.getTag(this.tagid_list);
              this.isDisable = false;
            });
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    onSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.isDisable = true;
          this.loading = true;
          this.$axios
            .post(this.GLOBAL.BASE_URL + "qrcodeadd", {
              id: this.form.id,
              appid: this.$store.getters.showQuery,
              name: this.form.name,
              rule: this.form.rule,
              expire: this.form.date,
              type: this.replayObj.type,
              tagid: this.changeTagsListReagain(this.tagid_list)
            })
            .then(res => {
              if (res.data.code == 0) {
                this.$message.success("操作成功");
                setTimeout(() => {
                  this.back();
                }, 1000);
                this.getData();
                this.loading = false;
              } else {
                this.isDisable = false;
                this.$message.error(res.data.message);
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    back() {
      localStorage.removeItem("qid");
      this.$router.push({
        path: "/QrCode"
      });
    },
    handleTYpe(value) {
      if (parseInt(value) == 1) {
        this.showDate = false;
        this.form.date = "0";
      } else if (parseInt(value) == 2) {
        this.showDate = true;
      }
    },
    addReply() {
      this.is_add = false;
      this.form = {
        id: "",
        name: "",
        rule: "",
        date: ""
      };
      this.tagid_list = [];
      this.replayData = [];
      this.replayObj.qrcode_id = "";
      this.replayObj.type = "";
      this.replayObj.url = "";
      this.replayObj.value = "";
      this.disabled = false;
      this.naveidt = !this.naveidt;
      this.isDisable = false;
    },
    handlereplay() {
      this.dialogVisible = !this.dialogVisible;
    },
    biao_qian_list() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "diytaglist", {
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tagid_lists = this.changeTagsList(res.data.data);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    showTag(value) {
      value = value ? value : [];
      let result = [];
      if (this.tagid_lists.length) {
        for (let i = 0; i < this.tagid_lists.length; i++) {
          for (let j = 0; j < value.length; j++) {
            if (value[j].id == this.tagid_lists[i].tag_value) {
              result.push(value[j]);
            }
          }
        }
      }
      if (result.length) {
        return result;
      }
    },
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
<style lang='scss' scoped>
.imageDom {
  width: 300px;
  height: 300px;
  position: relative;
}
.imageDom img {
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.logo {
  width: 50px;
  height: 50px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}
// ------------------------------
.inputArea {
  width: 215px;
}
.remark {
  text-align: center;
  background: #79c1fb;
  border-radius: 2px;
  margin: auto;
  color: #fff;
  margin-bottom: 4px;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  padding: 4px;;
}
.remarks {
  display: inline-block;
  margin-right: 5px;
}
.input {
  width: 215px;
}
/* ---------------------------------- */
.imgCover {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
}
.imgCover > i {
  font-size: 30px;
}
.line {
  width: 100%;
  height: 20px;
}
.dialog {
  margin-top: -2vh;
}
.qrurl {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
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
