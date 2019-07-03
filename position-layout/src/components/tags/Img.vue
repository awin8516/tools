<template>
  <img :data-img-name="elementParams.src && elementParams.style.name" :style="elementParams.style" :src="elementParams.src" :class="elementParams.className">
</template>

<script>
export default {
  name: "Img",
  data() {
    return {
      tagName: "img",
      icon: "picture",
      name: "img-01",
      id: "img1",
      className: "img img-test",
      src: require("@/assets/img.jpg"),
      style: {
        position: "absolute",
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
