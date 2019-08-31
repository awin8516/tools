
<script>
import { registerContextMenu } from "@/utils";
export default {
  name: "Div",
  data() {
    return {
      type: "div",
      tagName: "div",
      icon: "level",
      container: true,
      // name: "div-1",
      innerText: "",
      editing: false,
      tagSort: 1000,
      // children:[],
      className: "div div-test",
      attribute: {
        id: "div-1",
        "data-name": "div-1"
      },
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
          color: "",
          "background-image": "url()",
          "background-color": "#eee",
          "background-repeat": "no-repeat",
          "background-size": "100% auto",
          "background-position": "left top"
        }
      }
    };
  },
  // render: function(createElement) {
  //   return createElement(
  //     "div", // 标签名称
  //     {
  //       class: this.element.attribute.className,
  //       style: this.element.style[this.$parent.gt_mediaName],
  //       attrs: {
  //         id: this.element.attribute.id,
  //         "data-name": this.element.name
  //       }
  //     },
  //     [
  //       // 子节点数组
  //       this.$slots.innerText,
  //       this.$slots.children
  //     ]
  //   );
  // },
  props: ["element"],
  mounted() {
    registerContextMenu(this, {
      name: "cm_editInnerText",
      icon: "el-icon-delete",
      label: "编辑文字",
      sort: 4,
      command: () => {
        this.$parent.ac_updateElement({ editing: true });
      }
    });
  }
};
</script>
