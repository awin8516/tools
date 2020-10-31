<template>
  <div class="table">
    <div class="crumbs">
      <h2>网页授权</h2>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :inline="true">
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="添加网页授权" placement="top">
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="addOauth()"
              >添加</el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>

        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="selectObj.key" placeholder="请输入搜索的key"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="selectObj.name" placeholder="请输入搜索的活动名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="timepicker"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              type="datetimerange"
              :picker-options="pickerOptions"
              @change="getpickerTimes(timepicker)"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="搜索" placement="top">
              <el-button type="primary" @click="handleSelect(selectObj)">搜索</el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="重置搜索条件" placement="top">
              <el-button
                type="primary"
                icon="el-icon-refresh"
                @click="reset()"
              >重置</el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="导出搜索结果" placement="top">
              <el-button
                type="primary"
                icon="el-icon-upload"
                @click="exportData()"
              >导出</el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="查看使用说明" placement="top">
              <el-button
                type="primary"
                icon="el-icon-tickets"
                @click="useTips()"
              >使用说明</el-button>
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
        <el-table-column prop="key" label="Key" sortable>
          <template slot-scope="scope">
            <span v-html="(scope.row.key)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="back_url" label="回跳域名" sortable>
          <template slot-scope="scope">
            <span v-html="(scope.row.back_url)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="start_time" label="开始时间" sortable>
          <template slot-scope="scope">
            <span v-html="(scope.row.start_time)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="end_time" label="结束时间" sortable>
          <template slot-scope="scope">
            <span v-html="(scope.row.end_time)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="活动名称" sortable>
          <template slot-scope="scope">
            <span v-html="(scope.row.name)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" sortable>
          <template slot-scope="scope">
            <span v-html="(scope.row.remark)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="tagid" label="自定义标签" sortable>
          <template slot-scope="scope">
            <div class="remarks" v-for="(item,index) in showTag(scope.row.tagid)" :key="index">
              <p class="remark">{{item}}</p>
            </div>
            <!-- <span v-html="showTag(scope.row.tagid)"></span> -->
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="添加时间" sortable>
          <template slot-scope="scope">
            <span v-html="(scope.row.created_at)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="updated_at" label="更新时间" sortable>
          <template slot-scope="scope">
            <span v-html="(scope.row.updated_at)"></span>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width="180">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改网页授权规则" placement="top">
              <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除网页授权规则" placement="top">
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
          :current-page.sync="currentPage"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      title="网页授权配置"
      :visible.sync="dialogVisible"
      width="30%"
      @close="handleClose()"
      class="dialog"
      v-if="dialogVisible"
      :close-on-click-modal="modal"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        :label-position="labelPosition"
      >
        <el-form-item label="key" prop="key">
          <el-input v-model="form.key" disabled="disabled" placeholder="自动生成"></el-input>
        </el-form-item>
        <el-form-item label="域名" prop="back_url">
          <el-input v-model="form.back_url"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="start_time">
          <div class="time">
            <el-date-picker
              v-model="form.start_time"
              placeholder="选择开始时间"
              type="datetime"
              align="bottom"
              :picker-options="pickerOptions"
              @change="confirmDate('start',form.start_time)"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="结束时间" prop="end_time">
          <div class="time">
            <el-date-picker
              v-model="form.end_time"
              placeholder="选择结束时间"
              type="datetime"
              align="bottom"
              :picker-options="pickerOptions"
              @change="confirmDate('end',form.end_time)"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="给粉丝打标签" prop="value1">
          <el-select v-model="value1" multiple placeholder="请选择" @change="getTags">
            <el-option
              v-for="item in tagData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-tooltip class="item" effect="dark" content="提交网页授权" placement="top">
            <el-button type="primary" @click="onSubmit(form.id)" :disabled="isDisable">提交</el-button>
          </el-tooltip>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="网页授权使用说明"
      :visible.sync="dialogVisibleUse"
      width="80%"
      class="dialog"
      v-if="dialogVisibleUse"
      :close-on-click-modal="modal"
    >
      <div class="authInfo">
        <p>网页授权使用说明</p>
        <p>网页授权使用说明：主要为了通过公众号获取用户的信息，比如openid，昵称等;</p>
        <p>一、</p>
        <p>Scrm后台人员添加网页授权：</p>
        <p>域名：是自己的开发域名,比如https://wangye.com</p>
        <p>开始时间：表示授权的生效时间，比如2019-12-10</p>
        <p>结束时间：表示授权的截止时间，比如2020-01-11</p>
        <p>给粉丝打标签：给拿到用户信息的用户打标签；比如标签为”山东师”</p>
        <p>活动名称：需要授权的活动名称，比如：“消消乐活动”</p>
        <p>备注：活动备注，比如：这是腾讯公司的活动；</p>
        <p>点加添加，就会生成如下数据：</p>
        <p>
          <img src="../../assets/example2.png" />
        </p>
        <p>二、</p>
        <p>使用方法：</p>
        <p>比如你调用授权的方法是https://wangye.com/getuserinfo;</p>
        <p>你的回调地址是https://wangye.com/scrm/backurl;</p>
        <p>你想获取用户的全部信息；则可以在https://wangye.com/getuserinfo; 中去访问：</p>
        <p>Scrm网站的授权地址xxx.com/scrm/api/oauth2/authorize;</p>
        <p>(https://xxx.com/scrm/api/oauth2/authorize?key=9d9ba746271bc80449910ac3d7cc8608&back_uri=scrm/backurl&scopes=snsapi_userinfo);</p>
        <p>这里的key就是上图中自动生成的key；back_uri就是你的回调地址（在此地址中返回用户信息），scopes就是获取用户信息的方式snsapi_userinfo就是获取用户的全部信息，snsapi_base表示只获取用户的openid4；</p>
        <p>当你请求:</p>
        <p>https://xxx.com/scrm/api/oauth2/authorize?key=9d9ba746271bc80449910ac3d7cc8608&back_uri=scrm/backurl&scopes=snsapi_userinfo 这个地址的时候：这个地址便会返回给你当前访问用户的信息到/scrm/backurl这个地址中去；只要在此地址接受就可以了。</p>
        <p>返回示例：</p>
        <p>https://wangye.com/scrm/backurl?openid=xxxxxx&city=上海&country=中国&languaze=zh&nickname=llst&province=上海&sex=1&unionid=xxxxxx&headimgurl=xxxx</p>
        <p>注意: 发起请求地址和调用授权地址请使用https的形式；</p>
      </div>
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
import BaseView from "../common/BaseView";
import vDanger from "../dialogs/danger.vue";
export default {
  extends: BaseView,
  components: {
    vDanger
  },
  data() {
    return {
      currentPage: 1,
      isDisable: false,
      loading: false,
      tableData: [],
      modal: false,
      dialogVisible: false,
      dialogVisibleUse: false,
      form: {},
      authId: "",
      rules: {
        key: [{ required: false, message: "不能为空", trigger: "blur" }],
        back_url: [{ required: true, message: "不能为空", trigger: "blur" }],
        name: [{ required: true, message: "不能为空", trigger: "blur" }],
        remark: [{ required: true, message: "不能为空", trigger: "blur" }],
        start_time: [{ required: true, message: "不能为空", trigger: "blur" }],
        end_time: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      tagData: [],
      value: "",
      labelPosition: "left",
      options: [],
      list: [],
      tagList: [],
      value1: "",
      danger_type: "网页授权",
      danger_ontent: "删除网页授权，此操作会网页授权",
      danger_item: {},
      pickerOptions: {},
      select_words: "",
      selectObj: {
        key: "",
        start_time: "",
        end_time: "",
        name: ""
      },
      timepicker: "",
      limit: 10,
      page: 1,
      totals: 0,
      currentPage: 0
    };
  },
  mounted() {
    // this.list = this.tagData.map(item => {
    //   return { value: item, label: item };
    // });
  },
  created() {
    if (localStorage.getItem("pages")) {
      this.page = JSON.parse(localStorage.getItem("pages")).oauth || this.page;
      this.currentPage =
        JSON.parse(localStorage.getItem("pages")).oauth || this.page;
    }
    this.getalldiytag();
    this.getData();
    // 获取自定义标签
    this.gettagData();
  },
  methods: {
    // 重置
    reset() {
      this.selectObj.key = "";
      this.selectObj.name = "";
      this.selectObj.start_time = "";
      this.selectObj.end_time = "";
      this.timepicker = "";
      this.handleSelect();
    },
    // 提取对象中的key  value  并将其拼接到url上  这个是为了导出需要的url
    exportData(selectObj = this.selectObj) {
      this.webauthObj = {
        appid: this.$store.getters.showQuery,
        page: this.page,
        limit: this.limit,
        key: selectObj.key,
        start_time: selectObj.start_time,
        end_time: selectObj.end_time,
        name: selectObj.name,
        type: 2
      };
      window.location.href =
        this.GLOBAL.BASE_URL +
        "webauthexport?" +
        this.encodeUrl(this.webauthObj);
    },
    handleSelect(selectObj) {
      this.getData(selectObj);
    },
    getpickerTimes(val) {
      if (val) {
        this.selectObj.start_time = parseInt(val[0].getTime() / 1000);
        this.selectObj.end_time = parseInt(val[1].getTime() / 1000);
        this.getData(this.selectObj);
      } else {
        this.selectObj.start_time = "";
        this.selectObj.end_time = "";
        this.getData(this.selectObj);
      }
    },
    // 选择日期
    confirmDate(type, val) {
      if (type == "start") {
        this.form.start_time = this.$utils.format(val);
      } else if (type == "end") {
        this.form.end_time = this.$utils.format(val);
      }
      if (this.form.start_time && this.form.end_time) {
        let start = new Date(this.form.start_time).getTime();
        let end = new Date(this.form.end_time).getTime();
        if (start > end) {
          this.$message.error("开始时间不能大于结束时间,请重新选择");
          this.form.start_time = "";
          this.form.end_time = "";
        } else {
        }
      }
    },
    useTips() {
      this.dialogVisibleUse = true;
    },
    // 取出标签名称
    // 显示标签名称
    showTag(value) {
      if (value) {
        value = JSON.parse(value);
        let result = [];
        for (var j = 0; j < value.length; j++) {
          for (var i = 0; i < this.tagList.length; i++) {
            if (value[j] == this.tagList[i].value) {
              result.push(this.tagList[i].label);
            }
          }
        }
        return result;
      }
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
            this.tagList = this.changeDiyTagsList(res.data.data.data);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 将json数据中的id和name转化为value和label
    changeDiyTagsList(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/tag_id/g, "value"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/tag_name/g, "label"));
      return obj2;
    },
    // 标签筛选
    remoteMethod(query) {
      // console.log(query);
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
    // 选择标签
    getTags(val) {
      // console.log(val);
      this.form.tagid = val;
    },
    // 关闭授权弹窗---重新获取数据
    handleClose(formRule) {
      this.getData();
    },
    // 翻页
    handleCurrentChange(val) {
      this.page = val;
      this.getData();
      let pages = JSON.parse(localStorage.getItem("pages"));
      pages.oauth = val;
      localStorage.setItem("pages", JSON.stringify(pages));
    },
    // 选择条数
    handleSizeChange(val) {
      this.page = this.currentPage;
      this.limit = val;
      this.getData();
    },
    // 获取数据
    getData(selectObj = this.selectObj) {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "weboath", {
          appid: this.$store.getters.showQuery,
          page: this.page,
          limit: this.limit,
          key: selectObj.key,
          start_time: selectObj.start_time,
          end_time: selectObj.end_time,
          name: selectObj.name
        })
        .then(res => {
          this.loading = false;
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
            this.totals = res.data.data.total;
            this.currentPage1 = res.data.data.current_page;
            if (this.page > res.data.data.last_page) {
              this.page = res.data.data.last_page;
              this.getData();
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 添加授权
    addOauth() {
      this.dialogVisible = !this.dialogVisible;
      this.authId = "";
      this.value1 = "";
      this.form = {};
    },
    // 编辑授权信息
    handleEdit(value) {
      this.authId = value.id;
      this.value1 = JSON.parse(value.tagid);
      this.dialogVisible = !this.dialogVisible;
      this.$nextTick(() => {
        //  start_time: [{ required: true, message: "不能为空", trigger: "blur" }],
        // end_time: [{ required: true, message: "不能为空", trigger: "blur" }]
        this.form = {
          back_url: value.back_url,
          key: value.key,
          name: value.name,
          remark: value.remark,
          start_time: value.start_time,
          end_time: value.end_time
        };
      });
    },

    // 删除
    dangerSure() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "weboathdel", {
          appid: this.$store.getters.showQuery,
          id: this.danger_item.id
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("操作成功");
            this.getData();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 删除授权
    handleDelete(value) {
      this.danger_item = value;
      this.$refs.danger.showDanger();
    },
    // 提交授权
    onSubmit(value) {
      this.isDisable = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.checkURL(this.form.back_url)) {
            this.$axios
              .post(this.GLOBAL.BASE_URL + "weboathadd", {
                appid: this.$store.getters.showQuery,
                remark: this.form.remark,
                key: this.form.key,
                back_url: this.form.back_url,
                name: this.form.name,
                id: this.authId,
                tagid: this.form.tagid,
                start_time: this.form.start_time,
                end_time: this.form.end_time
              })
              .then(res => {
                this.isDisable = false;
                if (res.data.code == 0) {
                  this.$message.success("操作成功");
                  this.getData();
                  this.dialogVisible = !this.dialogVisible;
                  this.isDisable = false;
                } else {
                  this.isDisable = false;
                  this.$message.error(res.data.message);
                }
              });
          } else {
            this.$message.error("域名格式不正确");
            this.isDisable = false;
          }
        } else {
          this.isDisable = false;
          return false;
        }
      });
    },
    // 正则表达式判断url是否真确
    checkURL(URL) {
      var str = URL;
      var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
      var objExp = new RegExp(Expression);
      if (objExp.test(str) == true) {
        return true;
      } else {
        return false;
      }
    },
    gettagData() {
      this.loading = true;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "getalldiytag", {
          appid: this.$store.getters.showQuery,
          page: 1,
          limit: 1000000000
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
    changeTagsList(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/tag_id/g, "value"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/tag_name/g, "label"));

      return obj2;
    }
  }
};
</script>
<style lang='scss' scoped>
.timepicker {
  width: auto;
  display: inline-block;
  margin-right: 10px;
}
.authInfo {
  width: 100%;
  height: 600px;
  overflow: auto;
  p {
    margin: 10px 0;
  }
}
/* 滚动槽 */
.authInfo::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.authInfo::-webkit-scrollbar-track {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.06);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.08);
}
.authInfo::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.12);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
}
.authInfo img {
  width: 80%;
  text-align: center;
}
.remark {
  text-align: center;
  background: #79c1fb;
  border-radius: 2px;
  margin: auto;
  color: #fff;
  margin-bottom: 4px;
  box-sizing: border-box;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  padding: 4px;
}
.remarks {
  display: inline-block;
  margin-right: 5px;
}
.dialog {
  margin-top: -2vh;
}
.qrurl {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
}


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