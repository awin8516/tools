<template>
  <img
    :data-name="element.name"
    :style="element.style[$parent.mediaName]"
    :src="element.src"
    :class="element.className"
  />
</template>

<script>
export default {
  name: "Img",
  data() {
    return {
      type: "img",
      icon: "picture",
      name: "img-1",
      id: "img-1",
      className: "img img-test",
      src: require("@/assets/img.jpg"),
      style: {
        default: {
          position: "absolute",
          left: "0",
          top: "0",
          width: "100px",
          height: "100px"
        }
      }
    };
  },
  props: ["element"]
};
</script>
