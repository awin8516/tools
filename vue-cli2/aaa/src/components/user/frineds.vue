<template>
  <div class="table">
    <div class="crumbs">
      <h2>朋友圈关系网</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-tooltip class="item" effect="dark" content="返回用户详情" placement="top">
        <el-button type="success" @click="back()" icon="el-icon-back">返回用户详情</el-button>

        </el-tooltip>
      </div>
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
      <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}" style="width: 100%" v-loading="loading">
        <el-table-column fixed label="序号" width="50" align="center" type="index"></el-table-column>
          <el-table-column prop="nickname" label="昵称" width="180">
            <template slot-scope="scope">
              <div style="display:flex;align-items:center;cursor:pointer" @click="show(scope.row)">
                <div class="qrurl">
                  <el-image :src="scope.row.headimgurl" :fit="fit"></el-image>
                </div>
                {{scope.row.nickname}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="标签" width="300">
            <template slot-scope="scope">
              <div
                class="remarks"
                v-for="(item,index) in showTag(scope.row.tagid_list)"
                :key="index"
              >
                <p class="remark">{{item}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="formatted_address" label="地理位置" width="250"></el-table-column>
          <el-table-column prop="openid" label="OpenID" width="260"></el-table-column>
          <el-table-column prop="subscribe_scene" label="来源" width="100"></el-table-column>
          <el-table-column prop="fan_status" label="关注状态" width="80"></el-table-column>
          <el-table-column prop="subscribe_time" label="最后关注时间">
            <template slot-scope="scope">{{scope.row.subscribe_time}}</template>
          </el-table-column>
          <!-- <el-table-column prop label="消息管理">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" @click="message(scope.row)"></el-button>
            </template>
          </el-table-column>
          <el-table-column prop label="电商信息">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-data-line" @click="getBusiness(scope.row)"></el-button>
            </template>
          </el-table-column> -->
        </el-table>
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      uid:"",
      page:1,
      tableData:[],
      loading:false,
      total:0,
      tagList:[],
      fit:'cover'
    }
  },
  created(){
    if (localStorage.getItem("pages")) {
      this.page = JSON.parse(localStorage.getItem("pages")).friends  || this.page;
    }
    this.uid =JSON.parse(localStorage.getItem("uid"))._id
    this.biao_qian_list();
  },
  methods:{
     // 返回用户信息列表页
    back() {
      let id = JSON.parse(localStorage.getItem('uid'))._id;
      window.open(this.GLOBAL.USEROPEN + window.btoa(id), "_blank");
      this.$router.push({
        path: "/UserPortrait"
      });
    },
    // 翻页
    handleCurrentChange(val){
      this.page = val;
      this.friendlist();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.friends = val;
      localStorage.setItem("pages", JSON.stringify(pages));

    },
    // 显示标签名称
    showTag(value) {
      // console.log(value)
      let result = [];
      for (var j = 0; j < value.length; j++) {
        for (var i = 0; i < this.tagList.length; i++) {
          if (value[j] == this.tagList[i].value) {
            result.push(this.tagList[i].label);
          }
        }
      }
      return result;
    },
    // 获取朋友列表
    friendlist() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "friendlist", {
          appid: this.$store.getters.showQuery,
          page:this.page,
          id: this.uid
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
            this.total = res.data.data.total
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
     // 获取微信标签
    biao_qian_list() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "biao_qian_list", {
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tagList = this.changeTagsList(res.data.data);
            this.friendlist();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 将json数据中的id和name转化为value和label
    changeTagsList(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/id/g, "value"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/name/g, "label"));
      return obj2;
    },
    // 获取自定义标签
    getalldiytag() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "getalldiytag", {
          appid: this.$store.getters.showQuery,
          page: this.page,
          limit: this.limit
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tagList = this.tagList.concat(
              this.changeDiyTagsList(res.data.data.data)
            );
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
  }
}
</script>

<style lang='scss' scoped>

.remark {
  text-align: center;
  background: #79c1fb;
  border-radius: 2px;
  margin: auto;
  color: #fff;
  margin-bottom: 4px;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  padding: 4px;;
}
.remarks {
  display: inline-block;
  margin-right: 5px;
}
.qrurl {
  width: 50px;
  height: 50px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}
.qrurl .getheadimg {
  width: 60px;
  height: 50px;
}
/* ------------------ */
.pagination {
  display: flex;
  justify-content: flex-end;
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

