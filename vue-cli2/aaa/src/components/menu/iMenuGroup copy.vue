<template>
  <div class="table">
    <div class="crumbs">
      <h2>个性化菜单编辑</h2>
    </div>
    <br />
    <div class="contv">
      <div class="menuarea">
        <div class="menuarea_tit"></div>
        <div class="mobile_nav">
          <ul class="premenu_list premenu_list1 premenu_list2 premenu_list3">
            <li
              v-for="(item, index) in menu.list"
              :class="['premenu_li'+ menu.list.length]"
              :key="index"
            >
              <a
                href="javascript:void(0);"
                @click="activeSelected(item.id)"
                class="prelink_left_a"
                :class="{prelink_a : isActive(item.id)}"
              >
                <!-- <div class="menuTool">
                  <div class="tools left" @click="handleLeft(index)">
                    <svg-icon icon-class="left"></svg-icon>
                  </div>
                  <div class="tools right" @click="handleRight(index)">
                    <svg-icon icon-class="right"></svg-icon>
                  </div>
                </div> -->
                <span>{{item.name}}</span>
                <!-- <span>{{item.id}}</span> -->
              </a>
              <div class="ziprenav" :class="{active : isActive(item.id)}">
                <ul class="ziprenav_ul">
                  <li
                    v-for="(value, key) in item.list"
                    :class="{current : isCurrent(value.id)}"
                    :key="key"
                  >
                      <!-- <div class="zipmenuTool">
                        <div class="ziptools up" @click="handleUp(item.list)">
                          <svg-icon icon-class="up"></svg-icon>
                        </div>
                        <div class="ziptools down" @click="handleDown(item.list)">
                          <svg-icon icon-class="down"></svg-icon>
                        </div>
                      </div> -->
                    <a href="javascript:void(0);" @click="currentSelected(value.id)">
                      <span>{{value.name}}</span>
                    </a>
                  </li>
                  <li class="preadd" :style="item.list.length == 5 ? 'display:none' : ''">
                    <a
                      href="javascript:void(0);"
                      @click="twoLevelMenuAdd(item.id)"
                      title="最多添加5个子菜单"
                    >
                      <span>
                        <i></i>
                      </span>
                    </a>
                  </li>
                </ul>
                <i class="arrow arrow_out"></i>
                <i class="arrow arrow_in"></i>
              </div>
            </li>
            <!-- {{menu.list.length}} -->
            <li
              class="proadd"
              :class="['premenu_li'+ (menu.list.length > 0 ? menu.list.length : '')]"
            >
              <a
                href="javascript:void(0);"
                @click="oneLevelMenuAdd"
                :class="['prelink_left_a', menu.list.length == 0 ? 'prelink_a' : '' ]"
                title="最多添加3个一级菜单"
              >
                <i></i>
                <span v-if="menu.list.length == 0">菜单名称</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="widget container">
        <div class="card-box">
          <el-form ref="form">
            <el-form-item label>
              <!-- <el-input v-model="menuObject.topName"></el-input> -->
            </el-form-item>
            <el-form-item label>
              <el-input v-model="menuObject.key" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label>
              <el-input v-model="menuObject.name" :maxlength="maxlength" show-word-limit>
                <template slot="prepend">菜单名称</template>
              </el-input>
            </el-form-item>
            <el-form-item label>
              <el-radio-group v-model="menuObject.type" @change="handleResource(menuObject)">
                <el-radio label="click">发送消息</el-radio>
                <el-radio label="view">跳转网页</el-radio>
                <el-radio label="miniprogram">跳转小程序</el-radio>
                <el-radio label="fntype">功能键</el-radio>
                <el-radio label="keytype">关键字</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="menuObject.type == 'view'"
              :rules="[
              { required: true, message: '不能为空'},
            ]"
            >
              <el-input v-model="menuObject.url" placeholder="链接">
                <template slot="prepend">网页url</template>
              </el-input>
            </el-form-item>
            <el-form-item v-if="menuObject.type == 'click'">
              <el-tooltip class="item" effect="dark" content="新增发送内容" placement="top">
                <el-button type="primary" @click="addContent">添加内容</el-button>
              </el-tooltip>
            </el-form-item>
            <el-form-item v-if="menuObject.type == 'click'">
              <el-table
                :data="menuObject.materialData"
                :header-cell-style="{background:'#f9f9f9'}"
                style="width: 100%"
              >
                <el-table-column fixed label="序号" width="50" align="center" type="index"></el-table-column>
                <el-table-column prop="type" label="发送类型" width="180">
                  <template slot-scope="scope">{{handleDivision(scope.row.type)}}</template>
                </el-table-column>
                <el-table-column prop="content" label="内容" width="350">
                  <template slot-scope="scope">
                    <div class v-if="scope.row.type == '1'">{{scope.row.content}}</div>
                    <div class="imgCover" v-if="scope.row.type == '6'">
                      <el-image :src="showImg(scope.row.content.url)" fit="cover"></el-image>
                    </div>
                    <div class v-if="scope.row.type == '2'">
                      <v-LinkNews
                        v-if="scope.row.reply_content"
                        :replyContent="scope.row.reply_content"
                      ></v-LinkNews>
                    </div>
                    <div class="" v-if="scope.row.type == '3'">
                      <v-voice :replyContent="scope.row.reply_content"></v-voice>
                    </div>
                    <div class v-if="scope.row.type == '4'">
                      <v-NewsList
                        v-if="scope.row.reply_content"
                        :replyContent="scope.row.reply_content"
                      ></v-NewsList>
                    </div>
                    <div class="" v-if="scope.row.type == '5'">
                      <v-video :replyContent="scope.row.reply_content"></v-video>
                    </div>
                    <div v-if="scope.row.type == '7'">
                      <v-wechatapp
                        v-if="scope.row.reply_content"
                        :replyContent="scope.row.reply_content"
                      ></v-wechatapp>
                    </div>
                    <div v-if="scope.row.type == '10'">
                      <v-voucher
                        v-if="scope.row.reply_content"
                        :replyContent="scope.row.reply_content"
                      ></v-voucher>
                    </div>
                    <div v-if="scope.row.type == '11'">
                      <v-voucher
                        v-if="scope.row.reply_content"
                        :replyContent="scope.row.reply_content"
                      ></v-voucher>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label align="center">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="删除回复内容" placement="top">
                      <el-button
                        type="danger"
                        icon="el-icon-delete"
                        @click="deleteTable(menuObject.materialData,scope.$index)"
                      ></el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item v-if="menuObject.type == 'miniprogram'">
              <template slot-scope>
                <div class="miniprogram">
                  <p class="miniprogram-tips">注意：跳转的小程序必须绑定该公众号</p>
                  <div class="miniprogram-area">
                    <p class="miniprogram-area-label">跳转小程序：</p>
                    <el-button type v-show="!menuObject.is_mini" @click="toMiniPro()">选择小程序</el-button>
                    <div class="mini" v-show="menuObject.is_mini">
                      <el-input placeholder="请输入内容" v-model="menuObject.appid">
                        <template slot="prepend">小程序Appid:</template>
                      </el-input>
                      <div class="margins"></div>
                      <el-input placeholder="请输入内容" v-model="menuObject.pagepath">
                        <template slot="prepend">小程序路径:</template>
                      </el-input>
                      <el-button
                        v-show="menuObject.is_mini"
                        type="text"
                        @click="again(menuObject)"
                      >重新选择</el-button>
                    </div>
                  </div>
                  <div class="miniprogram-area">
                    <p class="miniprogram-area-label">备用网页url：</p>
                    <div class="input">
                      <el-input placeholder="请输入正确的url" v-model="menuObject.url"></el-input>
                    </div>
                  </div>
                  <div class="miniprogram-area qrcode_url" v-if="menuObject.qrcode_url">
                    <p class="miniprogram-area-label">小程序二维码：</p>
                    <div class="qrcode_url_img">
                      <el-image :src="showImg(menuObject.qrcode_url)"></el-image>
                    </div>
                  </div>
                </div>
              </template>
            </el-form-item>
            <el-form-item
              v-if="menuObject.type == 'fntype' || menuObject.type == 'scancode_waitmsg' || menuObject.type == 'pic_sysphoto' || menuObject.type == 'pic_photo_or_album' || menuObject.type == 'pic_weixin' || menuObject.type == 'location_select' "
            >
              <template slot-scope>
                <div class="miniprogram">
                  <p class="miniprogram-tips">粉丝点击该菜单会使用以下功能：</p>
                  <div class="miniprogram-area">
                    <el-radio-group v-model="menuObject.fnType" @chang="getFnType">
                      <el-radio label="scancode_waitmsg" check>扫一扫</el-radio>
                      <el-radio label="pic_sysphoto">打开手机拍照功能</el-radio>
                      <el-radio label="pic_photo_or_album">打开手机拍照或者相册</el-radio>
                      <el-radio label="pic_weixin">打开系统相册</el-radio>
                      <el-radio label="location_select">使用地理位置</el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </template>
            </el-form-item>
            <el-form-item v-if="menuObject.type == 'keytype'">
              <template slot-scope>
                <div class="miniprogram">
                  <p class="miniprogram-tips">粉丝点击该菜单等同发送该关键词：</p>
                  <div class="miniprogram-area keywords">
                    <div class="btn">
                      <el-button type="primary" @click="showKeyWords()">选择关键字</el-button>
                    </div>
                    <div class="margins"></div>
                    <div v-if="menuObject.is_keyword" class="keyList">
                      <el-input v-model="menuObject.keyword" disabled="disabled"></el-input>
                    </div>
                  </div>
                </div>
              </template>
            </el-form-item>
            <el-form-item label>
              <template>
                <div class="line"></div>
              </template>
            </el-form-item>
            <el-form-item
              label="为用户增加标签"
              v-if="menuObject.type == 'click' || menuObject.type == 'keytype'"
            >
              <el-select
                v-model="menuObject.tagid"
                multiple
                placeholder="标签筛选"
                :multiple-limit="3"
                style="margin-left:50px"
                @change="getTagId(menuObject)"
              >
                <el-option
                  v-for="(item) in tagid_lists"
                  :key="item.value"
                  :label="item.label"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="需要触发菜单的次数"
              v-if="menuObject.type == 'click' || menuObject.type == 'keytype'"
            >
              <div class="q-input" style="margin-left:22px">
                <el-input v-model="menuObject.num" @input="getNum(menuObject)"></el-input>
              </div>
            </el-form-item>
            <el-form-item
              label="增加标签的时间段"
              v-if="menuObject.type == 'click' || menuObject.type == 'keytype'"
            >
              <div class="q-input" style="margin-left:36px">
                <el-date-picker
                  v-model="menuObject.time"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getTimes(menuObject)"
                ></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item
              label="菜单标签组筛选"
              v-if="menuObject.type == 'click' || menuObject.type == 'keytype'"
            >
              <template>
                <div class="q-input" style="margin-left:50px">
                  <el-select v-model="person_id" placeholder="标签筛选">
                    <el-option label="无" value></el-option>
                    <el-option
                      v-for="(item) in person_ids"
                      :key="item.value"
                      :label="item.label"
                      :value="item"
                    ></el-option>
                  </el-select>
                </div>
              </template>
            </el-form-item>
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="发布菜单设置" placement="top">
                <el-button type="primary" @click="onSave(1)" :disabled="isDisable">发布</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除菜单内容" placement="top">
                <el-button type="danger" @click="removeMenu(menuObject.id)">删除菜单</el-button>
              </el-tooltip>
            </el-form-item>
          </el-form>
        </div>
        <el-dialog title="选择素材" :visible.sync="dialogVisible" :close-on-click-modal="modal">
          <v-material ref="materials" @listenChild="showChild"></v-material>
        </el-dialog>
        <el-dialog title="选择小程序" :visible.sync="miniProgramVisible" :close-on-click-modal="modal">
          <v-miniprogram @listenMini="showMini" ref="childMethod" :miniprograms="miniprograms"></v-miniprogram>
        </el-dialog>
        <el-dialog
          title="选择关键词"
          :visible.sync="keywordsVisible"
          @close="handleClose()"
          :close-on-click-modal="modal"
        >
          <v-keywordData @listenKeyWord="showKeyWordData" ref="keywordsMethod"></v-keywordData>
        </el-dialog>
      </div>
    </div>

    <v-danger
      ref="danger"
      @dangerSure="dangerSure"
      :danger_type="danger_type"
      :danger_ontent="danger_ontent"
    ></v-danger>
  </div>
