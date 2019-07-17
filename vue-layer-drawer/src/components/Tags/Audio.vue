<template>
  <div v-if="element.attribute.bgm" :style="element.style[$parent.gt_mediaName]">
    <audio :data-name="element.name" :src="element.attribute.src" :id="element.attribute.id" :class="element.attribute.className"  :autoplay="element.attribute.autoplay" :controls="element.attribute.controls" :loop="element.attribute.loop" :preload="element.attribute.preload"></audio>
  </div>
  <audio v-else :data-name="element.name" :src="element.attribute.src" :style="element.style[$parent.gt_mediaName]" :id="element.attribute.id" :class="element.attribute.className"  :autoplay="element.attribute.autoplay" :controls="element.attribute.controls" :loop="element.attribute.loop" :preload="element.attribute.preload"></audio>
</template>

<script>
export default {
  name: "Audio",
  data() {
    return {
      type: "audio",
      icon: "audio",
      name: "audio-1",
      attribute: {
        bgm: true,
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
          position: "absolute",
          right: "0",
          top: "0",
          "background-image": ""
        }
      }
    };
  },
  props: ["element"]
};
</script>
