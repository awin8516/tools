<template>
  <div class="po-options">
    <Screen></Screen>
    <Element></Element>
    <ElementOptions></ElementOptions>
  </div>
</template>

<script>
import Screen from "@/views/options/Screen.vue";
import Element from "@/views/options/Element.vue";
import ElementOptions from "@/views/options/ElementOptions.vue";
export default {
  name: "MainOptions",
  data() {
    return {};
  },
  components: {
    Screen,
    Element,
    ElementOptions
  }
};
</script>
