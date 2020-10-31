<template>
  <div class="table">
    <div class="crumbs">
      <h2>新建商品</h2>
    </div>
    <div class="container">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick(activeName)">
        <el-tab-pane label="基本信息" name="1">
          <div class="addArea">
            <el-form ref="addGoods" :model="addGoods" :rules="rules" label-width="150px">
              <el-form-item label="商品名称" prop="name">
                <div class="largeinput">
                  <el-input
                    v-model="addGoods.name"
                    type="text"
                    maxlength="60"
                    placeholder="最多只能输入60个字符"
                  ></el-input>
                </div>
              </el-form-item>
              <el-form-item label="上架状态" prop="state">
                <el-switch
                  v-model="addGoods.state"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-value="1"
                  inactive-value="2"
                ></el-switch>
                <span class="showState">{{showState(addGoods.state)}}</span>
              </el-form-item>
              <el-form-item label="商品类型" prop="type">
                <el-radio-group v-model="addGoods.type">
                  <el-radio label="1">实体商品</el-radio>
                  <el-radio label="2">虚拟商品</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="商品售价"
                prop="price"
                :rules="[
                  { required: true, message: '商品售价不能为空'},
                ]"
              >
                <div class="middleinput">
                  <el-input v-model.number="addGoods.price"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="商品原价" prop="o_price" 
                :rules="[
                  { required: true, message: '商品原价不能为空'},
                ]">
                <div class="middleinput">
                  <el-input v-model.number="addGoods.o_price"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="商品库存" prop="stock"
                :rules="[
                  { required: true, message: '商品库存不能为空'},
                  { type: 'number', message: '商品库存必须为数字值'}
                ]">
                <div class="middleinput">
                  <el-input v-model.number="addGoods.stock"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="商品销量" prop="sales_volume" 
                :rules="[
                  { required: true, message: '商品销量不能为空'},
                  { type: 'number', message: '商品销量必须为数字值'}
                ]">
                <div class="middleinput">
                  <el-input v-model.number="addGoods.sales_volume"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="封面图片" prop="img">
                <template slot-scope>
                  <div class="fm upload">
                    <el-upload
                      class="upload-demo"
                      :action="img_add"
                      :data="uploadData"
                      multiple
                      :before-upload="beforeAvatarUpload"
                      :on-success="uploadSuccess"
                      :on-error="uploadError"
                      :show-file-list="false"
                    >
                      <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                    <!-- <p style="font-size:12px;color:gray;white-space:nowrap;">支持jpg、png图片格式，大小不超过2M</p> -->
                  </div>
                  <div class="imgs fm" v-for="(item,index) in fmimgData" :key="index">
                    <i class="el-icon-error" @click="delImg(item,index)"></i>
                    <el-image :src="showImg(item.path)" fit="cover"></el-image>
                    <!-- <p class="fmid">{{item.id}}</p> -->
                  </div>
                </template>
              </el-form-item>
              <el-form-item label="商品积分使用上限" prop="max_integral"
                :rules="[
                  { required: true, message: '商品积分使用上限不能为空'},
                  { type: 'number', message: '商品积分使用上限必须为数字值'}
                ]">
                <div class="middleinput">
                  <el-input v-model.number="addGoods.max_integral"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="	购买商品赠送积分" prop="gice_integral"
                :rules="[
                  { required: true, message: '购买商品赠送积分不能为空'},
                  { type: 'number', message: '购买商品赠送积分必须为数字值'}
                ]">
                <div class="middleinput">
                  <el-input v-model.number="addGoods.gice_integral"></el-input>
                </div>
              </el-form-item>
              <el-form-item label="限购" prop="quota">
                <el-switch
                  v-model="addGoods.quota"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-value="1"
                  inactive-value="0"
                ></el-switch>
              </el-form-item>
              <el-form-item label="券开始时间" prop="start">
                <div class="time">
                  <el-date-picker
                    v-model="addGoods.start"
                    placeholder="选择日期时间"
                    type="datetime"
                    align="bottom"
                    :picker-options="pickerOptions"
                    @change="confirmDate('start',addGoods.start)"
                  ></el-date-picker>
                </div>
              </el-form-item>
              <el-form-item label="券结束时间" prop="end">
                <div class="time">
                  <el-date-picker
                    v-model="addGoods.end"
                    placeholder="选择日期时间"
                    type="datetime"
                    align="bottom"
                    :picker-options="pickerOptions"
                    @change="confirmDate('end',addGoods.end)"
                  ></el-date-picker>
                </div>
              </el-form-item>
              <el-form-item label="轮播图" prop="img">
                <template slot-scope>
                  <div class="fm upload">
                    <el-upload
                      class="upload-demo"
                      :action="img_add"
                      :data="uploadDataBanner"
                      :before-upload="beforeAvatarUpload_banner"
                      :on-success="uploadSuccess_banner"
                      :on-error="uploadError_banner"
                      :show-file-list="false"
                    >
                      <el-button size="small" type="primary">点击上传</el-button>

                      <!--  -->
                    </el-upload>
                    <!-- <p style="font-size:12px;color:gray;white-space:nowrap;">支持jpg、png图片格式，大小不超过2M</p> -->
                  </div>
                  <div class="imgs banner" v-for="(item,index) in BannerData" :key="index">
                    <i class="el-icon-error" @click="delBanImg(item,index)"></i>
                    <el-image :src="(item.path)" fit="cover"></el-image>
                  </div>
                </template>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品详情" name="2">
          <div class="iedit">
            <quill-editor
              v-model="addGoods.text"
              ref="myQuillEditor"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @change="onEditorChange($event)"
            ></quill-editor>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="addBtn" v-if="!is_edit">
        <el-button type="primary" @click="addGoodsHandle(addGoods)" :disabled="isDisable">添加商品</el-button>
      </div>
      <div class="addBtn" v-else>
        <el-button type="primary" @click="editGoodsHandle(addGoods)" :disabled="isDisable">确认修改</el-button>
        <el-button @click="back()" icon="el-icon-back">返回商品列表页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import BaseView from "../common/BaseView";
