<template>
  <div :style="element.style"></div>
</template>

<script>
import { object2style } from "@/utils";
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
      }
    };
  },
  props: ["element"]
};
</script>
