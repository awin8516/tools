<template>
  <div :data-name="element.name" :style="element.style[$parent.gt_mediaName]" :class="element.className">
    <slot name="innerText"></slot>
    <slot name="children"></slot>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Div",
  data() {
    return {
      type: "div",
      icon: "menu",
      container: true,
      name: "div-1",
      id: "div-1",
      className: "div div-test",
      innerText: "",
      editing: false,
      style: {
        default: {
          position: "absolute",
          left: "0",
          right: "auto",
          top: "0",
          bottom: "auto",
          width: "100px",
          height: "100px",
          display: "block",
          "background-image": "url()",
          "background-color": "#eee",
          "background-repeat": "no-repeat",
          "background-size": "100% auto",
          "background-position": "left top"
        }
      }
      // contextMenu: [
      //   {
      //     icon: "el-icon-delete",
      //     name: "编辑文字",
      //     command: () => {
      //       this.$parent.ac_updateElementAttr({ editing: true });
      //     }
      //   }
      // ]
    };
  },
  props: ["element"],
  methods: {
    ...mapActions(["ac_registerContextMenu"])
  },
  mounted() {
    console.log(this);
    // this.contextMenu = [
    //   {
    //     icon: "el-icon-delete",
    //     name: "编辑文字",
    //     command: () => {
    //       this.$parent.ac_updateElementAttr({ editing: true });
    //     }
    //   }
    // ];
    this.ac_registerContextMenu([
      {
        name: "cm_editInnerText",
        icon: "el-icon-delete",
        label: "编辑文字",
        command: () => {
          this.$parent.ac_updateElementAttr({ editing: true });
        }
      }
    ]);
    // this.$parent.ac_updateElementAttr({
    //   contextMenu: [
    //     {
    //       icon: "el-icon-delete",
    //       name: "编辑文字",
    //       command: () => {
    //         this.$parent.ac_updateElementAttr({ editing: true });
    //       }
    //     }
    //   ]
    // });
  }
};
</script>
