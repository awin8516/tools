<template>
  <div>
    <div class="po-screen-field">
      window size
      <input id="po-screen-width" type="text" v-range='{val:"screenWidth"}' v-model.lazy="screenWidth" placeholder="屏宽" /> ✕ <input id="po-screen-height" type="text" v-range v-model.lazy="screenHeight" placeholder="屏高" />
    </div>
    <div id="po-main" class="po-main" :style="'width:'+screenWidth+';height:'+screenHeight+';'">
      <div class="po-screen" ref="screen" v-drag>
        <Element v-for="(item, index) in elementList" :key="index" :class="{'active':index == active}" :params.sync="elementList[index]" @mousedown.native="setOption(index)"></Element>
      </div>

      <div class="po-toolbar">
        <el-button v-for="(item, index) in tools" :key="index" :icon="'el-icon-'+item.name" circle @click="addElement(item.type)"></el-button>
      </div>

      <ul class="po-options">
        <li v-for="(value, key) in options" :key="key" :class="'po-options-'+key">
          <label>{{key}}:</label>
          <input v-if="['background','src'].includes(key)" type="text" :placeholder="key" v-model.lazy="options[key]">
          <input v-else type="text" :placeholder="key" v-range='{val:"options",key:key}' v-model.lazy="options[key]">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import draggable from "vuedraggable";
import Element from "@/views/Element.vue";
import { setInterval } from "timers";
export default {
  name: "home",
  data() {
    return {
      screenWidth: "375px",
      screenHeight: "667px",
      elementList: [],
      active: 0,
      options: {},
      tools: [
        {
          name: "menu",
          type: "div"
        },
        {
          name: "picture",
          type: "image"
        }
      ]
    };
  },
  components: {
    Element
    // draggable
  },
  methods: {
    addElement(type) {
      this.elementList.push({
        type: type
      });
      this.$nextTick(() => {
        this.setOption(this.elementList.length - 1);
      });
    },
    setOption(index) {
      this.active = index;
      this.options = this.elementList[index];
    }
  },
  mounted() {},
  watch: {
    "options.left": {
      handler: function(val, oldVal) {
        console.log(val, oldVal);
        console.log(this);
        if (parseInt(val) < 0) {
          this.options.left = 0;
        }
      }
    }
  }
};
</script>
