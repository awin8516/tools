<template>
  <div :data-name="element.name" :style="element.style[$parent.gt_mediaName]" :id="element.attribute.id" :class="element.attribute.className">
    <ul class="swiper-wrapper">
      <li class="swiper-slide"><img :src='require("@/assets/1.jpg")'></li>
      <li class="swiper-slide"><img :src='require("@/assets/2.jpg")'></li>
      <li class="swiper-slide"><img :src='require("@/assets/3.jpg")'></li>
      <li class="swiper-slide"><img :src='require("@/assets/4.jpg")'></li>
      <li class="swiper-slide"><img :src='require("@/assets/5.jpg")'></li>
    </ul>
  </div>
</template>

<script>
import { registerContextMenu } from "@/utils";
import "swiper/dist/css/swiper.min.css";
import swiper from "swiper";
export default {
  name: "Swiper",
  data() {
    return {
      type: "swiper",
      icon: "swiper",
      name: "swiper-1",
      tagSort: 600,
      attribute: {
        id: "swiper-1",
        className: "swiper-container swiper-test"
      },
      style: {
        default: {
          position: "absolute",
          left: "0",
          right: "auto",
          top: "0",
          bottom: "auto",
          width: "300px",
          height: "300px",
          display: "block",
          color: "",
          "background-image": "url()",
          "background-color": "#eee",
          "background-repeat": "no-repeat",
          "background-size": "100% auto",
          "background-position": "left top"
        }
      },
      options: {
        direction: "horizontal",
        initialSlide: 0,
        speed: 300,
        freeMode: false,
        loop: false,
        preventClicks: true,
        preventClicksPropagation: true,
        touchRatio: 1,
        simulateTouch: false,
        followFinger: true,
        allowSlideNext: true,
        allowSlidePrev: true,
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: true
        },
        effect: "slide",
        mousewheel: false
      }
    };
  },
  props: ["element"],
  mounted() {
    this.swiper = new swiper(".swiper-container", this.options);
    // registerContextMenu(this, {
    //   name: "cm_editInnerText",
    //   icon: "el-icon-delete",
    //   label: "编辑文字",
    //   sort: 4,
    //   command: () => {
    //     this.$parent.ac_updateElement({ editing: true });
    //   }
    // });
  },
  watch: {
    element: function(newVal, oldVal) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.swiper.destroy(true, false);
        this.swiper = new swiper(
          "#" + this.element.attribute.id,
          this.element.options
        );
      }, 500);
    }
  }
};
</script>

<style lang="scss">
.swiper-container,
.swiper-wrapper {
  z-index: initial;
}
</style>
