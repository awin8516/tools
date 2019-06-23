<template>
  <div class="po-toolbar">
    <el-button v-for="(item,index) in tools" :key="index" :icon="'el-icon-'+item.icon" :title="'创建'+item.tagName" circle @click="createElement(item)"></el-button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { deepClone } from "@/utils";
export default {
  name: "Tools",
  data() {
    return {
      tools: []
    };
  },
  computed: {
    ...mapState(["elementList"]),
    ...mapGetters(["gt_elementSelected"])
  },
  methods: {
    ...mapActions(["ac_selectElement"]),
    createElement(item) {
      const params = deepClone(item);
      params.vid = new Date().getTime();
      //子元素
      if (this.gt_elementSelected) {
        //必须是container容器才能加子元素
        if (this.gt_elementSelected.container) {
          params.pid = this.gt_elementSelected.vid;
          this.elementList.push(params);
          this.$nextTick(() => {
            this.ac_selectElement(params);
          });
        }
      } else {
        //顶层元素
        this.elementList.push(params);
        this.$nextTick(() => {
          this.ac_selectElement(params);
        });
      }
    }
  },
  mounted() {
    const requireAll = requireContext =>
      requireContext.keys().map(requireContext);
    const req = require.context("../components/tags", false, /\.vue$/);
    this.tags = requireAll(req);
    this.tools = this.tags.map(function(tag) {
      var tool = tag.default.data();
      tool.file = tag.default.__file;
      return tool;
    });
  }
};
</script>
