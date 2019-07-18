<template>
  <dd :class="'po-options-'+_key">
    <template v-if="Object.keys(attributeOptions.select).includes(_key)">
      <label>{{_key}}:</label>
      <div class="field">
        <el-select v-model.lazy="value" allow-create filterable>
          <el-option v-for="(item) in attributeOptions.select[_key]" :key="item" :value="item"></el-option>
        </el-select>
      </div>
    </template>
    <template v-else-if="attributeOptions.switch.includes(_key)">
      <label>{{_key}}:</label>
      <div class="field">
        <el-switch v-model="value" active-color="#008cff" inactive-color="#ddd"></el-switch>
      </div>
    </template>
    <template v-else-if="attributeOptions.upload.includes(_key)">
      <label>{{_key}}:</label>
      <div class="field">
        <Upload :val.sync="value"></Upload>
      </div>
    </template>
    <template v-else>
      <label>{{_key}}:</label>
      <input type="text" v-model.lazy="value" />
    </template>
    <i class="delete-param el-icon-remove" @click="ac_deleteAttribute(_key)"></i>
  </dd>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Upload from "@/components/Upload.vue";
import attributeOptions from "@/utils/attributeOptions";
export default {
  name: "optionsElementAttribute",
  data() {
    return { attributeOptions: attributeOptions };
  },
  props: ["_key", "_attribute"],
  computed: {
    ...mapGetters(["gt_elementSelected"]),
    value: {
      get: function() {
        return this.gt_elementSelected && this._attribute[this._key];
      },
      set: function(v) {
        this.ac_updateElementAttr({ [this._key]: v });
      }
    }
  },
  components: {
    Upload
  },
  methods: {
    ...mapActions(["ac_updateElementAttr", "ac_deleteAttribute"])
  }
};
</script>
