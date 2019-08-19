<template>
  <div :data-name="element.name" :style="element.style[$parent.gt_mediaName]" :id="element.attribute.id" :class="element.attribute.className">
    <slot name="innerText"></slot>
  </div>
</template>

<script>
import { registerContextMenu } from "@/utils";
export default {
  name: "Txt",
  data() {
    return {
      type: "txt",
      icon: "text",
      container: false,
      name: "text-1",
      innerText: "",
      editing: true,
      tagSort: 800,
      attribute: {
        id: "text-1",
        className: "text text-test"
      },
      style: {
        default: {
          position: "absolute",
          left: "0",
          right: "auto",
          top: "0",
          bottom: "auto",
          width: "100px",
          "min-height": "2em",
          display: "block",
          color: "",
          "text-align": "",
          "background-color": "#eee",
          "background-image": "url()",
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
