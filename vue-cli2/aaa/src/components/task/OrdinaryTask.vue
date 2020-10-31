<template>
  <div class="table">
    <div class="crumbs">
      <h2>普通群发</h2>
    </div>
    <div class="container">
      <el-form ref="form" :model="form">
        <el-form-item label="标签筛选">
          <el-select v-model="normalObj.tagid" placeholder="请选择标签" @change="getTag">
            <el-option
              v-for="item in tagList"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-tooltip class="item" effect="dark" content="选择群发内容" placement="top">
            <el-button type="primary" icon="el-icon-plus" @click="addMessage()">选择群发内容</el-button>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <div class="messages">
        <p v-if="type == '1'">{{message}}</p>
        <div class="imgItem" v-loading="loading" v-else-if="type === '6'">
          <div class="img" @click="chooseImg(message)">
            <!-- <el-image :src="showImg(message.url)" :fit="fit"></el-image> -->
            <div class="imgs">
              <img v-if="message.url" :src="showImg(message.url)" />
            </div>
            <span class="imgTxt">{{message.name}}</span>
          </div>
        </div>
        <div v-else-if="type == '2'">
          <div class="infos">
            <div class="infositem">
              <div v-if="message.info">
                <div class="infositem_bg">
                  <div class="infositem_head" v-if="message.info">{{message.info[0].title}}</div>
                  <div class="infositem_body">
                    <div
                      class="infositem_body_left"
                      v-if="message.info"
                    >{{message.info[0].description}}</div>
                    <div class="infositem_body_right" v-if="message.info">
                      <img v-if="message.info" :src="showImg(message.info[0].picurl)" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="type === '4'">
          <div class="infos">
            <div class="infositem">
              <div v-if="message.info">
                <div class="infositem_bg">
                  <div class="infositem_head">{{message.info.news_item[0].title}}</div>
                  <div class="infositem_img">
                    <!-- <a v-if="message.info.news_item[0]" :href="message.info.news_item[0].url" target="view_window" class="active">预览</a> -->
                    <!-- <el-image v-if="message.info.news_item[0]" :src="showImg((message.info.news_item[0].thumb_url))" fit="fit"></el-image> -->
                    <div class="imgs">
                      <img
                        v-if="message.info.news_item[0]"
                        :src="showImg((message.info.news_item[0].thumb_url))"
                      />
                    </div>
                  </div>
                  <div
                    class="infositem_foot"
                    v-if="message.info.news_item[0]"
                  >{{message.info.news_item[0].digest}}</div>
                </div>
                <div class="nextInfos" v-show="ishift(message.info.news_item).length">
                  <div
                    class="nextInfosbg"
                    v-for="(item,index) in ishift(message.info.news_item)"
                    :key="index"
                  >
                    <!-- <a :href="item.url" target="view_window" class="active">预览</a> -->
                    <div class="nextInfos_head">{{item.title}}</div>
                    <div class="nextInfos_img">
                      <el-image :src="showImg(item.thumb_url)" fit="fit"></el-image>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="type === '3'">
          <div class="imgItem" v-loading="loading">
            <div class="img" @click="chooseImg(message)">
              <div class="voiceBg">
                <i class="el-icon-microphone"></i>
              </div>
              <span class="imgTxt">{{message.name}}</span>
            </div>
          </div>
        </div>
        <div v-else-if="type === '5'">
          <div class="imgItem" v-loading="loading">
            <div class="img" @click="chooseImg(message)">
              <div class="voiceBg">
                <i class="el-icon-video-camera-solid"></i>
              </div>
              <span class="imgTxt">{{message.name}}</span>
            </div>
          </div>
        </div>
        <div v-else-if="type === '10'">
          <div class="coupon">
            <div v-if="message.info">
              <div v-if="message.info.card">
                <div v-if="message.info.card.card_type">
                  <div v-if="message.info.card.cardInfo.base_info">
                    <div
                      class="couponbg"
                      :style="{background: message.info.card.cardInfo.base_info.color}"
                    >
                      <div class="coupon_head">
                        <div class="coupon_head_left">
                          <img :src="message.info.card.cardInfo.base_info.logo_url" />
                        </div>
                        <div class="coupon_head_right">
                          <p>{{message.info.card.cardInfo.base_info.title}}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tools">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label>
            <el-input v-model="OpenId" placeholder="OpenId"></el-input>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="发送预览" placement="top">
              <el-button type="primary" @click="PreView()">发送预览</el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-tooltip class="item" effect="dark" content="群发" placement="top">
              <el-button type="primary" @click="sendMessage">群发</el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>
      </div>
      <div class="tips">
        <i class="el-icon-info"></i>&nbsp;群发消息有20s的延迟
      </div>
    </div>
    <el-dialog title="选择素材" :visible.sync="dialogVisible" @close="handleClose()">
      <v-material ref="materials" @listenChild="showChild" showTips="true"></v-material>
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
import vMaterial from "../dialogs/material";
import BaseView from "../common/BaseView";
export default {
  extends: BaseView,
  components: {
    vMaterial,
    vDanger
  },
  data() {
    return {
      isDisable1: false,
      isDisable2: false,
      fit: "cover",
      form: {},
      loading: false,
      formInline: {},
      tagId: "",
      tagList: [],
      dialogVisible: false,
      message: {},
      type: "",
      OpenId: "",
      normalObj: {
        appid: "",
        type: "",
        value: "",
        tagid: "",
        tagname: ""
      },
      danger_type: "群发",
      danger_ontent: "群发，此操作会将消息群发给所有的用户",
      item: ""
    };
  },
  created() {
    this.normalObj.appid = this.$store.getters.showQuery;
    this.biao_qian_list();
  },
  methods: {
    handleClose() {
      // 触发素材组件方法
      this.$refs.materials.resetData();
      this.isDisable2 = false;
    },
    // 获取标签
    getTag(val) {
      let obj = {};
      obj = this.tagList.find(item => {
        return item.value == val;
      });
      this.normalObj.tagid = val;
      this.normalObj.tagname = obj.label;
    },
    // 发送预览功能
    PreView() {
      // normal_news_preview
      this.isDisable1 = true;
      if (this.normalObj.value == "") {
        this.$message.warning("预览内容不能为空");
        this.isDisable1 = false;
      } else {
        this.normal_news_preview();
      }
    },
    // 选择群发内容 弹出弹窗
    addMessage() {
      this.dialogVisible = true;
    },
    // 监听   material   子组件  的事件 获取到子组件传来的数据
    showChild(type, data) {
      this.message = {};
      this.type = "";
      switch (parseInt(type)) {
        case 1:
          this.normalObj.value = data;
          break;
        case 2:
          this.normalObj.value = data.id;
          this.normalObj.url = data.info[0].picurl;
          break;
        case 3:
          this.normalObj.value = data.media_id;
          break;
        case 4:
          this.normalObj.value = data.id;
          this.normalObj.url = data.info.news_item[0].thumb_url;
          break;
        case 5:
          this.normalObj.value = data.media_id;
          break;
        case 6:
          this.normalObj.value = data.media_id;
          this.normalObj.url = data.url;
          break;
        case 10:
          this.normalObj.value = data.code;
          break;
        default:
          break;
      }
      this.normalObj.type = type;
      if (parseInt(this.normalObj.type) == 7) {
        this.normalObj.type = 10;
      }
      this.type = type;
      this.message = data;
      this.dialogVisible = false;
    },
    // 点击图片
    chooseImg() {},
    // 删掉数组中的第一个数据
    ishift(arr) {
      let newArr = arr.map(o => Object.assign({}, o));
      newArr.shift();
      return newArr;
    },
    // 获取标签组
    biao_qian_list() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "biao_qian_list", {
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tagList = this.changeTagsList(res.data.data);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 修改对象属性
    changeTagsList(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/id/g, "value"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/name/g, "label"));
      return obj2;
    },
    sendMessage() {
      this.isDisable2 = true;
      if (this.normalObj.value == "") {
        this.$message.warning("群发内容不能为空");
        this.isDisable2 = false;
      } else {
        this.$refs.danger.showDanger();
      }
    },
    dangerSure() {
      this.normal_news_add();
    },
    normal_news_add() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "normal_news_add", this.normalObj)
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("群发成功");
            this.isDisable2 = false;
          } else {
            this.isDisable2 = false;
            this.$message.error(res.data.message);
          }
        });
    },
    normal_news_preview() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "normal_news_preview", {
          appid: this.normalObj.appid,
          tagid: this.normalObj.tagid,
          tagname: this.normalObj.tagname,
          openid: this.OpenId,
          type: this.normalObj.type,
          value: this.normalObj.value
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success("发送预览成功");
            this.isDisable1 = false;
          } else {
            this.isDisable1 = false;
            this.$message.error(res.data.message);
          }
        });
    }
  }
};
</script>

