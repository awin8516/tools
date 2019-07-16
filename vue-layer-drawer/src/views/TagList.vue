<template>
  <div class="po-toolbar">
    <el-button v-for="(item,index) in tagsList" :key="index" :title="'创建'+item.type" circle @click="ac_addElement(item)">
      <svg-icon :icon-class="item.icon"></svg-icon>
    </el-button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import * as Tags from "@/components/Tags";
import { deepClone } from "@/utils";
import MSG from "@/utils/message";
export default {
  name: "TagList",
  data() {
    return {
      tagsList: []
    };
  },
  computed: {
    ...mapGetters(["gt_elementSelected"])
  },
  methods: {
    ...mapActions(["ac_addElement", "ac_selectElement"])
  },
  mounted() {
    for (let key in Tags) {
      let tag = Tags[key].data();
      tag.file = Tags[key].__file;
      this.tagsList.push(tag);
    }
  }
};
</script>
