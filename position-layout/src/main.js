import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import {
  Checkbox,
  Select,
  Button,
  ButtonGroup,
  Alert,
  Icon,
  Loading,
  MessageBox,
  Message
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'

Vue.config.productionTip = false
Vue.use(Button)
Vue.use(Icon)
Vue.prototype.$loading = Loading.service
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$message = Message
Vue.directive('drag', {
  bind: function(el, binding, vnode) {},
  componentUpdated: function(el, binding, vnode) {
    let child = Array.from(el.children) //获取当前元素
    child.forEach(odiv => {
      odiv.onmousedown = e => {
        //算出鼠标相对元素的位置
        let disX = e.clientX - odiv.offsetLeft
        let disY = e.clientY - odiv.offsetTop

        document.onmousemove = e => {
          //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          let left = e.clientX - disX
          let top = e.clientY - disY

          let maxLeft = el.clientWidth - odiv.clientWidth
          let maxTop = el.clientHeight - odiv.clientHeight

          left = left < 0 ? 0 : left > maxLeft ? maxLeft : left
          top = top < 0 ? 0 : top > maxTop ? maxTop : top

          //绑定元素位置到positionX和positionY上面
          odiv.positionX = top
          odiv.positionY = left

          //移动当前元素
          odiv.style.left = left + 'px'
          odiv.style.top = top + 'px'
        }
        document.onmouseup = e => {
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    })
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
