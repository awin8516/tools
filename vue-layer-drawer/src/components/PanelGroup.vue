<template>
  <dl>
    <i class="panel-group-toggle" :class="isClosed ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" @click="toggle"></i>
    <slot></slot>
  </dl>
</template>

<script>
import { closest } from "@/utils";
export default {
  name: "PanelGroup",
  data() {
    return {
      isClosed :false
    };
  },
  props: [],
  methods: {
    toggle() {
      this.isClosed = !this.isClosed;      
      const act = this.isClosed ? "add" : "remove";
      closest(this.$el, 'dl').classList[act]('closed');
    }
  }
};
</script>
<style lang="scss">
.panel-group-toggle{
  position: absolute;
  right: 5px;
  top: 3px;
}
</style>
