<template>
  <section class="po-el-item" :style="'left:'+paramsLocal.style.left+';top:'+paramsLocal.style.top+';'" @mousedown="draging = true" @mouseup="draging = false" @mousemove="mouseMove" @contextmenu.prevent="contextMenu">
    <component :is="element" :element="paramsLocal"></component>
    <div v-show="contextMenuActive && paramsLocal.selected" class="context-menu" :style="'left:'+contextMenuPos.left+'px;top:'+contextMenuPos.top+'px'">
      <ul>
        <li v-for="(item, index) in contextMenuList[paramsLocal.tagName]" :key="index" @click="item.command(),contextMenuActive = false"><i :class='item.icon'></i>{{item.name}}</li>
      </ul>
      <input class="focus-filed" ref="focusFiled" @blur="hideMenu" type="test">
    </div>
    <div class="resize" v-drag="resize" @mousedown="getSize"></div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { object2style, deepClone } from "@/utils";
export default {
  name: "Element",
  data() {
    return {
      element: null,
      draging: false,
      size: {
        width: 0,
        height: 0
      },
      contextMenuList: {
        div: [
          {
            icon: 'el-icon-delete',
            name: '删除',
            command: () => {
              this.deleteElement(this.currentIndex)
            }
          },
          {
            icon: 'el-icon-upload2',
            name: '上移一层',
            command: () => {
              if (this.currentIndex < this.elementList.length - 1) {
                this.updateLayer(1)
              }
            }
          },
          {
            icon: 'el-icon-download',
            name: '下移一层',
            command: () => {
              if (this.currentIndex > 0) {
                this.updateLayer(-1)
              }
            }
          },
          {
            icon: 'el-icon-upload2',
            name: '置为顶层',
            command: () => {
              if (this.currentIndex < this.elementList.length - 1) {
                this.updateLayer(1000)
              }
            }
          },
          {
            icon: 'el-icon-download',
            name: '置为底层',
            command: () => {
              if (this.currentIndex > 0) {
                this.updateLayer(-1000)
              }
            }
          }
        ],
        img: [
          {
            icon: 'el-icon-delete',
            name: '删除',
            command: () => {
              this.deleteElement(this.currentIndex)
            }
          },
          {
            icon: 'el-icon-upload2',
            name: '上移一层',
            command: () => {
              if (this.currentIndex < this.elementList.length - 1) {
                this.updateLayer(1)
              }
            }
          },
          {
            icon: 'el-icon-download',
            name: '下移一层',
            command: () => {
              if (this.currentIndex > 0) {
                this.updateLayer(-1)
              }
            }
          },
          {
            icon: 'el-icon-upload2',
            name: '置为顶层',
            command: () => {
              if (this.currentIndex < this.elementList.length - 1) {
                this.updateLayer(1000)
              }
            }
          },
          {
            icon: 'el-icon-download',
            name: '置为底层',
            command: () => {
              if (this.currentIndex > 0) {
                this.updateLayer(-1000)
              }
            }
          }
        ]
      },
      contextMenuActive: false,
      contextMenuPos: {
        left: 0,
        top: 0
      }
    };
  },
  props: ["currentIndex"],
  computed: {
    ...mapState(['elementList']),
    paramsLocal: function () {
      return this.elementList[this.currentIndex]
    },
    style: function () {
      return object2style(this.paramsLocal.style)
    }
  },
  methods: {
    ...mapActions(['setElementList', 'deleteElement', 'updateLayer']),
    contextMenu(e) {
      this.contextMenuActive = true
      this.contextMenuPos = {
        left: e.offsetX,
        top: e.offsetY
      }
      this.$nextTick(() => {
        this.$refs.focusFiled.focus()
      })
    },
    mouseMove(e) {
      if (this.draging) {
        this.paramsLocal.style.left = e.currentTarget.style.left;
        this.paramsLocal.style.top = e.currentTarget.style.top;
      }
    },
    hideMenu() {
      setTimeout(() => {
        this.contextMenuActive = false
      }, 200)
    },
    getSize() {
      this.size = {
        width: parseInt(this.paramsLocal.style.width),
        height: parseInt(this.paramsLocal.style.height)
      }
    },
    resize(el, data) {
      let _Element = deepClone(this.paramsLocal)
      _Element.style.width = this.size.width + data.x + 'px';
      _Element.style.height = this.size.height + data.y + 'px';
      const _Elementlist = deepClone(this.elementList)
      _Elementlist[this.currentIndex] = _Element
      this.setElementList(_Elementlist)
    }
  },
  filters: {
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  mounted() {
    const path = this.elementList[this.currentIndex].file.replace('src/', '')
    this.element = () => import('@/'+path);
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