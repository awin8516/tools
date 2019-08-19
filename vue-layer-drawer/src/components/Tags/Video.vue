<template>
  <video :data-name="element.name" :src="element.attribute.src" :style="element.style[$parent.gt_mediaName]" :id="element.attribute.id" :class="element.attribute.className" :autoplay="element.attribute.autoplay" :controls="element.attribute.controls" :loop="element.attribute.loop" :preload="element.attribute.preload"></video>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Audio",
  data() {
    return {
      type: "video",
      icon: "video",
      name: "video-1",
      tagSort: 500,
      attribute: {
        id: "video-1",
        className: "video video-test",
        src: "",
        autoplay: false,
        controls: true,
        loop: false,
        preload: false
      },
      style: {
        default: {
          width: "200px",
          height:"150px"
        }
      }
    };
  },
  props: ["element"]
};
</script>
