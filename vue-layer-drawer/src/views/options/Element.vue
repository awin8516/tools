<template>
  <div class="po-options-group po-options-el" v-if="elementSelected">
    <h2>元素</h2>
    <dl>
      <dd>
        <label class="h2">name:</label>
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
        <el-autocomplete class="inline-input" v-model="state2" :fetch-suggestions="querySearch" placeholder="请输入" :trigger-on-focus="false" @select="addStyle"><template slot="prepend">添加样式</template></el-autocomplete>
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
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ElementAttribute from "@/views/options/ElementAttribute.vue";
import ElementStyle from "@/views/options/ElementStyle.vue";
import Upload from "@/components/Upload.vue";
import { style2object } from "@/utils";
import cssKey from "@/utils/cssKey";
export default {
  name: "optionsElement",
  data() {
    return {
      state2: "",
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
    Upload
  },
  methods: {
    ...mapActions([
      "ac_updateElement",
      "ac_updateElementAttr",
      "ac_deleteElement",
      "ac_updateStyle"
    ]),
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
      if (!this.state2) return;
      this.ac_updateStyle({ [this.state2]: "" });
      this.state2 = "";
    },
    pushStyle() {
      if (!this.styleCustom) return;
      this.ac_updateStyle(style2object(this.styleCustom));
      this.styleCustom = "";
    }
  }
};
</script>
