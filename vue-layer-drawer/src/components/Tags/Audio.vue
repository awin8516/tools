<template>
  <audio :data-name="element.name" :style="element.style[$parent.gt_mediaName]" :src="element.attr.src" :autoplay="element.attr.autoplay" :class="element.attr.className"></audio>
</template>

<script>
export default {
  name: "Audio",
  data() {
    return {
      type: "audio",
      icon: "audio",
      name: "audio-1",
      attr: {
        id: "audio-1",
        className: "audio audio-test",
        src: "",
        autoplay: true,
        controls: false,
        loop: false,
        preload: false
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
