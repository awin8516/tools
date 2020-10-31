<template>
  <div class="breadcrumb">
    <el-breadcrumb>
      <el-breadcrumb-item  :to="{ path: '/' }"><span class="breadcrumb_text">首页</span></el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item,index) in this.$store.state.route" :key="index"><span class="breadcrumb_text">{{item}}</span></el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data(){
    return {
      routes:[]/*  */
    }
  },
  methods:{
    matchRoute(route=this.$store.state.route){
      routes = route;
    }
  }
};
</script>

<style lang="scss" scoped>
.breadcrumb{
  width: 100%;
  height: auto;
  padding: 10px;
  color: #aaa;
}
.breadcrumb .breadcrumb_text{
  color: #aaa !important;
}
</style>