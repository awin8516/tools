<template>
  <div :data-name="element.name" :style="element.style[$parent.gt_mediaName]" :id="element.attribute.id" :class="element.attribute.className">
    <ul class="swiper-wrapper">
      <li class="swiper-slide">a</li>
      <li class="swiper-slide">b</li>
      <li class="swiper-slide">c</li>
    </ul>
  </div>
</template>

<script>
import { registerContextMenu } from "@/utils";
import "swiper/dist/css/swiper.min.css"
import swiper from "swiper"
export default {
  name: "Swiper",
  data() {
    return {
      type: "swiper",
      icon: "level",
      name: "swiper-1",
      attribute: {
        id: "swiper-1",
        className: "swiper swiper-test"
      },
      style: {
        default: {
          position: "absolute",
          left: "0",
          right: "auto",
          top: "0",
          bottom: "auto",
          width: "100px",
          height: "100px",
          display: "block",
          color: "",
          "background-image": "url()",
          "background-color": "#eee",
          "background-repeat": "no-repeat",
          "background-size": "100% auto",
          "background-position": "left top"
        }
      }
    };
  },
  props: ["element"],
  mounted() {
    console.log(swiper)
    const a = new swiper('.swiper')
    registerContextMenu(this, {
      name: "cm_editInnerText",
      icon: "el-icon-delete",
      label: "编辑文字",
      sort: 4,
      command: () => {
        this.$parent.ac_updateElement({ editing: true });
      }
    });
  }
};
</script>
