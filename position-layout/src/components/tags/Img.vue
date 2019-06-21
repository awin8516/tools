<template>
  <img :style="elementParams.style" :src="elementParams.src" :class="elementParams.className">
</template>

<script>
export default {
  name: "Img",
  data() {
    return {
      tagName: "img",
      icon: "picture",
      src: require("@/assets/img.jpg"),
      style: {
        left: "0",
        top: "0",
        width: "100px",
        height: "100px"
      }
    };
  },
  props: ["elementParams"]
};
</script>
