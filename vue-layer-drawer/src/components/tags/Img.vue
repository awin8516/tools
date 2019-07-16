<template>
  <img :data-name="element.name" :style="element.style[$parent.gt_mediaName]" :src="element.attribute.src" :id="element.attribute.id" :class="element.attribute.className" />
</template>

<script>
export default {
  name: "Img",
  data() {
    return {
      type: "img",
      icon: "img",
      name: "img-1",
      attribute: {
        id: "img-1",
        className: "img img-test",
        src: require("@/assets/img.jpg")
      },
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
