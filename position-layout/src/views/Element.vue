<template>
  <div class="po-el-item" :style="'left:'+paramsLocal.left+';top:'+paramsLocal.top+';'" @mousemove="mouseMove">
    <template v-if="paramsLocal.type === 'div'">
      <div :style="createStyle()"></div>
    </template>
    <template v-if="paramsLocal.type === 'image'">
      <img :style="createStyle()" :src="paramsLocal.src">
    </template>
  </div>
</template>

<script>
export default {
  name: "Element",
  data() {
    return {
      paramsLocal: {},
      attrName: {
        left: "left",
        top: "top",
        width: "宽度",
        height: "高度",
        background: "背景"
      }
    };
  },
  props: ["params"],
  components: {
    // draggable
  },
  methods: {
    createStyle(p) {
      p = this.paramsLocal;
      let s = JSON.stringify(p)
        .replace("{", "")
        .replace("}", "")
        .replace(/"/g, "")
        .replace(/,/g, ";");
      return s;
    },
    mouseMove(e) {
      if (e.currentTarget.className.indexOf("v-draging") !== -1) {
        this.paramsLocal.left = e.currentTarget.style.left;
        this.paramsLocal.top = e.currentTarget.style.top;
      }
    }
  },
  filters: {
    capitalize: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  mounted() {
    let defaultParams = {
      left: 0,
      top: 0,
      width: "100px",
      height: "100px",
      background: "#eee"
    };
    if (this.params.type === "image") {
      defaultParams.src = require("@/assets/img.jpg");
    }
    this.paramsLocal = Object.assign(defaultParams, this.params);
    this.$emit("update:params", this.paramsLocal);
  }
};
</script>
<style lang="scss">
.po-el-item {
  > div:first-child {
    left: 0 !important;
    top: 0 !important;
    background-size: 100% auto !important;
  }
}
</style>