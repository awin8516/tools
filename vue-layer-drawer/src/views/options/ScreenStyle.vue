<template>
  <dd :class="'po-options-'+_key">
    <template v-if="Object.keys(styleOptions.select).includes(_key)">
      <label>{{_key}}:</label>
      <div class="field">
        <el-select v-model.lazy="value" allow-create filterable>
          <el-option v-for="(item) in styleOptions.select[_key]" :key="item" :label="item" :value="item" size="mini">{{item}}</el-option>
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
    <i class="delete-param el-icon-remove" @click="ac_deleteScreenStyle(_key)"></i>
  </dd>
</template>

<script>
import { mapActions } from "vuex";
import Upload from "@/components/Upload.vue";
import ColorPicker from "@/components/ColorPicker.vue";
import styleOptions from "@/utils/styleOptions";
export default {
  name: "optionsScreenStyle",
  data() {
    return { styleOptions: styleOptions };
  },
  props: ["_key", "_style"],
  computed: {
    value: {
      get: function() {
        return this._style[this._key];
      },
      set: function(v) {
        this.ac_updateScreenStyle({
          [this._key]: v
        });
      }
    }
  },
  components: {
    Upload,
    ColorPicker
  },
  methods: {
    ...mapActions(["ac_updateScreenStyle", "ac_deleteScreenStyle"])
  }
};
</script>
