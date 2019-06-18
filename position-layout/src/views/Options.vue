<template>
  <div class="po-options">
    <ScreenOptions></ScreenOptions>
    <div class="po-options-el" v-if="elementList.length && selectedIndex>=0">
      <dl>
        <dt>
          <label class="h2">className:</label>
          <input type="text" v-model.lazy="elementSelected.className">
        </dt>
      </dl>
      <dl v-if="elementSelected.src">
        <dt>
          <label class="h2">src:</label>
          <input type="text" v-model.lazy="elementSelected.src">
          <input type="file">
        </dt>
      </dl>
      <dl>
        <dt class="h2">Style</dt>
        <dd v-for="(value, key) in elementSelected.style" :key="key" :class="'po-options-'+key">
          <label>{{key}}:</label>
          <input v-if="ragneList.includes(key)" v-range='{val:"elementSelected.style",key:key}' type="text" v-model.lazy="elementSelected.style[key]">
          <input v-else type="text" v-model.lazy="elementSelected.style[key]">
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
        <el-button icon='el-icon-delete' @click="deleteElement(selectedIndex)">删除元素</el-button>
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
    ...mapGetters(['elementSelected', 'selectedIndex'])
  },
  components: {
    ScreenOptions
  },
  methods: {
    ...mapActions(['deleteElement', 'setElementList']),
    pushStyle() {
      if (!this.styleCustom) return
      this.elementList[this.selectedIndex].style = Object.assign({}, this.elementSelected.style, style2object(this.styleCustom))
      this.setElementList(this.elementList)
      this.styleCustom = ''
    }
  },
  mounted() {

  }
};
</script>
