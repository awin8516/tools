<template>
  <div class="icons-demo">
    <el-select v-model="fontSize">
      <el-option
        v-for="item in fontSizeList"
        :key="item"
        :label="item"
        :value="item"
        size="mini"
        >{{ item }}</el-option
      >
    </el-select>
    <color-picker class="color" :val.sync="color"></color-picker>
    <color-picker class="color" :val.sync="bgColor"></color-picker>
    <ul id="icon" :style="style">
      <li v-for="item in list" :key="item">
        <svg-icon :icon-class="item"></svg-icon>
        <div>{{ item }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import ColorPicker from '@/components/ColorPicker.vue';
export default {
  name: 'icon',
  data() {
    return {
      fontSize: '18px',
      color: '#000000',
      bgColor: '#f6f6f6',
      list: []
    };
  },
  components: {
    ColorPicker
  },
  computed: {
    fontSizeList() {
      const list = [];
        for (let i = 10; i <= 36; i++) {
          list.push(i + 'px');
        }
        return list;
    },
    style() {
      return {
        fontSize: this.fontSize,
        color: this.color,
        backgroundColor: this.bgColor
      };
    }
  },
  mounted() {
    const req = require.context('./svg', false, /\.svg$/);
    this.list = req.keys().map(function(name) {
      return name.replace(/.\/|.svg/g, '');
    });
    this.style.fontSize = this.fontSize;
    this.style.color = this.color;
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.icons-demo {
  .el-select {
    display: inline-block;
  }
  .color {
    display: inline-block;
    margin-left: 1em;
    position: relative;
    vertical-align: top;
    width: auto;
    height: 40px;
    white-space: nowrap;
    > * {
      display: inline-block;
      vertical-align: top;
      border: none;
    }
  }
  input {
    height: 40px;
    padding: 0 15px;
    box-sizing: border-box;
    border: 1px #ddd solid;
    border-radius: 3px;
    vertical-align: top;
  }
  .el-color-picker {
    position: relative;
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    margin-left: -2px;
  }
  .el-color-picker__color {
    border-radius: 0 3px 3px 0;
  }
  #icon li {
    text-align: center;
    font-size: inherit;
    display: inline-block;
    width: 80px;
    margin: 10px;
    .svg-icon {
      font-size: inherit;
      // width: 40px;
      // height: 40px;
      fill: currentColor;
      overflow: hidden;
    }
    div {
      // font-size: 12px;
      margin-top: 10px;
    }
  }
}
</style>
