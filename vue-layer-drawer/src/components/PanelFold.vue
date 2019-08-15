<template>
  <div class="panel-fold"><i :class="[ isClosed ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right']" @click="toggle"></i></div>
</template>

<script>
import { closest } from "@/utils";
export default {
  name: "PanelFold",
  data() {
    return {
      isClosed: false
    };
  },
  props: ["target", "closed"],
  methods: {
    toggle() {
      this.isClosed = !this.isClosed;
      const act = this.isClosed ? "add" : "remove";
      closest(this.$el, this.target).classList[act](this.closed);
    }
  }
};
</script>
<style lang="scss">
.panel-fold {
  // padding: 0 5px;
  // margin: -10px;
  // margin-bottom: 10px;
  // border-bottom: 1px #ddd solid;
  // background-color: #e9e9e9;
  // text-align: right;
}
</style>
