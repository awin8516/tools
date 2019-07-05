<template>
  <div class="po-options-group">
    <h2>页面</h2>
    <dl>
      <dd>
        <label class="h2">name:</label>
        <input type="text" v-model.lazy="name">
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
import { mapState, mapActions } from "vuex";
import ScreenStyle from "@/views/options/ScreenStyle.vue";
export default {
  name: "Screen",
  data() {
    return {};
  },
  computed: {
    ...mapState(["screenOptions"]),
    name: {
      get: function() {
        return this.screenOptions && this.screenOptions.name;
      },
      set: function(v) {
        this.ac_updateScreenAttr({ name: v });
      }
    },
    style: {
      get: function() {
        return this.screenOptions.style;
      }
    }
  },
  components: {
    ScreenStyle
  },
  methods: {
    ...mapActions(["ac_updateScreenAttr"])
  }
};
</script>
