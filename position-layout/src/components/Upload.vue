<template>
  <div class="po-upload">
    <input class="text" type="text" v-model="src">
    <button @click="open">选择</button>
    <input class="file" type="file" ref="file" @change="change" accept="image/gif, image/jpeg, image/png">
  </div>
</template>

<script>
import { file2base64 } from "@/utils";
export default {
  name: "Div",
  data() {
    return {};
  },
  props: ["val"],
  methods: {
    open() {
      this.$refs.file.click();
    },
    change: function(e) {
      file2base64(e.target.files[0]).then(data => {
        this.src = data;
      });
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
.po-upload {
  overflow: hidden;
  white-space: nowrap;
  .text {
    display: inline-block;
    width: 54%;
    vertical-align: top;
  }
  button {
    display: inline-block;
    margin-left: 0.5em;
    width: 3em;
    height: 1.7em;
    color: #fff;
    background: rgb(0, 140, 255);
    border-radius: 0.3em;
    border: none;
  }
  .file {
    opacity: 0;
    position: absolute;
  }
}
</style>
