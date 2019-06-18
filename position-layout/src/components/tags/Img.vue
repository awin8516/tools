<template>
  <img :style="element.style" :src="element.src">
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { object2style } from "@/utils";
export default {
  name: "Img",
  data() {
    return {
      tagName: "img",
      icon: "picture",
      src: require("@/assets/img.jpg"),
      style: {
        "left": "0",
        "top": "0",
        "width": "100px",
        "height": "100px",
      }
    };
  },
  props: ["element"],
  computed: {
    styleStr: function () {
      return object2style(this.style)
    }
  }
};
</script>
