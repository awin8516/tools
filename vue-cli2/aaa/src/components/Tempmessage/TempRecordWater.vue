<template>
  <div class="table">
    <div class="crumbs">
      <h2>模板消息发送任务流水记录</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-tooltip class="item" effect="dark" content="返回发送记录" placement="top">
          <el-button type="success" @click="back()" icon="el-icon-back">返回发送记录</el-button>
        </el-tooltip>
      </div>
      <div class="info" v-if="info">
        <p>任务ID：{{info.id}}</p>
        <p>任务标题：{{info.title}}</p>
        <p>任务创建时间：{{info.created_at}}</p>
      </div>
      <div style="display:inline-block;margin:15px 0 15px 0;width:200px">
        <el-input v-model="openid" placeholder="请输入搜索openid"></el-input>
      </div>
      <div style="margin-right:10px;margin-left:0px;display:inline-block;">
        <el-tooltip class="item" effect="dark" content="搜索" placement="top">
          <el-button type="primary" @click="search(openid)">搜索</el-button>
        </el-tooltip>
      </div>
      <div style="margin-right:10px;">
        <el-tooltip class="item" effect="dark" content="重置搜索条件" placement="top">
          <el-button
            type="primary"
            icon="el-icon-refresh"
            class="handle-del mr10"
            @click="reset()"
          >重置</el-button>
        </el-tooltip>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 200]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
          :current-page.sync="currentPage1"
        ></el-pagination>
      </div>
      <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}" style="width: 100%">
        <el-table-column fixed label="序号" width="50" align="center" type="index">
          <template slot-scope="scope">{{(scope.$index + 1) + (page- 1) *limit}}</template>
        </el-table-column>
        <!-- <el-table-column prop="id" label="发送序号" width="100"></el-table-column> -->
        <!-- <el-table-column prop="template_task_id" label="模板ID" width="120"></el-table-column> -->
        <!-- <el-table-column prop="title" label="标题" width="120"></el-table-column>
        <el-table-column prop="filter_content" label="内容" width="300"></el-table-column>-->
        <el-table-column prop="send_content" label="用户头像和昵称" width="300">
          <template slot-scope="scope">
            <!-- <p>{{scope.row.fan}}</p> -->
            <div class="headerImg" v-if="scope.row.fan" @click="show(scope.row)">
              <img :src="scope.row.fan.headimgurl" />
              <p style="margin-left:30px">{{scope.row.fan.nickname}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="msg_content" label="内容" width="300"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <!-- 0已经推送1发送中2表示发送成功3.发送失败5没有推送 -->
            <p v-if="scope.row.status == 0">成功</p>
            <p v-if="scope.row.status == 1">失败</p>
            <p v-if="scope.row.status == 2">发送成功</p>
            <p v-if="scope.row.status == 3">发送失败</p>
            <p v-if="scope.row.status == 4">没有推送</p>
            <!-- <p v-if="scope.row.status == 5">已经推送</p> -->
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="发送时间"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 200]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
          :current-page.sync="currentPage1"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import vDanger from "../dialogs/danger.vue";
export default {
  components: {
    vDanger
  },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      totals: 0,
      page: 1,
      limit: 10,
      currentPage1: 1,
      id: "",
      addTagObj: {},
      info: {},
      openid: ""
    };
  },
  filters: {
    formatTime: function(time) {
      // 不足10  补0
      function addZero(num) {
        if (num < 10) {
          num = "0" + num;
        }
        return num;
      }
      let date = new Date(time * 1000);
      return (
        date.getFullYear() +
        "-" +
        addZero(date.getMonth() + 1) +
        "-" +
        addZero(date.getDate()) +
        " " +
        addZero(date.getHours()) +
        ":" +
        addZero(date.getMinutes()) +
        ":" +
        addZero(date.getSeconds())
      );
    }
  },
  created() {
    if (localStorage.getItem("pages")) {
      this.page = JSON.parse(localStorage.getItem("pages")).tempRecordWater  || this.page;
      this.currentPage1 = JSON.parse(localStorage.getItem("pages")).tempRecordWater  || this.page;
    }

    this.info = JSON.parse(localStorage.getItem("obj"));
    this.getList();
  },
  methods: {
    search(openid) {
      this.getList(openid);
    },
    // 进入详细信息
    show(row, event) {
      // console.log(row.fan._id);
      // localStorage.setItem("uid", window.atob(row.fan._id) + "?temp");
      // this.$router.push({
      //   name: "UserPortrait"
      // });
      window.open(this.GLOBAL.USEROPEN + window.btoa(row.fan._id), "_blank");
    },
    // 返回
    back() {
      localStorage.removeItem("obj");
      this.$router.push({
        name: "TempRecord"
      });
    },
    // 翻页
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.tempRecordWater = val;
      localStorage.setItem("pages",JSON.stringify(pages));
    },
    handleSizeChange(val) {
      this.page = this.currentPage1;
      this.limit = val;
      this.getList();
    },
    getList(openid = this.openid) {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "templatesendlog", {
          appid: this.$store.getters.showQuery,
          id: window.atob(localStorage.getItem("tid")),
          page: this.page,
          limit: this.limit,
          openid: openid
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
            this.totals = res.data.data.total;
            this.currentPage1 = res.data.data.current_page;
            if (this.page > res.data.data.last_page) {
              this.page = res.data.data.last_page;
              this.getList();
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
.info {
  margin-bottom: 10px;
}
.info p {
  margin: 10px 0;
}
/* --------------- */
.headerImg {
  width: 200px;
  height: 60px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
}
.headerImg img {
  height: 100%;
  width: auto;
}
.headerImg p {
  margin-right: 10px;
  white-space: nowrap;
}
/* ------------------------------ */


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

