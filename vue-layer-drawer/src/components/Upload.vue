<template>
  <div class="po-input-button po-upload">
    <div class="input">
      <input class="text" type="text" v-model.lazy="src">
      <input class="file" type="file" ref="file" @change="change" accept="image/*, video/*, audio/*">
    </div>
    <button @click="open"><i class="el-icon-folder-opened"></i></button>
  </div>
</template>

<script>
import { file2base64 } from "@/utils";
export default {
  name: "Upload",
  data() {
    return {};
  },
  props: ["val", "template"],
  methods: {
    open() {
      this.$refs.file.click();
    },
    change: function(e) {
      console.log(this);
      console.log(e);
      if (e.target.value.indexOf(".mp4") == -1) {
        file2base64(e.target.files[0]).then(data => {
          this.src = this.template ? this.template.replace("#", data) : data;
        });
      } else {
        this.src = e.target.value;
      }
    }
  },
  computed: {
    src: {
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
</style>
