<template>
  <dd :class="'po-options-'+_key">
    <template v-if="_key == 'background-image'">
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
import { mapState, mapActions } from "vuex";
import Upload from "@/components/Upload.vue";
export default {
  name: "optionsScreenStyle",
  data() {
    return {};
  },
  props: ["_key", "_style"],
  computed: {
    ...mapState(["ragneList"]),
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
    Upload
  },
  methods: {
    ...mapActions(["ac_updateScreenStyle"])
  }
};
</script>
