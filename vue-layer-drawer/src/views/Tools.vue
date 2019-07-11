<template>
  <div class="po-toolbar">
    <el-button v-for="(item,index) in tools" :key="index" :icon="'el-icon-'+item.icon" :title="'创建'+item.type" circle @click="ac_addElement(item)"></el-button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import * as Tags from "@/components/tags";
import { deepClone } from "@/utils";
import MSG from "@/utils/message";
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
    ...mapActions(["ac_addElement", "ac_selectElement"])
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
