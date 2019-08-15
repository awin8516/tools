<template>
  <div class="po-options-panel po-options-el" v-if="elementSelected">
    <div class="panel-hd">
      元素
      <panel-fold target=".po-options-panel" closed="po-options-panel-closed"></panel-fold>
    </div>
    <div class="panel-bd scrollstyle">
      <dl>
        <dt class="h2">基础属性：</dt>
        <dd>
          <label>name:</label>
          <input type="text" v-model.lazy="name">
        </dd>
      </dl>
      <dl v-if="typeof attribute !== 'undefined'">
        <dt class="h2">Attribute</dt>
        <template v-for="(value, key) in attribute">
          <ElementAttribute :key="key" :_key="key" :_attribute="attribute"></ElementAttribute>
        </template>
      </dl>
      <dl v-if="typeof style !== 'undefined'">
        <dt class="h2">Style</dt>
        <template v-for="(value, key) in style">
          <ElementStyle :key="key" :_key="key" :_style="style"></ElementStyle>
        </template>
        <dd>
          <add-style @command="addStyle"></add-style>
        </dd>
        <dd>
          <custom-style @command="pushStyle"></custom-style>
        </dd>
      </dl>
      <!-- <div class="po-options-foot">
        <el-button icon="el-icon-delete" @click="ac_deleteElement(gt_indexSelected)">删除元素</el-button>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ElementAttribute from "@/views/options/ElementAttribute.vue";
import ElementStyle from "@/views/options/ElementStyle.vue";
import Upload from "@/components/Upload.vue";
import AddStyle from "@/components/AddStyle.vue";
import CustomStyle from "@/components/CustomStyle.vue";
export default {
  name: "optionsElement",
  data() {
    return {
      styleCustom: "margin:10px;\npadding:20px;"
    };
  },
  computed: {
    ...mapGetters(["gt_mediaName", "gt_elementSelected", "gt_indexSelected"]),
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
        this.ac_updateElement({ name: v });
      }
    },
    attribute: {
      get: function() {
        return this.elementSelected && this.elementSelected.attribute;
      }
    },
    style: {
      get: function() {
        return (
          this.elementSelected && this.elementSelected.style[this.gt_mediaName]
        );
      }
    }
  },
  components: {
    ElementAttribute,
    ElementStyle,
    Upload,
    AddStyle,
    CustomStyle
  },
  methods: {
    ...mapActions([
      "ac_updateElement",
      "ac_deleteElement",
      "ac_updateElementStyle"
    ]),
    addStyle(style) {
      this.ac_updateElementStyle({ [style]: "" });
    },
    pushStyle(style) {
      this.ac_updateElementStyle(style);
    }
  }
};
</script>
