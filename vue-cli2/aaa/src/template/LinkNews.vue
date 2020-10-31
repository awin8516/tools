<template>
  <div class="infos">
    <div class="infositem" v-for="(item,index) in infospanel" :key="index">
      <a v-if="item.url" :href="item.url" target="view_window" class="active">预览</a>
      <div class="infositem_head" v-if="item">{{handleCut(item.title,20)}}</div>
      <div class="infositem_body">
        <div class="infositem_body_left" v-if="item">{{handleCut(item.description,30)}}</div>
        <div class="infositem_body_right" v-if="item">
          <img v-if="item" :src="showImg(item.picurl)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseView from "../components/common/BaseView";
export default {
  extends: BaseView,
  props: ["replyContent"],
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
      if (arr.length > 1) {
        arr.shift();
      }
      return arr;
    },
    showImg(url) {
      if (url) {
        return (
          "" + url
        );
      } else {
        return "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.infos .infositem:hover .active {
  display: flex;
}
.active {
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
.infositem_body {
  width: 100%;
  display: flex;
  max-height: 100px;
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
  padding: 8px 8px 8px  0;
  box-sizing: border-box;
}
.infositem_body_right img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
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
  padding: 10px 0;
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
  line-height: 100px;
  box-sizing: border-box;
  padding: 0 10px 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
.infositem_bg {
  position: relative;
}
.infos .infositem .infositem_head {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 10px 10px 0 10px;
  line-height: 18px;
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