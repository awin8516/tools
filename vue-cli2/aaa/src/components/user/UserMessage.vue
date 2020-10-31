<template>
  <div class="infos">
    <div class="message" id="message" ref="message" v-loading="loading">
      <ul v-if="messages.length">
        <li v-for="item in messages" :key="item.id">
          <div class="main" :class="{ self: item.is_sys == 1 }">
            <img
              class="avatar"
              width="30"
              height="30"
              :src="item.is_sys != 1 ? item.fan.headimgurl : user.img"
            />
            <div
              :class="{'text':true,'other':item.message_type == 6 || item.message_type == 7 || item.message_type == 2 || item.message_type == 4 || item.message_type == 11 || item.message_type == 10}"
            >
              <div v-if="item.message_type == 'event'">
                <p class="msg">{{item.message_content}}</p>
              </div>
              <div class="msgText" v-if="item.message_type == 1 || item.message_type == 8">
                <p class="msg">{{item.message_content}}</p>
              </div>
              <div style="margin-top:-10px" v-if="item.message_type == 2">
                <v-LinkNews :replyContent="showContent(item.message_content)"></v-LinkNews>
              </div>
              <div class="msgVideoVoice" v-if="item.message_type == 3">[语音消息]</div>
              <div style="margin-top:-10px" v-if="item.message_type == 4">
                <v-NewsList :replyContent="showContent(item.message_content)"></v-NewsList>
              </div>
              <div class="msgVideoVoice" v-if="item.message_type == 5">[视频消息]</div>
              <div class="avatarImg" v-if="item.message_type == 6">
                <img :src="item.message_content" class="avatar" width="50" height="50" />
              </div>
              <div v-if="item.message_type == 7">
                <v-wechatapp :replyContent="item.message_content"></v-wechatapp>
              </div>
              <div v-if="item.message_type == 10">
                <v-voucher
                  v-if="item.message_content"
                  :replyContent="showContent(item.message_content,'voucher')"
                ></v-voucher>
              </div>
              <div v-if="item.message_type == 11">
                <v-voucher
                  v-if="item.message_content"
                  :replyContent="showContent(item.message_content,'voucher')"
                ></v-voucher>
              </div>
              <p>{{item.created_at}}</p>
            </div>
          </div>
        </li>
      </ul>
      <div v-else class="wxqq"></div>
    </div>
    <div class="mains container">
      <v-material :have_btn="have_btn" ref="materials" @listenChild="showChild"></v-material>
      <div class="send">
        <el-tooltip class="item" effect="dark" content="发送所选内容" placement="top">
          <el-button type="primary" @click="sendMessage()">发送</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="返回用户列表" placement="top">
          <el-button @click="back()" icon="el-icon-back">返回</el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import vMaterial from "../dialogs/materials";
