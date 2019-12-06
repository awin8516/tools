<template>
  <div>
    <ScreenSize></ScreenSize>
    <div id="po-main" class="po-main">
      <div id="po-screen" class="po-screen scrollstyle" ref="screen" v-drag:po-el-item :style="gt_screenOptions.style" @mousedown.self="cancelacSelectElement">
        <template v-for="item in gt_elementList">
          <Element v-if="!item.pid" :key="item.vid" :elementParams.sync="item"></Element>
        </template>
      </div>
      <div class="po-setting">
        <TagList></TagList>
        <Options></Options>
      </div>
      <ContextMenu></ContextMenu>
      <div class="po-resize" v-drag="resize" @mousedown="getSize"></div>
      <Tools></Tools>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ScreenSize from "@/views/ScreenSize.vue";
import Element from "@/views/Element.vue";
import ContextMenu from "@/views/ContextMenu.vue";
import TagList from "@/views/TagList.vue";
import Options from "@/views/options/Main.vue";
import Tools from "@/views/Tools.vue";
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
    ...mapGetters(["gt_screenOptions", "gt_elementList"])
  },
  components: { ScreenSize, Element, ContextMenu, TagList, Options, Tools },
  methods: {
    ...mapActions([
      "ac_updateScreenStyle",
      "ac_updateScreenElement",
      "ac_cancelacSelectElement",
      "ac_importProject"
    ]),
    getSize() {
      this.size = {
        width: parseInt(this.gt_screenOptions.style.width) || 0,
        height: parseInt(this.gt_screenOptions.style.height) || 0
      };
    },
    resize(el, data) {
      const screenStyle = Object.assign({}, this.gt_screenOptions.style);
      screenStyle.width = this.size.width + data.x + "px";
      screenStyle.height = this.size.height + data.y + "px";
      this.ac_updateScreenStyle(screenStyle);
    },
    cancelacSelectElement() {
      setTimeout(() => {
        this.ac_cancelacSelectElement();
      }, 1);
    }
  },
  mounted() {
    this.ac_importProject(window.localStorage.getItem("project"));
    this.ac_updateScreenElement(this.$refs.screen);
  }
};
</script>
