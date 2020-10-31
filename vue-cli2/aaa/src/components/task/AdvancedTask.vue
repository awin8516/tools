<template>
  <div class="table">
    <div class="crumbs">
      <h2>消息群发</h2>
    </div>
    <div class="container">
      <el-form ref="form" label-width="200px" label-position="left">
        <el-form-item label="发送给" v-show="resource == '1'">
          <el-select v-model="status" placeholder="请选择标签" @change="getTagType">
            <el-option
              v-for="item in sendTags"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择用户自定义标签" v-if="status == 2">
          <el-select v-model="need_custom_taglist" multiple placeholder="请选择标签">
            <el-option
              v-for="item in diy_tagList"
              :key="item.value"
              :label="item.label"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="过滤用户自定义标签">
          <el-select v-model="drop_custom_taglist" multiple placeholder="请选择标签">
            <el-option
              v-for="item in diy_tagList"
              :key="item.value"
              :label="item.label"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="群发内容">
          <el-tooltip class="item" effect="dark" content="选择群发内容" placement="top">
            <el-button type="primary" icon="el-icon-plus" @click="addMessage()">选择群发内容</el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item label>
          <div class="messages">
            <!-- --------111111111111 -->
            <div class v-if="type == '1'">{{message}}</div>
            <!-- 66666666666666666 -->
            <div class="imgItem" v-loading="loading" v-else-if="type === '6'">
              <div class="img" @click="chooseImg(message)">
                <div class="imgs">
                  <img v-if="message.url" :src="showImg(message.url)" />
                </div>
              </div>
            </div>
            <!-- --------------33333333333 -->
            <div v-if="type == '3'">
              <div class="imgItem" v-loading="loading">
                <div class="img" @click="chooseImg(message)">
                  <div class="voiceBg">
                    <i class="el-icon-microphone"></i>
                  </div>
                  <span class="imgTxt">{{message.real_name}}</span>
                </div>
              </div>
            </div>
            <!-- ------------444444444444444444444 -->
            <div v-if="type == '4'">
              <v-NewsList ref="NewsList" :replyContent="message.info" :groupsend="true"></v-NewsList>
            </div>
            <!-- ------------5555555555555555 -->
            <div v-if="type == '5'">
              <div class="imgItem" v-loading="loading">
                <div class="img" @click="chooseImg(message)">
                  <div class="voiceBg">
                    <i class="el-icon-video-camera-solid"></i>
                  </div>
                  <span class="imgTxt">{{message.title}}</span>
                </div>
              </div>
            </div>
            <!-- ------------10 -->
            <div v-if="type == '10'">
              <v-voucher :replyContent="message"></v-voucher>
            </div>
            <!-- ------------11 -->
            <div v-if="type == '11'">
              <v-voucher :replyContent="message"></v-voucher>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="发送日期">
          <div class="time">
            <el-date-picker
              v-model="normalObj.send_time"
              placeholder="选择日期时间"
              type="datetime"
              align="bottom"
              @change="confirmDate"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="发送预览">
          <el-autocomplete
            popper-class="my-autocomplete"
            class="inline-input"
            v-model="OpenId"
            style="width:250px"
            :fetch-suggestions="querySearch"
            placeholder="请输预览的OpenId"
            @input="handleInput"
            @select="handleSelect"
          >
            <template slot-scope="{ item }">
              <div class="name">{{ item.fan.nickname }}</div>
              <span class="addr">{{ item.openid }}</span>
            </template>
          </el-autocomplete>
          <div class="user" @click="handleUser(userInfo)">
            <img v-if="userInfo.headimgurl" :src="userInfo.headimgurl" />
            <span>{{userInfo.nickname}}</span>
          </div>
          <el-tooltip class="item" effect="dark" content="发送预览" placement="top">
            <el-button type="primary" @click="PreView()">发送预览</el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item label>
          <el-tooltip class="item" effect="dark" content="开始发送" placement="top">
            <el-button type="primary" @click="sendMessage">群发</el-button>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <div class="tips">
        <i class="el-icon-info"></i>&nbsp;群发消息有20s的延迟
      </div>
    </div>
    <el-dialog title="选择素材" :visible.sync="dialogVisible" @close="handleClose()">
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
const debounce = (function() {
  let timer = 0;
  return function(callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();
import vMaterial from "../dialogs/material";
import vDanger from "../dialogs/danger.vue";
import BaseView from "../common/BaseView";
import vLinkNews from "../../template/LinkNews";
import vNewsList from "../../template/NewsList";
import vVoucher from "../../template/voucher";
import vWechatapp from "../../template/wechatapp";
export default {
  extends: BaseView,
  components: {
    vMaterial,
    vDanger,
    vLinkNews,
    vNewsList,
    vVoucher,
    vWechatapp
  },
  data() {
    return {
      labelPosition: "left",
      isDisable1: false,
      isDisable2: false,
      fit: "cover",
      loading: false,
      tagList: [], // 标签选项
      diy_tagList: [],
      dialogVisible: false,
      message: {}, // 群发内容
      type: "", //  群发内容的类型  （1-6种类型）
      OpenId: "", //openid
      normalObj: {
        //  获取数据的参数
        appid: "",
        type: "",
        value: "",
        need_custom_taglist: [],
        drop_custom_taglist: [],
        tagname: "",
        send_time: ""
      },
      need_custom_taglist: "",
      drop_custom_taglist: "",
      resource: "1", // 按标签还是标签组
      sex: "", // 性别
      date: "", // 日期
      // 今天 昨天等快捷操作
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now() - 8.64e6;
        }
      },
      // 发送给标签
      status: 0,
      sendTags: [
        {
          label: "-",
          value: 0
        },
        {
          label: "所有用户",
          value: 1
        },
        {
          label: "自定义标签群发",
          value: 2
        }
      ],
      limit: 100000,
      page: 1,
      danger_type: "群发",
      danger_ontent: "群发，此操作会将消息群发给所有的用户",
      item: "",
      users: [],
      listObj: {
        paginate: "10",
        name: "",
        fan_status: "1",
        openid: "",
        start: "",
        end: "",
        appid: "",
        subscribe_scene: "",
        tag_list: [],
        page: 1,
        limit: 10,
        user_shows:'',
        totals: 0,
        current_page1: 1,
        diy_tagid_list: []
      },
      userInfo: {
        headimgurl: "",
        nickname: ""
      }
    };
  },
  created() {
    this.normalObj.appid = this.$store.getters.showQuery;
    this.listObj.appid = this.$store.getters.showQuery;
    this.news_pre_persion();
    // 获取设定的标签组
    this.biao_qian_list();
    this.getalldiytag();
  },
  methods: {
    // 查看用户
    handleUser(item) {
      window.open(this.GLOBAL.USEROPEN + window.btoa(item._id), "_blank");
    },
    // 获取与预览的信息
    news_pre_persion() {
      this.$axios
        .get(this.GLOBAL.BASE_URL + "news_pre_persion", {
          params: {
            appid: this.$store.getters.showQuery
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            if (Object.keys(res.data.data).length > 0) {
              this.users = res.data.data;
              this.users.forEach(item => {
                item.value = item.fan.openid;
              });

              this.OpenId = this.users[0].openid;
              this.userInfo = this.users[0].fan;
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 获取用户头像
    getUserList() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "user_list", this.listObj)
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data.data.length) {
              this.userInfo = res.data.data.data[0];
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 监听实时输入
    handleInput(item) {
      debounce(() => {
        this.listObj.openid = (item).trim();
        this.getUserList();
      }, 500);
    },
    // 选择
    handleSelect(item) {
      this.listObj.openid = item.openid;
      this.getUserList();
    },
    createFilter(queryString) {
      return user => {
        return (
          user.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    // 激活即列出输入建议
    querySearch(queryString, cb) {
      var users = this.users;
      var results = queryString
        ? users.filter(this.createFilter(queryString))
        : users;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    // 关闭
    handleClose() {
      // 触发素材组件方法
      this.$refs.materials.resetData();
    },
    // 选择标签类型
    getTagType(val) {
      if (parseInt(val) == 1) {
        // 所有人
        this.drop_custom_taglist = [];
      } else if (parseInt(val) == 2) {
        // 制定的人
      }
    },
    // 选择日期
    confirmDate(val) {
      this.normalObj.send_time = this.$utils.format(val);
    },
    // 不足10加0
    add(m) {
      return m < 10 ? "0" + m : m;
    },
    // 日期格式
    format(date) {
      var time = new Date(date);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return (
        y +
        "-" +
        this.add(m) +
        "-" +
        this.add(d) +
        " " +
        this.add(h) +
        ":" +
        this.add(mm) +
        ":" +
        this.add(s)
      );
    },
    // 预览
    PreView() {
      this.isDisable2 = true;
      if (this.normalObj.value == "") {
        this.$message.warning("群发内容不能为空");
        this.isDisable2 = false;
      } else if (this.OpenId == "") {
        {
          this.$message.warning("OpenID不能为空");
          this.isDisable2 = false;
        }
      } else {
        this.senior_news_preview();
      }
    },
    // 添加选择素材
    addMessage() {
      this.dialogVisible = true;
    },
    // 选择的素材数据
    showChild(type, data) {
      this.message = {};
      this.type = "";
      this.message = data;
      switch (parseInt(type)) {
        case 1:
          this.normalObj.value = data;
          break;
        case 2:
          this.normalObj.value = data.id;
          this.normalObj.url = data.info[0].picurl;
          break;
        case 3:
          this.normalObj.value = data.media_id;
          break;
        case 4:
          this.normalObj.value = data.id;
          this.normalObj.url = data.info.news_item[0].thumb_url;
          break;
        case 5:
          this.normalObj.value = data.media_id;
          break;
        case 6:
          this.normalObj.value = data.media_id;
          this.normalObj.url = data.url;
          break;
        case 10:
          this.normalObj.value = data.code;
          break;
        default:
          break;
      }
      this.normalObj.type = type;
      if (parseInt(this.normalObj.type) == 7) {
        this.normalObj.type = 10;
      }
      this.type = type;
      this.dialogVisible = false;
    },
    chooseImg() {},
    // 删掉数组中的第一个数据，再讲后面的数据进行循环
    ishift(arr) {
      let newArr = arr.map(o => Object.assign({}, o));
      newArr.shift();
      return newArr;
    },
    getalldiytag() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "getalldiytag", {
          appid: this.$store.getters.showQuery,
          page: this.page,
          limit: this.limit
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.diy_tagList = this.changeDiyTagsList(res.data.data.data);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },

    // 将json数据中的id和name转化为value和label
    changeDiyTagsList(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/tag_id/g, "value"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/tag_name/g, "label"));
      return obj2;
    },
    // 获取标签
    biao_qian_list() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "biao_qian_list", {
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tagList = this.changeTagsList(res.data.data);
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
    // 群发
    sendMessage() {
      this.isDisable1 = true;
      // console.log(this.status);
      if (this.status == 0) {
        this.$message.warning("选择发送目标标签");
        this.isDisable1 = false;
        return false;
      }
      if (this.status == "1") {
        if (this.normalObj.value == "") {
          this.$message.warning("群发内容不能为空");
          this.isDisable1 = false;
        } else if (this.normalObj.send_time == "") {
          this.$message.warning("发送时间不能为空");
          this.isDisable1 = false;
        } else {
          this.$refs.danger.showDanger();
          // this.senior_news_add();
        }
      } else if (this.status == "2") {
        if (this.need_custom_taglist.length == 0) {
          this.$message.warning("自定义标签不能为空");
          this.isDisable1 = false;
        } else if (this.normalObj.value == "") {
          this.$message.warning("群发内容不能为空");
          this.isDisable1 = false;
        } else if (this.normalObj.send_time == "") {
          this.$message.warning("发送时间不能为空");
          this.isDisable1 = false;
        } else {
          this.$refs.danger.showDanger();
          // this.senior_news_add();
        }
      }
    },
    dangerSure() {
      this.senior_news_add();
    },
    // 群发接口
    senior_news_add() {
      if (parseInt(this.status) == 1) {
        this.need_custom_taglist = [];
      } else if (parseInt(this.status) == 2) {
        this.need_custom_taglist.forEach(ele => {
          this.normalObj.need_custom_taglist.push(ele.value);
        });
      }
      this.drop_custom_taglist.forEach(ele => {
        this.normalObj.drop_custom_taglist.push(ele.value);
      });
      this.normalObj.status = this.status;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "senior_news_add", this.normalObj)
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("群发成功");
            this.isDisable1 = false;
            this.normalObj.need_custom_taglist = [];
            this.normalObj.drop_custom_taglist = [];
            this.need_custom_taglist = "";
            this.drop_custom_taglist = "";
            this.news_pre_persion();
          } else {
            this.$message.error(res.data.message);
            this.isDisable1 = false;
          }
        });
    },
    // 群发预览
    senior_news_preview() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "senior_news_preview", {
          appid: this.normalObj.appid,
          // tagid: this.normalObj.tagid,
          // tagname: this.normalObj.tagname,
          openid: this.OpenId,
          type: this.normalObj.type,
          value: this.normalObj.value
          // send_time: this.normalObj.send_time
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("发送预览成功");
            this.isDisable2 = false;
            this.OpenId = "";
            this.userInfo = {
              headimgurl: "",
              nickname: ""
            };
          } else {
            this.$message.error(res.data.message);
            this.isDisable2 = false;
          }
        });
    }
  }
};
</script>
<style>
</style>
<style scoped lang='scss'>
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
.user {
  display: inline-block;
  cursor: pointer;
  margin: 0 10px;
}
.user img {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  vertical-align: bottom;
}
.user p {
  padding: 0;
  margin: 0;
}

// ----------------------------------------

.infositem_body {
  width: 100%;
  display: flex;
  max-height: 100px;
  overflow: hidden;
}
.infositem_body_left {
  width: 60%;
  overflow: hidden;
  padding: 10px;
  box-sizing: border-box;
}
.infositem_body_right {
  width: 40%;
  overflow: hidden;
  padding: 10px 0;
  box-sizing: border-box;
}
.infositem_body_right img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.coupon {
  width: 150px;
  height: 70px;
  display: inline-flex;
  margin-right: 10px;
  margin-bottom: 10px;
  position: relative;
  border: 1px solid rgb(230, 227, 227);
  border-radius: 2px;
  overflow: hidden;
  cursor: pointer;
}
.couponbg {
  width: 150px;
  height: 70px;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 2px;
}
.coupon_head {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
}
.coupon_head_left {
  width: 40px;
  height: 40px;
  border-radius: 100%;
  overflow: hidden;
  flex-shrink: 0;
  img {
    width: 100%;
    height: 100%;
  }
}
.coupon_head_right {
  width: calc(100% - 40px);
  margin-left: 4px;
  p {
    color: #fff;
  }
}
.coupon_body {
  width: 100%;
  height: 30px;
  background: #fff;
}
.imgs {
  width: 100%;
  height: 100%;
}
.imgs > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.tips {
  font-size: 12px;
  color: rgb(144, 145, 148);
}
.voiceBg {
  width: 100%;
  height: 100%;
  background: #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
}
.voiceBg i {
  font-size: 30px;
}
/* -------------------- */
.time {
  margin-bottom: 20px;
}
.tools {
  width: 50%;
}
.tools_input {
  width: 50%;
}
.nextInfosbg {
  width: 100%;
  height: 100px;
  display: flex;
  border-top: 1px solid #ccc;
  overflow: hidden;
  position: relative;
}
.nextInfosbg .active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  justify-content: center;
  align-items: center;
  background: rgba(120, 123, 124, 0.5);
  color: #fff;
  font-size: 16px;
  z-index: 10;
}
.nextInfosbg:hover .active {
  display: flex;
}
.nextInfos_head {
  width: 60%;
  height: 100px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.nextInfos_img {
  width: 40%;
  height: 100px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
/* ---------------- */
.infos {
  width: 100%;
  height: 100%;
}
.infos .infositem {
  width: 250px;
  height: 100%;
  border: 1px solid #ccc;
  position: relative;
  cursor: pointer;
  display: inline-flex;
  margin: 0 20px 20px 0;
  flex-direction: column;
  border-radius: 5px;
  overflow: hidden;
}
.infos .infositem .infositem_head {
  width: 100%;
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
  padding: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.infos .infositem .infositem_img {
  width: 220px;
  height: 160px;
  margin: auto;
  overflow: hidden;
  position: relative;
}
.infos .infositem .infositem_img .active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  justify-content: center;
  align-items: center;
  background: rgba(120, 123, 124, 0.5);
  color: #fff;
  font-size: 16px;
}
.infos .infositem .infositem_img:hover .active {
  display: flex;
}
/* .infos .infositem .infositem_img img {
  width: 100%;
} */

.infositem_bg {
  position: relative;
}
.infos .infositem .infositem_bg .active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 16px;
  z-index: 10;
}
.infos .infositem .infositem_bg:hover .active {
  display: flex;
}
.infos .infositem .infositem_foot {
  width: 100%;
  height: 30px;
  text-align: center;
  line-height: 30px;
  box-sizing: border-box;
  padding: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.infositem_tool {
  width: 100%;
  height: 50px;
  border-top: 1px solid #ccc;
  display: flex;
}
.infositem_tools {
  width: 50%;
  height: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
/* ----------------- */
.imgItem {
  width: 100%;
  height: 100%;
}
.imgItem .img {
  display: inline-block;
  width: 150px;
  height: 170px;
  position: relative;
  border: 1px solid #ccc;
  margin-right: 20px;
  margin-bottom: 20px;
  overflow: hidden;
}
/* .imgItem .img img {
  width: 100%;
  height: auto;
} */
.imgItem .img .imgTxt {
  width: 100%;
  height: 20px;
  position: absolute;
  left: 0;
  bottom: 0;
  border-top: 1px solid #ccc;
  text-align: center;
  line-height: 20px;
  background: #fff;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.imgItem .img .imgClose {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(77, 76, 76, 0.5);
  color: #fff;
}
.imgItem .img .imgClose i {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 40px;
  cursor: pointer;
}
/* ------------------- */
.messages {
  width: 50%;
  height: 100%;
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
