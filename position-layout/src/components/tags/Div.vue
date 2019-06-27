<template>
  <div :style="elementParams.style" :class="elementParams.className">
    <slot name="children"></slot>
  </div>
</template>

<script>
export default {
  name: "Div",
  data() {
    return {
      tagName: "div",
      icon: "menu",
      container: true,
      className: ["div", "div-test"],
      style: {
        position: "absolute",
        left: "0",
        right: "auto",
        top: "0",
        bottom: "auto",
        width: "100px",
        height: "100px",
        display: "block",
        "background-image": "url()",
        "background-color": "#eee",
        "background-repeat": "no-repeat",
        "background-size": "100% auto",
        "background-position": "left top"
      },
      contextMenu: [
        {
          icon: "el-icon-delete",
          name: "编辑文字",
          command: () => {}
        }
      ]
    };
  },
  props: ["elementParams"]
};
</script>
