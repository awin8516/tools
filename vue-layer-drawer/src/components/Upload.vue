<template>
  <div class="po-upload">
    <div class="input">
      <input class="text" type="text" v-model.lazy="src">
      <input class="file" type="file" ref="file" @change="change" accept="image/gif, image/jpeg, image/png, audio/*">
    </div>
    <button @click="open">选择</button>
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
      file2base64(e.target.files[0]).then(data => {
        this.src = this.template ? this.template.replace("#", data) : data;
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
  display: flex;
  overflow: hidden;
  .input {
    .text {
      width: 100%;
    }
  }
  button {
    color: #fff;
    background: rgb(0, 140, 255);
    border-radius: 0.3em;
    border: none;
    padding: 0 0.3em;
    margin-left: 0.2em;
  }
  input.file {
    width: 0;
    height: 0;
    font-size: 0;
    margin: 0;
    padding: 0;
    opacity: 0;
    position: absolute;
    overflow: hidden;
    left: 0;
    z-index: -1;
  }
}
</style>
