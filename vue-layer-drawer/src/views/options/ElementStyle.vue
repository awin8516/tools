<template>
  <dd :class="'po-options-'+_key">
    <template v-if="Object.keys(styleOptions.select).includes(_key)">
      <label :title="_key">{{_key}}:</label>
      <div class="field">
        <el-select v-model.lazy="value" allow-create filterable>
          <el-option v-for="(item) in styleOptions.select[_key]" :key="item" :label="item" :value="item" size="mini">{{item}}</el-option>
        </el-select>
      </div>
    </template>
    <template v-else-if="styleOptions.upload.includes(_key)">
      <label :title="_key">{{_key}}:</label>
      <div class="field">
        <Upload :val.sync="value" :template="'url(#)'"></Upload>
      </div>
    </template>
    <template v-else-if="styleOptions.color.includes(_key)">
      <label :title="_key">{{_key}}:</label>
      <div class="field">
        <color-picker :val.sync="value"></color-picker>
      </div>
    </template>
    <template v-else-if="styleOptions.range.includes(_key)">
      <label :title="_key">*{{_key}}:</label>
      <!-- <input v-range="{val:'value'}" type="text" v-model.lazy="value" /> -->
      <div class="field">
        <el-input-number v-model.lazy="value" controls-position="right"></el-input-number>
      </div>
    </template>
    <template v-else>
      <label :title="_key">{{_key}}:</label>
      <input type="text" v-model.lazy="value" />
    </template>
    <i class="delete-param el-icon-remove" @click="ac_deleteElementStyle(_key)"></i>
  </dd>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Upload from "@/components/Upload.vue";
import ColorPicker from "@/components/ColorPicker.vue";
import { getElementWidth } from "@/utils";
import styleOptions from "@/utils/styleOptions";
export default {
  name: "optionsElementStyle",
  data() {
    return { styleOptions: styleOptions };
  },
  props: ["_key", "_style"],
  computed: {
    ...mapGetters(["gt_elementSelected"]),
    value: {
      get: function() {
        if (this.gt_elementSelected) {
          if (styleOptions.range.includes(this._key)) {
            return parseInt(this._style[this._key]);
          } else {
            return this._style[this._key];
          }
        }
        return null;
      },
      set: function(v) {
        let style;
        if (this._key == "position") {
          style =
            v == "absolute" || v == "fixed"
              ? {
                  left: this._style["margin-left"],
                  top: this._style["margin-top"],
                  width:
                    getElementWidth(
                      '[data-vid="' +
                        this.gt_elementSelected.vid +
                        '"] > *:first-child'
                    ) || 0,
                  "margin-left": "auto",
                  "margin-top": "auto"
                }
              : {
                  left: "auto",
                  top: "auto",
                  right: "auto",
                  bottom: "auto",
                  width: "auto"
                };
          style.position = v;
        } else if (styleOptions.range.includes(this._key)) {
          // console.log(v);
          // if (v && isNaN(v)) {
            // const val = v.indexOf("px") == -1 ? v + "px" : v;
            style = { [this._key]: v + "px" };
          // }
        } else {
          style = { [this._key]: v };
        }
        this.ac_updateElementStyle(style);
      }
    }
  },
  components: {
    Upload,
    ColorPicker
  },
  methods: {
    ...mapActions(["ac_updateElementStyle", "ac_deleteElementStyle"])
  }
};
</script>
