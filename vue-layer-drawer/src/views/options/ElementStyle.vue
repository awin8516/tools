<template>
  <dd :class="'po-options-'+_key">
    <template v-if="_key == 'position'">
      <label>position:</label>
      <div class="field">
        <el-select v-model.lazy="position">
          <el-option v-for="(item) in positionOptions" :key="item" :label="item" :value="item">{{item}}</el-option>
        </el-select>
      </div>
    </template>
    <template v-else-if="_key == 'background-image'">
      <label>background-image:</label>
      <div class="field">
        <Upload :val.sync="value" :template="'url(#)'"></Upload>
      </div>
    </template>
    <template v-else>
      <label>{{_key}}:</label>
      <input v-if="ragneList.includes(_key)" v-range="{val:'value'}" type="text" v-model.lazy="value" />
      <input v-else type="text" v-model.lazy="value" />
    </template>
  </dd>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import Upload from "@/components/Upload.vue";
export default {
  name: "optionsElementStyle",
  data() {
    return {};
  },
  props: ["_key", "_style"],
  computed: {
    ...mapState(["mediaName", "ragneList", "positionOptions"]),
    ...mapGetters(["gt_elementSelected"]),
    position: {
      get: function() {
        return this.gt_elementSelected && this._style.position;
      },
      set: function(v) {
        let style =
          v == "absolute" || v == "fixed"
            ? {
                left: this._style["margin-left"],
                top: this._style["margin-top"],
                right: this._style["margin-right"],
                bottom: this._style["margin-bottom"],
                width:
                  document.querySelector(
                    '[data-vid="' + this.gt_elementSelected.vid + '"]'
                  ).clientWidth + "px" || 0,
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
        this.ac_updateStyle(style);
      }
    },
    value: {
      get: function() {
        return this.gt_elementSelected && this._style[this._key];
      },
      set: function(v) {
        this.ac_updateStyle({
          [this._key]: v
        });
      }
    }
  },
  components: {
    Upload
  },
  methods: {
    ...mapActions(["ac_updateElementAttr", "ac_updateStyle"])
  }
};
</script>
