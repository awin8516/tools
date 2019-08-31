<template>
  <div class="po-toolbar">
    <el-button v-for="(item,index) in tagsList" :key="index" :title="'创建'+item.type" size="mini" circle @click="ac_addElement(item)">
      <svg-icon :icon-class="item.icon"></svg-icon>
    </el-button>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import * as Tags from "@/components/Tags";
import { arraySort } from "@/utils";
export default {
  name: "TagList",
  data() {
    return {
      tagsList: []
    };
  },
  methods: {
    ...mapActions(["ac_addElement"])
  },
  mounted() {
    for (let key in Tags) {
      let tag = Tags[key].data();
      tag.children = tag.children || [];
      // tag.file = Tags[key].__file;
      this.tagsList.push(tag);
    }
    arraySort(this.tagsList, "tagSort");
  }
};
</script>
