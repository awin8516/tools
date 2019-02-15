<template>
  <div>
    <div class="po-screen-field">
      window size
      <input id="po-screen-width" type="text" v-model="screenWidth" placeholder="屏宽" /> ✕ <input id="po-screen-height" type="text" v-model="screenHeight" placeholder="屏高" />
    </div>
    <div id="po-main" class="po-main" :style="'width:'+screenWidth+'px;height:'+screenHeight+'px;'">
      <div class="po-screen" ref="screen" v-drag>
        <div class="po-el-item" v-for="(item, index) in elementList" :key="index" @click="addElement(item.type)">
          <Element :params="item"></Element>
        </div>
      </div>

      <div class="po-toolbar">
        <el-button v-for="(item, index) in tools" :key="index" :icon="'el-icon-'+item.name" circle @click="addElement(item.type)"></el-button>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import draggable from "vuedraggable";
import Element from "@/views/Element.vue";
export default {
  name: "home",
  data() {
    return {
      screenWidth: 375,
      screenHeight: 667,
      elementList: [],
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
      if (type === "div") {
        console.log("div");
        // console.log(this.$refs.screen);
        // const el = this.creater(type);
        // this.elementList.push(el);
        // this.bindEvent(el);
        this.elementList.push({
          type: 'div',
          width: 100,
          height: 100,
          backgroundColor: '#eeeeee'
        });
      }
      if (type === "image") {
        console.log("image");
        this.elementList.push({
          type: 'image',
          width: 100,
          height: 100,
          src: '@/assets/logo.png'
        });
      }
    },
    creater(type) {
      if (type === "div") {
        const div = document.createElement("DIV");
        div.style.width = "100px";
        div.style.height = "100px";
        div.style.backgroundColor = "#eeeeee";
        return div;
      }
      if (type === "image") {
        console.log("image");
      }
    },
    bindEvent(el) { }
  }
};
</script>
