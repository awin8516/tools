<template>
  <div>
    <ScreenSize></ScreenSize>
    <div id="po-main" class="po-main">
      <div class="po-body">
        <div id="po-screen" class="po-screen" ref="screen" v-drag:po-el-item :style="screenOptions.style" @mousedown.self="ac_cancelacSelectElement()">
          <template v-for="item in elementList">
            <Element v-if="!item.pid" :key="item.vid" :elementParams.sync="item"></Element>
          </template>
        </div>
        <div class="resize" v-drag="resize" @mousedown="getSize"></div>
        <save></save>
      </div>
      <Tools></Tools>
      <Options></Options>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ScreenSize from "@/views/ScreenSize.vue";
import Element from "@/views/Element.vue";
import Tools from "@/views/Tools.vue";
import Options from "@/views/options/Main.vue";
import Save from "@/views/Save.vue";
export default {
  name: "Home",
  data() {
    return {
      size: {
        width: 0,
        height: 0
      }
    };
  },
  computed: {
    ...mapState(["screenOptions", "elementList"])
  },
  components: { ScreenSize, Element, Tools, Options, Save },
  methods: {
    ...mapActions([
      "ac_updateScreenStyle",
      "ac_updateScreenElement",
      "ac_cancelacSelectElement"
    ]),
    getSize() {
      this.size = {
        width: parseInt(this.screenOptions.style.width) || 0,
        height: parseInt(this.screenOptions.style.height) || 0
      };
    },
    resize(el, data) {
      const screenStyle = Object.assign({}, this.screenOptions.style);
      screenStyle.width = this.size.width + data.x + "px";
      screenStyle.height = this.size.height + data.y + "px";
      this.ac_updateScreenStyle(screenStyle);
    }
  },
  mounted() {
    this.ac_updateScreenElement(this.$refs.screen);
  }
};
</script>
