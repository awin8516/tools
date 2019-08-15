<template>
  <div>
    <h2 class="h2">自定义：</h2>
    <div class="style-custom">
      <textarea v-model="styleCustom"></textarea>
      <div class="submit disabled0" @click="pushStyle"></div>
    </div>
  </div>
</template>

<script>
import { style2object } from "@/utils";
export default {
  name: "AddStyle",
  data() {
    return { styleCustom: "margin:10px 20px 30px 40px;\npadding:10px 20px 30px;" };
  },
  methods: {
    pushStyle() {
      if (!this.styleCustom) return;
      this.$emit("command", style2object(this.styleCustom));
      this.styleCustom = "";
    }
  },
  computed: {}
};
</script>
<style lang="scss">
</style>
