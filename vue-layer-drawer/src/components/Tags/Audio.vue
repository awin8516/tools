<template>
  <audio 
  :data-name="element.name" 
  :style="element.style[$parent.gt_mediaName]" 
  :id="element.attribute.id" 
  :class="element.attribute.className" 
  :src="element.attribute.src" 
  :autoplay="element.attribute.autoplay" 
  :controls="element.attribute.controls" 
  :loop="element.attribute.loop" 
  :preload="element.attribute.preload"></audio>
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
