<template>
  <div class="po-options-group">
    <h2>页面</h2>
    <dl>
      <dd>
        <label class="h2">name:</label>
        <input type="text" v-model.lazy="name">
      </dd>
    </dl>
    <dl>
      <dd>
        <label class="h2">主题色系:</label>
        <div class="field">
          <ThemeColors></ThemeColors>
        </div>
      </dd>
    </dl>
    <dl v-if="typeof style !== 'undefined'">
      <dt class="h2">Style</dt>
      <template v-for="(value, key) in style">
        <ScreenStyle :key="key" :_key="key" :_style="style"></ScreenStyle>
      </template>
      <!-- <dd>
        <h2 class="h2">自定义：</h2>
        <div class="style-custom">
          <textarea v-model="styleCustom"></textarea>
          <div class="submit disabled0" @click="pushStyle"></div>
        </div>
      </dd> -->
    </dl>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ThemeColors from "@/components/ThemeColors.vue";
import ScreenStyle from "@/views/options/ScreenStyle.vue";
export default {
  name: "optionsScreen",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["gt_screenOptions"]),
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
  components: { ThemeColors, ScreenStyle },
  methods: {
    ...mapActions(["ac_updateScreenAttr"])
  }
};
</script>
