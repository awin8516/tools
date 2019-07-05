<template>
  <div>
    <div class="po-screen-size">
      Size
      <el-select v-model="sizeSelect" @change="setSize">
        <el-option v-for="(item, key) in screenOptions.sizeList" :key="key" :label="item.name" :value="key">{{key}}</el-option>
      </el-select>
      <el-input id="po-screen-width" type="text" v-range='{val:"width"}' v-model.lazy="width" placeholder="屏宽"></el-input>
      ✕
      <el-input id="po-screen-height" type="text" v-range='{val:"height"}' v-model.lazy="height" placeholder="屏高"></el-input>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "screenSize",
  data() {
    return {
      sizeSelect: "iphoneX"
    };
  },
  computed: {
    ...mapState(["screenOptions"]),
    width: {
      get: function() {
        return this.screenOptions.style.width;
      },
      set: function(v) {
        const screenStyle = Object.assign({}, this.screenOptions.style);
        screenStyle.width = v;
        this.ac_updateScreenStyle(screenStyle);
      }
    },
    height: {
      get: function() {
        return this.screenOptions.style.height;
      },
      set: function(v) {
        const screenStyle = Object.assign({}, this.screenOptions.style);
        screenStyle.height = v;
        this.ac_updateScreenStyle(screenStyle);
      }
    }
  },
  components: {},
  methods: {
    ...mapActions(["ac_updateMediaName", "ac_updateScreenStyle"]),
    setSize() {
      this.ac_updateMediaName(this.sizeSelect);
    }
  },
  mounted() {
    this.setSize();
  }
};
</script>
