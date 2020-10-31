<template>
  <div class="table">
    <div class="crumbs">
      <h2>模板消息</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :inline="true">
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="同步微信模板消息模板" placement="top">
              <el-button
                type="primary"
                icon="el-icon-folder-opened"
                class="handle-del mr10"
                @click="getWx()"
              >同步模板</el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>

        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="title" placeholder="请输入搜索标题"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="content" placeholder="请输入搜索内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="搜索" placement="top">
              <el-button type="primary" @click="search()">搜索</el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="重置搜索条件" placement="top">
              <el-button
                type="primary"
                icon="el-icon-refresh"
                class="handle-del mr10"
                @click="reset()"
              >重置</el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 200]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
          :current-page.sync="currentPage"
        ></el-pagination>
      </div>
      <el-table
        :data="tableData"
        :header-cell-style="{background:'#f9f9f9'}"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column fixed label="序号" width="50" align="center" type="index">
          <template slot-scope="scope">{{(scope.$index + 1) + (page- 1) *limit}}</template>
        </el-table-column>
        <!-- <el-table-column prop="id" label="模板编号" width="100" sortable></el-table-column> -->
        <el-table-column prop="title" label="标题" width="120" sortable></el-table-column>
        <el-table-column prop="primary_industry" label="一级行业" width="120" sortable></el-table-column>
        <el-table-column prop="deputy_industry" label="二级行业" sortable></el-table-column>
        <el-table-column prop="example" label="模板内容" width="350" sortable></el-table-column>
        <el-table-column prop="remark" label="备注" center sortable>
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="点击修改备注"
              placement="top"
              v-if="scope.row.remark"
            >
              <div class="tempedit" @click="addRemark(scope.row)">{{scope.row.remark}}</div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="添加备注" placement="top" v-else>
              <el-button type="primary" @click="addRemark(scope.row)">添加备注</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit-outline"
              @click="handleEdit(scope.row)"
            >发送模板消息</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="170">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="批量发送模板消息" placement="top">
              <el-button type="primary" icon="el-icon-bottom" @click="showFile(scope.row)">批量发送模板消息</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete-solid" @click="handleDelete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 200]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
          :current-page.sync="currentPage"
        ></el-pagination>
      </div>
    </div>
    <v-danger
      ref="danger"
      @dangerSure="dangerSure"
      :danger_type="danger_type"
      :danger_ontent="danger_ontent"
    ></v-danger>

    <el-dialog title="备注" :visible.sync="dialogVisible" width="30%" @closed="handleClose">
      <el-input
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 4}"
        placeholder="请输入内容"
        v-model="remark"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="批量发送模板消息" :visible.sync="dialogVisible_tag" width="40%" center>
      <p class="tagTips">请下载模板填入发送任务的openid、关键词、url信息后上传以开始批量发送进程(单次上限100,00粉丝，单日10次)</p>
      <el-button type="primary" icon="el-icon-download" size="mini" @click="down()">下载模板</el-button>
      <br />
      <br />
      <br />
      <el-form ref="form" :model="form" label-width="100px" :label-position="labelPosition">
        <el-form-item label="上传文件">
          <el-upload
            ref="upload"
            class="upload-demo"
            :action="fileupload"
            :data="tagfile"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :on-change="handleChange"
            :file-list="fileList"
            :show-file-list="show_file_list"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <el-button type="primary" icon="el-icon-upload" plain disabled>上传CSV列表</el-button>
          <p class="uploadTips">支持文件格式：CSV，OpenID在文件里为必填。注意：只能传一份文件,修改文件需要先删除再上传</p>
        </el-form-item>
        <el-form-item label="发送时间">
          <el-date-picker
            v-model="tempObj.send_time"
            type="datetime"
            placeholder="选择日期时间"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="submit()">立即创建</el-button>
      </span>
    </el-dialog>
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
      multiple: false,
      dialogVisible: false,
      dialogVisible_tag: false,
      remark: "",
      tableData: [],
      page: 1,
      totals: 0,
      danger_type: "模板消息",
      danger_ontent: "删除模板消息，此操作会将所有删除所有用户的模板消息",
      item: "",
      templateId: "",
      form: {},
      value: "",
      options: [],
      list: [],
      tagData: [],
      page: 1,
      limit: 10,
      currentPage: 1,
      addTagObj: {},
      labelPosition: "left",
      fileupload: this.GLOBAL.BASE_URL + "fileupload",
      fileList: [],
      tagfile: {
        appid: "",
        type: 2,
      },
      send_time: "",
      tempObj: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e6;
        }
      },
      show_file_list: false,
      loading: false,
      title: "",
      content: ""
    };
  },
  created() {
    if (localStorage.getItem("pages")) {
      this.page =
        JSON.parse(localStorage.getItem("pages")).tempmessage || this.page;
      this.currentPage =
        JSON.parse(localStorage.getItem("pages")).tempmessage || this.page;
    }

    this.addTagObj.appid = this.$store.getters.showQuery;
    this.tagfile.appid = this.$store.getters.showQuery;
    this.getList();
    this.gettagData();
  },
  // select选择器的可搜索功能，参考组件官网
  mounted() {
    this.list = this.tagData.map(item => {
      return { value: item, label: item };
    });
  },
  methods: {
    // 重置
    reset() {
      this.title = "";
      this.content = "";
      this.search();
    },
    // 搜索
    search() {
      this.getList();
    },
    // submit立即创建
    submit() {
      this.tempObj.send_type = 3;
      this.tempObj.send_content = this.tempObj.simple_content;
      if (!this.tempObj.filter_content) {
        this.$message.warning("表格不能为空");
        return;
      } else if (!this.tempObj.send_time) {
        this.$message.warning("选择发送的时间");
        return;
      }
      this.tempObj.url = "uploads/2019-08-12-00-27-53-5d50420984ccf.csv";
      let oldDate = new Date(this.tempObj.send_time).getTime();
      let newDate = new Date().getTime();
      if (oldDate < newDate) {
        this.tempObj.send_time = "";
      } else {
      }
      this.$axios
        .post(this.GLOBAL.BASE_URL + "templatesend", this.tempObj)
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("消息发送成功");
            this.dialogVisible_tag = false;
            this.tempObj = "";
            this.getList();
          } else {
            this.tempObj = "";
            this.$message.error(res.data.message);
            this.dialogVisible = false;
          }
        });
    },
    handleClose() {
      this.dialogVisible_tag = false;
      this.$refs.upload.clearFiles();
    },
    cancel() {
      this.dialogVisible_tag = false;
      this.$refs.upload.clearFiles();
    },
    showFile(item) {
      this.dialogVisible_tag = true;
      this.$nextTick(() => {
        this.tempObj = "";
        this.tempObj = item;
        this.tempObj.filter_content = "";
        this.$refs.upload.clearFiles();
      });
    },
    handleChange(file, filelist) {
      this.fileList = filelist.slice(-1);
      console.log(this.fileList);
    },
    // 上传图片成功后的回调
    uploadSuccess(res, file) {
      // console.log(file);
      if (res.code == 0) {
        this.show_file_list = true;
        this.tempObj.filter_content = res.data.path;
        this.loading = false;
      } else {
        this.$message.error(res.message);
      }
    },
    // 上传图片之前的判断  判断图片的大小
    beforeAvatarUpload(file) {
      // console.log(this.myFileList);
      let isLt2M;
      let type = file.name.split(".")[file.name.split(".").length - 1];
      if (type == "csv") {
        isLt2M = true;
      } else {
        isLt2M = false;
      }
      this.loading = true;
      if (!isLt2M) {
        this.$message.error("请上传CSV类型的文件");
        this.loading = false;
      }
      return isLt2M;
    },
    uploadError() {},
    // 修改对象属性格式
    changeTagsList(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/tag_id/g, "value"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/tag_name/g, "label"));

      return obj2;
    },
    // 获取自定义标签----这个接口是做select搜索功能用----因为这里有分页的格式`在,所以一次性请求大量的数据来避免分页,
    gettagData() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "getalldiytag", {
          appid: this.$store.getters.showQuery,
          page: 1,
          limit: 10000
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.tagData = res.data.data.data;
            this.tagData = this.changeTagsList(this.tagData);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    getTags(val) {
      this.createdTagInfo.diy_tag_id = val;
    },
    // 参看组件官网,,可搜索的selct
    remoteMethod(query) {
      if (query !== "") {
        setTimeout(() => {
          this.options = this.tagData.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
    // 下载
    down() {
      window.location.href =
        this.GLOBAL.BASE_URL +
        "downloadtemplate?appid=" +
        this.$store.getters.showQuery +
        "&template_id=" +
        this.tempObj.template_id;
    },
    // 确认添加备注
    sure() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "templateedit", {
          appid: this.$store.getters.showQuery,
          id: this.templateId,
          remark: this.remark
        })
        .then(res => {
          if (res.data.code == 0) {
            this.dialogVisible = false;
            this.$message.success("操作成功");
            this.getList();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 添加备注
    addRemark(value) {
      this.remark = value.remark;
      this.templateId = value.id;
      this.dialogVisible = true;
    },
    // 编辑
    handleEdit(value) {
      localStorage.setItem("tid", window.btoa(value.id));
      this.$router.push({
        path: "/TempmesEdit"
      });
    },
    // 同步
    getWx() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "pulltemplate", {
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("操作成功");
            this.getList();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    dangerSure() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "templatedel", {
          appid: this.$store.getters.showQuery,
          id: this.item.id,
          type: ""
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("操作成功");
            this.getList();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    handleDelete(value) {
      this.item = value;
      this.$refs.danger.showDanger();
    },
    // fanye
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.tempmessage = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    handleSizeChange(val) {
      this.page = this.currentPage;
      this.limit = val;
      this.getList();
    },
    getList() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "templatelist", {
          appid: this.$store.getters.showQuery,
          page: this.page,
          limit: this.limit,
          title: this.title,
          content: this.content
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
            this.totals = res.data.data.total;
            this.currentPage = res.data.data.current_page;
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

<style>
.upload-demo {
  width: auto;
  margin-right: 10px;
}
.upload-demo .el-upload--text {
  width: auto;
  height: auto;
  border: none;
}
</style>
<style scoped>
.uploadTips {
  font-size: 12px;
  color: rgb(173, 173, 180);
  margin-top: 10px;
}
.select {
  width: 400px;
  margin-top: 50px;
}
.tagTips {
  margin-bottom: 10px;
}
.select {
  width: 300px;
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