</template>

<script>
import $ from "jquery";
import vMaterial from "../dialogs/materials";
import vMiniprogram from "../dialogs/miniprogram";
import vKeywordData from "../dialogs/keywordData";
import BaseView from "../common/BaseView";
import vDiyTagList from "../dialogs/diyTagList";
import vDanger from "../dialogs/danger.vue";
import vLinkNews from "../../template/LinkNews";
import vNewsList from "../../template/NewsList";
import vVoucher from "../../template/voucher";
import vWechatapp from "../../template/wechatapp";
import vVoice from "../../template/voice";
import vVideo from "../../template/video";
export default {
  extends: BaseView,
  components: {
    vMaterial,
    vMiniprogram,
    vKeywordData,
    vDiyTagList,
    vDanger,
    vLinkNews,
    vNewsList,
    vVoucher,
    vWechatapp,
    vVoice,
    vVideo
  },
  data() {
    return {
      danger_type: "个性化菜单",
      danger_ontent: "确认删除该菜单吗，删除操作在点击发布按钮后生效。",
      item: {},
      maxlength: 5,
      modal: false,
      isDisable: false,
      keytype: true,
      fnType: "",
      is_mini: false,
      empty: "", //后去删除
      dialogVisible: false,
      miniProgramVisible: false,
      keywordsVisible: false,
      ischeck: false,
      tableData: [],
      EventKey: "",
      src:
        "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
      fit: "cover",
      textarea: "",
      activeName: "1",
      isItem1: false,
      isItem2: true,
      isItem3: false,
      resource: 1,
      selected: 0,
      selectedTwo: 0,
      count: 0,
      menu: { list: [] },
      wxInfo: { list: [] },
      menuObject: {},
      infos: [],
      appid: "",
      id: "",
      sort: [],
      conts: [],
      contents: [],
      loading: false,
      materialObj: {},
      QmaterialData: [],
      meimglinkID: "",
      meimgtextID: "",
      person_ids: [],
      person_id: "",

      // 以下为传值所需的媒介数组
      postData: [],
      sex: "",
      menuid: "",
      miniprograms: "",
      judegData: [],
      tagid_lists: [],
      person_ids: [],
      form: {
        name: ""
      }
    };
  },
  created() {
    this.getData();
  },
  computed: {},
  watch: {
    selectedTwo: function(newSelectedTwo, oldSelectedTwo) {
      var vm = this;
      $.each(vm.menu.list, function(k, v) {
        if (v.id == vm.selected) {
          $.each(v.list, function(index, item) {
            if (item.id == newSelectedTwo) {
              vm.menuObject = item;
            }
          });
        }
      });
    }
  },
  methods: {
    // --------------------------------------------左右移动
    swiper(arr, index, tindex) {
      //如果当前元素在拖动目标位置的下方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置的地方新增一个和当前元素值一样的元素，
      //我们再把数组之前的那个拖动的元素删除掉，所以要len+1
      if (index > tindex) {
        arr.splice(tindex, 0, arr[index]);
        arr.splice(index + 1, 1);
      } else {
        //如果当前元素在拖动目标位置的上方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置+1的地方新增一个和当前元素值一样的元素，
        //这时，数组len不变，我们再把数组之前的那个拖动的元素删除掉，下标还是index
        arr.splice(tindex + 1, 0, arr[index]);
        arr.splice(index, 1);
      }
    },
    swapArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    handleLeft(index) {
      event.stopPropagation();
      let len = this.menu.list.length - 1
      this.swiper(this.menu.list,0,len)
    },

    handleRight(index) {
      event.stopPropagation();
      let len = this.menu.list.length - 1
      this.swiper(this.menu.list,len,0)
    },

    handleUp(item){
      event.stopPropagation();
      let len = item.length - 1
      this.swiper(item,0,len)
    },

    handleDown(item){
      event.stopPropagation();
      let len = item.length - 1
      this.swiper(item,len,0)
    },

    // --------------------------------------------左右移动
    getTimes(item) {
      let times = item.time;
      let start_time = parseInt(times[0].getTime() / 1000);
      let end_time = parseInt(times[1].getTime() / 1000);
      item.start_time = start_time;
      item.end_time = end_time;
      if (item.materialData.length) {
        for (let i = 0; i < item.materialData.length; i++) {
          item.materialData[i].start_time = start_time;
          item.materialData[i].end_time = end_time;
        }
      }
      if (item.keywordData.length) {
        item.keywordData[0].num = item.num;
        item.keywordData[0].start_time = start_time;
        item.keywordData[0].end_time = end_time;
      }
    },
    back() {
      localStorage.removeItem("mid");
      this.$router.push({
        path: "/imenus"
      });
    },
    handleClose() {
      // 触发素材组件方法
      this.$refs.materials.resetData();
    },
    showKeyWordData(data, flag) {
      this.menuObject.keywordData = [];
      let obj = {};
      obj.type = "9";
      obj.value = data.id;
      obj.keyword = data.name;
      obj.key = this.menuObject.key;
      obj.rule = this.menuObject.rule;
      obj.tagid = this.menuObject.tagid;
      this.menuObject.keyword = data.name;
      this.menuObject.is_keyword = flag;
      if (this.menuObject.keywordData) {
        this.menuObject.keywordData.push(obj);
        this.is_keyword = true;
        this.keywordsVisible = false;
      } else {
        this.$message.warning("请添加菜单");
      }
      // this.menuObject.materialData.push(obj);
      // this.is_keyword = true;
      // this.keywordsVisible = false;
    },
    showKeyWords() {
      setTimeout(() => {
        this.$refs.keywordsMethod.keygroup();
      }, 1);
      this.keywordsVisible = true;
    },
    getFnType(value) {},
    again(data) {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "getminiprogram", {
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            this.miniProgramVisible = true;
            setTimeout(() => {
              this.$refs.childMethod.eliminate();
            }, 1);
            this.miniprograms = res.data.data;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    showMini(data, flag) {
      // this.menuObject.name = "wxa";
      this.menuObject.appid = data.appid;
      this.menuObject.pagepath = data.pagepath;
      this.menuObject.is_mini = flag;
      this.menuObject.qrcode_url = data.qrcode_url;
      this.miniProgramVisible = false;
      this.is_mini = true;
    },
    toMiniPro() {
      // 获取小程序
      this.$axios
        .post(this.GLOBAL.BASE_URL + "getminiprogram", {
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            this.miniProgramVisible = true;
            setTimeout(() => {
              this.$refs.childMethod.eliminate();
            }, 1);
            this.miniprograms = res.data.data;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    getTagId(item) {
      // console.log(item);
      if (item.materialData && item.materialData.length) {
        for (let i = 0; i < item.materialData.length; i++) {
          item.materialData[i].tagid = item.tagid;
        }
      }
      if (item.keywordData && item.keywordData.length) {
        item.keywordData[0].tagid = item.tagid;
        // console.log(item.tagid)
        // console.log(item.keywordData[0].tagid)
      }
    },
    getNum(item) {
      if (item.materialData.length) {
        for (let i = 0; i < item.materialData.length; i++) {
          item.materialData[i].num = item.num;
        }
      }
    },
    deleteTable(data, idx) {
      data.splice(idx, 1);
    },
    showChild(type, data) {
      // console.log("传过来的数据", type, data);
      let obj = {};
      obj.type = type;
      switch (parseInt(type)) {
        case 1:
          obj.value = data;
          break;
        case 2:
          obj.value = data.id;
          obj.reply_content = data.info;
          data = data.info[0];
          this.meimglinkID = data.id;
          break;
        case 3:
          this.meimglinkID = data.id;
          obj.value = data.id;
          obj.reply_content = data;
          break;
        case 4:
          obj.value = data.id;
          obj.reply_content = data.info.news_item;
          data = data.info.news_item[0];
          this.meimgtextID = data.id;
          break;
        case 5:
          this.meimgtextID = data.media_id;
          obj.value = data.id;
          obj.reply_content = data;
          break;
        case 6:
          obj.value = data.id;
          break;
        case 7:
          // 小程序
          obj.value = data.weappid;
          obj.reply_content = data;
          obj.reply_content.thumb_url = obj.reply_content.picurl;
          obj.reply_content = JSON.stringify(data);
          break;
        case 10:
          // 优惠券
          obj.value = data.id;
          obj.reply_content = data;
          break;
        case 11:
          // 会员卡
          obj.value = data.id;
          obj.reply_content = data;
          break;
      }
      obj.type = type;
      obj.content = data;
      obj.key = this.menuObject.key;
      obj.rule = this.menuObject.rule;
      obj.tagid = this.menuObject.tagid;
      obj.menu_name = this.menuObject.name;
      obj.num = this.menuObject.num;
      // this.menuObject.materialData=[];
      if (this.menuObject.materialData) {
        this.menuObject.materialData.push(obj);
        this.menuObject.materialData = this.menuObject.materialData.reverse();
        this.dialogVisible = false;
      } else {
        this.$message.warning("请添加菜单");
        this.dialogVisible = false;
      }
    },
    handleResource(item) {
      // this.is_mini = false
      // this.$set(item, "fnType", "");
      // if (item.type == "fntype") {
      //   item.fnType = "scancode_waitmsg";
      // } else {
      //   // 默认选择第一个
      //   item.fnType = "";
      //   delete item.fnType;
      // }
      // if (item.type != "keytype") {
      //   item.is_keyword = false;
      // }
      this.is_mini = false;
      this.$set(item, "fnType", "");
      if (item.type == "fntype") {
        item.fnType = "scancode_waitmsg";
      } else {
        item.fnType = "";
      }
      if (item.type != "keytype") {
        item.is_keyword = false;
      }
      // console.log(item);
    },
    changeTagsList(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/id/g, "value"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/name/g, "label"));
      return obj2;
    },
    changeDivTagsList(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/tag_id/g, "value"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/tag_name/g, "label"));
      return obj2;
    },
    changeTagsListReagain(obj) {
      let obj1 = JSON.parse(JSON.stringify(obj).replace(/value/g, "id"));
      let obj2 = JSON.parse(JSON.stringify(obj1).replace(/label/g, "name"));
      return obj2;
    },
    // 获取标签
    biao_qian_list() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "biao_qian_list", {
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            this.person_ids = this.changeTagsList(res.data.data);
            this.diyTaglist();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 获取标签
    diyTaglist() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "diytaglist", {
          appid: this.$store.getters.showQuery
        })
        .then(res => {
          if (res.data.code == 0) {
            this.tagid_lists = this.changeDivTagsList(res.data.data);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    getData() {
      this.tagid_lists = [];
      this.person_ids = [];
      this.$axios
        .post(this.GLOBAL.BASE_URL + "menuedit", {
          appid: this.$store.getters.showQuery,
          rule: 2
        })
        .then(res => {
          if (Boolean(res.data.data.menuinfo)) {
            this.biao_qian_list();
            var obj = res.data.data.menuinfo[0];
            if (obj) {
              if (obj.anoter_info) {
                this.menu.list = obj.anoter_info;
                this.menuObject = this.menu.list[0];
                this.activeSelected(this.menuObject.id);
                let ids = [];
                let data = obj.anoter_info;
                for (let i = 0; i < data.length; i++) {
                  ids.push(data[i].id);
                  if (data[i].list.length) {
                    for (let j = 0; j < data[i].list.length; j++) {
                      ids.push(data[i].list[j].id);
                    }
                  }
                }
                const maxNum = ids[ids.sort().length - 1];
                this.count = maxNum;
                // this.count = this.sort.sort()[this.sort.length - 1] + 1;
                if (obj.tag != "[]") {
                  let tags = JSON.parse(res.data.data.menuinfo[0].tag);
                  this.sex = tags.sex;
                  this.person_id = this.changeTagsList(tags.tag_id);
                }
                if (obj.id != "") {
                  this.id = obj.id;
                }
                if (obj.menuid != "") {
                  this.menuid = obj.menuid;
                }
              }
            } else {
              this.oneLevelMenuAdd();
            }
            if (obj) {
              this.id = obj.id;
            }
          } else {
          }
        });
    },
    // 判断素材类型
    judgeType(type, data) {
      let str = "";
      switch (parseInt(type)) {
        case 1:
          return data;
          break;
        case 2:
          return this.meimglinkID;
          break;
        case 3:
          return data.media_id;
          break;
        case 4:
          return this.meimgtextID;
          break;
        case 5:
          return data.media_id;
          break;
        case 6:
          return data.media_id;
          break;
        case 10:
          return data.code;
          break;
      }
    },
    // 具体的判断不为空的函数
    judgeEmpty(type, obj) {
      return new Promise((resolve, reject) => {
        switch (type) {
          case "click":
            console.log("发送消息");
            if (obj.materialData.length == 0) {
              this.$message.warning(`${obj.name}的消息内容不能为空`);
              reject();
            } else {
              resolve();
            }
            break;
          case "view":
            console.log("跳转网页");
            if (obj.url == "") {
              this.$message.warning(`${obj.name}的链接不能为空`);
              reject();
            } else {
              resolve();
            }
            break;
          case "miniprogram":
            console.log("跳转小程序");
            if (!Boolean(obj.is_mini)) {
              this.$message.warning(`${obj.name}的小程序信息不能为空`);
              reject();
            } else {
              resolve();
            }
            break;
          case "fntype":
            console.log("功能键");
            if (!Boolean(obj.fnType)) {
              this.$message.warning(`${obj.name}的功能键不能为空`);
              reject();
            } else {
              resolve();
            }
            break;
          case "keytype":
            console.log("关键字");
            if (!Boolean(obj.is_keyword)) {
              this.$message.warning(`${obj.name}的关键字不能为空`);
              reject();
            } else {
              resolve();
            }
            break;
          default:
            break;
        }
      });
    },
    // 判断菜单是否为空
    judegHandle() {
      // console.log(this.menu.list);
      this.judegData = this.menu.list;
      let flag = true;
      let onelen = this.judegData.length;
      let onecount = 0;
      let twolen = 0;
      let twocount = 0;
      if (this.judegData.length == 0) {
        this.$message.warning("请添加菜单");
        flag = false;
      } else {
        for (let i in this.judegData) {
          // 没有一级菜单的情况·
          let type = this.judegData[i].type;
          // console.log(type);
          switch (type) {
            case "click":
              if (this.judegData[i].materialData.length == 0) {
                this.$message.warning(
                  `${this.judegData[i].name}的消息内容不能为空`
                );
                flag = false;
                // console.log(`flagClick---${flag}`);
              }
              break;
            case "view":
              if (
                !Boolean(this.judegData[i].url) ||
                this.judegData[i].url == ""
              ) {
                this.$message.warning(
                  `${this.judegData[i].name}的网页url不能为空`
                );
                flag = false;
              }
              if (!this.checkURL(this.judegData[i].url)) {
                this.$message.warning(
                  `${this.judegData[i].name}的网页url格式不正确`
                );
                flag = false;
              }
              break;
            case "miniprogram":
              if (!Boolean(this.judegData[i].is_mini)) {
                this.$message.warning(
                  `${this.judegData[i].name}的小程序信息不能为空`
                );
                flag = false;
              }
              if (this.judegData[i].url != "") {
                if (!this.checkURL(this.judegData[i].url)) {
                  this.$message.warning(
                    `${this.judegData[i].name}的备用网页url格式不正确`
                  );
                  flag = false;
                }
              }
              break;
            case "fntype":
              if (!Boolean(this.judegData[i].fnType)) {
                this.$message.warning(
                  `${this.judegData[i].name}的功能键不能为空`
                );
                flag = false;
              }
              break;
            case "keytype":
              if (!Boolean(this.judegData[i].is_keyword)) {
                this.$message.warning(
                  `${this.judegData[i].name}的关键字不能为空`
                );
                flag = false;
              }
              break;
            default:
              break;
          }
          if (this.judegData[i].list.length != 0) {
            for (let j in this.judegData[i].list) {
              let type = this.judegData[i].list[j].type;
              // console.log(type);
              switch (type) {
                case "click":
                  if (this.judegData[i].list[j].materialData.length == 0) {
                    this.$message.warning(
                      `${this.judegData[i].list[j].name}的消息内容不能为空`
                    );
                    flag = false;
                  }
                  break;
                case "view":
                  if (
                    !Boolean(this.judegData[i].list[j].url) ||
                    this.judegData[i].list[j].url == ""
                  ) {
                    this.$message.warning(
                      `${this.judegData[i].list[j].name}的网页url不能为空`
                    );
                    flag = false;
                  }
                  if (!this.checkURL(this.judegData[i].list[j].url)) {
                    this.$message.warning(
                      `${this.judegData[i].name}的网页url格式不正确`
                    );
                    flag = false;
                  }
                  break;
                case "miniprogram":
                  if (!Boolean(this.judegData[i].list[j].is_mini)) {
                    this.$message.warning(
                      `${this.judegData[i].list[j].name}的小程序信息不能为空`
                    );
                    flag = false;
                  }
                  if (this.judegData[i].list[j].url != "") {
                    if (!this.checkURL(this.judegData[i].list[j].url)) {
                      this.$message.warning(
                        `${this.judegData[i].name}的备用网页url格式不正确`
                      );
                      flag = false;
                    }
                  }
                  break;
                case "fntype":
                  if (!Boolean(this.judegData[i].list[j].fnType)) {
                    this.$message.warning(
                      `${this.judegData[i].list[j].name}的功能键不能为空`
                    );
                    flag = false;
                  }
                  break;
                case "keytype":
                  if (!Boolean(this.judegData[i].list[j].is_keyword)) {
                    this.$message.warning(
                      `${this.judegData[i].list[j].name}的关键字不能为空`
                    );
                    flag = false;
                  }
                  break;
                default:
                  break;
              }
            }
          }
        }
      }
      // console.log(`flag1--${flag}`);
      return new Promise((resolve, reject) => {
        if (flag) {
          resolve();
        } else {
          reject();
        }
      });
    },
    // 处理数据
    dealData() {
      this.infos = [];
      this.conts = [];
      $.extend(true, this.judegData, this.menu.list);
      return new Promise((resolve, reject) => {
        this.judegHandle()
          .then(() => {
            $.extend(true, this.infos, this.menu.list);
            $.extend(true, this.conts, this.menu.list);
            this.deleteOne();
            this.deleteTwo();
            this.toContentOne();
            this.toContentTwo();
            this.toContent();
            this.toPostData();
            this.getkeyWords();
            this.deleteSubButton(this.infos);
            this.changeFnType(this.infos);
            this.changekeyType(this.infos);
            this.clearConts(this.conts);
            // 最后时刻将menu_name赋值上去
            this.valToId(this.conts);
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    deleteOne() {
      for (let key in this.infos) {
        this.infos[key].sub_button = this.infos[key].list;
        delete this.infos[key].id;
        delete this.infos[key].menuType;
        delete this.infos[key].list;
        delete this.infos[key].topName;
        delete this.infos[key].value;
        delete this.infos[key].materialData;
        delete this.infos[key].tagid;
        delete this.infos[key].is_mini;
        delete this.infos[key].is_keyword;
        delete this.infos[key].qrcode_url;
        delete this.infos[key].keywordData;
      }
    },
    deleteTwo() {
      for (let i = 0; i < this.infos.length; i++) {
        if (
          this.infos[i].type == "click" ||
          this.infos[i].type == "fntype" ||
          this.infos[i].type == "keytype"
        ) {
          if (this.infos[i].url) {
            delete this.infos[i].url;
          }
          if (this.infos[i].fntype && this.infos[i].type == "fntype") {
            this.infos[i].type = this.infos[i].fntype;
            delete this.infos[i].fntype;
          }
        } else {
        }
        if (this.infos[i].type != "miniprogram") {
          delete this.infos[i].appid;
          delete this.infos[i].pagepath;
          delete this.infos[i].standby_url;
        } else {
          this.infos[i].url = this.infos[i].standby_url;
          delete this.infos[i].standby_url;
        }
        if (this.infos[i].sub_button.length > 0) {
          for (let key in this.infos[i].sub_button) {
            delete this.infos[i].sub_button[key].id;
            delete this.infos[i].sub_button[key].menuType;
            delete this.infos[i].sub_button[key].pid;
            delete this.infos[i].sub_button[key].topName;
            delete this.infos[i].sub_button[key].value;
            delete this.infos[i].sub_button[key].materialData;
            delete this.infos[i].sub_button[key].tagid;
            delete this.infos[i].sub_button[key].is_mini;
            delete this.infos[i].sub_button[key].is_keyword;
            delete this.infos[i].sub_button[key].qrcode_url;
            delete this.infos[i].sub_button[key].keywordData;
          }
        }
      }
    },
    toContentOne() {
      for (let key in this.conts) {
        // 发送消息和关键字类型德1数据传进去
        if (this.conts[key].type == "click") {
          if (this.conts[key].is_keyword) {
            // 关键字数据，就不传materialData数据进去
            delete this.conts[key].materialData;
          } else {
            // 发送消息数据，就传消息数据进去
            delete this.conts[key].keywordData;
            if (
              this.conts[key].materialData &&
              this.conts[key].materialData.length
            ) {
              for (let index in this.conts[key].materialData) {
                if (this.conts[key].materialData[index].type == 4) {
                  this.conts[key].materialData[index].url = this.conts[
                    key
                  ].materialData[index].content.thumb_url;
                }
                if (this.conts[key].materialData[index].type == 2) {
                  this.conts[key].materialData[index].url = this.conts[
                    key
                  ].materialData[index].content.picurl;
                }
                delete this.conts[key].materialData[index].content;
              }
            }
          }
        } else if (this.conts[key].type == "view") {
          // 如果是跳转网页类型 就删除materialData数据和keywordData数据
          delete this.conts[key].materialData;
          delete this.conts[key].keywordData;
          this.conts[key].value = this.conts[key].url;
          if (this.conts[key].appid) {
            delete this.conts[key].appid;
          }
        } else if (this.conts[key].type == "miniprogram") {
          // 如果是跳转网页类型 就删除materialData数据和keywordData数据
          delete this.conts[key].materialData;
          delete this.conts[key].keywordData;
        } else if (this.conts[key].type == "fntype") {
          // 如果是功能键类型 就删除materialData数据和keywordData数据
        }

        this.conts[key].menu_name = this.conts[key].name;

        delete this.conts[key].id;
        delete this.conts[key].menuType;
        delete this.conts[key].name;
        delete this.conts[key].topName;
        delete this.conts[key].appid;
        delete this.conts[key].is_mini;
        delete this.conts[key].pagepath;
        delete this.conts[key].qrcode_url;
        delete this.conts[key].standby_url;
      }
    },
    toContentTwo() {
      for (let i = 0; i < this.conts.length; i++) {
        if (this.conts[i].list && this.conts[i].list.length) {
          for (let key in this.conts[i].list) {
            if (this.conts[i].list[key].type == "click") {
            } else if (this.conts[i].list[key].type == "view") {
              this.conts[i].list[key].value = this.conts[i].list[key].url;
            }
            if (this.conts[i].list[key].materialData.length) {
              for (let index in this.conts[i].list[key].materialData) {
                delete this.conts[i].list[key].materialData[index].content;
              }
            }

            this.conts[i].list[key].menu_name = this.conts[i].list[key].name;

            delete this.conts[i].list[key].url;
            delete this.conts[i].list[key].menuType;
            delete this.conts[i].list[key].pid;
            delete this.conts[i].list[key].topName;
            delete this.conts[i].list[key].name;
          }
        } else {
        }
      }
    },
    toContent() {
      for (let i = 0; i < this.conts.length; i++) {
        if (this.conts[i].list && this.conts[i].list.length) {
          this.conts[i].list.forEach(ele => {
            this.contents.push(ele);
          });
        } else {
        }
      }
      for (let key in this.conts) {
        delete this.conts[key].list;
      }
      if (this.contents.length) {
        Array.prototype.push.apply(this.conts, this.contents);
      }
    },
    toPostData() {
      for (let i = 0; i < this.conts.length; i++) {
        if (this.conts[i].keywordData && this.conts[i].keywordData.length) {
        } else {
          if (this.conts[i].materialData && this.conts[i].materialData.length) {
            for (let j = 0; j < this.conts[i].materialData.length; j++) {
              this.postData.push(this.conts[i].materialData[j]);
            }
          }
        }
      }
      for (let key in this.conts) {
        delete this.conts[key].materialData;
      }
      if (this.postData.length) {
        Array.prototype.push.apply(this.conts, this.postData);
      }
    },
    // 提取keywordData数据
    getkeyWords() {
      this.keyWords = [];
      for (let i = 0; i < this.conts.length; i++) {
        if (this.conts[i].is_keyword) {
          if (this.conts[i].keywordData && this.conts[i].keywordData.length) {
            for (let j = 0; j < this.conts[i].keywordData.length; j++) {
              this.keyWords.push(this.conts[i].keywordData[j]);
            }
          }
        }
      }
      for (let key in this.conts) {
        delete this.conts[key].keywordData;
      }
      if (this.keyWords.length) {
        Array.prototype.push.apply(this.conts, this.keyWords);
      }
    },
    deleteSubButton(data) {
      data.forEach(ele => {
        // 如果子菜单存在的话  主菜单只需要留下name和key参数
        if (ele.sub_button && ele.sub_button.length != 0) {
          for (let index in ele) {
            if (ele.appid) {
              delete ele.appid;
            }
            if (ele.pagepath) {
              delete ele.pagepath;
            }
            if (ele.url) {
              delete ele.url;
            }
            if (ele.fnType) {
              delete ele.fnType;
            }
            if (ele.type == "keytype") {
              delete ele.type;
            }
            if (ele.type) {
              delete ele.type;
            }
          }
        } else {
        }
      });
    },
    // 将fnType转化为type
    changeFnType(data) {
      data.forEach(ele => {
        if (ele.sub_button && ele.sub_button.length != 0) {
          for (let i = 0; i < ele.sub_button.length; i++) {
            if (ele.sub_button[i].fnType && ele.sub_button[i].fnType != "") {
              ele.sub_button[i].type = ele.sub_button[i].fnType;
              delete ele.sub_button[i].fnType;
            }
          }
        } else {
          if (ele.fnType && ele.fnType != "") {
            ele.type = ele.fnType;
            delete ele.url;
            delete ele.fnType;
          }
        }
      });
    },
    // 将keyType转化为type
    changekeyType(data) {
      data.forEach(ele => {
        if (ele.sub_button && ele.sub_button.length != 0) {
          for (let i = 0; i < ele.sub_button.length; i++) {
            if (ele.sub_button[i].type == "keytype") {
              ele.sub_button[i].type = "click";
            }
          }
        } else {
          if (ele.type == "keytype") {
            ele.type = "click";
          }
        }
      });
    },
    // 净化contents 将不需要的数据（key）清除掉  只保留发送消息和关键字
    clearConts(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].type == "fntype" || data[i].fnType) {
          data.splice(i, 1);
        } else if (data[i].type == "keytype") {
          data.splice(i, 1);
        } else if (data[i].type == "click" && data[i].keyword) {
          data.splice(i, 1);
        }
      }
    },
    valToId(data) {
      data.forEach(item => {
        item.tagid.forEach(ele => {
          ele.id = ele.value;
        });
      });
    },
    onSave(value) {
      this.dealData()
        .then(() => {
          console.log("success");
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(255,255,255, 0.7)"
          });
          let obj = {
            id: "",
            name: "233",
            flag: 1,
            info: this.infos,
            tagid: 0,
            sex: 0
          };
          this.isDisable = true;
          // console.log(this.id);
          this.$axios
            .post(this.GLOBAL.BASE_URL + "menuadd", {
              appid: this.$store.getters.showQuery,
              rule: 2,
              status: value,
              name: obj.name,
              flag: obj.flag,
              info: obj.info,
              sex: this.sex,
              id: this.id,
              menuid: this.menuid,
              anoter_info: this.menu.list,
              contents: this.conts,
              person_id: this.changeTagsListReagain(this.person_id)
            })
            .then(res => {
              this.isDisable = false;
              loading.close();
              if (res.data.code == 0) {
                this.infos = [];
                this.contents = [];
                this.conts = [];
                this.postData = [];
                this.$message.success("发布成功");
                this.getData();
              } else {
                this.infos = [];
                this.contents = [];
                this.conts = [];
                this.postData = [];
                this.$message.error(res.data.message);
              }
            });
        })
        .catch(() => {
          console.log("error");
        });
    },
    randomWord(num) {
      let str = "",
        arr = [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "g",
          "h",
          "i",
          "j",
          "k",
          "l",
          "m",
          "n",
          "o",
          "p",
          "q",
          "r",
          "s",
          "t",
          "u",
          "v",
          "w",
          "x",
          "y",
          "z",
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
          "P",
          "Q",
          "R",
          "S",
          "T",
          "U",
          "V",
          "W",
          "X",
          "Y",
          "Z"
        ],
        pos = "";
      for (var i = 0; i < num; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
      }
      return str;
    },
    addMaterial() {
      this.tableData.push(obj);
      this.dialogVisible = false;
    },
    isActive(id) {
      return this.selected == id;
    },
    isCurrent(id) {
      return this.selectedTwo == id;
    },
    oneLevelMenuAdd() {
      var vm = this;
      this.EventKey = this.randomWord(32);
      var levelOneMenu = {
        topName: "233",
        id: ++vm.count,
        name: "菜单名称",
        menuType: "msg",
        list: [],
        key: this.EventKey,
        type: "click",
        materialData: [],
        tagid: []
      };
      vm.selected = vm.count;
      vm.menu.list.push(levelOneMenu);
      vm.activeSelected(vm.selected);
    },
    twoLevelMenuAdd(pid) {
      var vm = this;
      this.EventKey = this.randomWord(32);
      var levelTwoMenu = {
        topName: "233",
        id: ++vm.count,
        pid: pid,
        name: "子菜单",
        menuType: "msg",
        key: this.EventKey,
        type: "click",
        materialData: [],
        tagid: []
      };
      vm.selectedTwo = vm.count;
      $.each(vm.menu.list, function(k, v) {
        if (v.id == pid) {
          v.list.push(levelTwoMenu);
        }
      });
      vm.currentSelected(vm.selectedTwo);
    },
    activeSelected(id) {
      var vm = this;
      vm.selected = id;
      vm.selectedTwo = id;
      $.each(vm.menu.list, function(k, v) {
        if (v.id == id) {
          vm.menuObject = v;
        }
      });
      this.maxlength = 5;
    },
    currentSelected(id) {
      var vm = this;
      vm.selectedTwo = id;
      this.maxlength = 20;
    },
    addContent() {
      this.dialogVisible = true;
    },
    // 删除
    dangerSure() {
      $.each(this.menu.list, function(index, item) {
        item.list = item.list.filter(t => t.id != this.item);
      });
      this.menu.list = this.menu.list.filter(t => t.id != this.item);
      this.menuObject.id = null;
      this.menuObject = {};
      let clickIndex = [];
      this.menu.list.forEach(ele => {
        clickIndex.push(ele.id);
      });

      this.activeSelected(clickIndex[0]);
    },
    removeMenu(id) {
      this.item = id;
      this.$refs.danger.showDanger();
    },
    onSubmit() {}
  }
};
</script>

<style scoped>
.keyList {
  width: 200px;
}
.keyList p {
  padding: 5px;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
}
.keywords {
  flex-direction: column;
  border: none;
}

.input {
  width: 50%;
}
.miniprogram {
  width: 100%;
  padding: 5px 10px 30px 10px;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  color: rgb(112, 109, 109);
}
.miniprogram-area {
  width: 100%;
  height: auto;
  display: flex;
  margin-top: 20px;
}
.miniprogram-area-label {
  width: 100px;
  margin-right: 20px;
  flex-shrink: 0;
}
.qrcode_url {
  width: 250px;
}
.qrcode_url_img {
  width: 250px;
}
.qrcode_url_img > img {
  width: 100%;
}
/* --------------------------- */
.line {
  width: 100%;
  height: 1px;
  background: #ddd;
}
.margins {
  width: 100%;
  height: 10px;
}
/* ------------------ */
.input {
  width: 50%;
}
.miniprogram {
  width: 100%;
  padding: 5px 10px 30px 10px;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  color: rgb(112, 109, 109);
}
.miniprogram-area {
  width: 100%;
  height: auto;
  display: flex;
  margin-top: 20px;
}
.miniprogram-area-label {
  width: 100px;
  margin-right: 20px;
  flex-shrink: 0;
}
.qrcode_url {
  width: 250px;
}
.qrcode_url_img {
  width: 250px;
}
.qrcode_url_img > img {
  width: 100%;
}
/* ------------------ */
.imgCover {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
}
.imgCover > i {
  font-size: 30px;
}
.contv {
  width: 100%;
  display: flex;
}

.menuarea {
  background: #fff;
  width: 294px;
  height: 580px;
  border: 1px solid #e7e7eb;
  background-image: url(../../assets/bg_mobile_head_default.png);
  background-repeat: no-repeat;
  background-position: 0px 0px;
  -webkit-background-size: contain;
  background-size: contain;
  position: relative;
  flex-shrink: 0;
}
.menuarea ul {
  list-style-type: none;
}
.menuarea_tit {
  color: #fff;
  text-align: center;
  padding-top: 30px;
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  margin-left: 30px;
  margin-right: 30px;
}
.mobile_nav .premenu_list {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 1px solid #e7e7eb;
  background-image: url(../../assets/bg_mobile_foot_default.png);
  background-repeat: no-repeat;
  background-position: 0px 0px;
  padding-left: 43px;
}
.mobile_nav .premenu_list li {
  line-height: 50px;
  position: relative;
  text-align: center;
}
.mobile_nav .premenu_list li a {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  text-decoration: none;
  color: #616161;
}
.mobile_nav .premenu_list li a:hover {
  color: #000000;
}
.prelink_left_a {
  border-left: 1px solid #e7e7eb;
}
.prelink_left_a .menuTool {
  display: none;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50px;
  right: 0;
  border: 1px solid #e7e7eb;
  box-sizing: border-box;
}
.prelink_left_a .menuTool .tools {
  width: 50%;
  height: 100%;
  flex-shrink: 0;
}
.prelink_left_a .menuTool .tools:nth-of-type(1) {
  border-right: 1px solid #e7e7eb;
}
.mobile_nav .premenu_list li a.prelink_a .menuTool{
  display: flex;
}
.mobile_nav .premenu_list li a.prelink_a {
  border: 1px solid #44b549;
  color: #44b549;
  line-height: 48px;
}
.mobile_nav .premenu_list li a i {
  background-image: url(../../assets/index_z3c4bd4.png);
  background-repeat: no-repeat;
  background-position: 0px 0px;
  width: 14px;
  height: 14px;
  vertical-align: middle;
  display: inline-block;
  margin-top: -2px;
  margin-right: 5px;
}
.mobile_nav .premenu_list li.premenu_li a i {
  background-position: 0 -18px;
}

.mobile_nav .premenu_list1 li.proadd {
  width: auto;
  float: none;
  overflow: hidden;
}
.premenu_li1 {
  width: 50%;
  float: left;
}
.premenu_li2 {
  width: 33.3333333%;
  float: left;
}
.premenu_li3 {
  width: 33.3333333%;
  float: left;
}

.ziprenav {
  bottom: 60px;
  background-color: #fafafa;
  position: absolute;
  left: 0;
  width: 100%;
  border: 1px solid #d0d0d0;
  border-top: 0px;
  display: none;
}
.ziprenav .zipmenuTool{
  position: absolute;
  top: 0;
  left: -41px;
  height: 45px;
  width: 40px;
  border: 1px solid #e4e7ed;
  box-sizing: border-box;
  display: none;
  cursor: pointer;
}
.ziprenav .ziptools{
  width: 100%;
  height: 22px;
  line-height: 22px;
}
.ziprenav .ziptools:nth-of-type(1){
  border-bottom: 1px solid #e4e7ed;;
}
.ziprenav .ziprenav_ul li.current .zipmenuTool{
  display: block;
}
.ziprenav.active {
  display: block;
}
.ziprenav .ziprenav_ul li:first-child {
  border-top: 1px solid #d0d0d0;
}
.ziprenav .ziprenav_ul li {
  line-height: 44px;
  border: 1px solid transparent;
  margin: 0 -1px -1px;
}
.ziprenav .ziprenav_ul li.current {
  background-color: #fff;
  border: 1px solid #44b549;
  position: relative;
  z-index: 1;
  line-height: 45px;
}
.ziprenav .ziprenav_ul li.current a span {
  border-top: 0px;
}
.ziprenav .ziprenav_ul li a {
  display: block;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  color: #616161;
  text-decoration: none;
  padding: 0 0.5em;
}
.ziprenav .ziprenav_ul li a span {
  display: block;
  border-top: 1px solid #e7e7eb;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  cursor: pointer;
}
.ziprenav .ziprenav_ul li a span i {
  margin-right: 0px;
}
.ziprenav .ziprenav_ul li:first-child a span {
  border-top: 0px;
}

.ziprenav .arrow_out {
  bottom: -6px;
  display: inline-block;
  width: 0;
  height: 0;
  border-width: 6px;
  border-style: dashed;
  border-color: transparent;
  border-bottom-width: 0;
  border-top-color: #d0d0d0;
  border-top-style: solid;
}

.ziprenav .arrow {
  position: absolute;
  left: 50%;
  margin-left: -6px;
}

.ziprenav .arrow_in {
  bottom: -5px;
  display: inline-block;
  width: 0;
  height: 0;
  border-width: 6px;
  border-style: dashed;
  border-color: transparent;
  border-bottom-width: 0;
  border-top-color: #fafafa;
  border-top-style: solid;
}

.ziprenav .arrow {
  position: absolute;
  left: 50%;
  margin-left: -6px;
}

.widget {
  width: 60%;
  margin-left: 40px;
}
.widget .el-dialog__body {
  padding: 0 30px 30px;
}
.imgItem {
  width: 100%;
  height: 100%;
  border: 1px solid #e4e7ed;
  box-sizing: border-box;
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