import vNewsList from "../../template/NewsList";
import vLinkNews from "../../template/LinkNews";
import vWechatapp from "../../template/wechatapp";
import vVoice from "../../template/voice";
import vVoucher from "../../template/voucher";
export default {
  components: {
    vMaterial,
    vNewsList,
    vLinkNews,
    vWechatapp,
    vVoice,
    vVoucher
  },
  data() {
    return {
      // 显示素材组件
      have_btn: true,
      // 当前用户
      user: {
        name: "coffce",
        img: localStorage.getItem("avatar")
      },
      messages: [],
      // user_dynamics_list接口的参数  用来获取这个用户的对话信息
      dynamicsObj: {
        openid: "",
        appid: this.$store.getters.showQuery,
        paginate: "10",
        f_id: "",
        type: "",
        is: "",
        page: 1,
        limit: 10,
        totals: 0,
        currentPage1: 0
      },
      message: [],
      is_onscroll: false,
      loading: false,
      // 发送消息的参数  用来发送用户的消息  和组件一起使用
      userMessage: {
        appid: this.$store.getters.showQuery,
        type: "text",
        openid: "",
        id: "",
        str: "",
        nickname: ""
      }
    };
  },

  filters: {
    // 将日期过滤为 hour:minutes
    time(date) {
      if (typeof date === "string") {
        date = new Date(date);
      }
      return date.getHours() + ":" + date.getMinutes();
    }
  },
  created() {
    if (localStorage.getItem("uid")) {
      this.dynamicsObj.openid = JSON.parse(localStorage.getItem("uid")).openid;
      this.user_dynamics_list();
      this.userMessage.openid = JSON.parse(localStorage.getItem("uid")).openid;
      this.userMessage.nickname = JSON.parse(
        localStorage.getItem("uid")
      ).nickname;
    } else {
    }
  },
  mounted() {
    // 监听这个dom的scroll事件
    this.$refs.message.onscroll = () => {
      this.is_onscroll = true;
      this.scrollHandle();
    };
  },
  methods: {
    // 处理数据
    showContent(data, type) {
      data = JSON.parse(data);
      return data;
    },
    // 发送消息  父组件出发子组件addMaterial（方法 ，这个方法回传素材的数据回到父组件
    sendMessage() {
      this.$refs.materials.addMaterial();
    },
    // 监测子组件的addMaterial方法  ，，传来type和data数据
    showChild(type, data) {
      switch (parseInt(type)) {
        case 1:
          // 文本就接收字符串;
          this.userMessage.str = data;
          this.userMessage.type = "1";
          break;
        case 2:
          // 外联图文就接收id;
          this.userMessage.id = data.id;
          this.userMessage.type = "2";
          break;
        case 3:
          // 音频就接收media_id
          this.userMessage.id = data.id;
          this.userMessage.type = "3";
          break;
        case 4:
          // 图文就接收id;
          this.userMessage.id = data.id;
          this.userMessage.type = "4";
          break;
        case 5:
          // 视频就接收media_id;
          this.userMessage.id = data.id;
          this.userMessage.type = "5";
          break;
        case 6:
          // 图片就接收media_id;
          this.userMessage.id = data.id;
          this.userMessage.type = "6";
          break;
        case 7:
          // 图片就接收media_id;
          this.userMessage.id = data.id;
          this.userMessage.thumb_media_id = data.thumb_media_id;
          this.userMessage.weappid = data.weappid;
          this.userMessage.title = data.title;
          this.userMessage.pagepath = data.pagepath;
          this.userMessage.type = "7";

          data.thumb_url = data.picurl;
          this.userMessage.str = data;
          break;
        case 10:
          // 图片就接收media_id;
          this.userMessage.id = data.id;
          this.userMessage.type = "10";
          break;
        case 11:
          // 图片就接收media_id;
          this.userMessage.id = data.id;
          this.userMessage.type = "11";
          break;
      }
      // 获取参数后 调用发送消息接口
      this.user_message();
    },
    user_message() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "user_message", this.userMessage)
        .then(res => {
          if (res.data.code == 0) {
            this.isDisable = false;
            this.$message.success("发送成功");
            // 发送成功以后  调用获取信息列表接口获取对话信息列表
            this.dynamicsObj.page = 1;
            this.$axios
              .post(
                this.GLOBAL.BASE_URL + "user_dynamics_list",
                this.dynamicsObj
              )
              .then(res => {
                if (res.data.code == 0) {
                  let data = res.data.data.data.data;
                  this.messages = this.messages.concat(data[0]);
                  this.is_onscroll = false;
                  if (!this.is_onscroll) {
                    // 如果不是手动滚动的话
                    this.$nextTick(() => {
                      let msg = document.getElementById("message"); // 获取对象
                      msg.scrollTop = msg.scrollHeight; // 滚动高度
                    });
                  }
                  this.loading = false;
                } else {
                  this.$message.error(res.data.message);
                }
              });
          } else {
            this.isDisable = false;
            this.$message.error(res.data.message);
          }
        });
    },
    // 监测滚动事件
    scrollHandle() {
      let msg = document.getElementById("message"); // 获取对象
      if (msg.scrollTop == 0) {
        if (this.messages.length) {
          this.dynamicsObj.page++;
          this.user_dynamics_list();
        }
      }
    },
    // 获取对话心里却
    user_dynamics_list() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "user_dynamics_list", this.dynamicsObj)
        .then(res => {
          if (res.data.code == 0) {
            let data = res.data.data.data.data;
            data = data.reverse();
            this.messages = data.concat(this.messages);
            if (!this.is_onscroll) {
              // 如果不是手动滚动的话
              this.$nextTick(() => {
                let msg = document.getElementById("message"); // 获取对象
                msg.scrollTop = msg.scrollHeight + 100; // 滚动高度
              });
            }
            this.loading = false;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    back() {
      localStorage.removeItem("uid");
      this.$router.push({
        path: "/UserInfo"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.msgVideoVoice {
  margin-top: 0px;
  margin-bottom: 10px;
  background: #b2e281;
  padding: 6px;
}
.msgText{
  margin-bottom: 10px;;
}
.infos {
  display: flex;
}
.avatarImg {
  height: 60px;
}
.wxqq {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 100px;
  height: 90px;
  background: url("../../assets/wxqq.png") no-repeat;
  background-position: -96px -150px;
  background-size: 487px 462px;
}
.mains {
  width: 60%;
}
.send {
  margin-top: 40px;
  margin-bottom: 20px;
}
/* 滚动槽 */
.message::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.message::-webkit-scrollbar-track {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.06);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.08);
}
.message::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.12);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}
.message {
  background: #eeeeee;
  box-shadow: 0 0 6px -3px #2e3238;
  width: 400px;
  height: 440px;
  padding: 10px 15px;
  overflow-y: scroll;
  position: relative;
  margin-right: 50px;
  ul {
    list-style: none;
  }
  li {
    margin-bottom: 15px;
  }
  .time {
    margin: 7px 0;
    text-align: center;

    > span {
      display: inline-block;
      padding: 0 18px;
      font-size: 12px;
      color: #fff;
      border-radius: 2px;
      background-color: #dcdcdc;
    }
  }
  .avatar {
    float: left;
    margin: 0 10px 0 0;
    border-radius: 3px;
  }
  .text {
    display: inline-block;
    position: relative;
    max-width: 344px;
    min-height: 30px;
    line-height: 1.5;
    font-size: 12px;
    text-align: left;
    word-break: break-all;
    background-color: transparent;
    border-radius: 4px;

    .msg {
      background: #fff;
      padding: 10px;
    }

    &:before {
      content: " ";
      position: absolute;
      top: 6px;
      right: 100%;
      border: 10px solid transparent;
      border-right-color: #fafafa;
    }
  }

  .self {
    text-align: right;

    .avatar {
      float: right;
      margin: 0 0 0 10px;
    }
    .text {
      background-color: transparent;

      .msg {
        background: #b2e281;
        padding: 10px;
      }

      &.other {
        background: transparent;
        padding: 0;
      }
      &:before {
        right: inherit;
        left: 100%;
        border-right-color: transparent;
        border-left-color: #b2e281;
      }
      &.other:before {
        right: inherit;
        left: 100%;
        border-right-color: transparent;
        border-left-color: #fff;
      }
    }
  }
}
</style>