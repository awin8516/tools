<template>
  <ins class="po-el-item" :data-vid="elementParams.vid" :data-pid="elementParams.pid" :class="[elementParams.style.position,{'active':elementParams.selected}]" :style="itemStyle" @mousedown="mouseDown" @mouseup="draging = false" @mousemove="mouseMove" @contextmenu.prevent="contextMenu">
    <component :is="component" :elementParams="elementParams" ref="component">
      <template v-for="item in elementList" slot="children">
        <Element v-if="item.pid == elementParams.vid" :key="item.vid" :data-vid="item.vid" :class="{'active':item.selected}" :elementParams.sync="item"></Element>
      </template>
    </component>
    <mark v-show="contextMenuActive && elementParams.selected" class="context-menu" :style="'left:'+contextMenuPos.left+'px;top:'+contextMenuPos.top+'px'">
      <ul>
        <li v-for="(item, index) in contextMenuDefault" :key="index" @click="item.command(),contextMenuActive = false"><i :class='item.icon'></i>{{item.name}}</li>
      </ul>
      <input class="focus-filed" ref="focusFiled" @blur="hideMenu" type="text">
    </mark>
    <mark class="resize" v-drag="resize" @mousedown.stop="getSize"></mark>
  </ins>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  name: "Element",
  data() {
    return {
      component: null,
      draging: false,
      shiftKey: false,
      size: {
        width: 0,
        height: 0
      },
      contextMenuDefault: [
        {
          icon: "el-icon-upload2",
          name: "上移一层",
          command: () => {
            if (this.gt_indexSelected < this.elementList.length - 1) {
              this.ac_updateLayer(1);
            }
          }
        },
        {
          icon: "el-icon-download",
          name: "下移一层",
          command: () => {
            if (this.gt_indexSelected > 0) {
              this.ac_updateLayer(-1);
            }
          }
        },
        {
          icon: "el-icon-upload2",
          name: "置为顶层",
          command: () => {
            if (this.gt_indexSelected < this.elementList.length - 1) {
              this.ac_updateLayer(1000);
            }
          }
        },
        {
          icon: "el-icon-download",
          name: "置为底层",
          command: () => {
            if (this.gt_indexSelected > 0) {
              this.ac_updateLayer(-1000);
            }
          }
        },
        {
          icon: "el-icon-delete",
          name: "删除",
          command: () => {
            this.ac_deleteElement(this.elementParams);
          }
        }
      ],
      contextMenuActive: false,
      contextMenuPos: {
        left: 0,
        top: 0
      }
    };
  },
  props: ["elementParams"],
  computed: {
    ...mapState(["elementList"]),
    ...mapGetters(["gt_indexSelected"]),
    itemStyle: function() {
      const style = [
        "position",
        "width",
        "left",
        "top",
        "right",
        "bottom",
        "margin",
        "margin-top",
        "margin-right",
        "margin-bottom",
        "margin-left"
        // "display"
      ];
      let styleObject = {};
      style.forEach(v => {
        if (typeof this.elementParams.style[v] !== "undefined") {
          if (v == "width") {
            if (this.elementParams.style.position == "relative") {
              styleObject[v] = this.elementParams.style[v];
            }
          } else {
            styleObject[v] = this.elementParams.style[v];
          }
        }
      });
      return styleObject;
    },
    isAbsolute: function() {
      return (
        this.elementParams.style.position == "absolute" ||
        this.elementParams.style.position == "fixed"
      );
    }
  },
  methods: {
    ...mapActions([
      "ac_selectElement",
      "ac_deleteElement",
      "ac_updateLayer",
      "ac_addStyle"
    ]),
    contextMenu(e) {
      this.contextMenuActive = true;
      this.contextMenuPos = {
        left: e.offsetX,
        top: e.offsetY
      };
      this.$nextTick(() => {
        this.$refs.focusFiled.focus();
      });
    },
    mouseDown(e) {
      if (e.target.parentElement.dataset.vid == this.elementParams.vid) {
        this.draging = true;
        this.ac_selectElement(this.elementParams);
      }
      if (e.button == 0) {
        this.hideMenu();
      }
    },
    mouseMove(e) {
      if (this.draging) {
        const key = this.isAbsolute
          ? { x: "left", y: "top", jx: "left", jy: "top" }
          : {
              x: "margin-left",
              y: "margin-top",
              jx: "marginLeft",
              jy: "marginTop"
            };
        const style = {
          [key.x]: e.currentTarget.style[key.jx],
          [key.y]: e.currentTarget.style[key.jy]
        };
        this.ac_addStyle(style);
      }
    },
    hideMenu() {
      setTimeout(() => {
        this.contextMenuActive = false;
      }, 200);
    },
    getSize(e) {
      this.shiftKey = e.shiftKey == 1;
      this.size = this.isAbsolute
        ? {
            width: parseInt(this.elementParams.style.width) || 0,
            height: parseInt(this.elementParams.style.height) || 0
          }
        : {
            width:
              document.querySelector(
                '[data-vid="' + this.elementParams.vid + '"]'
              ).clientWidth || 0,
            height:
              document.querySelector(
                '[data-vid="' + this.elementParams.vid + '"]'
              ).clientHeight || 0
          };
    },
    resize(el, data) {
      let style = {};
      style.width = this.size.width + data.x + "px";
      if (this.shiftKey) {
        style.height =
          parseInt(
            (this.size.height / this.size.width) * (this.size.width + data.x)
          ) + "px";
      } else {
        style.height = this.size.height + data.y + "px";
      }
      this.ac_addStyle(style);
    }
  },
  filters: {
    capitalize: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  mounted() {
    try {
      const path = this.elementParams.file.replace("src/", "");
      this.component = () => import("@/" + path);
      if (this.elementParams.contextMenu) {
        this.contextMenuDefault = this.contextMenuDefault.concat(
          this.elementParams.contextMenu
        );
      }
    } catch (e) {
      console.log('no vue')
    }
  }
};
</script>
<style lang="scss">
.po-el-item {
  > div:first-child {
    left: 0 !important;
    top: 0 !important;
  }
}
</style>
