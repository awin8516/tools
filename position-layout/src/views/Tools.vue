<template>
  <div class="po-toolbar">
    <el-button v-for="(item,index) in tools" :key="index" :icon="'el-icon-'+item.icon" :title="'创建'+item.type" circle @click="createElement(index)"></el-button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
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
      tools: [
        {
          icon: "menu",
          type: "div",
          style: {
            "left": "0",
            "top": "0",
            "width": "100px",
            "height": "100px",
            "background-image": "url()",
            "background-color": "#eee",
            "background-repeat": "no-repeat",
            "background-size": "100% auto",
            "background-position": "left top"
          }
        },
        {
          icon: "picture",
          type: "image",
          src: require("@/assets/img.jpg"),
          style: {
            "left": "0",
            "top": "0",
            "width": "100px",
            "height": "100px",
          }
        }
      ]
    };
  },
  computed: {
    ...mapState(['elementList'])
  },
  methods: {
    ...mapActions(['setElementList', 'selectElement']),
    createElement(index) {
      let _ElementList = this.elementList
      const _params = Object.assign({}, deepClone(this.params), deepClone(this.tools[index]));
      _params.vid = new Date().getTime()
      _ElementList.push(_params);
      this.setElementList(_ElementList)
      // console.log(this.elementList)
      this.$nextTick(() => {
        this.selectElement(_ElementList.length - 1);
      });
    }
  }
};
</script>
