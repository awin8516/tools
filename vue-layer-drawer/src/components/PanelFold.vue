<template>
  <div class="panel-fold"><i :class="[ isClosed  ? 'el-icon-plus' : 'el-icon-minus']" @click="toggle"></i></div>
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
  props: ["target", "toggleClass", "closed"],
  methods: {
    toggle(status) {
      this.isClosed = typeof status !== "boolean" ? !this.isClosed : status;
      const act = this.isClosed ? "add" : "remove";
      closest(this.$el, this.target).classList[act](this.toggleClass);
    }
  },
  watch: {
    closed: function(newVal, oldVal) {
      this.toggle(newVal);
    }
  }
};
</script>
<style lang="scss">
</style>
