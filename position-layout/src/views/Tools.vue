<template>
  <div class="po-toolbar">
    <el-button v-for="(item,index) in tools" :key="index" :icon="'el-icon-'+item.icon" :title="'创建'+item.tagName" circle @click="createElement(item)"></el-button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import * as Tags from "@/components/tags";
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
    ...mapActions(["ac_addElement", "ac_selectElement", "ac_resetName"]),
    createElement(item) {
      const params = deepClone(item);
      params.vid = new Date().getTime();
      this.ac_resetName(params);
      //子元素
      if (this.gt_elementSelected) {
        //必须是container容器才能加子元素
        if (this.gt_elementSelected.container) {
          params.pid = this.gt_elementSelected.vid;
          // this.elementList.push(params);
          this.ac_addElement(params);
          this.ac_selectElement(params);
        }
      } else {
        //顶层元素
        this.ac_addElement(params);
        this.ac_selectElement(params);
      }
    }
  },
  mounted() {
    for (let key in Tags) {
      let tool = Tags[key].data();
      tool.file = Tags[key].__file;
      this.tools.push(tool);
    }
  }
};
</script>
