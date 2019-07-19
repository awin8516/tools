<template>
  <div v-if="isBgm" :style="element.style[$parent.gt_mediaName]">
    <audio :data-name="element.name" :src="element.attribute.src" :id="element.attribute.id" :class="element.attribute.className" :autoplay="element.attribute.autoplay" :controls="element.attribute.controls" :loop="element.attribute.loop" :preload="element.attribute.preload"></audio>
  </div>
  <audio v-else :data-name="element.name" :src="element.attribute.src" :style="element.style[$parent.gt_mediaName]" :id="element.attribute.id" :class="element.attribute.className" :autoplay="element.attribute.autoplay" :controls="element.attribute.controls" :loop="element.attribute.loop" :preload="element.attribute.preload"></audio>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Audio",
  data() {
    return {
      type: "audio",
      icon: "audio",
      name: "audio-1",
      attribute: {
        id: "audio-1",
        className: "audio audio-test",
        src: "",
        autoplay: false,
        controls: true,
        loop: false,
        preload: false
      },
      style: {
        default: {
          // position: "absolute",
          // right: "0",
          // top: "0",
          // "background-image": ""
        }
      },
      options: {
        bgm: false
      }
    };
  },
  props: ["element"],
  computed: {
    isBgm: {
      get: function() {
        return this.element && this.element.options.bgm;
      }
    }
  },
  methods: {
    ...mapActions(["ac_updateElementAttr", "ac_updateElementStyle"])
  },
  watch: {
    isBgm(newValue, oldValue) {
      if (newValue) {
        const style = {
          position: "absolute",
          right: "10px",
          top: "10px",
          width: "40px",
          height: "40px",
          "background-image": "url("+require("@/assets/bgm_on.png")+")",
          "background-repeat": "no-repeat",
          "background-size": "100% auto"
        };
        console.log(style)
        this.ac_updateElementStyle(style);
      } else {
        const style = {};
        this.ac_updateElementStyle(style);
      }
      this.ac_updateElementAttr({ controls: !newValue });
    }
  }
};
</script>
