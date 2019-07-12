<template>
  <div class="po-save">
    <el-button type="primary">导入<input class="file" type="file" ref="file" @change="change" accept="*.json"></el-button>
    <el-button type="primary" @click="ac_saveProject">保存</el-button>
    <el-button type="primary" @click="ac_clearProject">清空</el-button>
    <el-button type="primary" @click="ac_exportProject">导出</el-button>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Div",
  data() {
    return {};
  },
  props: ["val"],
  methods: {
    ...mapActions(["ac_importProject", "ac_saveProject","ac_clearProject", "ac_exportProject"]),
    change: function(e) {
      const reader = new FileReader();
      reader.readAsText(e.target.files[0]);
      reader.onload = e => {
        this.ac_importProject(e.target.result);
      };
    }
  }
};
</script>
<style lang="scss">
.po-save {
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  button {
    overflow: hidden;
    position: relative;
  }
  input.file {
    width: 100%;
    height: 100%;
    font-size: 100em;
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
  }
}
</style>
