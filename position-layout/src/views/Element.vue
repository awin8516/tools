<template>
  <div class="po-el-item">
    <div v-if="params.type === 'div'" :style="createStyle(params)"></div>
    <img v-if="params.type === 'image'" :style="createStyle(params)" :src="params.src">
  </div>
</template>

<script>
export default {
  name: "Element",
  data() {
    return {

    }
  },
  props: ['params'],
  components: {
    // draggable
  },
  methods: {
    createStyle(params) {
      if (params.type === 'div') {
        return `width:${params.width}px;height:${params.height}px;background-color:${params.backgroundColor};`;
      }

    }
  }
};
</script>
