<template>
  <div :data-name="element.name" :style="element.style[mediaName]" :class="element.className">
    <slot name="innerHTML"></slot>
  </div>
</template>

<script>
export default {
  name: "Txt",
  data() {
    return {
      tagName: "div",
      icon: "menu",
      container: false,
      name: "text-1",
      id: "text-1",
      className: "text text-test",
      text: "",
      texting: true,
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
          "background-color": "#eee",
          "background-image": "url()",
          "background-repeat": "no-repeat",
          "background-size": "100% auto",
          "background-position": "left top"
        }
      }
    };
  },
  props: ["element", "mediaName"],
  mounted() {
    this.$parent.ac_updateElementAttr({
      contextMenu: [
        {
          icon: "el-icon-delete",
          name: "编辑文字",
          command: () => {
            this.$parent.ac_updateElementAttr({texting:true})
          }
        }
      ]
    });
  }
};
</script>
