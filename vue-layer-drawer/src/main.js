import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import { closest } from "@/utils";

import {
  // Checkbox,
  Input,
  Select,
  Option,
  Switch,
  Button,
  // ButtonGroup,
  // Alert,
  Icon,
  Loading,
  ColorPicker,
  MessageBox,
  Message
} from "element-ui";
import '@/icons' // icon
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/index.scss";

Vue.config.productionTip = false;
Vue.use(Input);
Vue.use(Button);
Vue.use(Select);
Vue.use(Option);
Vue.use(Switch);
Vue.use(Icon);
Vue.use(ColorPicker);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$message = Message;
Vue.directive("drag", {
  bind: function (el, binding) {
    let handler = function (e) {
      let argElement = closest(e.target, '.' + binding.arg);
      const clearEvent = () => {
        argElement && argElement.classList.remove("v-draging");
        document.onmousemove = null;
        document.onmouseup = null;
      };
      if (binding.arg && argElement) {
        if (e.button == 0) {
          setTimeout(function () {
            argElement.classList.add("v-draging");
          }, 10);

          const position = argElement.style.position;
          const posKey =
            position == "absolute" || position == "fixed"
              ? {
                ox: "offsetLeft",
                oy: "offsetTop",
                x: "left",
                y: "top"
              }
              : {
                ox: "marginLeft",
                oy: "marginTop",
                x: "marginLeft",
                y: "marginTop"
              };


          ['img', 'textarea'].includes(e.target.tagName.toLowerCase()) && e.preventDefault();
          let posStart
          switch (position) {
            case 'absolute':
              posStart = {
                left:
                  argElement.offsetLeft -
                  (parseInt(argElement.style.marginLeft) || 0),
                top:
                  argElement.offsetTop -
                  (parseInt(argElement.style.marginTop) || 0)
              }
              break;
            case 'fixed':
              posStart = {
                left:
                  argElement.offsetLeft -
                  (parseInt(argElement.style.marginLeft) || 0),
                top:
                  argElement.offsetTop -
                  (parseInt(argElement.style.marginTop) || 0)
              }
              break;
            default:
              posStart = {
                left: parseInt(argElement.style.marginLeft) || 0,
                top: parseInt(argElement.style.marginTop) || 0
              }
          }
          let clientStart = {
            x: e.clientX,
            y: e.clientY
          };
          if (!['textarea'].includes(e.target.tagName.toLowerCase())) {
            document.onmousemove = e => {
              //用鼠标位移量
              let clientEnd = {
                x: e.clientX - clientStart.x,
                y: e.clientY - clientStart.y
              };
              //元素最终Left top
              let posEnd = {
                left: posStart.left + clientEnd.x,
                top: posStart.top + clientEnd.y
              };

              let maxLeft = el.clientWidth - argElement.clientWidth;
              let maxTop = el.clientHeight - argElement.clientHeight;

              if (position == "absolute" || position == "fixed") {
                posEnd.left =
                  posEnd.left < 0
                    ? 0
                    : posEnd.left > maxLeft
                      ? maxLeft
                      : posEnd.left;
                posEnd.top =
                  posEnd.top < 0 ? 0 : posEnd.top > maxTop ? maxTop : posEnd.top;
              }

              //移动当前元素
              argElement.style[posKey.x] = posEnd.left + "px";
              argElement.style[posKey.y] = posEnd.top + "px";
              binding.value && binding.value(argElement, clientEnd);
            };
          }
          document.onmouseup = clearEvent
        }
      } else if (binding.value) {
        if (e.target === el) {
          e.preventDefault();
          //算出鼠标相对元素的位置
          let clientStart = {
            x: e.clientX,
            y: e.clientY
          };
          document.onmousemove = e => {
            //用鼠标位移量
            let clientEnd = {
              x: e.clientX - clientStart.x,
              y: e.clientY - clientStart.y
            };
            binding.value && binding.value(el, clientEnd);
          };
          document.onmouseup = clearEvent
        }
      }
    };
    el.removeEventListener("mousedown", handler);
    el.addEventListener("mousedown", handler);
  }
});
Vue.directive("range", {
  bind: function (_el, binding, vnode) {
    let el = _el.type ? _el : _el.querySelector("input");
    el.onmousedown = e => {
      //算出鼠标相对元素的位置
      let disY = e.clientY;
      let value = parseInt(el.value) || 0;
      let getKey = (obj, keyStr) => {
        let keyArr = keyStr.split(".");
        let o = obj;
        keyArr.forEach(key => {
          o = o[key];
        });
        return o;
      };
      let obj = getKey(vnode.context, binding.value.val);
      document.onmousemove = e => {
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let top = e.clientY - disY;
        el.value = value + top + "px";
        if (binding.value.index || binding.value.key) {
          obj[binding.value.index || binding.value.key] = el.value;
        } else {
          if (binding.value.val.indexOf(".") !== -1) {
            obj = el.value;
          } else {
            vnode.context[binding.value.val] = el.value;
          }
        }
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }
});

Vue.directive('focus', function (el, binding) {
  if (binding.value) {
    el.focus()
  } else {
    el.blur()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
