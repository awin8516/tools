<template>
  <dd :class="'po-options-'+_key">
    <template v-if="Object.keys(styleOptions.select).includes(_key)">
      <label>{{_key}}:</label>
      <div class="field">
        <el-select v-model.lazy="value" allow-create filterable>
          <el-option v-for="(item) in styleOptions.select[_key]" :key="item" :label="item" :value="item">{{item}}</el-option>
        </el-select>
      </div>
    </template>
    <template v-else-if="styleOptions.upload.includes(_key)">
      <label>{{_key}}:</label>
      <div class="field">
        <Upload :val.sync="value" :template="'url(#)'"></Upload>
      </div>
    </template>
    <template v-else-if="styleOptions.color.includes(_key)">
      <label>{{_key}}:</label>
      <div class="field">
        <color-picker :val.sync="value"></color-picker>
      </div>
    </template>
    <template v-else-if="styleOptions.range.includes(_key)">
      <label>{{_key}}:</label>
      <input v-range="{val:'value'}" type="text" v-model.lazy="value" />
    </template>
    <template v-else>
      <label>{{_key}}:</label>
      <input type="text" v-model.lazy="value" />
    </template>
  </dd>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Upload from "@/components/Upload.vue";
import ColorPicker from "@/components/ColorPicker.vue";
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
        return this.gt_elementSelected && this._style[this._key];
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
                    document.querySelector(
                      '[data-vid="' + this.gt_elementSelected.vid + '"]'
                    ).firstElementChild.clientWidth + "px" || 0,
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
        } else {
          style = { [this._key]: v };
        }
        this.ac_updateStyle(style);
      }
    }
  },
  components: {
    Upload,
    ColorPicker
  },
  methods: {
    ...mapActions(["ac_updateStyle"])
  }
};
</script>
