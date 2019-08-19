<template>
  <div class="po-options-panel">
    <div class="panel-hd">
      页面
      <panel-fold target=".po-options-panel" toggleClass="po-options-panel-closed" :closed="!!gt_elementSelected"></panel-fold>
    </div>
    <div class="panel-bd scrollstyle">
      <panel-group>
        <dt class="h2">基础属性：</dt>
        <dd>
          <label title="name">name:</label>
          <input type="text" v-model.lazy="name">
        </dd>
        <dd>
          <label title="主题色系">主题色系:</label>
          <div class="field">
            <ThemeColors></ThemeColors>
          </div>
        </dd>
      </panel-group>
      <panel-group v-if="typeof style !== 'undefined'">
        <dt class="h2">Style</dt>
        <template v-for="(value, key) in style">
          <ScreenStyle :key="key" :_key="key" :_style="style"></ScreenStyle>
        </template>
        <dd>
          <add-style @command="addStyle"></add-style>
        </dd>
        <dd>
          <custom-style @command="pushStyle"></custom-style>
        </dd>
      </panel-group>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ThemeColors from "@/components/ThemeColors.vue";
import ScreenStyle from "@/views/options/ScreenStyle.vue";
import AddStyle from "@/components/AddStyle.vue";
import CustomStyle from "@/components/CustomStyle.vue";
export default {
  name: "optionsScreen",
  data() {
    return { state2: "", styleCustom: "margin:10px;\npadding:20px;" };
  },
  computed: {
    ...mapGetters(["gt_screenOptions", "gt_elementSelected"]),
    name: {
      get: function() {
        return this.gt_screenOptions && this.gt_screenOptions.name;
      },
      set: function(v) {
        this.ac_updateScreenAttr({ name: v });
      }
    },
    style: {
      get: function() {
        return this.gt_screenOptions.style;
      }
    }
  },
  components: { ThemeColors, ScreenStyle, AddStyle, CustomStyle },
  methods: {
    ...mapActions(["ac_updateScreenAttr", "ac_updateScreenStyle"]),
    addStyle(style) {
      this.ac_updateScreenStyle({ [style]: "" });
    },
    pushStyle(style) {
      this.ac_updateScreenStyle(style);
    }
  }
};
</script>
