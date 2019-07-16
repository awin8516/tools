<template>
  <ins class="po-el-item" :data-vid="elementParams.vid" :data-pid="elementParams.pid" :class="[style.position,{'active':elementParams.selected}]" :style="itemStyle" @mousedown="mouseDown" @mouseup="draging = false" @mousemove="mouseMove" @contextmenu.prevent="contextMenu">
    <component :is="component" :element="elementParams">
      <template slot="innerText">
        {{elementParams.innerText}}
      </template>
      <template v-for="item in gt_elementList" slot="children">
        <Element v-if="item.pid == elementParams.vid" :key="item.vid" :data-vid="item.vid" :class="{'active':item.selected}" :elementParams.sync="item"></Element>
      </template>
    </component>
    <mark v-show="contextMenuActive && elementParams.selected" class="context-menu" :style="'left:'+contextMenuPos.left+'px;top:'+contextMenuPos.top+'px'">
      <ul>
        <li v-for="(item, index) in contextMenuList" :key="index" @click="item.command(),contextMenuActive = false"><i :class='item.icon'></i>{{item.label}}</li>
      </ul>
      <input class="focus-filed" ref="focusFiled" @blur="hideMenu" type="text">
    </mark>
    <mark v-show="elementParams.editing" class="textarea">
      <textarea v-focus="elementParams.editing" placeholder="编辑文字" @blur="updateText" :value="innerText"></textarea>
    </mark>
    <mark class="resize" v-drag="resize" @mousedown.stop="getSize"></mark>
  </ins>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import * as Tags from "@/components/Tags";
import { closest, getElementWidth, getElementHeight } from "@/utils";
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
          name: "cm_zindexMoveUp",
          icon: "el-icon-upload2",
          label: "上移一层",
          command: () => {
            if (this.gt_indexSelected < this.gt_elementList.length - 1) {
              this.ac_updateLayer(1);
            }
          }
        },
        {
          name: "cm_zindexMoveDown",
          icon: "el-icon-download",
          label: "下移一层",
          command: () => {
            if (this.gt_indexSelected > 0) {
              this.ac_updateLayer(-1);
            }
          }
        },
        {
          name: "cm_zindexMoveTop",
          icon: "el-icon-upload2",
          label: "置为顶层",
          command: () => {
            if (this.gt_indexSelected < this.gt_elementList.length - 1) {
              this.ac_updateLayer(1000);
            }
          }
        },
        {
          name: "cm_zindexMoveBottom",
          icon: "el-icon-download",
          label: "置为底层",
          command: () => {
            if (this.gt_indexSelected > 0) {
              this.ac_updateLayer(-1000);
            }
          }
        },
        {
          name: "cm_delete",
          icon: "el-icon-delete",
          label: "删除",
          command: () => {
            this.ac_deleteElement(this.elementParams);
          }
        }
      ],
      textareaActive: false,
      contextMenuActive: false,
      contextMenuPos: {
        left: 0,
        top: 0
      }
    };
  },
  props: ["elementParams"],
  computed: {
    ...mapGetters([
      "gt_elementList",
      "gt_mediaName",
      "gt_indexSelected",
      "gt_contextMenu"
    ]),
    contextMenuList() {
      if (this.gt_contextMenu) {
        console.log(this.gt_contextMenu)
        return this.contextMenuDefault.concat(this.gt_contextMenu);
      } else {
        console.log(this.gt_contextMenu)
        return this.contextMenuDefault;
      }
    },
    style() {
      return this.elementParams.style[this.gt_mediaName];
    },
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
        if (typeof this.style[v] !== "undefined") {
          if (v == "width") {
            if (this.style.position == "relative") {
              const padding =
                (parseInt(this.style["padding-left"]) || 0) +
                (parseInt(this.style["padding-right"]) || 0);
              // console.log(this.style[v])
              // styleObject[v] = ((parseInt(this.style[v]) || 0) + padding) + "px";
              if (this.style[v] == "auto") {
                styleObject[v] = this.style[v];
              } else {
                styleObject[v] =
                  (parseInt(this.style[v]) || 0) + padding + "px";
              }
            }
          } else if (v == "left" && this.style.position == "fixed") {
            styleObject[v] =
              (parseInt(this.style[v]) || 0) +
              document.querySelector("#po-screen").getBoundingClientRect()
                .left +
              "px";
          } else if (v == "top" && this.style.position == "fixed") {
            styleObject[v] =
              (parseInt(this.style[v]) || 0) +
              document.querySelector("#po-screen").getBoundingClientRect().top +
              "px";
          } else {
            styleObject[v] = this.style[v];
          }
        }
      });
      return styleObject;
    },
    isAbsolute: function() {
      return this.style.position === "absolute";
    },
    isFixed: function() {
      return this.style.position === "fixed";
    },
    innerText: {
      get: function() {
        return this.elementParams && this.elementParams.innerText;
      }
    }
  },
  components: Tags,
  methods: {
    ...mapActions([
      "ac_selectElement",
      "ac_deleteElement",
      "ac_updateLayer",
      "ac_updateElementAttr",
      "ac_replaceElementAttr",
      "ac_updateStyle"
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
      if (
        closest(e.target, ".po-el-item").dataset.vid ==
          this.elementParams.vid &&
        e.target.tagName !== "TEXTAREA"
      ) {
        this.draging = true;
        this.ac_selectElement(this.elementParams);
      }
      if (e.button == 0) {
        this.hideMenu();
      }
    },
    mouseMove(e) {
      if (this.draging) {
        const key =
          this.isAbsolute || this.isFixed
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
        if (this.isFixed) {
          style.left =
            (parseInt(style.left) || 0) -
            document.querySelector("#po-screen").getBoundingClientRect().left +
            "px";
          style.top =
            (parseInt(style.top) || 0) -
            document.querySelector("#po-screen").getBoundingClientRect().top +
            "px";
        }
        this.ac_updateStyle(style);
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
            width: parseInt(this.style.width) || 0,
            height: parseInt(this.style.height) || 0
          }
        : {
            width:
              parseInt(
                getElementWidth(
                  '[data-vid="' + this.elementParams.vid + '"] > *:first-child'
                )
              ) || 0,
            height:
              parseInt(
                getElementHeight(
                  '[data-vid="' + this.elementParams.vid + '"] > *:first-child'
                )
              ) || 0
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
      this.ac_updateStyle(style);
    },
    updateText(e) {
      this.ac_updateElementAttr({
        innerText: e.target.value,
        editing: false,
        vid: this.elementParams.vid
      });
    },
    addContextMenu() {
      this.$nextTick(() => {
        console.log(this.elementParams);
        console.log(Tags.Div.data());
      });
      console.log(this.elementParams);
      // if (this.elementParams.contextMenu) {
      //   const contextMenu = this.contextMenuDefault.concat(
      //     this.elementParams.contextMenu
      //   );
      //   console.log(contextMenu);
      //   this.ac_replaceElementAttr({
      //     contextMenu: contextMenu
      //   });
      // } else {
      //   this.ac_replaceElementAttr({
      //     contextMenu: this.contextMenuDefault
      //   });
      // }
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
      this.component = this.elementParams.file.replace(/(.*\/)|.vue/g, "");
      // this.addContextMenu();
    } catch (e) {
      throw new Error(e);
    }
  }
};
</script>
