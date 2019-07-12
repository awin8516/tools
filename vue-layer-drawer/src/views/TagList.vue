<template>
  <div class="po-toolbar">
    <el-button v-for="(item,index) in tagsList" :key="index" :icon="'el-icon-'+item.icon" :title="'创建'+item.type" circle @click="ac_addElement(item)"></el-button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import * as Tags from "@/components/tags";
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
