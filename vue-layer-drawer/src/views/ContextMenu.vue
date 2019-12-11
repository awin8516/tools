<template>
  <div v-show="gt_elementSelected && gt_elementSelected.selected && gt_elementSelected.contextMenuActive" class="po-context-menu" :style="contextMenuStyle">
    <ul>
      <li v-for="(item, index) in contextMenuList" :key="index" @click="command(item)"><i :class='item.icon'></i>{{item.label}}</li>
    </ul>
    <input id="context-menu-filed" class="focus-filed" ref="focusFiled" @blur="hideMenu" type="text">
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "ContextMenu",
  data() {
    return {
      contextMenuDefault: [
        {
          icon: "el-icon-upload2",
          label: "上移一层",
          command: "zindexMoveUp"
        },
        {
          icon: "el-icon-download",
          label: "下移一层",
          command: "zindexMoveDown"
        },
        {
          icon: "el-icon-upload2",
          label: "置为顶层",
          command: "zindexMoveTop"
        },
        {
          icon: "el-icon-download",
          label: "置为底层",
          command: "zindexMoveBottom"
        },
        {
          icon: "el-icon-delete",
          label: "删除",
          command: "delete"
        }
      ]
    };
  },
  computed: {
    ...mapGetters([
      "gt_elementList",
      "gt_indexSelected",
      "gt_elementSelected"
    ]),
    contextMenuList() {
      var tagMenu = this.gt_elementSelected
        ? this.gt_elementSelected.contextMenuList
        : [];
      var menu = Object.assign([], this.contextMenuDefault);
      tagMenu.forEach(element => {
        if (element.sort !== undefined) {
          menu.splice(element.sort - 1, 0, element);
        } else {
          menu.push(element);
        }
      });
      return menu;
    },
    contextMenuStyle() {
      let contextMenuPos = {
        left: 0,
        top: 0
      };
      return this.gt_elementSelected && this.gt_elementSelected.contextMenuPos
        ? {
            left: this.gt_elementSelected.contextMenuPos.left + "px",
            top: this.gt_elementSelected.contextMenuPos.top + "px"
          }
        : {
            left: 0,
            top: 0
          };
    }
  },
  methods: {
    ...mapActions([
      "ac_deleteElement",
      "ac_updateElementLayer",
      "ac_updateElement"
    ]),
    zindexMoveUp() {
      if (this.gt_indexSelected < this.gt_elementList.length - 1) {
        this.ac_updateElementLayer(1);
      }
    },
    zindexMoveDown() {
      if (this.gt_indexSelected > 0) {
        this.ac_updateElementLayer(-1);
      }
    },
    zindexMoveTop() {
      if (this.gt_indexSelected < this.gt_elementList.length - 1) {
        this.ac_updateElementLayer(1000);
      }
    },
    zindexMoveBottom() {
      if (this.gt_indexSelected > 0) {
        this.ac_updateElementLayer(-1000);
      }
    },
    delete() {
      this.ac_deleteElement(this.gt_elementSelected);
    },
    editInnerText() {
      this.ac_updateElement({ editing: true });
    },
    command(item) {
      this[item.command]();
      this.hideMenu();
    },
    hideMenu() {
      this.ac_updateElement({
        contextMenuActive: false
      });
    }
  }
};
</script>
