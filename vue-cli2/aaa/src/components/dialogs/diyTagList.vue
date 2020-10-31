<template>
  <el-select v-model="tagid" placeholder="请选择自定义标签" @change="tagAdd" multiple :multiple-limit="3">
    <el-option v-for="item in tagids" :key="item.value" :label="item.label" :value="item"></el-option>
  </el-select>
</template>
<script>
export default {
  props: ["chooseTag"],
  data() {
    return {
      tagid: "",
      tagids: []
    };
  },
  created() {
    // 获取diy标签
    this.biao_qian_list();
  },
  mounted(){
  },
  methods: {
    // 拿到父组件上的值进行更性
    getTag(value) {
      this.tagid = value;
    },
    // 选择标签
    tagAdd(value) {
      this.$emit("listenChild", value); //
    },
    // 获取标签
    biao_qian_list() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "diytaglist", {
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tagids = this.changeTagsList(res.data.data);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    changeTagsList(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/tag_id/g, "value"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/tag_name/g, "label"));
      let obj3 = JSON.parse(
        JSON.stringify(obj2).replace(/bind_total/g, "count")
      );
      return obj3;
    }
  }
};
</script>
<style scoped>
</style>