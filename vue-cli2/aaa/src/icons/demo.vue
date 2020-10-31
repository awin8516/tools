<template>
  <ul id="icon">
    <li v-for="item in list" :key="item">
      <svg-icon :icon-class="item"></svg-icon>
      <div>{{item}}</div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'icon',
  data() {
    return {
      list: []
    }
  },
  mounted() {
    const req = require.context('./svg', false, /\.svg$/)
    this.list = req.keys().map(function(name) {
      return name.replace(/.\/|.svg/g, '')
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
#icon li {
  text-align: center;
  font-size: 18px;
  display: inline-block;
  width: 80px;
  margin: 10px;
  .svg-icon {
    width: 40px;
    height: 40px;
    fill: currentColor;
    overflow: hidden;
  }
  div {
    font-size: 12px;
    margin-top: 10px;
  }
}
</style>
