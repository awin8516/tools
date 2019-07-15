<template>
  <div class="po-upload">
    <div class="input">
      <input class="text" type="text" v-model.lazy="value">
    </div>
    <el-color-picker v-model="value" show-alpha :predefine="gt_themeColors"></el-color-picker>
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
.po-upload {
  display: flex;
  overflow: hidden;
  .input {
    .text {
      width: 100%;
    }
  }
  .el-color-picker {
    display: block;
    height: auto;
    margin-left: 0.2em;
    .el-color-picker__trigger {
      width: 0.25rem;
      height: 100%;
      padding: 0;
      border: none;
    }
  }
}
</style>