export default {
  extends: BaseView,
  components: {
  },
  data() {
    return {
      img_add: this.GLOBAL.BASE_URL + 'shop/img_add',
      isDisable: false,
      content: "",
      editorOption: {},
      // 规则
      rules: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
       
        o_price: [
          { required: true, message: "请输入商品原价", trigger: "blur" }
        ],
        stock: [{ required: true, message: "请输入商品库存", trigger: "blur" }],
        sales_volume: [
          { required: true, message: "请输入销量", trigger: "blur" }
        ],
        max_integral: [
          { required: true, message: "请输入商品积分使用上限", trigger: "blur" }
        ],
        gice_integral: [
          { required: true, message: "请输入购买商品赠送积分", trigger: "blur" }
        ],
        start: [
          { required: true, message: "请输入券开始时间", trigger: "blur" }
        ],
        end: [{ required: true, message: "请输入券结束时间", trigger: "blur" }]
      },
      uploadData: {
        appid: ""
      },
      uploadDataBanner: {
        appid: ""
      },
      uploadImg_dialogVisible: false,
      imgData: [],
      // 封面图片
      fmimgData: [],
      // 轮播图数据
      BannerData: [],
      // 商品新增参数
      addGoods: {
        appid: "",
        name: "",
        state: "1",
        fm_id: "",
        text: "暂无",
        price: "",
        o_price: "",
        stock: "",
        sales_volume: "",
        max_integral: "",
        gice_integral: "",
        lbts: [],
        quota: "0",
        start: "",
        end: "",
        type: "1"
      },
      banner: {
        id: "",
        url: "", //h5跳转地址
        url1: "", //小程序跳转地址
        number: "1", //排序序号
        appid: "",
        img_id: "" //图篇id
      },
      // activeName
      activeName: "1",
      // 判断是添加还是修改
      is_edit: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e6;
        }
      }
    };
  },
  created() {
    this.getGoodsInfo();
    this.addGoods.appid = this.$store.getters.showQuery;
    this.uploadData.appid = this.$store.getters.showQuery;
    this.uploadDataBanner.appid = this.$store.getters.showQuery;
  },
  // 离开当前页面
  destroyed: function() {
    if (localStorage.getItem("addGoods")) {
      localStorage.removeItem("addGoods");
    }
  },
  methods: {
    // 富文本编辑
    onEditorBlur() {},
    onEditorFocus() {},
    onEditorChange() {},
    // 删除banner
    delBanImg(item, idx) {
      this.BannerData.splice(idx, 1);
      this.addGoods.lbts.splice(idx, 1);
    },
    // handleClick
    handleClick() {},
    // 回到商品页面
    back() {
      this.$router.push({
        path: "/goodslist"
      });
    },
    // 将state参数改变类型  （number转string）
    NumStr(data) {
      if (data.type) {
        data.type = String(data.type);
      }
      if (data.state) {
        data.state = String(data.state);
      }
      if (data.quota) {
        data.quota = String(data.quota);
      }
      return data;
    },
    // 上下架状态
    showState(value) {
      if (parseInt(value) == 1) {
        // 上架
        return "上架";
      } else if (parseInt(value) == 2) {
        // 下架
        return "下架";
      } else if (parseInt(value) == 3) {
        // 回收站
        return "回收站";
      }
    },
    // 判断是否是通过修改商品进来的,从而获取详情
    getGoodsInfo() {
      let getGoods = {};
      if (this.$route.params && this.$route.params.id) {
        getGoods = this.$route.params;
      } else if (localStorage.getItem("addGoods")) {
        let Cookie_addGoods = JSON.parse(localStorage.getItem("addGoods"));
        getGoods = Cookie_addGoods;
      } else {
      }
      if (Object.keys(getGoods).length) {
        this.is_edit = true;
        this.get_good(getGoods, response => {
          this.addGoods = this.NumStr(response);
          if (response.fm_path) {
            this.fmimgData.push(response.fm_path);
            this.BannerData = response.good_img;
            let lbts = [];
            this.BannerData.forEach(ele => {
              if (ele.url) {
                ele.path = ele.url;
              }
              lbts.push(ele.id);
            });
            this.addGoods.lbts = lbts;
          }
        });
      }
    },
    // 商品详情
    get_good(item, cb) {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "shop/get_good", {
          id: item.id,
          appid:  this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            cb(res.data.data);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 修改商品
    editGoodsHandle() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "shop/good_edit", this.addGoods)
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("修改成功，即将返回商品页");
            setTimeout(() => {
              this.$router.push({
                path: "/goodslist"
              });
            }, 500);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 添加商品
    addGoodsHandle() {
      this.isDisable = true;
      this.$refs["addGoods"].validate(valid => {
        if (valid) {
          this.$axios
            .post(this.GLOBAL.BASE_URL + "shop/good_add", this.addGoods)
            .then(res => {
              if (res.data.code == 0) {
                this.$message.success("操作成功，即将返回商品页");
                setTimeout(() => {
                  this.$router.push({
                    path: "/goodslist"
                  });
                  this.isDisable = false;
                }, 500);
              } else {
                this.$message.error(res.data.message);
                this.isDisable = false;
              }
            });
        } else {
          this.$message.error("请完整填写商品信息");
          this.isDisable = false;
          return false;
        }
      });
    },
    // 选择日期
    confirmDate(type, val) {
      if (type == "start") {
        this.addGoods.start = this.$utils.format(val);
      } else if (type == "end") {
        this.addGoods.end = this.$utils.format(val);
      }
      if (this.addGoods.start && this.addGoods.end) {
        if (
          new Date(this.addGoods.start).getTime() >
          new Date(this.addGoods.end).getTime()
        ) {
          this.$message.error("开始时间不能大于结束时间,请重新选择");
          this.addGoods.start = "";
          this.addGoods.end = "";
        }
      }
    },
    // 不足10加0
    add(m) {
      return m < 10 ? "0" + m : m;
    },
    // 日期格式
    format(date) {
      var time = new Date(date);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return (
        y +
        "-" +
        this.add(m) +
        "-" +
        this.add(d) +
        " " +
        this.add(h) +
        ":" +
        this.add(mm) +
        ":" +
        this.add(s)
      );
    },
    delImg(item, index) {
      this.fmimgData.splice(index, 1);
    },
    // 上传图片拿到id和url传进去
    uploadSuccess(res, file) {
      this.fmimgData = [];
      this.fmimgData.push(res.data);
      this.fmimgData.forEach(ele => {
        ele.path = ele.url;
      });
      this.addGoods.fm_id = res.data.id;
    },
    uploadSuccess_banner(res, file) {
      this.BannerData.push(res.data);
      let lbts = [];
      this.BannerData.forEach(ele => {
        if (ele.url) {
          ele.path = ele.url;
        }
        lbts.push(ele.id);
      });
      this.addGoods.lbts = lbts;
    },
    beforeAvatarUpload_banner(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    uploadError() {},
    uploadError_banner() {}
  }
};
</script>
<style>
.addArea {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  border-radius: 5px;
  padding: 20px 0px 0 0;
}
/* -------------- */
.upload .el-upload--text {
  border: none;
  width: auto;
  height: 30px;
}
</style>
<style scoped>
.iedit {
  width: 100%;
  height: auto;
}
.banner {
  margin-top: 0px !important;
}
.upload-demo {
  width: 360px;
}
.upload {
  width: 0px;
  height: auto;
  border: none;
  z-index: -1;
  margin-right: 100px;
}
.upload .upload-demo .el-upload--text {
  width: 0px;
  height: 0px;
  border: none;
}
/* --------------- */
.line {
  margin-right: 10px;
}
.largeinput {
  width: 400px;
}
.middleinput {
  width: 200px;
}
.fm {
  float: left;
  margin-top: 0px !important;
}
.fmid {
  color: #fff;
  font-size: 16px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
/* --------------- */
.imgs {
  float: left;
  width: 150px;
  height: 150px;
  border-radius: 5px;
  margin-top: 10px;
  overflow: hidden;
  margin-right: 10px;
  border: 1px solid #ddd;
  position: relative;
}

.imgs > i {
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 20px;
  color: #fff;
  z-index: 99;
  cursor: pointer;
}
/* --------------- */
.imgurl {
  width: 150px;
  height: 150px;
  border: dashed 1px #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}
.imgurl:hover {
  border-color: rgb(32, 153, 209);
}
.imgurl > i {
  font-size: 20px;
}
/* --------------------- */
.container {
  position: relative;
}
.info {
  width: 100%;
  height: 100%;
  background: #f2f2f6;
  padding: 20px;
  border-radius: 5px;
  box-sizing: border-box;
}
.info_title {
  text-align: left;
  font-size: 16px;
}
.form {
  width: 80%;
  margin: 20px auto;
}
.addBtn {
  margin-top: 10px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
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
