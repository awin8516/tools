<template>
  <div class="infos">
    <div class="infositem">
      <div class="infositem_head" v-if="this.infospanel">小程序</div>
      <div class="infositem_head">{{this.infospanel.title}}</div>
      <div class="infositem_img">
        <img :src="showImg(this.infospanel.thumb_url)" />
      </div>
      <div class="infositem_footer">
        <img src="../assets/mini.png" />
        <span>小程序</span>
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
      infospanel: {}
    };
  },
  watch: {
    replyContent: {
      handler(newValue, oldValue) {
        if (
          Object.prototype.toString.call(this.replyContent) == "[object Object]"
        ) {
          this.infospanel = this.replyContent;
        } else {
          this.infospanel = JSON.parse(this.replyContent);
        }
      },
      deep: true
    }
  },
  mounted() {
    if (
      Object.prototype.toString.call(this.replyContent) == "[object Object]"
    ) {
      this.infospanel = this.replyContent;
    } else {
      this.infospanel = JSON.parse(this.replyContent);
    }
  },
  methods: {
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
.infositem_footer {
  height: 30px;
  border-top: 1px solid #e4e4e4;
  display: flex;
  align-items: center;
  padding: 0px 10px;
  margin-top: 8px;
}
.infositem_footer img {
  width: 12px;
  height: 12px;
  flex-shrink: 1;
}
.infositem_footer span {
  font-size: 12px;
  color: #adadad;
  margin-left: 8px;
}
.infositem_img {
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 10px;
}
.infositem_img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
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
  width: 270px;
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
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 10px;
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