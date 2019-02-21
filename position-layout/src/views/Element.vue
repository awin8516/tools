<template>
  <div class="po-el-item" :style="'left:'+paramsLocal.style.left+';top:'+paramsLocal.style.top+';'" @mousedown="draging = true" @mouseup="draging = false" @mousemove="mouseMove" @contextmenu.prevent="contextMenu">
    <template v-if="paramsLocal.type === 'div'">
      <div :style="createStyle()"></div>
    </template>
    <template v-if="paramsLocal.type === 'image'">
      <img :style="createStyle()" :src="paramsLocal.src">
    </template>
    <div v-show="contextMenuActive && paramsLocal.selected" :title="paramsLocal.selected" class="context-menu" :style="'left:'+contextMenuPos.left+'px;top:'+contextMenuPos.top+'px'">
      <ul>
        <li v-for="(item, index) in contextMenuList[paramsLocal.type]" :key="index" @click="item.command"><i :class='item.icon'></i>{{item.name}}</li>
      </ul>
      <input class="focus-filed" ref="focusFiled" @blur="contextMenuActive = false" type="test">
    </div>
  </div>
</template>

<script>
export default {
  name: "Element",
  data() {
    return {
      paramsLocal: {
        selected: false
      },
      draging: false,
      contextMenuList: {
        div: [
          {
            icon: 'el-icon-delete',
            name: '删除',
            command: () => {
              this.$parent.deleteElement(this.$parent.active)
              this.contextMenuActive = false
            }
          },
          {
            icon: 'el-icon-upload2',
            name: '上移一层',
            command: () => {
              if (this.$parent.active < this.$parent.elementList.length - 1) {
                this.updateLayer(this.$parent.active, 1)
              }
              this.contextMenuActive = false
            }
          },
          {
            icon: 'el-icon-download',
            name: '下移一层',
            command: () => {
              if (this.$parent.active > 0) {
                this.updateLayer(this.$parent.active, -1)
              }
              this.contextMenuActive = false
            }
          }
        ],
        image: [
          {
            icon: 'el-icon-delete',
            name: '删除',
            command: () => {
              this.$parent.deleteElement(this.$parent.active)
              this.contextMenuActive = false
            }
          },
          {
            icon: 'el-icon-upload2',
            name: '上移一层',
            command: () => {
              if (this.$parent.active < this.$parent.elementList.length - 1) {
                this.updateLayer(this.$parent.active, 1)
              }
              this.contextMenuActive = false
            }
          },
          {
            icon: 'el-icon-download',
            name: '下移一层',
            command: () => {
              if (this.$parent.active > 0) {
                this.updateLayer(this.$parent.active, -1)
              }
              this.contextMenuActive = false
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
  props: ["params"],
  methods: {
    createStyle() {
      return JSON.stringify(this.paramsLocal.style)
        .replace("{", "")
        .replace("}", "")
        .replace(/"/g, "")
        .replace(/,/g, ";");
    },
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
    updateLayer(index, act) {
      let a = this.$parent.elementList[index]
      let b = this.$parent.elementList[index + act]
      this.$parent.elementList[index] = b
      this.$parent.elementList[index + act] = a
      this.$parent.active = index + act
    }
  },
  filters: {
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  created() {
    let defaultParams = {
      vid: new Date().getTime(),
      className: ['el', 'el-a'],
      style: {
        "left": 0,
        "top": 0,
        "width": "100px",
        "height": "100px",
        "background-image": "url()",
        "background-color": "#eee",
        "background-repeat": "no-repeat",
        "background-size": "100% auto",
        "background-position": "left top"
      }
    };
    if (this.params.type === "image") {
      defaultParams.src = require("@/assets/img.jpg");
    }
    this.paramsLocal = Object.assign(defaultParams, this.params);
    this.$emit("update:params", this.paramsLocal);
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