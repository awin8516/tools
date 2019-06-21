<template>
  <div :style="elementParams.style">
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
      style: {
        "left": "0",
        "top": "0",
        "width": "100px",
        "height": "100px",
        "background-image": "url()",
        "background-color": "#eee",
        "background-repeat": "no-repeat",
        "background-size": "100% auto",
        "background-position": "left top"
      },
      contextMenu: [
        {
          icon: 'el-icon-delete',
          name: '编辑文字',
          command: () => {

          }
        }
      ]
    };
  },
  props: ["elementParams"]
};
</script>
