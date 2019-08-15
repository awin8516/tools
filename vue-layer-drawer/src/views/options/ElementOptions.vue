<template>
  <div class="po-options-panel po-options-el" v-if="options">
    <div class="panel-hd">
      组件
      <panel-fold target=".po-options-panel" closed="po-options-panel-closed"></panel-fold>
    </div>
    <div class="panel-bd scrollstyle">
      <ElementOptionsChild :options="options" _key="Options"></ElementOptionsChild>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ElementOptionsChild from "@/views/options/ElementOptionsChild.vue";
export default {
  name: "optionsElementOptions",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["gt_elementSelected"]),
    options() {
      return this.gt_elementSelected && this.gt_elementSelected.options;
    }
  },
  components: { ElementOptionsChild }
};
</script>
