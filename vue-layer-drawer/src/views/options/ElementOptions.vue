<template>
  <div class="po-options-group po-options-el" v-if="options">
    <h2><i class="el-icon-setting"></i> 组件设置</h2>

    <template>
      <ElementOptionsChild :options="options"></ElementOptionsChild>
    </template>

    <!-- <div class="po-options-foot">
      <el-button icon="el-icon-delete" @click="">立即更新</el-button>
    </div> -->
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
    options(){
      return this.gt_elementSelected && this.gt_elementSelected.options
    } 
  },
  components: { ElementOptionsChild }
};
</script>
