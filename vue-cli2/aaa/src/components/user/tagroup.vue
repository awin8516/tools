<template>
  <div class="table">
    <div class="crumbs">
      <h2>自定义标签组列表</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :inline="true">
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="新增标签组" placement="top">
              <el-button
                type="primary"
                icon="el-icon-plus"
                class="handle-del mr10"
                @click="addtag()"
              >添加</el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>

        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="select_words" placeholder="搜索"></el-input>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="搜索" placement="top">
              <el-button type="primary" @click="handleSearch(select_words)">搜索</el-button>
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
          :current-page.sync="currentPage1"
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
        <el-table-column prop="name" label="标签组名称" sortable>
          <template slot-scope="scope">
            <span v-html="(scope.row.name)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" sortable>
          <template slot-scope="scope">
            <span v-html="(scope.row.created_at)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="bind_total" label="总人数" sortable>
          <template slot-scope="scope">
            <span v-html="(scope.row.bind_total)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="tag_num" label="标签数量" sortable>
          <template slot-scope="scope">
            <span v-html="(scope.row.tag_num)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="操作" width="180">
          <template slot-scope="scope">
            
            <el-tooltip class="item" effect="dark" content="编辑标签组" placement="top">
              <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除标签组" placement="top">
              <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
            </el-tooltip>
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
          :current-page.sync="currentPage1"
        ></el-pagination>
      </div>
    </div>

    <el-dialog title="自定义标签组" :visible.sync="dialogVisible" width="30%">
      <el-form
        ref="addTagObj"
        :model="addTagObj"
        label-width="120px"
        label-position="left"
        :rules="rules"
      >
        <el-form-item label="标签组名称" prop="name">
          <el-input v-model="addTagObj.name"></el-input>
        </el-form-item>
        <el-form-item label="选择关联标签" v-if="is_tagid" prop="tagid">
          <el-select v-model="addTagObj.tagid" multiple placeholder="请选择">
            <el-option
              v-for="item in tagData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel('dialogVisible')">取 消</el-button>
        <el-button type="primary" @click="sure()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="自定义标签" :visible.sync="dialogVisible_tag" width="40%" center>
      <p class="tagTips">请上传粉丝OpenId列表，以开始批量标记进程(单次上限100，100粉丝，单日10次)</p>
      <el-button type="primary" icon="el-icon-download" size="mini" @click="down()">下载模板</el-button>
      <br />
      <br />
      <br />
      <el-form ref="form" :model="form" label-width="100px" :label-position="labelPosition">
        <el-form-item label="给粉丝打标签">
          <el-select
            v-model="value"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            v-loading="loading"
            @change="getTags(value)"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件">
          <el-upload
            class="upload-demo"
            :action="fileupload"
            :data="tagfile"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :limit="1"
            :multiple="multiple"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <el-button type="primary" icon="el-icon-upload" plain disabled>上传CSV列表</el-button>
          <p class="uploadTips">支持文件格式：CSV，OpenID在文件里为必填。注意：只能传一张图片,鼠标移上图片删除</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel('dialogVisible_tag')">取 消</el-button>
        <el-button type="primary" @click="createTag()">立即创建</el-button>
      </span>
    </el-dialog>

    <v-danger
      ref="danger"
      @dangerSure="dangerSure"
      :danger_type="danger_type"
      :danger_ontent="danger_ontent"
    ></v-danger>
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
      select_words: "",
      fileupload: this.GLOBAL.BASE_URL + "fileupload",
      tableData: [],
      tagData: [],
      loading: false,
      totals: 0,
      page: 1,
      limit: 10,
      currentPage1: 0,
      addTagObj: {
        id: "",
        name: "",
        appid: "",
        tagid: ""
      },
      rules: {
        name: [
          { required: true, message: "请选择标签组名称", trigger: "blur" }
        ],
        tagid: [{ required: true, message: "请选择关联标签", trigger: "blur" }]
      },
      labelPosition: "left",
      dialogVisible: false,
      dialogVisible_tag: false,
      tagfile: {
        appid: ""
      },
      form: {},
      value: "",
      options: [],
      list: [],
      createdTagInfo: {
        path: "",
        appid: "",
        diy_tag_id: ""
      },
      fileList: [],
      danger_type: "自定义标签组",
      danger_ontent: "删除自定义标签组，此操作会将所有删除所有用户的自定义标签组",
      item: "",
      is_tagid: true
    };
  },
  // select选择器的可搜索功能，参考组件官网
  mounted() {
    this.list = this.tagData.map(item => {
      return { value: item, label: item };
    });
  },
  created() {
    if (localStorage.getItem("pages")) {
      this.page =
        JSON.parse(localStorage.getItem("pages")).taggroup || this.page;
      this.currentPage1 = JSON.parse(localStorage.getItem("pages")).taggroup;
    }

    this.addTagObj.appid = this.$store.getters.showQuery;
    this.tagfile.appid = this.$store.getters.showQuery;
    this.createdTagInfo.appid = this.$store.getters.showQuery;
    // 获取自动定义标签
    this.getalldiytag();
    this.gettagData();
  },
  methods: {
    // 重置
    reset() {
      this.select_words = "";
      this.handleSearch();
    },
    handleSearch(val) {
      this.getalldiytag(val);
    },
    // 下载
    down() {
      window.location.href = this.GLOBAL.FILE_URL;
    },
    // 创建新的标签
    createTag() {
      if (this.createdTagInfo.diy_tag_id == "") {
        this.$message.warning("标签不能为空");
      } else if (this.createdTagInfo.path == "") {
        this.$message.warning("文件不能为空");
      } else {
        this.$axios
          .post(this.GLOBAL.BASE_URL + "autotagfile", this.createdTagInfo)
          .then(res => {
            this.dialogVisible_tag = false;
            if (res.data.code == 0) {
              this.$message.success("创建成功");
              this.createdTagInfo = {
                path: "",
                diy_tag_id: "",
                appid: this.$store.getters.showQuery
              };
              this.getalldiytag();
            } else {
              this.$message.error(res.data.message);
            }
          });
      }
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
    // 上传图片成功后的回调
    uploadSuccess(res, file) {
      if (res.code == 0) {
        this.createdTagInfo.path = res.data.path;
      } else {
        this.$message.error(res.message);
      }
    },
    // 上传图片之前的判断  判断图片的大小
    beforeAvatarUpload(file) {
      let isLt2M;
      let type = file.name.split(".")[file.name.split(".").length - 1];
      if (type == "csv") {
        isLt2M = true;
      } else {
        isLt2M = false;
      }
      if (!isLt2M) {
        this.$message.error("请上传CSV类型的文件");
        this.loading = false;
      }
      return isLt2M;
    },
    uploadError() {},
    // 批量打标签
    allAddTag() {
      this.createdTagInfo = {
        path: "",
        diy_tag_id: "",
        appid: this.$store.getters.showQuery
      };
      this.dialogVisible_tag = true;

      this.gettagData();
    },
    // 显示有效和无效的数据,,根据返回的值的不同进行判断
    showStatus(status) {
      if (parseInt(status) == 1) {
        return "无效";
      } else if (parseInt(status) == 0) {
        return "有效";
      }
    },
    dangerSure(item) {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "diytaggroupdel", {
          id: this.item.id,
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success(res.data.message);
            this.getalldiytag();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 删除自定义标签
    handleDelete(item) {
      this.item = item;
      this.$refs.danger.showDanger();
      // this.diytagdel(item);
    },
    // 删除自定义标签
    diytagdel(item) {},
    // 添加自定义标签
    diytagadd() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "diytaggroupsave", this.addTagObj)
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.$message.success("修改成功");
            this.getalldiytag();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 编辑自定义标签
    handleEdit(item) {
      this.dialogVisible = true;
      this.addTagObj.id = item.id;
      this.addTagObj.name = item.name;
      this.is_tagid = false;
      this.gettagData();
    },
    // 确定添加自定义标签名称
    sure() {
      if (this.addTagObj.id == "") {
        if (this.addTagObj.name == "") {
          this.$message.warning("标签名称不能为空");
        } else {
          this.$axios
            .post(this.GLOBAL.BASE_URL + "diytaggroupadd", this.addTagObj)
            .then(res => {
              this.loading = false;
              if (res.data.code == 0) {
                this.dialogVisible = false;
                this.$message.success("操作成功");
                this.getalldiytag();
              } else {
                this.$message.error(res.data.message);
              }
            });
        }
      } else {
        this.diytagadd();
        this.dialogVisible = false;
      }
    },
    // 取消对话框
    cancel(type) {
      if (type == "dialogVisible") {
        this.getalldiytag();
        this.dialogVisible = false;
        this.addTagObj.id = "";
        this.addTagObj.tag_name = "";
      } else if (type == "dialogVisible_tag") {
        this.getalldiytag();
        this.dialogVisible_tag = false;
        this.tagfile.diy_tag_id = "";
      }
    },
    // 添加标签
    addtag() {
      this.addTagObj.id = "";
      this.addTagObj.name = "";
      this.addTagObj.tagid = "";
      this.dialogVisible = true;
      this.is_tagid = true;
      this.gettagData();
      this.$nextTick(() => {
        this.$refs.addTagObj.resetFields();
      });
    },
    // 获取自定义标签----这个接口是做select搜索功能用----因为这里有分页的格式`在,所以一次性请求大量的数据来避免分页,
    gettagData() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "getalldiytag", {
          appid: this.$store.getters.showQuery,
          page: 1,
          limit: 10000,
          nogroup: 1
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
    // 修改对象属性格式
    changeTagsList(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/tag_id/g, "value"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/tag_name/g, "label"));

      return obj2;
    },
    // 获取自定义标签----这个接口是返回表格的数据
    getalldiytag(name = this.select_words) {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "diytaggrouplist", {
          appid: this.$store.getters.showQuery,
          page: this.page,
          limit: this.limit,
          name: name
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
            this.totals = res.data.data.total;
            this.currentPage1 = res.data.data.current_page;
            if (this.page > res.data.data.last_page) {
              this.page = res.data.data.last_page;
              this.getalldiytag();
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 翻页
    handleCurrentChange(val) {
      this.page = val;
      this.getalldiytag();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.taggroup = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    handleSizeChange(val) {
      this.page = this.currentPage1;
      this.limit = val;
      this.getalldiytag();
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
.toptag {
  background: #337ab7 !important;
  border-radius: 5px 5px 0 0;
}
.toptag a {
  color: #fff !important;
}
.tips {
  font-size: 14px;
  color: #ccc;
}
.qtags {
  width: 100%;
  display: flex;
}

.panel {
  width: 250px;
  height: 100%;
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  display: block;
}
.tagPanel {
  display: flex;
}
.line {
  width: 20px;
}
.tagItem {
  width: 250px;
  margin-top: 20px;
}
.tagItem ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.tagItem ul li {
  width: 100%;
  height: 35px;
  position: relative;
}
.tagItem ul li:hover {
  background: rgb(233, 231, 231);
}
.tagItem ul li i {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 10;
}
.tagItem ul li a {
  display: flex;
  align-items: center;
  color: #333;
  padding-left: 10px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #ddd;
  z-index: 9;
}
.tagItem ul li:last-child a {
  border-bottom: none;
}
.tagstable {
  width: 100%;
  height: 100%;
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
