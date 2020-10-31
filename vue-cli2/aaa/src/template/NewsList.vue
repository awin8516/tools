<template>
  <div class="infos">
    <div v-if="groupsend">
      <!-- 这是渲染群发消息的 -->
      <div class="infositem groupsend">
        <div class="infositem_bg" v-if="infospanel[0]">
          <a
            v-if="infospanel[0].url"
            :href="infospanel[0].url"
            target="view_window"
            class="active"
          >预览文章</a>
          <div class="infositem_img">
            <img :src="showImg((infospanel[0].thumb_url))" />
          </div>
          <div class="infositem_foot">{{handleCut(infospanel[0].title,20)}}</div>
        </div>
        <!-- 后续的图文 -->
        <div class="nextInfos" v-if="ishift(infospanel).length > 0">
          <div class="nextInfosbg" v-for="(list,index) in ishift(infospanel)" :key="index">
            <a v-if="list.url" :href="list.url" target="view_window" class="active">预览文章</a>
            <div class="nextInfos_head">{{handleCut(list.title,31)}}</div>
            <div class="nextInfos_img">
              <img :src="showImg(list.thumb_url)" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <!-- 这是不渲染群发消息 -->
      <div class="infositem">
        <div class="infositem_bg" v-if="infospanel[0]">
          <a
            v-if="infospanel[0].url"
            :href="infospanel[0].url"
            target="view_window"
            class="active"
          >预览</a>
          <div class="infositem_head" v-if="infospanel[0]">{{handleCut(infospanel[0].title,20)}}</div>
          <div class="infositem_body">
            <div
              class="infositem_body_left"
              v-if="infospanel[0]"
            >{{handleCut(infospanel[0].digest || infospanel[0].description,20)}}</div>
            <div class="infositem_body_right" v-if="infospanel[0]">
              <img v-if="infospanel[0]" :src="showImg(infospanel[0].thumb_url)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vLinkNews from "./LinkNews";
import BaseView from "../components/common/BaseView";
export default {
  extends: BaseView,
  components: {
    vLinkNews
  },
  props: ["replyContent", "groupsend"],
  data() {
    return {
      infospanel: []
    };
  },
  watch: {
    replyContent: {
      handler(newValue, oldValue) {
        this.infospanel = this.replyContent.news_item || this.replyContent;
      },
      deep: true
    }
  },
  mounted() {
    this.infospanel = this.replyContent.news_item || this.replyContent;
  },
  methods: {
    handleCut(str, num) {
      if (str.length < num) {
      } else {
        str = str.toString()
        str = str.substring(0, num) + "...";
      }
      return str;
    },
    // 处理数据
    ishift(arr) {
      // let newArr = arr.concat();
      // if (newArr.length > 1) {
      //   newArr.shift();
      //   return newArr;
      // }
      let newArr = arr.map(o => Object.assign({}, o));
      newArr.shift();
      return newArr;
    },
    showImg(url) {
      if (url) {
        return (
          "https://scrm.beats-digital.com/Ajax/Media/ShowImage?image=" + url
        );
      } else {
        return "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.infositem_body {
  width: 100%;
  display: flex;
  height: auto;
  overflow: hidden;
}
.infositem_body_left {
  width: 70%;
  overflow: hidden;
  padding: 8px 8px 8px 8px;
  box-sizing: border-box;
  font-size: 12px;
  line-height: 18px;
}
.infositem_body_right {
  width: 40%;
  overflow: hidden;
  padding: 8px 8px 8px 0;
  box-sizing: border-box;
}
.infositem_body_right img {
  width: 100%;
  height: 60px;
  object-fit: cover;
}
// --------------------------------
/* ----------------- */
.infositem_remark {
  background: #a8a8a8;
  color: #fff;
  display: flex;
  justify-content: center;
}
.infositem_remark p {
  width: 100%;
  margin: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
.nextInfosbg {
  width: 100%;
  height: 100px;
  display: flex;
  border-top: 1px solid rgb(230, 230, 230);
  overflow: hidden;
  position: relative;
  padding: 6px 0;
  box-sizing: border-box;
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
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 16px;
  z-index: 10;
}
.nextInfosbg:hover .active {
  display: flex;
}
.nextInfos_head {
  width: 60%;
  height: 100%;
  display: inline-block;
  box-sizing: border-box;
  padding: 10px;
  line-height: 1.2em;
}
.nextInfos_img {
  width: 40%;
  height: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.nextInfos_img > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.infositem_remark {
  background: #a8a8a8;
  color: #fff;
  display: flex;
  justify-content: center;
}
.infositem_remark p {
  width: 100%;
  margin: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
.infos {
  width: 100%;
  height: 100%;
}
.infos .infositem {
  width: 200px;
  height: auto;
  position: relative;
  cursor: pointer;
  display: inline-flex;
  flex-direction: column;
  border-radius: 5px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 1px 10px 0 #e4e8eb;
  border-radius: 2px;
  margin: 10px 0;
}
.infos .infositem.groupsend {
  width: 250px;
}
.infositem_bg {
  position: relative;
}
.infos .infositem .infositem_head {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 10px;
  line-height: 18px;
  color: #000;
  font-size: 14px;
}
.infos .infositem .infositem_img {
  width: 100%;
  height: 140px;
  margin: auto;
  overflow: hidden;
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
.infos .infositem .infositem_img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.infos .infositem .infositem_foot {
  width: 100%;
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
  padding: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: absolute;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
}
</style>