<template>
  <div class="po-options">
    <ScreenOptions></ScreenOptions>
    <div class="po-options-el" v-if="gt_elementSelected">
      <dl>
        <dt>
          <label class="h2">className:</label>
          <input type="text" v-model.lazy="gt_elementSelected.className">
        </dt>
      </dl>
      <dl v-if="gt_elementSelected.src">
        <dt>
          <label class="h2">src:</label>
          <input type="text" v-model.lazy="gt_elementSelected.src">
          <input type="file">
        </dt>
      </dl>
      <dl>
        <dt class="h2">Style</dt>
        <dd v-for="(value, key) in gt_elementSelected.style" :key="key" :class="'po-options-'+key">
          <label>{{key}}:</label>
          <input v-if="ragneList.includes(key)" v-range='{val:"gt_elementSelected.style",key:key}' type="text" v-model.lazy="gt_elementSelected.style[key]">
          <input v-else type="text" v-model.lazy="gt_elementSelected.style[key]">
        </dd>
        <dd>
          <h2 class="h2">自定义：</h2>
          <div class="style-custom">
            <textarea v-model="styleCustom"></textarea>
            <div class="submit disabled0" @click="pushStyle"></div>
          </div>
        </dd>
      </dl>
      <div class="po-options-foot">
        <el-button icon='el-icon-delete' @click="ac_deleteElement(gt_indexSelected)">删除元素</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import ScreenOptions from "@/views/ScreenOptions.vue";
import { style2object } from "@/utils";
import { setTimeout } from 'timers';
export default {
  name: "options",
  data() {
    return {
      styleCustom: 'margin:10px;\npadding:20px;'
    };
  },
  computed: {
    ...mapState(['elementList', 'ragneList']),
    ...mapGetters(['gt_elementSelected', 'gt_indexSelected'])
  },
  components: {
    ScreenOptions
  },
  methods: {
    ...mapActions(['ac_deleteElement', 'ac_setElementList']),
    pushStyle() {
      if (!this.styleCustom) return
      this.gt_elementSelected.style = Object.assign({}, this.gt_elementSelected.style, style2object(this.styleCustom))
      this.styleCustom = ''

      // this.elementList[this.gt_indexSelected].style = Object.assign({}, this.gt_elementSelected.style, style2object(this.styleCustom))
      // this.ac_setElementList(this.elementList)
      // this.styleCustom = ''
    }
  },
  mounted() {

  }
};
</script>
