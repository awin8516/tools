<template>
  <div class="po-theme-colors">
    <ul>
      <li v-for="(value, index) in gt_themeColors" :key="index" :style="'background-color:'+value"><b @click="removeColor(value)"></b></li>
      <li class="add-color"><i class="el-icon-circle-plus-outline">
          <el-color-picker show-alpha size="mini" v-model="color" @change="addColor"></el-color-picker>
        </i></li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { deepClone } from "@/utils";
export default {
  name: "ColorPicker",
  data() {
    return {
      color: "#f30"
    };
  },
  props: ["val"],
  methods: {
    ...mapActions(["ac_updateThemeColors"]),
    addColor(val) {
      let _themeColors = deepClone(this.gt_themeColors);
      if (!_themeColors.includes(val)) {
        _themeColors.push(val);
        this.ac_updateThemeColors(_themeColors);
      }
    },
    removeColor(val) {
      let _themeColors = deepClone(this.gt_themeColors);
      const index = _themeColors.findIndex(v => v === val);
      _themeColors.splice(index, 1);
      this.ac_updateThemeColors(_themeColors);
    }
  },
  computed: {
    ...mapGetters(["gt_themeColors"])
  }
};
</script>
<style lang="scss">
.po-theme-colors {
  ul {
    white-space: normal;
    width: 105%;
    li {
      position: relative;
      display: inline-block;
      vertical-align: top;
      font-size: 0;
      width: 15.5%;
      margin-right: 4%;
      margin-bottom: 4%;
      box-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
      &::before {
        content: "";
        display: inline-block;
        padding-bottom: 100%;
        vertical-align: top;
      }
      &:hover {
        z-index: 100;
        transform: scale(1.2);
        box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
        b {
          position: absolute;
          left: 100%;
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          cursor: pointer;
          background-color: rgb(0, 140, 255);
          &::before,
          &::after {
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
            display: inline-block;
            width: 80%;
            height: 1px;
            background-color: #fff;
          }
          &::after {
            transform: translate(-50%, -50%) rotate(-45deg);
          }
        }
      }
    }
    li.add-color {
      overflow: hidden;
      // border: 1px #ccc dashed;
      box-sizing: border-box;
      &::before,
      &::after {
        display: none;
      }
      &:hover {
        box-shadow: none;
      }
      .el-icon-circle-plus-outline {
        font-size: 20px;
      }
      div {
        position: absolute;
        left: -2px;
        top: -2px;
        opacity: 0;
        padding: 0;
        z-index: 10;
      }
    }
  }
}
</style>
