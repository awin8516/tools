<template>
  <dd v-if="typeof value == 'string' || typeof value == 'number'">
    <label :title="_key">{{_key}}:</label>
    <input type="text" v-model.lazy="value">
  </dd>
  <dd v-else-if="typeof value == 'boolean'">
    <label :title="_key">{{_key}}:</label>
    <el-switch v-model="value" active-color="#008cff" inactive-color="#ddd"></el-switch>
  </dd>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "ElementOption",
  data() {
    return {};
  },
  props: ["_options", "_key", "_parentKey"],
  computed: {
    ...mapGetters(["gt_elementSelected"]),
    value: {
      get: function() {
        return this._options[this._key];
      },
      set: function(v) {
        if (this._parentKey) {
          let a = this.gt_elementSelected.options[this._parentKey];
          let b = { [this._key]: v };
          a = Object.assign({}, a, b);
          this.ac_updateElementOptions({ [this._parentKey]: a });
        } else {
          this.ac_updateElementOptions({ [this._key]: v });
        }
      }
    }
  },
  methods: {
    ...mapActions(["ac_updateElementOptions"])
  }
};
</script>
