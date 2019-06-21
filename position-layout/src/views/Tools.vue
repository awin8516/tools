<template>
  <div class="po-toolbar">
    <el-button v-for="(item,index) in tools" :key="index" :icon="'el-icon-'+item.icon" :title="'创建'+item.tagName" circle @click="createElement(item)"></el-button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { deepClone } from "@/utils";
export default {
  name: "Tools",
  data() {
    return {
      //公共属性
      params: {
        selected: false,
        className: ['test', 'test-a']
      },
      //私有属性
      tools: []
    };
  },
  computed: {
    ...mapState(['elementList']),
    ...mapGetters(['gt_elementSelected'])
  },
  methods: {
    ...mapActions(['ac_setElementList', 'ac_selectElement',]),
    createElement(item) {
      // let _ElementList = this.elementList
      const params = Object.assign({}, this.params, item);
      params.vid = new Date().getTime()
      //兄弟元素/子元素
      if (this.gt_elementSelected) {
        // console.log(0)
        // this.gt_elementSelected.children.push(params)
        params.pid = this.gt_elementSelected.vid
        this.elementList.push(params);
      } else {
        // console.log(1)
        // _ElementList.push(_params);
        this.elementList.push(params);
      }
      // console.log(params.parent == this.gt_elementSelected)
      // this.ac_setElementList(this.elementList)
      this.$nextTick(() => {
        this.ac_selectElement(params);
        // this.ac_selectElement(_ElementList.length - 1);
      });
    }
  },
  mounted() {
    const requireAll = requireContext => requireContext.keys().map(requireContext)
    const req = require.context('../components/tags', false, /\.vue$/)
    this.tags = requireAll(req)
    this.tools = this.tags.map(function (tag) {
      var tool = tag.default.data()
      tool.file = tag.default.__file
      return tool
    })
  }
};
</script>
