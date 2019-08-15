<template>
  <dl>
    <dt v-if="_key" class="h2">{{_key}}</dt>
    <template v-for="(value, key) in options">
      <dd v-if="typeof value == 'object'" :key="key">
        <ElementOptionsChild :options="options[key]" :_key="key" :parentKey="key"></ElementOptionsChild>
      </dd>
      <ElementOption v-else :key="key" :_key="key" :_options="options" :_parentKey="parentKey"></ElementOption>
    </template>
  </dl>
</template>

<script>
import ElementOption from "@/views/options/ElementOption.vue";
export default {
  name: "ElementOptionsChild",
  data() {
    return {};
  },
  props: ["options", "_key", "parentKey"],
  components: { ElementOption }
};
</script>
