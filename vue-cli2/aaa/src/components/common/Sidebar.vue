<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      text-color="#000"
      active-text-color="red"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <!-- <svg-icon icon-class="edit"></svg-icon> -->
              <i class="menu">
                <svg-icon :icon-class="item.icon"></svg-icon>
              </i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem,i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >{{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                <i class="whitespace"></i>
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i class="menu">
              <svg-icon :icon-class="item.icon"></svg-icon>
            </i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../common/bus";
export default {
  data() {
    return {
      collapse: false,
      items: this.$store.state.menu,
      status: 1
    };
  },
  computed: {
    // menu事件
    onRoutes() {
      let name = this.$route.name;
      return name;
    }
  },
  created() {
    if (localStorage.getItem("menu")) {
      this.items = JSON.parse(localStorage.getItem("menu"));
    }
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
    bus.$on("showMenuList", menuLIst => {
      this.items = menuLIst;
    });
  },

  methods: {}
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 69px;
  bottom: 0;
  overflow-y: scroll;
  background: #fff;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 200px;
}
.sidebar > ul {
  height: 100%;
}
.whitespace {
  display: inline-block;
  width: 8px;
}
.menu{
  margin: 0 1em 0 0 ;
}

.menu .svg-icon{
  color: inherit;
}

/* .is-active .menu .svg-icon{
  color: red;
} */
/* .is-opened .menu .svg-icon{
  color: red;
} */
</style>
