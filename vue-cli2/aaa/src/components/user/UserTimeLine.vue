<template>
  <el-timeline>
    <el-timeline-item
      :timestamp="item.created_at"
      placement="top"
      v-for="(item,index) in userRecord"
      :key="index"
    >
      <el-card>
        <h4>{{handleDivision(item.message_type)}}</h4>
        <br />
        <div class v-if="item.message_type == '1' || item.message_type == '8'">{{item.message_content}}</div>
        <div class v-if="item.message_type == 'event'">{{item.message_content}}</div>
        <div class v-if="item.message_type == 'authorize'">{{item.message_content}}</div>
        <div class="imgCover" v-if="item.message_type == '6'">
          <img :src="showImg(item.message_content)" />
        </div>
        <div v-if="item.message_type == '2'">
          <v-LinkNews v-if="item.message_content" :replyContent="strToJsons(item.message_content)"></v-LinkNews>
        </div>
        <div class="" v-if="item.message_type == '3'">
           <v-voice v-if="item.message_content" :replyContent="getUrl('voice',item.message_content)"></v-voice>
        </div>
        <div v-if="item.message_type == '4'">
          <v-NewsList v-if="item.message_content" :replyContent="strToJsons(item.message_content)"></v-NewsList>
        </div>
        <div class="" v-if="item.message_type == '5'">
          <v-video :replyContent="getUrl('video',item.message_content)"></v-video>
        </div>
        <div v-if="item.message_type == '7'">
          <v-wechatapp v-if="item.message_content" :replyContent="strToJsons(item.message_content)"></v-wechatapp>
        </div>
        <div v-if="item.message_type == '10'">
          <v-voucher v-if="item.message_content" :replyContent="strToJsons(item.message_content)"></v-voucher>
        </div>
        <div v-if="item.message_type == '11'">
          <v-voucher v-if="item.message_content" :replyContent="strToJsons(item.message_content)"></v-voucher>
        </div>
      </el-card>
    </el-timeline-item>
  </el-timeline>
</template>
<script>
import vLinkNews from "../../template/LinkNews";
import vNewsList from "../../template/NewsList";
import vVoucher from "../../template/voucher";
import vWechatapp from "../../template/wechatapp";
import BaseView from "../common/BaseView";;
import vVoice from "../../template/voice";
import vVideo from "../../template/video";
export default {
  extends: BaseView,
  components: {
    vLinkNews,
    vNewsList,
    vVoucher,
    vWechatapp,
    vVoice,
    vVideo
  },
  props: ["userRecord"],
  data() {
    return {
      activeNames: ["1"]
    };
  },
  methods: {
    // 提取链接
    getUrl(type, item) {
      item = JSON.parse(item);
      if (type == "voice") {
        return item;
      }
      if (type == "video") {
        return item;
      }
    },
    strToJsons(str) {
      if (str) {
        str = JSON.parse(str);
        return str;
      } else {
        return "";
      }
    },
    // 查看大图
    viewImg(url) {
      window.open(url, "_blank");
    },
    handleWe(item) {
      return item;
    },
    handleDeal(item) {
      item = JSON.parse(item);
      return item;
    },
    handleEdit(item) {
      item = JSON.parse(item);
      item.forEach(element => {
        element.picurl = element.image;
        element.thumb_url = element.image;
      });
      return item;
    }
  }
};
</script>
<style scoped>
.imgItem {
  width: 60px;
  margin-top: 10px;
}
.imgCover {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
}
.imgCover > img {
  height: 60px;
}
.imgCover > i {
  font-size: 30px;
}
</style>