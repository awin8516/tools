<template>
  <dl>
    <dt class="h2">页面</dt>
    <dd v-for="(value, key) in screenOptions.style" :key="key" :class="'po-options-'+key">
      <label class="h3">{{key}}:</label>
      <input v-if="ragneList.includes(key)" v-range="{val:'screenOptions.style',key:key}" type="text" v-model.lazy="screenOptions.style[key]">
      <input v-else type="text" v-model.lazy="screenOptions.style[key]">
    </dd>
  </dl>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "ScreenOptions",
  data() {
    return {};
  },
  computed: {
    ...mapState(["screenOptions", "ragneList"])
  }
};
</script>
