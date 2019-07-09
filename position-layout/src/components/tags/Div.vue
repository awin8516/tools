<template>
  <div :data-name="element.name" :style="element.style[mediaName]" :class="element.className">
    <slot name="children"></slot>
  </div>
</template>

<script>
export default {
  name: "Div",
  data() {
    return {
      tagName: "div",
      icon: "menu",
      container: true,
      name: "div-1",
      id: "div-1",
      className: "div div-test",
      text: "",
      texting:false,
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
      },
      contextMenu: [
        // {
        //   icon: "el-icon-delete",
        //   name: "编辑文字",
        //   command: ()=>{
        //     console.log(this)
        //   }
        // }
      ]
    };
  },
  props: ["element", "mediaName"],
  mounted(){
    this.element.contextMenu.push({
      icon: "el-icon-delete",
          name: "编辑文字",
          command: ()=>{
            this.element.texting = true
          }
    })
  }
};
</script>
