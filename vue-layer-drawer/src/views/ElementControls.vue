<template>
  <mark class="po-el-controls">
    <div v-show="elementParams.editing" class="textarea">
      <textarea v-focus="elementParams.editing" placeholder="编辑文字" @blur="updateText" :value="innerText"></textarea>
    </div>
    <div class="resize-group">
      <s></s>
      <s></s>
      <s></s>
      <s></s>
      <b class="resize-width" v-drag="resizeWidth" @mousedown.stop="getSize"></b>
      <b class="resize-height" v-drag="resizeHeight" @mousedown.stop="getSize"></b>
      <b class="resize-all" v-drag="resize" @mousedown.stop="getSize"></b>
      <i class="resize-rotate el-icon-refresh" v-drag="resizeRotate" @mousedown.stop="getSize"></i>
    </div>
  </mark>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getElementWidth, getElementHeight, getTransform } from "@/utils";
export default {
  name: "ElementControls",
  data() {
    return {
      shiftKey: false,
      size: {
        width: 0,
        height: 0
      }
    };
  },
  props: ["elementParams"],
  computed: {
    ...mapGetters(["gt_mediaName"]),
    style() {
      return this.elementParams.style[this.gt_mediaName];
    },
    isAbsolute: function() {
      return this.style.position === "absolute";
    },
    innerText: {
      get: function() {
        return this.elementParams && this.elementParams.innerText;
      }
    }
  },
  methods: {
    ...mapActions(["ac_updateElement", "ac_updateElementStyle"]),
    getSize(e) {
      this.shiftKey = e.shiftKey == 1;
      this.size = this.isAbsolute
        ? {
            width: parseInt(this.style.width) || 0,
            height: parseInt(this.style.height) || 0,
            rotate: getTransform(this.style, "rotate")
          }
        : {
            width:
              parseInt(
                getElementWidth(
                  '[data-vid="' + this.elementParams.vid + '"] > *:first-child'
                )
              ) || 0,
            height:
              parseInt(
                getElementHeight(
                  '[data-vid="' + this.elementParams.vid + '"] > *:first-child'
                )
              ) || 0,
            rotate: getTransform(this.style, "rotate")
          };
    },
    resize(el, data) {
      let style = {};
      style.width = this.size.width + data.x + "px";
      if (this.shiftKey) {
        style.height =
          parseInt(
            (this.size.height / this.size.width) * (this.size.width + data.x)
          ) + "px";
      } else {
        style.height = this.size.height + data.y + "px";
      }
      this.ac_updateElementStyle(style);
    },
    resizeWidth(el, data) {
      this.ac_updateElementStyle({ width: this.size.width + data.x + "px" });
    },
    resizeHeight(el, data) {
      this.ac_updateElementStyle({ height: this.size.height + data.y + "px" });
    },
    resizeRotate(el, data) {
      this.ac_updateElementStyle({
        transform: "rotate(" + (this.size.rotate + data.y) + "deg)"
      });
    },
    updateText(e) {
      this.ac_updateElement({
        innerText: e.target.value,
        editing: false,
        vid: this.elementParams.vid
      });
    }
  },
  mounted() {}
};
</script>
