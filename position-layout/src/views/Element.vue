<template>
  <div class="po-el-item">
    <div v-if="params.type == 'div'">div</div>
    <img v-if="params.type == 'image'" :src="params.src">
  </div>
</template>

<script>
export default {
  name: "Element",
  data() {
    return {
      
    };
  },
  props:['params'],
  components: {
    // draggable
  },
  methods: {
    addElement(type) {
      
    }
  }
};
</script>
