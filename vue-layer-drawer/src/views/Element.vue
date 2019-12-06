<template>
  <ins class="po-el-item" :data-vid="elementParams.vid" :data-pid="elementParams.pid" :class="[style.position,'type-'+elementParams.type,{'active':elementParams.selected}]" :style="itemStyle" @mousedown="mouseDown" @mouseup="draging = false" @mousemove="mouseMove" @contextmenu.prevent="contextMenu">
    <component :is="component" :element="elementParams">
      <template slot="innerText">
        {{innerHTML}}
      </template>
      <template v-for="item in gt_elementList" slot="children">
        <Element v-if="item.pid == elementParams.vid" :key="item.vid" :data-vid="item.vid" :class="{'active':item.selected}" :elementParams.sync="item"></Element>
      </template>
    </component>
    <mark class="po-el-controls">
      <div v-show="contextMenuActive && elementParams.selected" class="context-menu" :style="contextMenuStyle">
        <ul>
          <li v-for="(item, index) in contextMenuList2" :key="index" @click="item.command(),contextMenuActive = false"><i :class='item.icon'></i>{{item.label}}</li>
        </ul>
        <input class="focus-filed" ref="focusFiled" @blur="hideMenu" type="text">
      </div>
      <div v-show="elementParams.editing" class="textarea">
        <textarea v-focus="elementParams.editing" placeholder="编辑文字" @blur="updateText" :value="innerText"></textarea>
      </div>
      <div class="resize-group">
        <s></s>
        <s></s>
        <s></s>
        <s></s>
        <b class="resize-width" v-drag="resizeWidth" @mousedown.stop="getSize"></b>
        <b class="resize-height" v-drag="resizeHeight" @mousedown.stop="getSize"></b>
        <b class="resize-all" v-drag="resize" @mousedown.stop="getSize"></b>
        <i class="resize-rotate el-icon-refresh" v-drag="resizeRotate" @mousedown.stop="getSize"></i>
      </div>
    </mark>
  </ins>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import * as Tags from "@/components/Tags";
