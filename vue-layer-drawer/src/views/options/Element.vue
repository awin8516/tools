<template>
  <div class="po-options-group po-options-el" v-if="elementSelected">
    <h2>元素</h2>
    <dl>
      <dd>
        <label class="h2">name:</label>
        <input type="text" v-model.lazy="name">
      </dd>
    </dl>
    <dl>
      <dd>
        <label class="h2">id:</label>
        <input type="text" v-model.lazy="id">
      </dd>
    </dl>
    <dl>
      <dd>
        <label class="h2">className:</label>
        <input type="text" v-model.lazy="className">
      </dd>
    </dl>
    <dl v-if="typeof src !== 'undefined'">
      <dd>
        <label class="h2">src:</label>
        <div class="field">
          <Upload :val.sync="src"></Upload>
        </div>
      </dd>
    </dl>
    <dl v-if="typeof style !== 'undefined'">
      <dt class="h2">Style</dt>
      <template v-for="(value, key) in style">
        <ElementStyle :key="key" :_key="key" :_style="style"></ElementStyle>
      </template>
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
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import ElementStyle from "@/views/options/ElementStyle.vue";
import Upload from "@/components/Upload.vue";
import { style2object } from "@/utils";
export default {
  name: "optionsElement",
  data() {
    return {
      styleCustom: "margin:10px;\npadding:20px;"
    };
  },
  computed: {
    ...mapState(["mediaName"]),
    ...mapGetters(["gt_elementSelected", "gt_indexSelected"]),
    elementSelected: {
      get: function() {
        return this.gt_elementSelected && this.gt_elementSelected;
      }
    },
    name: {
      get: function() {
        return this.elementSelected && this.elementSelected.name;
      },
      set: function(v) {
        this.ac_updateElementAttr({ name: v });
      }
    },
    id: {
      get: function() {
        return this.elementSelected && this.elementSelected.id;
      },
      set: function(v) {
        this.ac_updateElementAttr({ id: v });
      }
    },
    className: {
      get: function() {
        return this.elementSelected && this.elementSelected.className;
      },
      set: function(v) {
        this.ac_updateElementAttr({ className: v });
      }
    },
    src: {
      get: function() {
        return this.elementSelected && this.elementSelected.src;
      },
      set: function(v) {
        this.ac_updateElementAttr({ src: v });
      }
    },
    style: {
      get: function() {
        return (
          this.elementSelected && this.elementSelected.style[this.mediaName]
        );
      }
    }
  },
  components: {
    ElementStyle,
    Upload
  },
  methods: {
    ...mapActions([
      "ac_updateElementAttr",
      "ac_deleteElement",
      "ac_updateStyle"
    ]),
    pushStyle() {
      if (!this.styleCustom) return;
      this.ac_updateStyle(style2object(this.styleCustom));
      this.styleCustom = "";
    }
  }
};
</script>
