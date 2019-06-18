<template>
  <div>
    <div class="po-screen-field">
      Size
      <el-select v-model="sizeIndex" @change="setSize">
        <el-option v-for="(item, index) in screenOptions.sizeList" :key="index" :label="item.name" :value="index">{{item.name}}</el-option>
      </el-select>
      <el-input id="po-screen-width" type="text" v-range='{val:"screenOptions.style", key:"width"}' v-model.lazy="screenOptions.style.width" placeholder="屏宽"></el-input>
      ✕
      <el-input id="po-screen-height" type="text" v-range='{val:"screenOptions.style", key:"height"}' v-model.lazy="screenOptions.style.height" placeholder="屏高"></el-input>
    </div>
    <div id="po-main" class="po-main" :style="'width:'+screenOptions.style.width+';height:'+screenOptions.style.height+';'">
      <div class="po-screen" ref="screen" v-drag:po-el-item :style="screenStyle" @mousedown.self="cancelSelectElement()">
        <Element v-for="(item, index) in elementList" :key="item.vid" :data-vid="item.vid" :class="{'active':item.selected}" :currentIndex.sync="index" @mousedown.native="selectElement(index)"></Element>
      </div>

      <Tools></Tools>
      <Options></Options>
      <div class="resize" v-drag="resize" @mousedown="getSize"></div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState, mapGetters, mapActions } from 'vuex'
// import draggable from "vuedraggable";
import Element from "@/views/Element.vue";
import Tools from "@/views/Tools.vue";
import Options from "@/views/Options.vue";
import { object2style } from "@/utils";
export default {
  name: "home",
  data() {
    return {
      sizeIndex: 0,
      size: {
        width: 0,
        height: 0
      }
    };
  },
  computed: {
    ...mapState(['screenOptions', 'elementList']),
    ...mapGetters(['selectedIndex', 'list']),
    screenStyle: function () {
      return object2style(this.screenOptions.style)
    }
  },
  components: {
    Element, Tools, Options
  },
  methods: {
    ...mapActions(['selectElement', 'cancelSelectElement', 'setScreenOptions']),
    setSize() {
      this.screenOptions.style.width = this.screenOptions.sizeList[this.sizeIndex].width
      this.screenOptions.style.height = this.screenOptions.sizeList[this.sizeIndex].height
    },
    getSize() {
      this.size = {
        width: parseInt(this.screenOptions.style.width),
        height: parseInt(this.screenOptions.style.height)
      }
    },
    resize(el, data) {
      console.log(data);
      this.screenOptions.style.width = this.size.width + data.x + 'px';
      this.screenOptions.style.height = this.size.height + data.y + 'px';
      this.setScreenOptions(this.screenOptions)
    }
  },
  mounted() {
    this.setSize()
  }
};
</script>
