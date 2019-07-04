<template>
  <img
    :data-name="element.src && element.name"
    :style="element.style[mediaName]"
    :src="element.src"
    :class="element.className"
  />
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
  props: ["element", "mediaName"]
};
</script>
