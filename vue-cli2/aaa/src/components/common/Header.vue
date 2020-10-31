<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="logo">
      <img v-if="logo" :src="logo" />
      {{name}}
    </div>
    <div class="collapse-btn" @click="collapseChage">
      <i v-if="collapse">
        <svg-icon icon-class="fold"></svg-icon>
      </i>
      <i v-else>
        <svg-icon icon-class="fold_other"></svg-icon>
      </i>
    </div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 子账号 -->
        <div class="btn-user" v-if="isAdmin == 0">
          <el-dropdown>
            <span class="el-dropdown-link">
              <span class="btn-user">
                <svg-icon icon-class="user"></svg-icon>
              </span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div class="user">
                  <p>账号：</p>
                  <p>{{form.name}}</p>
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="user" @click="changeUser()">
                  <p>修改个人信息</p>
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="user" @click="navAccount()">
                  <p>子账号管理</p>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="btn-fullscreen" @click="handleFullScreen()">
          <!-- <i class="el-icon-rank"></i> -->
           <svg-icon icon-class="fullscreen" v-if="!fullscreen"></svg-icon>
            <svg-icon icon-class="reduce" v-if="fullscreen"></svg-icon>
        </div>
        <div class="btn-exit" @click="logout()">
          <!-- <i class="el-icon-s-home"></i> -->
          <svg-icon icon-class="home"></svg-icon>
        </div>
      </div>
    </div>

    <el-dialog title="修改账户密码" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="form" label-width="150px" :rules="rules" label-position="left">
        <el-form-item label="账号" prop="name">
          <div class="inputarea">
            <el-input v-model="form.name" disabled="disabled"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="请输入新密码" prop="password">
          <div class="inputarea">
            <el-input v-model="form.password" placeholder="请输入6位密码" minlength="6"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="请再次输入新密码" prop="repassword">
          <div class="inputarea">
            <el-input v-model="form.repassword" placeholder="请重新输入6位密码" minlength="6"></el-input>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close('cancel')">取 消</el-button>
        <el-button type="primary" @click="close('sure')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import bus from "../common/bus";
export default {
  data() {
    return {
      isAdmin: true,
      logo: "",
      name: "",
      collapse: false,
      fullscreen: false,
      exit: false,
      name: "linxin",
      message: 2,
      collapse_btn_icon: "el-icon-s-data",
      form: {
        name: "",
        password: "",
        repassword: ""
      },
      dialogVisible: false,
      labelPosition: "left",
      rules: {
        name: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码不能小于6位", trigger: "blur" }
        ],
        repassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { min: 6, message: "密码不能小于6位", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    if (
      localStorage.getItem("avatar") &&
      localStorage.getItem("avatar") != "null"
    ) {
      this.logo = localStorage.getItem("avatar");
    } else {
    }

    this.name = localStorage.getItem("name") || "";
    this.form.name = localStorage.getItem("account");
    this.isAdmin = localStorage.getItem("pid");
  },
  computed: {
    username() {
      let username = localStorage.getItem("ms_username");
      return username ? username : this.name;
    }
  },
  methods: {
    navAccount() {
      // 子账号管理
      this.$router.push({
        name: "account"
      });
    },
    // 关闭弹窗
    close(type) {
      if (type == "cancel") {
        this.dialogVisible = false;
      } else if (type == "sure") {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.password != this.form.repassword) {
              this.$message.warning("两次密码输入不一致，请重新输入");
              return;
            }
            this.$axios
              .post(this.GLOBAL.BASE_URL + "editmanager", this.form)
              .then(res => {
                if (res.data.code == 0) {
                  this.dialogVisible = false;
                } else {
                  this.$message.error(res.data.message);
                }
              });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    // 退出登录
    logout() {
      window.location.href = this.GLOBAL.DOMAIN;
    },
    // 跳转易货后台
    navHandle() {
      this.$message.success("即将跳转易货后台");
      setTimeout(() => {
        window.location.href = "https://yihuo2.beats-digital.com/admin";
      }, 1000);
    },
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "loginout") {
        localStorage.removeItem("ms_username");
        this.$router.push("/login");
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },

    // 修改个人信息
    changeUser() {
      this.form.password = "";
      this.form.repassword = "";
      this.dialogVisible = true;
    }
  },
  // 回到顶部
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
    window.onresize = () => {
     (
        document.body.scrollHeight == window.screen.height &&
          document.body.scrollWidth == window.screen.width
      ) ? this.fullscreen = true : this.fullscreen = false
    };
  }
};
</script>
<style scoped>
.btn-user {
  margin-right: 10px;
  font-size: 24px;
  cursor: pointer;
}
.header .el-dropdown-link {
  cursor: pointer;
  color: rgb(0, 0, 0);
}
.inputarea {
  width: 200px;
}
.user {
  width: 150px;
  display: flex;
}
/* ------------------ */
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 16px;
  color: #000000;
  border-bottom: solid 1px #e6e6e6;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
  font-size: 20px;
  transition: all 0.2s linear;
}
.header .logo {
  float: left;
  width: 180px;
  display: flex;
  align-items: center;
  height: 70px;
  padding-left: 17px;
  box-sizing: border-box;
  font-size: 14px;
}
.header .logo > img {
  vertical-align: middle;
  width: 30px;
  height: 30px;
  margin-right: 15px;
  flex-shrink: 0;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  margin-right: 5px;
  font-size: 24px;
  cursor: pointer;
}
.btn-fullscreen.url {
  transform: rotate(0deg);
  margin-right: 70px;
  margin-top: -8px;
}
.btn-exit {
  margin-left: 15px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  text-align: center;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}

.btn-exit {
  margin-left: 15px;
  font-size: 24px;
  cursor: pointer;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
