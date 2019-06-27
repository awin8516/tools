<template>
  <div class="po-options">
    <ScreenOptions></ScreenOptions>
    <div class="po-options-group po-options-el" v-if="gt_elementSelected">
      <h2>元素</h2>
      <dl>
        <dd>
          <label class="h2">className:</label>
          <input type="text" v-model.lazy="gt_elementSelected.className">
        </dd>
      </dl>
      <dl v-if="typeof gt_elementSelected.src !== 'undefined'">
        <dd>
          <label class="h2">src:</label>
          <div class="field">
            <Upload :val.sync="gt_elementSelected.src"></Upload>
          </div>
        </dd>
      </dl>
      <dl>
        <dt class="h2">Style</dt>
        <dd v-for="(value, key) in gt_elementSelected.style" :key="key" :class="'po-options-'+key">
          <template v-if="key == 'position'">
            <label>position:</label>
            <div class="field">
              <el-select v-model="gt_elementSelected.style.position" @change="setPosition" :key="gt_elementSelected.vid">
                <el-option v-for="(item) in positionOptions" :key="item" :label="item" :value="item">{{item}}</el-option>
              </el-select>
            </div>
          </template>
          <template v-else>
            <label>{{key}}:</label>
            <input v-if="ragneList.includes(key)" v-range="{val:'gt_elementSelected.style',key:key}" type="text" v-model.lazy="gt_elementSelected.style[key]">
            <input v-else type="text" v-model.lazy="gt_elementSelected.style[key]">
          </template>
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
        <el-button icon="el-icon-delete" @click="ac_deleteElement(gt_indexSelected)">删除元素</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import ScreenOptions from "@/views/ScreenOptions.vue";
import Upload from "@/components/Upload.vue";
import { style2object } from "@/utils";
export default {
  name: "options",
  data() {
    return {
      position: "",
      styleCustom: "margin:10px;\npadding:20px;"
    };
  },
  computed: {
    ...mapState(["elementList", "ragneList", "positionOptions"]),
    ...mapGetters(["gt_elementSelected", "gt_indexSelected"])
  },
  components: {
    ScreenOptions,
    Upload
  },
  methods: {
    ...mapActions(["ac_deleteElement", "ac_addStyle"]),
    setPosition() {
      this.gt_elementSelected.style.left = "auto";
      this.gt_elementSelected.style.top = "auto";
      this.gt_elementSelected.style.right = "auto";
      this.gt_elementSelected.style.bottom = "auto";
      this.gt_elementSelected.style.width = "auto";
      this.ac_addStyle({ position: this.gt_elementSelected.style.position });
    },
    pushStyle() {
      if (!this.styleCustom) return;
      this.ac_addStyle(style2object(this.styleCustom));
      this.styleCustom = "";
    }
  },
  mounted() {}
};
</script>
