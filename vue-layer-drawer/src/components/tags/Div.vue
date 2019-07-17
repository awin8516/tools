<template>
  <div :data-name="element.name" :style="element.style[$parent.gt_mediaName]" :id="element.attribute.id" :class="element.attribute.className">
    <slot name="innerText"></slot>
    <slot name="children"></slot>
  </div>
</template>

<script>
import { registerContextMenu } from "@/utils";
export default {
  name: "Div",
  data() {
    return {
      type: "div",
      icon: "level",
      container: true,
      name: "div-1",
      innerText: "",
      editing: false,
      attribute: {
        id: "div-1",
        className: "div div-test"
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
