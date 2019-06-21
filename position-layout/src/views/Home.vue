<template>
  <div>
    <div class="po-screen-field">
      Size
      <el-select v-model="sizeSelect" @change="setSize">
        <el-option v-for="(item, key) in screenOptions.sizeList" :key="key" :label="item.name" :value="key">{{key}}</el-option>
      </el-select>
      <el-input id="po-screen-width" type="text" v-range='{val:"screenOptions.style", key:"width"}' v-model.lazy="screenOptions.style.width" placeholder="屏宽"></el-input>
      ✕
      <el-input id="po-screen-height" type="text" v-range='{val:"screenOptions.style", key:"height"}' v-model.lazy="screenOptions.style.height" placeholder="屏高"></el-input>
    </div>
    <div id="po-main" class="po-main" :style="'width:'+screenOptions.style.width+';height:'+screenOptions.style.height+';'">
      <div id="po-screen" class="po-screen" ref="screen" v-drag:po-el-item :style="screenOptions.style" @mousedown.self="ac_cancelacSelectElement()">
        <template v-for="item in elementList">
          <Element v-if="!item.pid" :key="item.vid" :elementParams.sync="item"></Element>
        </template>
      </div>

      <Tools></Tools>
      <Options></Options>
      <div class="resize" v-drag="resize" @mousedown="getSize"></div>
      <div>
        <el-button type="primary" @click="ac_downloadProject">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Element from "@/views/Element.vue";
import Tools from "@/views/Tools.vue";
import Options from "@/views/Options.vue";
export default {
  name: "home",
  data() {
    return {
      sizeSelect: "iphone6",
      size: {
        width: 0,
        height: 0
      }
    };
  },
  computed: {
    ...mapState(["screen", "screenOptions", "elementList"])
  },
  components: {
    Element,
    Tools,
    Options
  },
  methods: {
    ...mapActions(["ac_setScreen", "ac_cancelacSelectElement", "ac_downloadProject"]),
    setSize() {
      this.screenOptions.style.width = this.screenOptions.sizeList[
        this.sizeSelect
      ].width;
      this.screenOptions.style.height = this.screenOptions.sizeList[
        this.sizeSelect
      ].height;
    },
    getSize() {
      this.size = {
        width: parseInt(this.screenOptions.style.width),
        height: parseInt(this.screenOptions.style.height)
      };
    },
    resize(el, data) {
      this.screenOptions.style.width = this.size.width + data.x + "px";
      this.screenOptions.style.height = this.size.height + data.y + "px";
    }
  },
  mounted() {
    this.setSize();
    console.log(this.$refs.screen)
    this.ac_setScreen(this.$refs.screen);
  }
};
</script>
