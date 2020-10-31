<template>
  <div class="table">
    <div class="crumbs">
      <h2>权限管理</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button
          type="success"
          icon="el-icon-back"
          class="handle-del mr10"
          @click="back()"
        >返回子账号列表</el-button>
        <div style="display:inline-block;width:200px">
          <el-button
            type="primary"
            icon="el-icon-setting"
            class="handle-del mr10"
            @click="save()"
          >保存修改</el-button>
        </div>
      </div>
      <div class="line"></div>
      <div class="info">
        <div class="level1">
          <div
            class="accounts"
            v-for="(item,index) in accounts"
            :key="index"
            @click="getChild(item)"
            :class="{active: isbackground == item.id}"
          >{{item.name}}</div>
        </div>
        <div class="level2">
          <div class="childAccount" v-for="(item,index) in childAccount" :key="index">
            <el-checkbox
              v-model="item.checked"
              @change="changeTools(item,index)"
            >{{item.menu.title}}</el-checkbox>
          </div>
        </div>
        <div class="level3">
          <div class="tools" v-for="(item,index) in childAccount" :key="index">
            <div v-for="(list,idx) in item.type" :key="idx" class="toollist">
              <el-checkbox
                v-model="list.status"
                :disabled="list.disabled == 'on' ? false : true"
                @change="getType(list,index,idx)"
              >{{showType(list.type)}}</el-checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkList: "",
      activeName: "second",
      tabPosition: "left",
      accounts: [],
      childAccount: [],
      // 用来显示左侧蓝色背景
      isbackground: "",
      menu: [],
      menuObj: {
        id: "",
        appid: "",
        menus: []
      },
      accoundId: 0
    };
  },
  created() {
    this.childpermission();
  },
  methods: {
    save() {
      let menus = [];
      this.childAccount.forEach((ele, index) => {
        if (ele.checked) {
          var obj = {};
          obj.menu_id = ele.menu.id;
          obj.type = ele.type;
          menus.push(obj);
        }
      });
      for (let i = 0; i < menus.length; i++) {
        menus[i].types = [];
        for (let j = 0; j < menus[i].type.length; j++) {
          if (menus[i].type[j].pitch == "on") {
            menus[i].types.push(menus[i].type[j].type);
          }
        }
      }
      menus.forEach(ele => {
        ele.type = ele.types;
        delete ele.types;
      });

      let flag = true;
      menus.forEach((ele, index) => {
        if (!ele.type.length) {
          flag = false;
          this.$message.warning("菜单的选项不能为空");
        }
      });

      this.menus = menus;

      if (flag) {
        this.savechildpermission();
      }
    },
    savechildpermission() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "savechildpermission", {
          id: Number(window.atob(localStorage.getItem("pid"))),
          appid: this.menuObj.appid,
          menus: this.menus
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.$message.success("修改成功");
            this.childpermission();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    getType(item, index, idx) {
      if (item.pitch == "on") {
        item.pitch = "off";
      } else [(item.pitch = "on")];
    },
    changeTools(item, index) {
      let flag;
      this.childAccount[index].type.forEach(ele => {
        if (ele.disabled == "on") {
          // 不勾选
          ele.disabled = "off";
          ele.pitch = "on";
          flag = false;
        } else {
          // 选中
          ele.disabled = "on";
          ele.pitch = "off";
          flag = true;
        }
      });

      if (flag) {
      } else {
      }
    },
    showType(type) {
      switch (type) {
        case 1:
          return "显示";
        case 2:
          return "添加";
        case 3:
          return "修改";
        case 4:
          return "删除";
        case 5:
          return "其他";
      }
    },
    back() {
      localStorage.removeItem("pid");
      this.$router.push({
        name: "account"
      });
    },
    childpermission() {
      this.loading = true;
      this.$axios.post(this.GLOBAL.BASE_URL + "getmanagerapp").then(res => {
        this.loading = false;
        if (res.data.code == 0) {
          this.accounts = res.data.data;
          this.getChild(this.accounts[0]);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    getChild(item) {
      this.menus = [];
      this.menuObj = item;
      this.isbackground = item.id;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "chilpermission", {
          appid: item.appid,
          id: Number(window.atob(localStorage.getItem("pid")))
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.childAccount = res.data.data;

            // 添加一个状态
            this.childAccount.forEach((ele, index, arr) => {
              ele.menu.checked = false;
            });
            this.childAccount.forEach((ele, index, arr) => {
              this.$set(ele, "checked", false);
            });

            for (var i = 0; i < this.childAccount.length; i++) {
              if (this.childAccount[i].menu.status == 1) {
                this.childAccount[i].checked = true;
                for (var j = 0; j < this.childAccount[i].type.length; j++) {
                  this.childAccount[i].type[j].disabled = "on";
                }
              }
              for (var j = 0; j < this.childAccount[i].type.length; j++) {
                if (this.childAccount[i].type[j].status == 1) {
                  this.childAccount[i].type[j].pitch = "on";
                }else{
                  this.childAccount[i].type[j].pitch = "off"
                } 
                this.childAccount[i].type[j].status = Boolean(
                  this.childAccount[i].type[j].status
                );
              }
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    }
  }
};
</script>

<style scoped>
.checkbox {
  display: inline-block;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  background: transparent;
  border-color: rgb(204, 200, 200);
  margin-right: 10px;
}
.line {
  width: 100%;
  height: 1px;
}
.info {
  width: 100%;
  height: auto;
  padding: 10px 0;
  margin-top: 10px;
  display: flex;
}
.level1 {
  width: 200px;
  height: 100%;
}
.level2 {
  width: 300px;
  height: 100%;
  /* display: flex; */
}
.accounts {
  padding: 4px;
  border-bottom: 1px solid transparent;
  box-sizing: border-box;
  border-radius: 2px;
  cursor: pointer;
}
.accounts.active {
  background: #66b1ff;
  color: #fff;
}
.accounts:hover {
  background: #66b1ff;
  color: #fff;
}
.childAccount {
  height: 30px;
  border-bottom: 1px solid transparent;
  box-sizing: border-box;
  border-left: 1px solid rgb(204, 200, 200);
  border-right: 1px solid rgb(204, 200, 200);
  display: flex;
  padding-left: 10px;
  align-items: center;
}
.tools {
  height: 30px;
  border-bottom: 1px solid transparent;
  box-sizing: border-box;
  display: flex;
  padding-left: 10px;
  align-items: center;
}
.toollist {
  display: flex;
  align-items: center;
  margin-right: 20px;
}
/* -------------- */


.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.card {
  width: 100%;
  height: 100%;
  border: 1px solid #e4e7ed;
  padding: 10px;
  display: flex;
}
.cardItem {
  width: 150px;
  margin-right: 10px;
}
.sumit {
  text-align: center;
  margin-top: 20px;
}
</style>