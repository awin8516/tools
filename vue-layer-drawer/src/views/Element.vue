<script>
import { mapGetters, mapActions } from "vuex";
// import * as Tags from "@/components/Tags";
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
  render: function(createElement) {
    return createElement(
      this.elementParams.tagName, // 标签名称
      {
        class: this.elementParams.className,
        style: this.elementParams.style[this.gt_mediaName],
        attrs: this.elementParams.attribute
      },
      [
        // 子节点数组
        this.$slots.innerText,
        this.$slots.children
      ]
    );
  },
  props: ["elementParams"],
  computed: {
    ...mapGetters([
      "gt_elementList",
      "gt_mediaName",
      "gt_indexSelected",
      "gt_contextMenu"
    ]),
    style() {
      return this.elementParams.style[this.gt_mediaName];
    }
  },
  // components: Tags,
  methods: {
    ...mapActions([
      "ac_selectElement",
      "ac_deleteElement",
      "ac_updateElementLayer",
      "ac_updateElement",
      "ac_updateElementStyle"
    ])
  },
  mounted() {
    // try {
    //   this.component = this.elementParams.file.replace(/(.*\/)|.vue/g, "");
    // } catch (e) {
    //   throw new Error(e);
    // }
  }
};
</script>
