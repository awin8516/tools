<template>
  <div class="table">
    <div class="crumbs">
      <h2>商城用户</h2>
    </div>
    <div class="container">
      <div class="pagination">
        <el-pagination background layout="prev, pager, next" :total="totals" @current-change="handleCurrentChange"></el-pagination>
      </div>
      <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}"="userData" style="width: 100%" v-loading="loading">
        <el-table-column fixed label="序号" width="50" align="center" type="index"></el-table-column>
        <el-table-column prop="name" label="用户名" width="200">
          <template slot-scope="scope">
            <img vc-if='scope.row.avatar' :src='scope.row.avatar' class="avatar">
            {{scope.row.name}}
            </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="150">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column prop="phone" label="会员号" width="150">
          <template slot-scope="scope">{{scope.row.number_no}}</template>
        </el-table-column>
        <el-table-column prop="phone" label="	性别" width="100">
          <template slot-scope="scope">
            {{showRealData('gender',scope.row.gender)}}
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="入驻时间" width="150">
          <template slot-scope="scope">{{scope.row.created_at}}</template>
        </el-table-column>
        <el-table-column  label="购买" width="200">
          <template slot-scope="scope">
            {{showRealData('is_buy',scope.row.is_buy)}}
          </template>
        </el-table-column>
        <el-table-column  label="当前积分" width="150">
          <template slot-scope="scope">
            {{scope.row.current_point}}
          </template>
        </el-table-column>
        <el-table-column  label="会员等级" width="150">
          <template slot-scope="scope">
            {{scope.row.class_id}}
          </template>
        </el-table-column>
        <el-table-column  label="详细信息">
          <template slot-scope="scope">
            <el-button type="primary" @click="UserInfo('view',scope.$index,scope.row)">查看</el-button>
            <el-button type="primary" @click="UserInfo('edit',scope.$index,scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="prev, pager, next" :total="totals" @current-change="handleCurrentChange"></el-pagination>
      </div>
    </div>

    <!-- 修改当前积分 -->
    <el-dialog title="修改当前积分" :visible.sync="jf_dialogVisible" width="30%">
      <div class="form">
        <el-form ref="form" :model="UserInfos" label-width="100px">
          <el-form-item label="当前积分">
            <el-input v-model="UserInfos.current_point"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="jfBtn">
        <el-button type="primary" @click="sure()">确认修改</el-button>
      </div>
    </el-dialog>
    
    <!-- 用户信息展示 -->
    <el-dialog title="用户信息" :visible.sync="user_dialogVisible" width="30%">
      <div class="form">
        <el-form ref="form" :model="UserInfos" label-width="100px">
          <el-form-item label="用户等级" v-if="UserInfos.userclass">
            <el-input v-model="UserInfos.userclass.name"></el-input>
          </el-form-item>
          <el-form-item label="描述" v-if="UserInfos.userclass">
            <el-input v-model="UserInfos.userclass.desc"></el-input>
          </el-form-item>
          <el-form-item label="真实等级" v-if="UserInfos.userclass">
            <el-input v-model="UserInfos.userclass.real_name"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" v-if="UserInfos.userclass">
            <el-input v-model="UserInfos.userclass.created_at"></el-input>
          </el-form-item>
          <el-form-item label="国籍">
            <el-input v-model="UserInfos.country"></el-input>
          </el-form-item>
          <el-form-item label="省">
            <el-input v-model="UserInfos.province"></el-input>
          </el-form-item>
          <el-form-item label="市">
            <el-input v-model="UserInfos.city"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="UserInfos.email"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="jfBtn">
        <el-button type="primary" @click="close()">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      userData: [],
      totals:0,
      jf_dialogVisible:false,
      user_dialogVisible:false,
      UserInfos:{},
      page:1
    };
  },
  created() {
    this.UserInfos.appid = this.$store.getters.showQuery
    this.jfusers();
  },
  methods: {
    // 翻页
    handleCurrentChange(val){
      this.page = val;
      this.jfusers();
    },
    // 关用户信息弹窗
    close(){
      this.user_dialogVisible = false;
    },
    // 确认修改
    sure(){
      this.$axios.post(this.GLOBAL.BASE_URL+'saveone',this.UserInfos).then(res=>{
        if(res.data.code == 0){
          this.$message.success("修改成功")
          this.jf_dialogVisible = false;
          this.jfusers()
        }else{
          this.$message.error(res.data.message)
        }
      })
    },  
    // 查看用户详细信息
    UserInfo(type,idx,item){
      if(type == 'view'){
        // 查看信息
        this.user_dialogVisible = true;
        this.UserInfos =item;
      }else if(type == 'edit'){
        // 编辑信息
        this.jf_dialogVisible =true;
        this.editone(item);
      }
    },
    // 转化数据显示形态
    showRealData(str,value){
      if(str == 'is_buy'){
        switch (value){
          case 0:
            return '未购买'
          case 1:
            return '购买'
        }
      }
      if(str == 'gender'){
        switch (value){
          case 0:
            return '女'
          case 1:
            return '男'
        }
      }
    },
    // 编辑用户信息接口
    editone(item){
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "editone", {
          appid: this.$store.getters.showQuery,
          id:item.id
        })
        .then(res => {
          if (res.data.code == 0) {
            this.loading = false;
            this.UserInfos = res.data.data;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 获取用户信息列表
    jfusers() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "jfusers", {
          appid: this.$store.getters.showQuery,
          page:this.page
        })
        .then(res => {
          if (res.data.code == 0) {
            this.loading = false;
            this.userData = res.data.data.data;
            this.totals = res.data.data.total;
          } else {
            this.$message.error(res.data.message);
          }
        });
    }
  }
};
</script>

<style scoped>
.jfBtn{
  display: flex;
  justify-content: flex-end;
}
.form{
  width: 300px;
}
/* ------------------- */
/* ------------------ */
.pagination {
  display: flex;
  justify-content: flex-end;
}
/* 头像 */
.avatar{
  height: 50px;
  vertical-align: middle;
  border-radius: 5px;
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

