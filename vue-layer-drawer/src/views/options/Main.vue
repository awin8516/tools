<template>
  <div class="po-options">
    <Screen></Screen>
    <Element></Element>
  </div>
</template>

<script>
import Screen from "@/views/options/Screen.vue";
import Element from "@/views/options/Element.vue";
export default {
  name: "MainOptions",
  data() {
    return {};
  },
  components: {
    Screen,
    Element
  }
};
</script>
