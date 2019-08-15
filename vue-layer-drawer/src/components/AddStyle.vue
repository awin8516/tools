<template>
  <el-autocomplete class="add-style inline-input" v-model="selected" :fetch-suggestions="querySearch" placeholder="请输入" :trigger-on-focus="false" @select="addStyle"><template slot="prepend">添加样式</template></el-autocomplete>
</template>

<script>
import cssKey from "@/utils/cssKey";
export default {
  name: "AddStyle",
  data() {
    return { selected: "" };
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = Object.keys(cssKey);
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString)).map(v => {
            return (v = { value: v });
          })
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    addStyle() {
      if (!this.selected) return;
      this.$emit('command',this.selected);
      this.selected = "";
    }
  }
};
</script>
<style lang="scss">
.add-style{
  width: 100%;
  box-sizing: border-box;
}
</style>
