<template>
  <div class="po-input-button po-color-picker">
    <div class="input">
      <input class="text" type="text" v-model.lazy="value">
    </div>
    <button>
      <el-color-picker v-model="value" show-alpha :predefine="gt_themeColors"></el-color-picker>
    </button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "ColorPicker",
  data() {
    return {};
  },
  props: ["val"],
  methods: {},
  computed: {
    ...mapGetters(["gt_themeColors"]),
    value: {
      get: function() {
        return this.val;
      },
      set: function(v) {
        this.$emit("update:val", v);
      }
    }
  }
};
</script>
<style lang="scss">
.po-color-picker {
  button {
    background: none;
    outline: none;
  }
  .el-color-picker {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    .el-color-picker__trigger {
      width: 100%;
      height: 100%;
      padding: 0;
      border: none;
      line-height: 1;
      outline: none;
    }
    .el-color-picker__color {
      outline: none;
    }
    * {
      outline: none;
    }
  }
}
</style>
