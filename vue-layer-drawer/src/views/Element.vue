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
    <ElementControls :elementParams.sync="elementParams"></ElementControls>
  </ins>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Tags from "@/components/Tags";
import ElementControls from "@/views/ElementControls.vue";
var components = {};
for (var key in Tags) {
  components[key] = Tags[key];
}
components.ElementControls = ElementControls;
import { closest, getElementWidth } from "@/utils";
export default {
  name: "Element",
  data() {
    return {
      component: null,
      draging: false
    };
  },
  props: ["elementParams"],
  computed: {
    ...mapGetters(["gt_elementList", "gt_mediaName"]),
    innerHTML() {
      return (
        this.elementParams.innerText &&
        this.elementParams.innerText.replace(/\n/g, "<br>")
      );
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
    isAbsolute: function() {
      return this.style.position === "absolute";
    },
    isFixed: function() {
      return this.style.position === "fixed";
    }
  },
  components: components,
  methods: {
    ...mapActions([
      "ac_selectElement",
      "ac_updateElement",
      "ac_updateElementStyle"
    ]),
    contextMenu(e) {
      if (e.target.tagName != "B") {
        // this.$nextTick(() => {
        //   this.$refs.focusFiled.focus();
        // });
        document.querySelector('#context-menu-filed').focus();
        this.ac_updateElement({
          contextMenuPos: {
            left: e.pageX - document.querySelector('#po-main').offsetLeft,
            top: e.pageY - document.querySelector('#po-main').offsetTop
          },
          contextMenuActive: true
        });
      }
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
        this.ac_updateElement({
          contextMenuActive: false
        });
      }, 200);
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