import {
  closest,
  getElementWidth,
  getElementHeight,
  getTransform
} from "@/utils";
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
      contextMenuList: [
        {
          name: "cm_zindexMoveUp",
          icon: "el-icon-upload2",
          label: "上移一层",
          command: () => {
            if (this.gt_indexSelected < this.gt_elementList.length - 1) {
              this.ac_updateElementLayer(1);
            }
          }
        },
        {
          name: "cm_zindexMoveDown",
          icon: "el-icon-download",
          label: "下移一层",
          command: () => {
            if (this.gt_indexSelected > 0) {
              this.ac_updateElementLayer(-1);
            }
          }
        },
        {
          name: "cm_zindexMoveTop",
          icon: "el-icon-upload2",
          label: "置为顶层",
          command: () => {
            if (this.gt_indexSelected < this.gt_elementList.length - 1) {
              this.ac_updateElementLayer(1000);
            }
          }
        },
        {
          name: "cm_zindexMoveBottom",
          icon: "el-icon-download",
          label: "置为底层",
          command: () => {
            if (this.gt_indexSelected > 0) {
              this.ac_updateElementLayer(-1000);
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
    innerHTML() {
      return this.elementParams.innerText && this.elementParams.innerText.replace(/\n/g, "<br>");
      // return 'DFASDFASDF'
    },
    style() {
      return this.elementParams.style[this.gt_mediaName];
    },
    itemStyle: function() {
      let styleObject = {};
      const styleOptions = {
        fixed: [
          "position",
          "left",
          "top",
          "right",
          "bottom",
          "margin",
          "margin-top",
          "margin-right",
          "margin-bottom",
          "margin-left",
          "transform"
        ],
        absolute: [
          "position",
          "left",
          "top",
          "right",
          "bottom",
          "margin",
          "margin-top",
          "margin-right",
          "margin-bottom",
          "margin-left",
          "transform"
        ],
        relative: [
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
          "margin-left",
          "transform"
        ]
      };
      const done = position => {
        // console.log(position)
        position = position || "relative";
        styleOptions[position].forEach(v => {
          if (typeof this.style[v] !== "undefined") {
            // console.log(v+"--"+this.style[v])
            if (position == "fixed") {
              // console.log("-------------------fixed--------------------")
              if (v == "left" || v == "top") {
                const rect =
                  document.querySelector("#po-screen").getBoundingClientRect()[
                    v
                  ] + "px";
                styleObject[v] = (parseInt(this.style[v]) || 0) + rect;
                styleObject.display = "inline-block";
              }
            } else if (position == "absolute") {
              // console.log("-------------------absolute--------------------")
              styleObject[v] = this.style[v];
              styleObject.display = "inline-block";
            } else if (position == "relative") {
              // console.log("-------------------relative--------------------")
              // console.log(v+"--"+this.style[v])
              if (v == "width") {
                // const padding =
                //   (parseInt(this.style["padding-left"]) || 0) +
                //   (parseInt(this.style["padding-right"]) || 0);
                if (this.style[v] == "auto") {
                  styleObject[v] = this.style[v];
                } else {
                  styleObject.display = "inline-block";
                  // styleObject[v] =( parseInt(getElementWidth('[data-vid="' + this.elementParams.vid + '"] > *:first-child')) || 0 ) +'px'
                }
              } else {
                styleObject[v] = this.style[v];
              }
            } else {
              // console.log("-------------------else--------------------")
              styleObject[v] = this.style[v];
            }
          }
        });
      };
      done(this.style.position);
      // console.log(styleObject)
      return styleObject;

      // const style = [
      //   "position",
      //   "width",
      //   "left",
      //   "top",
      //   "right",
      //   "bottom",
      //   "margin",
      //   "margin-top",
      //   "margin-right",
      //   "margin-bottom",
      //   "margin-left",
      //   "transform"
      // ];
      // style.forEach(v => {
      //   if (typeof this.style[v] !== "undefined") {
      // if (v == "width") {
      //   if (this.style.position == "relative") {
      //     const padding =
      //       (parseInt(this.style["padding-left"]) || 0) +
      //       (parseInt(this.style["padding-right"]) || 0);
      //     if (this.style[v] == "auto") {
      //       styleObject[v] = this.style[v];
      //     } else {
      //       styleObject[v] =
      //         (parseInt(this.style[v]) || 0) + padding + "px";
      //     }
      //   }
      // } else if (v == "left" && this.style.position == "fixed") {
      //   styleObject[v] =
      //     (parseInt(this.style[v]) || 0) +
      //     document.querySelector("#po-screen").getBoundingClientRect()
      //       .left +
      //     "px";
      // } else if (v == "top" && this.style.position == "fixed") {
      //   styleObject[v] =
      //     (parseInt(this.style[v]) || 0) +
      //     document.querySelector("#po-screen").getBoundingClientRect().top +
      //     "px";
      // } else {
      //   styleObject[v] = this.style[v];
      // }
      // if (this.style.position == "fixed") {
      //   if (v == "left" || v == "top") {
      //     const rect =
      //       document.querySelector("#po-screen").getBoundingClientRect()[
      //         v
      //       ] + "px";
      //     styleObject[v] = (parseInt(this.style[v]) || 0) + rect;
      //   }
      // } else if (this.style.position == "absolute") {
      // } else if (v == "top" && this.style.position == "relative") {
      // } else {
      // }
      //   }
      // });
      // return styleObject;
    },
    contextMenuStyle() {
      let style = {
        left: this.contextMenuPos.left + "px",
        top: this.contextMenuPos.top + "px"
      };
      if (this.style.transform) {
        const rotate = getTransform(this.style, "rotate");
        style.transform = "rotate(" + -rotate + "deg)";
      }
      return style;
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
    },
    contextMenuList2() {
      if (this.style.position == "absolute") {
        if (this.contextMenuList.every(v => v.name !== "cm_align")) {
          this.contextMenuList.push({
            name: "cm_align",
            icon: "el-icon-download",
            label: "对齐",
            command: () => {
              if (this.gt_indexSelected > 0) {
                this.ac_updateElementLayer(-1);
              }
            }
          });
        }
      } else {
        const index = this.contextMenuList.findIndex(v => v.name == "cm_align");
        index >= 0 && this.contextMenuList.splice(index, 1);
      }
      return this.contextMenuList;
    }
  },
  components: Tags,
  methods: {
    ...mapActions([
      "ac_selectElement",
      "ac_deleteElement",
      "ac_updateElementLayer",
      "ac_updateElement",
      "ac_updateElementStyle"
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
        this.ac_updateElementStyle(style);
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
            height: parseInt(this.style.height) || 0,
            rotate: getTransform(this.style, "rotate")
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
              ) || 0,
            rotate: getTransform(this.style, "rotate")
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
      this.ac_updateElementStyle(style);
    },
    resizeWidth(el, data) {
      this.ac_updateElementStyle({ width: this.size.width + data.x + "px" });
    },
    resizeHeight(el, data) {
      this.ac_updateElementStyle({ height: this.size.height + data.y + "px" });
    },
    resizeRotate(el, data) {
      this.ac_updateElementStyle({
        transform: "rotate(" + (this.size.rotate + data.y) + "deg)"
      });
    },
    updateText(e) {
      this.ac_updateElement({
        innerText: e.target.value,
        editing: false,
        vid: this.elementParams.vid
      });
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
    } catch (e) {
      throw new Error(e);
    }
  }
};
</script>