<style lang='scss' scoped>
.infositem_body {
  width: 100%;
  display: flex;
  max-height: 100px;
  overflow: hidden;
}
.infositem_body_left {
  width: 60%;
  overflow: hidden;
  padding: 10px;
  box-sizing: border-box;
}
.infositem_body_right {
  width: 40%;
  overflow: hidden;
  padding: 10px 0;
  box-sizing: border-box;
}
.infositem_body_right img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.coupon {
  width: 150px;
  height: 70px;
  display: inline-flex;
  margin-right: 10px;
  margin-bottom: 10px;
  position: relative;
  border: 1px solid rgb(230, 227, 227);
  border-radius: 2px;
  overflow: hidden;
  cursor: pointer;
}
.couponbg {
  width: 150px;
  height: 70px;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 2px;
}
.coupon_head {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
}
.coupon_head_left {
  width: 40px;
  height: 40px;
  border-radius: 100%;
  overflow: hidden;
  flex-shrink: 0;
  img {
    width: 100%;
    height: 100%;
  }
}
.coupon_head_right {
  width: calc(100% - 40px);
  margin-left: 4px;
  p {
    color: #fff;
  }
}
.coupon_body {
  width: 100%;
  height: 30px;
  background: #fff;
}
.imgs {
  width: 100%;
  height: 100%;
}
.imgs > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.tips {
  font-size: 12px;
  color: rgb(144, 145, 148);
}
.voiceBg {
  width: 100%;
  height: 100%;
  background: #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
}
.voiceBg i {
  font-size: 30px;
}
/* -------------------- */
.tools {
  width: 40%;
}
.tools_input {
  width: 50%;
}
.nextInfosbg {
  width: 100%;
  height: 100px;
  display: flex;
  border-top: 1px solid #ccc;
  overflow: hidden;
  position: relative;
}
.nextInfosbg .active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  justify-content: center;
  align-items: center;
  background: rgba(120, 123, 124, 0.5);
  color: #fff;
  font-size: 16px;
  z-index: 10;
}
.nextInfosbg:hover .active {
  display: flex;
}
.nextInfos_head {
  width: 60%;
  height: 100px;
  display: inline-block;
  line-height: 100px;
  box-sizing: border-box;
  padding: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.nextInfos_img {
  width: 40%;
  height: 100px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
/* ---------------- */
.infos {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.infos .infositem {
  width: 250px;
  height: 100%;
  border: 1px solid #ccc;
  position: relative;
  cursor: pointer;
  display: inline-flex;
  flex-direction: column;
  border-radius: 5px;
  overflow: hidden;
}
.infos .infositem .infositem_head {
  width: 100%;
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
  padding: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.infos .infositem .infositem_img {
  width: 220px;
  height: 160px;
  margin: auto;
  overflow: hidden;
  position: relative;
}
.infos .infositem .infositem_img .active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  justify-content: center;
  align-items: center;
  background: rgba(120, 123, 124, 0.5);
  color: #fff;
  font-size: 16px;
}
.infos .infositem .infositem_img:hover .active {
  display: flex;
}
/* .infos .infositem .infositem_img img {
  width: 100%;
} */
.infos .infositem .infositem_foot {
  width: 100%;
  height: 30px;
  text-align: center;
  line-height: 30px;
  box-sizing: border-box;
  padding: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.infositem_tool {
  width: 100%;
  height: 50px;
  border-top: 1px solid #ccc;
  display: flex;
}
.infositem_tools {
  width: 50%;
  height: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
/* ----------------- */
.imgItem {
  width: 100%;
  height: 100%;
}
.imgItem .img {
  display: inline-block;
  width: 150px;
  height: 170px;
  position: relative;
  border: 1px solid #ccc;
  margin-right: 20px;
  margin-bottom: 20px;
  overflow: hidden;
}
/* .imgItem .img img {
  width: 100%;
  height: auto;
} */
.imgItem .img .imgTxt {
  width: 100%;
  height: 20px;
  position: absolute;
  left: 0;
  bottom: 0;
  border-top: 1px solid #ccc;
  text-align: center;
  line-height: 20px;
  background: #fff;
}
.imgItem .img .imgClose {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(77, 76, 76, 0.5);
  color: #fff;
}
.imgItem .img .imgClose i {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 40px;
  cursor: pointer;
}
/* ------------------- */
.messages {
  width: 50%;
  height: 100%;
  padding: 20px 0;
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
