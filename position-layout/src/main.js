import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';

import {
  Checkbox,
  Input,
  Select,
  Option,
  Button,
  ButtonGroup,
  Alert,
  Icon,
  Loading,
  MessageBox,
  Message
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/index.scss';

Vue.config.productionTip = false;
Vue.use(Input);
Vue.use(Button);
Vue.use(Select);
Vue.use(Option);
Vue.use(Icon);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$message = Message;
Vue.directive('drag', {
  bind: function (el, binding, vnode) {
    let handler = function (e) {
      let parentEl = e.target.parentElement;
      if (binding.arg) {
        if (parentEl.classList.contains(binding.arg) && e.button == 0) {
          setTimeout(function () {
            parentEl.classList.add('v-draging');
          }, 10);

          const position = parentEl.style.position;
          console.log(position)
          const posKey = position == 'absolute' || position == 'fixed' ?
            {
              ox: 'offsetLeft',
              oy: 'offsetTop',
              x: 'left',
              y: 'top'
            } : {
              ox: 'marginLeft',
              oy: 'marginTop',
              x: 'marginLeft',
              y: 'marginTop'
            }

          e.preventDefault();
          let posStart = position == 'absolute' || position == 'fixed' ? {
            left: parentEl.offsetLeft - (parseInt(parentEl.style.marginLeft) || 0),
            top: parentEl.offsetTop - (parseInt(parentEl.style.marginTop) || 0)
          } : {
              left: parseInt(parentEl.style.marginLeft) || 0,
              top: parseInt(parentEl.style.marginTop) || 0
            };
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
            //元素最终Left top
            let posEnd = {
              left: posStart.left + clientEnd.x,
              top: posStart.top + clientEnd.y
            };

            let maxLeft = el.clientWidth - parentEl.clientWidth;
            let maxTop = el.clientHeight - parentEl.clientHeight;

            if (position == 'absolute' || position == 'fixed') {
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
            parentEl.style[posKey.x] = posEnd.left + 'px';
            parentEl.style[posKey.y] = posEnd.top + 'px';
            binding.value && binding.value(parentEl, clientEnd);
          };
          document.onmouseup = () => {
            parentEl.classList.remove('v-draging');
            document.onmousemove = null;
            document.onmouseup = null;
          };
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
          document.onmouseup = () => {
            parentEl.classList.remove('v-draging');
            document.onmousemove = null;
            document.onmouseup = null;
          };
        }
      }
    };
    el.removeEventListener('mousedown', handler);
    el.addEventListener('mousedown', handler);
  }
});
Vue.directive('range', {
  bind: function (_el, binding, vnode) {
    let el = _el.type ? _el : _el.querySelector('input');
    el.onmousedown = e => {
      //算出鼠标相对元素的位置
      let disY = e.clientY;
      let value = parseInt(el.value) || 0;
      let getKey = (obj, keyStr) => {
        let keyArr = keyStr.split('.');
        let o = obj;
        keyArr.forEach((key, index) => {
          o = o[key];
        });
        return o;
      };
      let obj = getKey(vnode.context, binding.value.val);
      document.onmousemove = e => {
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let top = e.clientY - disY;
        el.value = value + top + 'px';
        if (binding.value.index || binding.value.key) {
          obj[binding.value.index || binding.value.key] = el.value;
        } else {
          if (binding.value.val.indexOf('.') !== -1) {
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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
