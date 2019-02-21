<template>
  <div>
    <div class="po-screen-field">
      window size
      <input id="po-screen-width" type="text" v-range='{val:"screenWidth"}' v-model.lazy="screenWidth" placeholder="屏宽" />
      ✕
      <input id="po-screen-height" type="text" v-range='{val:"screenHeight"}' v-model.lazy="screenHeight" placeholder="屏高" />
    </div>
    <div id="po-main" class="po-main" :style="'width:'+screenWidth+';height:'+screenHeight+';'">
      <div class="po-screen" ref="screen" v-drag :style="createStyle(screenOptions)">
        <Element v-for="(item, index) in elementList" :key="item.vid" :class="{'active':index == active}" :params.sync="elementList[index]" @mousedown.native="selectElement(index)"></Element>
      </div>

      <div class="po-toolbar">
        <el-button v-for="(item, index) in tools" :key="index" :icon="'el-icon-'+item.icon" :title="'创建'+item.type" circle @click="createElement(item.type)"></el-button>
      </div>
      <div class="po-options">
        <dl>
          <dt>页面背景</dt>
          <dd v-for="(value, key) in screenOptions" :key="key" :class="'po-options-'+key">
            <label>{{key}}:</label>
            <input type="text" v-model.lazy="screenOptions[key]">
          </dd>
        </dl>
        <div class="po-options-el" v-if="elementList.length">
          <dl>
            <dt>className</dt>
            <dd>
              <input type="text" v-model.lazy="options.className">
            </dd>
          </dl>
          <dl v-if="options.src">
            <dt>Src</dt>
            <dd>
              <input type="text" v-model.lazy="options.src">
            </dd>
          </dl>
          <dl>
            <dt>Style</dt>
            <dd v-for="(value, key) in options.style" :key="key" :class="'po-options-'+key">
              <label>{{key}}:</label>
              <input v-if="ragneList.includes(key)" v-range='{val:"options.style",key:key}' type="text" v-model.lazy="options.style[key]">
              <input v-else type="text" v-model.lazy="options.style[key]">
            </dd>
          </dl>
          <div class="po-options-foot">
            <el-button icon='el-icon-delete' @click="deleteElement(active)">删除元素</el-button>
          </div>
        </div>
      </div>

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
      ragneList: ['left', 'top', 'width', 'height'],
      active: 0,
      screenOptions: {
        "background-image": "url()",
        "background-color": "#fff",
        "background-repeat": "no-repeat",
        "background-size": "100% auto",
        "background-position": "left top"
      },
      options: {},
      tools: [
        {
          icon: "menu",
          type: "div"
        },
        {
          icon: "picture",
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
    createElement(type) {
      this.elementList.push({
        type: type
      });
      this.$nextTick(() => {
        this.selectElement(this.elementList.length - 1);
      });
    },
    selectElement(index) {
      this.active = index;
      this.elementList.map(v => this.$set(v, 'selected', false))
      this.elementList[index].selected = true
      this.options = this.elementList[index];
    },
    deleteElement(index) {
      this.elementList.splice(index, 1)
      if (index > 0) this.selectElement(this.active - 1);
    },
    createStyle(style) {
      return JSON.stringify(style)
        .replace("{", "")
        .replace("}", "")
        .replace(/"/g, "")
        .replace(/,/g, ";");
    }
  },
  mounted() { },
  watch: {
    // "options.style.left": {
    //   handler: function (val, oldVal) {
    //     if (parseInt(val) < 0) {
    //       this.options.style.left = 0;
    //     }
    //   }
    // }
  }
};
</script>
