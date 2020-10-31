<template>
  <el-tabs v-model="activeName" @tab-click="handleTabs()" class="dialog">
    <el-tab-pane label="文字" name="1">
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        :autosize="{ minRows: 10, maxRows: 10}"
        v-model="txt"
        ref="singleText"
        id="textarea"
      ></el-input>
      <br />
      <br />
      <el-button type="primary" plain icon="el-icon-user" @click="hanldeInsert('user')">插入用户名</el-button>
      <el-button type="primary" plain icon="el-icon-link" @click="hanldeInsert('link')">插入链接</el-button>
      <el-button type="primary" plain icon="el-icon-box" @click="hanldeInsert('mini')">插入小程序</el-button>
    </el-tab-pane>
    <el-tab-pane label="外链图文" name="2">
      <div class="imgItem" v-loading="loading2">
        <div
          class="img"
          v-for="(item,index) in meimglink"
          :key="index"
          @click="selectData(meimglink,item)"
        >
          <div v-if="item.info">
            <img v-if="item.info[0]" :src="showImg(item.info[0].picurl)" />
            <span class="imgTxt" v-if="item.info[0]">{{item.info[0].title}}</span>
            <div class="imgClose" v-show="item.active">
              <i class="el-icon-check" @click="deleteImg(item)"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
          :page-sizes="[10, 20,50]"
          :page-size="limit2"
          :current-page="currentPage2"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals2"
        ></el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="语音" name="3">
      <div class="imgItem" v-loading="loading3">
        <div
          class="img"
          v-for="(item,index) in mevoice"
          :key="index"
          @click="selectData(mevoice,item)"
        >
          <div class="voiceBg">
            <!-- <i class="el-icon-microphone"></i> -->
            <div class="big voice">
              <svg-icon icon-class="voice"></svg-icon>
            </div>
          </div>
          <span class="imgTxt">{{item.real_name}}</span>
          <div class="imgClose" v-show="item.active">
            <i class="el-icon-check" @click="deleteImg(item)"></i>
          </div>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange3"
          @current-change="handleCurrentChange3"
          :page-sizes="[10, 20,50]"
          :page-size="limit3"
          :current-page="currentPage3"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals3"
        ></el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="图文" name="4">
      <div class="imgItem" v-loading="loading4">
        <div
          class="img"
          v-for="(item,index) in meimgtextData"
          :key="index"
          @click="selectData(meimgtextData,item)"
        >
          <span class="imgRemark">{{item.remark}}</span>
          <div class="imgs">
            <img :src="showImg(arrpush()[index].thumb_url)" />
          </div>
          <span class="imgTxt">{{arrpush()[index].title}}</span>
          <div class="imgClose" v-show="item.active">
            <i class="el-icon-check" @click="deleteImg(item)"></i>
          </div>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange4"
          @current-change="handleCurrentChange4"
          :page-sizes="[10, 20,50]"
          :page-size="limit4"
          :current-page="currentPage4"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals4"
        ></el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="视频" name="5">
      <div class="imgItem" v-loading="loading5">
        <div
          class="img"
          v-for="(item,index) in mevideo"
          :key="index"
          @click="selectData(mevideo,item)"
        >
          <div class="voiceBg">
            <!-- <i class="el-icon-video-camera-solid"></i> -->
            <i class="big video">
              <svg-icon icon-class="video"></svg-icon>
            </i>
          </div>
          <span class="imgTxt">{{item.title}}</span>
          <div class="imgClose" v-show="item.active">
            <i class="el-icon-check" @click="deleteImg(item)"></i>
          </div>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange5"
          @current-change="handleCurrentChange5"
          :page-sizes="[10, 20,50]"
          :page-size="limit5"
          :current-page="currentPage5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals5"
        ></el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="图片" name="6">
      <div class="imgItem" v-loading="loading6">
        <div
          class="img"
          v-for="(item,index) in meimgData"
          :key="index"
          @click="selectData(meimgData,item)"
        >
          <span class="imgRemark">{{item.remark}}</span>
          <el-image :src="showImg(item.url)" :fit="fit"></el-image>
          <span class="imgTxt">{{item.name}}</span>
          <div class="imgClose" v-show="item.active">
            <i class="el-icon-check" @click="deleteImg(item)"></i>
          </div>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange6"
          @current-change="handleCurrentChange6"
          :page-sizes="[10, 20,50]"
          :page-size="limit6"
          :current-page="currentPage6"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals6"
        ></el-pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="小程序" name="7">
      <el-form
        :model="wechatapp"
        :rules="rules"
        ref="wechatapp"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="小程序封面" prop="thumb_media_id">
          <div class="infoPanel">
            <div class="infoPanelPic" @click="chooseImg()">
              <img :src="showImg(wechatapp.picurl)" v-show="wechatapp.picurl" />
            </div>
            <div class="deletePanel">
              <i class="el-icon-delete-solid" @click="deletePanel()"></i>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="小程序appid" prop="weappid">
          <el-input v-model="wechatapp.weappid"></el-input>
        </el-form-item>
        <el-form-item label="小程序标题" prop="title">
          <el-input v-model="wechatapp.title"></el-input>
        </el-form-item>
        <el-form-item label="小程序路径" prop="pagepath">
          <el-input v-model="wechatapp.pagepath"></el-input>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="优惠券" name="10">
      <div style="width:100%;height:100%">
        <el-table
          :data="couponData"
          border
          style="width: 100%"
          v-loading="loading10"
          @current-change="selectData10"
        >
          <el-table-column label="选择" width="55">
            <template slot-scope="scope">
              <el-radio v-model="couponDataRadio10" :label="scope.row">
                <i></i>
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column prop label="卡券类型" sortable width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.type">
                <span v-if="scope.row.type == 'gift'">兑换券</span>
                <span v-if="scope.row.type == 'groupon'">团购券</span>
                <span v-if="scope.row.type == 'cash'">代金券</span>
                <span v-if="scope.row.type == 'discount'">折扣券</span>
                <span v-if="scope.row.type == 'general_coupon'">优惠券</span>
                <span v-if="scope.row.type == 'member_card'">会员卡</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop label="卡券名称" sortable width="150">
            <template slot-scope="scope">
              <p>{{scope.row.title}}</p>
            </template>
          </el-table-column>
          <el-table-column prop label="卡券内容" sortable width="150">
            <template slot-scope="scope">
              <p>{{scope.row.brand_name}}</p>
            </template>
          </el-table-column>
          <el-table-column prop label="生效时间" sortable width="150">
            <template slot-scope="scope">
              <p>{{startTime(scope.row)}}</p>
            </template>
          </el-table-column>
          <el-table-column prop label="有效期" sortable width="200">
            <template slot-scope="scope">
              <p>{{showTime(scope.row)}}</p>
            </template>
          </el-table-column>
          <el-table-column prop label="核销" sortable>
            <template slot-scope="scope">
              <p>{{scope.row.write_off_num}}</p>
            </template>
          </el-table-column>
          <el-table-column prop label="领取" sortable>
            <template slot-scope="scope">
              <p>{{scope.row.receive_num}}</p>
            </template>
          </el-table-column>
          <el-table-column prop label="卡券状态" sortable width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 'CARD_STATUS_NOT_VERIFY'">待审核</span>
              <span v-if="scope.row.status == 'CARD_STATUS_VERIFY_FAIL'">审核失败</span>
              <span v-if="scope.row.status == 'CARD_STATUS_VERIFY_OK'">通过审核</span>
              <span v-if="scope.row.status == 'CARD_STATUS_DELE'">卡券被商户删除</span>
              <span v-if="scope.row.status == 'CARD_STATUS_DISPATCH'">在公众平台投放过的卡券</span>
            </template>
          </el-table-column>
          <el-table-column prop label="库存" sortable>
            <template slot-scope="scope">
              <p>{{scope.row.quantity}}</p>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="couponData.length > 1">
          <el-pagination
            @size-change="handleSizeChange10"
            @current-change="handleCurrentChange10"
            :page-sizes="[10, 20,50]"
            :page-size="limit10"
            :current-page="currentPage10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totals10"
          ></el-pagination>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="会员卡" name="11">
      <div style="width:100%;height:100%">
        <el-table
          :data="membershipData"
          border
          style="width: 100%"
          v-loading="loading11"
          @current-change="selectData11"
        >
          <el-table-column label="选择" width="55">
            <template slot-scope="scope">
              <el-radio v-model="couponDataRadio10" :label="scope.row">
                <i></i>
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column prop label="卡券类型" sortable width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.type">
                <span v-if="scope.row.type == 'gift'">兑换券</span>
                <span v-if="scope.row.type == 'groupon'">团购券</span>
                <span v-if="scope.row.type == 'cash'">代金券</span>
                <span v-if="scope.row.type == 'discount'">折扣券</span>
                <span v-if="scope.row.type == 'general_coupon'">优惠券</span>
                <span v-if="scope.row.type == 'member_card'">会员卡</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop label="卡券名称" sortable width="150">
            <template slot-scope="scope">
              <p>{{scope.row.title}}</p>
            </template>
          </el-table-column>
          <el-table-column prop label="卡券内容" sortable width="150">
            <template slot-scope="scope">
              <p>{{scope.row.brand_name}}</p>
            </template>
          </el-table-column>
          <el-table-column prop label="生效时间" sortable width="150">
            <template slot-scope="scope">
              <p>{{startTime(scope.row)}}</p>
            </template>
          </el-table-column>
          <el-table-column prop label="有效期" sortable width="200">
            <template slot-scope="scope">
              <p>{{showTime(scope.row)}}</p>
            </template>
          </el-table-column>
          <el-table-column prop label="核销" sortable>
            <template slot-scope="scope">
              <p>{{scope.row.write_off_num}}</p>
            </template>
          </el-table-column>
          <el-table-column prop label="领取" sortable>
            <template slot-scope="scope">
              <p>{{scope.row.receive_num}}</p>
            </template>
          </el-table-column>
          <el-table-column prop label="卡券状态" sortable width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 'CARD_STATUS_NOT_VERIFY'">待审核</span>
              <span v-if="scope.row.status == 'CARD_STATUS_VERIFY_FAIL'">审核失败</span>
              <span v-if="scope.row.status == 'CARD_STATUS_VERIFY_OK'">通过审核</span>
              <span v-if="scope.row.status == 'CARD_STATUS_DELE'">卡券被商户删除</span>
              <span v-if="scope.row.status == 'CARD_STATUS_DISPATCH'">在公众平台投放过的卡券</span>
            </template>
          </el-table-column>
          <el-table-column prop label="库存" sortable>
            <template slot-scope="scope">
              <p>{{scope.row.quantity}}</p>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="membershipData.length > 5">
          <el-pagination
            @size-change="handleSizeChange11"
            @current-change="handleCurrentChange11"
            :page-sizes="[10, 20,50]"
            :page-size="limit11"
            :current-page="currentPage11"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totals11"
          ></el-pagination>
        </div>
      </div>
    </el-tab-pane>
    <div class="sumit" v-show="!have_btn">
      <el-button type="primary" @click="addMaterial" :disabled="isDisable">确定</el-button>
    </div>

    <!-- 选择链接 -->
    <el-dialog
      width="30%"
      :type="innerType"
      :title="innerTitle"
      :visible.sync="innerVisible"
      append-to-body
      :close-on-click-modal="modal"
    >
      <el-form
        :model="linkForm"
        :rules="linkRules"
        ref="linkForm"
        label-width="80px"
        class="demo-ruleForm"
        label-position="left"
        v-if="innerType == 'link'"
      >
        <el-form-item label="链接" prop="link">
          <el-input v-model="linkForm.link"></el-input>
        </el-form-item>
      </el-form>
      <el-form
        :model="miniForm"
        :rules="rules"
        ref="miniForm"
        label-width="120px"
        class="demo-ruleForm"
        label-position="left"
        v-if="innerType == 'mini'"
      >
        <el-form-item label="小程序appid" prop="weappid">
          <el-input v-model="miniForm.weappid"></el-input>
        </el-form-item>
        <el-form-item label="小程序标题" prop="title">
          <el-input v-model="miniForm.title"></el-input>
        </el-form-item>
        <el-form-item label="小程序路径" prop="pagepath">
          <el-input v-model="miniForm.pagepath"></el-input>
        </el-form-item>
        <el-form-item label="小程序跳转链接" prop="href">
          <el-input v-model="miniForm.href"></el-input>
          <p class="q-tips">不支持apid的低版本，如果有href选项，则跳转href中的网页链接</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">取 消</el-button>
        <el-button type="primary" @click="hanldeInsertSure(innerType)">确定</el-button>
      </div>
    </el-dialog>

    <!-- 选择图片 -->
    <el-dialog
      title="选择图片"
      :visible.sync="dialogVisible_img"
      width="50%"
      center
      :close-on-click-modal="modal"
      append-to-body
    >
      <div class="imgItem" :loading="imgLoading">
        <div class="img" v-for="(item,index) in imgUrls" :key="index" @click="handleChoose(item)">
          <img :src="showImg(item.url)" />
          <span class="imgTxt">{{item.name}}</span>
          <div class="imgClose" v-show="item.active">
            <i class="el-icon-check" @click="deleteImg(item)"></i>
          </div>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange11"
          @current-change="handleCurrentChange11"
          :page-sizes="[10, 20, 50, 200]"
          :page-size="limit11"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals11"
          :current-page.sync="currentPage11"
        ></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_img = false">取 消</el-button>
        <el-button type="primary" @click="sureImg()">确 定</el-button>
      </span>
    </el-dialog>
  </el-tabs>
</template>

<script>
import BaseView from "../common/BaseView";
import utils from "../../utils/utils";
export default {
  extends: BaseView,
  props: ["have_btn", "editData", "showTips"],
  data() {
    return {
      limit11: 10,
      totals11: 0,
      currentPage11: 0,
      page11: 1,
      imgUrls: [],
      dialogVisible_img: false,
      modal: false,
      interval: "",
      isDisable: false,
      activeName: "1",
      txt: "",
      meimgData: [],
      meimgtextData: [],
      fit: "cover",
      chooseData: [],
      meimglink: [],
      mevoice: [],
      mevideo: [],
      meMiniData: {
        appid: "",
        path: "",
        content: ""
      },
      couponData: [],
      membershipData: [],

      totals2: 0,
      totals3: 0,
      totals4: 0,
      totals5: 0,
      totals6: 0,
      totals10: 0,
      totals11: 0,

      limit2: 10,
      limit3: 10,
      limit4: 10,
      limit5: 10,
      limit6: 10,
      limit10: 10,
      limit11: 10,

      page2: 1,
      page3: 1,
      page4: 1,
      page5: 1,
      page6: 1,
      page10: 1,
      page11: 1,

      currentPage2: 1,
      currentPage3: 1,
      currentPage4: 1,
      currentPage5: 1,
      currentPage6: 1,
      currentPage10: 1,
      currentPage11: 1,

      loading2: false,
      loading3: false,
      loading4: false,
      loading5: false,
      loading6: false,
      loading10: false,
      loading11: false,
      tips1: `添加超链接的形式为：<a href="http://www.baidu.com">百度</a>`,
      tips2: `添加跳转小程序的形式为：<a href=" " data-miniprogram-appid="appid" data-miniprogram-path="pages/index/index">点击跳小程序</a>`,
      // 小程序
      wechatapp: {
        appid: this.$store.getters.showQuery,
        nickname: "li",
        openid: JSON.parse(localStorage.getItem("uid"))
          ? JSON.parse(localStorage.getItem("uid")).openid
          : "",
        // 图片的media_id
        thumb_media_id: "",
        // 要填写的小陈虎须appid
        weappid: "",
        // 填
        title: "",
        type: "",
        // 填写
        pagepath: "",
        picurl: ""
      },
      rules: {
        thumb_media_id: [
          { required: true, message: "小程序封面不能为空", trigger: "blur" }
        ],
        weappid: [
          { required: true, message: "小程序appid不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "小程序标题不能为空", trigger: "blur" }
        ],
        pagepath: [
          { required: true, message: "小程序路径不能为空", trigger: "blur" }
        ]
      },
      imgUrl: "",
      media_id: "",
      couponDataRadio10: "",
      membershipDataRadio11: "",
      innerVisible: false,
      innerTitle: "",
      innerType: "",
      linkForm: {},
      linkRules: {
        link: [{ required: true, message: "请输入插入的链接", trigger: "blur" }]
      },
      miniForm: {
        href: ""
      },
      imgLoading: false
    };
  },
  mounted() {},
  created() {},
  methods: {
    // ------------------------------------------------------------
    // 插入信息的确认
    hanldeInsertSure(type) {
      if (type == "link") {
        this.$refs["linkForm"].validate(valid => {
          if (valid) {
            if (!this.checkURL(this.linkForm.link)) {
              this.$message.warning("链接不合法，请重新输入");
            } else {
              this.innerVisible = false;
              this.InsertValue(this.linkForm.link);
              this.linkForm.link = "";
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else if (type == "mini") {
        this.$refs["miniForm"].validate(valid => {
          if (valid) {
            if (this.miniForm.href == "") {
              var minval = `<a href="${this.miniForm.href}" data-miniprogram-appid="${this.miniForm.weappid}" data-miniprogram-path="${this.miniForm.pagepath}">${this.miniForm.title}</a>`;
              this.innerVisible = false;
              this.InsertValue(minval);
            } else {
              if (!this.checkURL(this.miniForm.href)) {
                this.$message.warning("链接不合法，请重新输入");
              } else {
                var minval = `<a href="${this.miniForm.href}" data-miniprogram-appid="${this.miniForm.weappid}" data-miniprogram-path="${this.miniForm.pagepath}">${this.miniForm.title}</a>`;
                this.innerVisible = false;
                this.InsertValue(minval);
              }
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    InsertValue(value) {
      const myField = document.querySelector("#textarea");
      var Pos = myField.selectionStart || myField.selectionEnd;
      var start = myField.value.substring(0, Pos);
      var end = myField.value.substring(Pos, myField.value.length);
      this.txt = `${start}${value}${end}`;
    },
    // 插入用户名链接小程序
    hanldeInsert(type) {
      this.innerType = type;
      if (type == "user") {
        this.InsertValue("{nickname}");
      } else if (type == "link") {
        this.innerVisible = true;
        this.innerTitle = "填写插入的链接";
        this.$refs.linkForm.resetFields();
      } else if (type == "mini") {
        this.innerVisible = true;
        this.innerTitle = "填写插入的小程序";
        this.$refs.miniForm.resetFields();
      }
    },
    // ------------------------------------------------------------
    // DATE_TYPE_FIX_TIME_RANGE
    formateRange(item) {
      if (item.start_time) {
        let startTime = utils.format(item.start_time * 1000).split(" ")[0];
        let endTime = utils.format(item.end_time * 1000).split(" ")[0];
        return `${startTime} 至 ${endTime}`;
      } else {
        return "";
      }
    },
    // DATE_TYPE_FIX_TERM
    formateTerm(item) {
      if (item.start_time) {
        let startTime = utils.getAfterDate(item.start_time).split(" ")[0];
        let endTime = utils.getAfterDate(item.end_time).split(" ")[0];
        return `${startTime} 至 ${endTime}`;
      } else {
        return "";
      }
    },
    startTime(item) {
      switch (item.time_type) {
        case "DATE_TYPE_FIX_TIME_RANGE":
          return utils.format(item.start_time * 1000).split(" ")[0];
        case "DATE_TYPE_FIX_TERM":
          return utils.getAfterDate(item.start_time).split(" ")[0];
        default:
          return "";
      }
    },
    showTime(item) {
      switch (item.time_type) {
        case "DATE_TYPE_FIX_TIME_RANGE":
          return this.formateRange(item);
        case "DATE_TYPE_FIX_TERM":
          return this.formateTerm(item);
        default:
          return "";
      }
    },

    // ---------------------------------

    resetWechat() {
      this.wechatapp = {
        appid: this.$store.getters.showQuery,
        nickname: "li",
        openid: JSON.parse(localStorage.getItem("uid"))
          ? JSON.parse(localStorage.getItem("uid")).openid
          : "",
        // 图片的media_id
        thumb_media_id: "",
        // 要填写的小陈虎须appid
        weappid: "",
        // 填
        title: "",
        type: "",
        // 填写
        pagepath: "",
        picurl: ""
      };
    },
    // 判断数据是否正常
    judegWechatData() {
      return new Promise((resolve, reject) => {
        if (this.wechatapp.thumb_media_id == "") {
          this.$message.warning("小程序封面不能为空");
          this.isDisable = false;
          return false;
        } else if (this.wechatapp.weappid == "") {
          this.$message.warning("小程序appid不能为空");
          this.isDisable = false;
          return false;
        } else if (this.wechatapp.title == "") {
          this.$message.warning("小程序标题不能为空");
          this.isDisable = false;
          return false;
        } else if (this.wechatapp.pagepath == "") {
          this.$message.warning("小程序路径不能为空");
          this.isDisable = false;
          return false;
        } else {
          resolve();
        }
      });
    },
    // 删除一个图文消息
    deletePanel() {
      this.wechatapp.picurl = "";
      this.wechatapp.thumb_media_id = "";
    },
    // 确认选择
    sureImg() {
      this.dialogVisible_img = false;
      // ---------------wechatapp
      this.wechatapp.picurl = this.imgUrl;
      this.wechatapp.thumb_media_id = this.media_id;
      // --------------miniForm
      this.miniForm.picurl = this.imgUrl;
      this.miniForm.thumb_media_id = this.media_id;
    },
    // 选中状态
    handleChoose(item) {
      var _this = this;
      this.$nextTick(function() {
        this.imgUrls.forEach(function(item) {
          _this.$set(item, "active", false);
        });
        this.$set(item, "active", true);
      });
      this.imgUrl = item.url;
      this.media_id = item.media_id;
    },
    // 选择图片
    chooseImg() {
      this.dialogVisible_img = true;
      this.imgLoading = true;
      this.getImgData11();
    },
    // 获取图片数据
    // 翻页
    handleCurrentChange11(val) {
      this.page11 = val;
      this.getImgData11();
      // this.$redrawVueMasonry('containerId')
    },
    handleSizeChange11(val) {
      this.page11 = 1;
      this.limit11 = val;
      this.getImgData11();
    },
    // 获取数据
    getImgData11() {
      this.$axios
        .post(this.GLOBAL.BASE_URL + "meimg", {
          appid: this.$store.getters.showQuery,
          page: this.page11,
          limit: this.limit11
        })
        .then(res => {
          this.imgLoading = false;
          if (res.data.code == 0) {
            this.imgUrls = res.data.data.data;
            this.totals11 = res.data.data.total;
            this.currentPage11 = res.data.data.current_page;
            if (this.page11 > res.data.data.last_page) {
              this.page11 = res.data.data.last_page;
              this.getImgData11();
            }
            this.totals1 = res.data.data.total;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // -----------------------
    handleCurrentChange2(val) {
      this.page2 = val;
      this.getmelink();
    },
    handleSizeChange2(val) {
      this.page2 = this.currentPage2;
      this.limit2 = val;
      this.getmelink();
    },

    handleCurrentChange3(val) {
      this.page3 = val;
      this.getmevoice();
    },
    handleSizeChange3(val) {
      this.page3 = this.currentPage3;
      this.limit3 = val;
      this.getmevoice();
    },

    handleCurrentChange4(val) {
      this.page4 = val;
      this.getmeimgtext();
    },
    handleSizeChange4(val) {
      this.page4 = this.currentPage4;
      this.limit4 = val;
      this.getmeimgtext();
    },

    handleCurrentChange5(val) {
      this.page5 = val;
      this.getmevideo();
    },
    handleSizeChange5(val) {
      this.page5 = this.currentPage5;
      this.limit5 = val;
      this.getmevideo();
    },

    handleCurrentChange6(val) {
      this.page6 = val;
      this.getmeimg();
    },
    handleSizeChange6(val) {
      this.page6 = this.currentPage6;
      this.limit6 = val;
      this.getmeimg();
    },

    handleCurrentChange10(val) {
      this.page10 = val;
      this.getcoupon();
    },
    handleSizeChange10(val) {
      this.page10 = this.currentPage10;
      this.limit10 = val;
      this.getcoupon();
    },

    handleCurrentChange11(val) {
      this.page11 = val;
      this.getmembershipData();
    },
    handleSizeChange11(val) {
      this.page11 = this.currentPage11;
      this.limit11 = val;
      this.getmembershipData();
    },

    // ------------------------
    // toMM(){
    //   this.$mlk.say(123)
    // },
    // 匹配函数
    deleteImg() {},
    matching(data, attribute, value) {
      data.forEach(ele => {
        if (ele[attribute] == value) {
          this.$set(ele, "active", true);
          this.chooseData = ele;
        }
      });
    },
    editChangeData(data) {
      let value = data.value;
      let dataType = data.type || "1";
      this.activeName = dataType.toString();
      switch (parseInt(dataType)) {
        case 1:
          this.txt = value;
          break;
        case 2:
          this.getMelinks(data);
          break;
        case 3:
          this.getMevoices(data);
          break;
        case 4:
          this.getMeimgtexts(data);
          break;
        case 5:
          this.getMevideo(data);
          break;
        case 6:
          this.getMeimg(data);
          break;
        case 10:
          this.getCoupon(data);
          break;
        case 7:
          let datas = JSON.parse(data.value);
          this.wechatapp = {
            thumb_media_id: datas.thumb_media_id,
            title: datas.title,
            pagepath: datas.pagepath,
            picurl: datas.thumb_url,
            weappid: datas.weappid
          };
          break;
        default:
          break;
      }
    },
    resetData() {
      this.activeName = "1";
      this.isDisable = false;
      this.txt = "";
      this.chooseData = [];
      this.interval = "";
    },
    handleTabs() {
      this.chooseData = [];
      switch (parseInt(this.activeName)) {
        case 1:
          this.txt = ""; // 获取图片数据
          break;
        case 2:
          this.getmelink(); // 获取外链图文
          break;
        case 3:
          this.getmevoice(); // 获取音频
          break;
        case 4:
          this.getmeimgtext(); // 获取图文
          break;
        case 5:
          this.getmevideo(); // 获取视频
          break;
        case 6:
          this.getmeimg(); // 获取图片
          break;
        case 10:
          this.getcoupon(); // 获取优惠券
          break;
        case 11:
          this.getmembershipData();
          break;
        default:
          break;
      }
    },

    // ------------------------------------------------------------------------------------------
    getMelinks(data) {
      let datas = data;
      this.getAllData("melink", 1, 1000).then(res => {
        let data = res.data.data.data;
        data.forEach((ele, index) => {
          if (ele.id == parseInt(datas.value)) {
            this.page2 = Math.ceil((index + 1) / 10);
          }
        });
        this.getmelink(datas);
      });
    },

    getMevoices(data) {
      let datas = data;
      this.getAllData("voicelist", 1, 1000).then(res => {
        let data = res.data.data.data;
        data.forEach((ele, index) => {
          if (ele.id == parseInt(datas.value)) {
            this.page3 = Math.ceil((index + 1) / 10);
          }
        });
        this.getmevoice(datas);
      });
    },
    getMeimgtexts(data) {
      let datas = data;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "meimgtext", {
          appid: this.$store.getters.showQuery,
          page: 1,
          is_push: 1,
          limit: 1000
        })
        .then(res => {
          if (res.data.code == 0) {
            let data = res.data.data.data;
            data.forEach((ele, index) => {
              if (ele.id == parseInt(datas.value)) {
                this.page4 = Math.ceil((index + 1) / 10);
              }
            });
            this.getmeimgtext(datas);
          } else {
          }
        });
    },
    getMevideo(data) {
      let datas = data;
      this.getAllData("videolist", 1, 1000).then(res => {
        let data = res.data.data.data;
        data.forEach((ele, index) => {
          if (ele.media_id == datas.value) {
            this.page5 = Math.ceil((index + 1) / 10);
          }
        });
        this.getmevideo(datas);
      });
    },
    getMeimg(data) {
      let datas = data;
      this.getAllData("meimg", 1, 1000).then(res => {
        let data = res.data.data.data;
        data.forEach((ele, index) => {
          if (ele.media_id == datas.value) {
            this.page6 = Math.ceil((index + 1) / 10);
          }
        });
        this.getmeimg(datas);
      });
    },

    getCoupon(data) {
      let datas = data;
      this.getAllData("pullCoupon", 1, 1000).then(res => {
        let data = res.data.data;
        data.forEach((ele, index) => {
          if (ele.media_id == datas.value) {
            this.page10 = Math.ceil((index + 1) / 10);
          }
        });
        this.getcoupon(datas);
      });
    },

    // 获取数据
    getAllData(methods, page, limit, type) {
      return new Promise((resolve, reject) => {
        this.$axios
          .post(this.GLOBAL.BASE_URL + methods, {
            appid: this.$store.getters.showQuery,
            page: page,
            limit: limit,
            type: type
          })
          .then(res => {
            if (res.data.code == 0) {
              resolve(res);
            } else {
              reject(res);
            }
          });
      });
    },
    // 获取视频
    getmevideo(data = {}) {
      let datas = data;
      this.getAllData("videolist", this.page5, this.limit5).then(res => {
        this.mevideo = res.data.data.data;
        this.totals5 = res.data.data.total;
        this.currentPage5 = res.data.data.current_page;
        if (datas) {
          this.mevideo.forEach(ele => {
            if (ele.media_id == datas.value) {
              this.$set(ele, "active", true);
              this.chooseData = ele;
            }
          });
        }
      });
    },
    // 获取音频
    getmevoice(data = {}) {
      let datas = data;
      this.getAllData("voicelist", this.page3, this.limit3).then(res => {
        this.mevoice = res.data.data.data;
        this.totals3 = res.data.data.total;
        this.currentPage3 = res.data.data.current_page;
        if (datas) {
          this.mevoice.forEach(ele => {
            if (ele.media_id == datas.value) {
              this.$set(ele, "active", true);
              this.chooseData = ele;
            }
          });
        }
      });
    },
    // 获取外链图文
    getmelink(data = {}) {
      let datas = data;
      this.getAllData("melink", this.page2, this.limit2).then(res => {
        this.meimglink = res.data.data.data;
        this.totals2 = res.data.data.total;
        this.currentPage2 = res.data.data.current_page;

        if (datas) {
          this.meimglink.forEach(ele => {
            if (ele.id == datas.value) {
              this.$set(ele, "active", true);
              this.chooseData = ele;
            }
          });
        }
      });
    },
    // 获取图文消息
    getmeimgtext(data = {}) {
      let datas = data;
      this.$axios
        .post(this.GLOBAL.BASE_URL + "meimgtext", {
          appid: this.$store.getters.showQuery,
          page: this.page4,
          is_push: 1,
          limit: this.limit4
        })
        .then(res => {
          if (res.data.code == 0) {
            this.meimgtextData = res.data.data.data;
            this.totals4 = res.data.data.total;
            this.currentPage4 = res.data.data.current_page;
            this.arrpush();
            if (datas) {
              this.meimgtextData.forEach(ele => {
                if (ele.id == datas.value) {
                  this.$set(ele, "active", true);
                  this.chooseData = ele;
                }
              });
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 获取图片
    getmeimg(data = {}) {
      let datas = data;
      this.loading6 = true;
      this.getAllData("meimg", this.page6, this.limit6).then(res => {
        this.loading6 = false;
        this.meimgData = res.data.data.data;
        this.totals6 = res.data.data.total;
        this.currentPage6 = res.data.data.current_page;
        if (datas) {
          this.meimgData.forEach(ele => {
            if (ele.media_id == datas.value) {
              this.$set(ele, "active", true);
              this.chooseData = ele;
            }
          });
        }
      });
    },
    // 获取优惠券
    getcoupon(data = {}) {
      let datas = data;
      this.loading10 = true;
      this.getAllData("pullCoupon", this.page10, this.limit10).then(res => {
        this.loading10 = false;
        this.couponData = res.data.data.data;
        this.totals10 = res.data.data.total;
        this.currentPage10 = res.data.data.current_page;
        if (datas) {
          this.couponData.forEach(ele => {
            if (ele.code == datas.value) {
              this.couponDataRadio10 = ele;
            }
          });
        }
      });
    },
    // 获取会员卡
    getmembershipData(data = {}) {
      let datas = data;
      this.loading11 = true;
      this.getAllData(
        "pullCoupon",
        this.page11,
        this.limit11,
        "member_card"
      ).then(res => {
        this.loading11 = false;
        this.membershipData = res.data.data.data;
        this.totals11 = res.data.data.total;
        this.currentPage11 = res.data.data.current_page;
        if (datas) {
          this.membershipData.forEach(ele => {
            if (ele.code == datas.value) {
              this.membershipDataRadio11 = ele;
            }
          });
        }
      });
    },
    selectData(objData, item) {
      var _this = this;
      this.chooseData = item;
      this.$nextTick(function() {
        objData.forEach(function(item) {
          _this.$set(item, "active", false);
        });
        this.$set(item, "active", true);
      });
    },
    // 给优惠券用的
    selectData10(item) {
      this.chooseData = item;
    },
    // 给会员卡用的
    selectData11(item) {
      this.chooseData = item;
    },
    arrpush(item) {
      let obj_info = [];
      let newItem = [];
      this.meimgtextData.forEach(ele => {
        obj_info.push(ele.info);
      });
      obj_info.forEach(ele => {
        newItem.push(ele.news_item[0]);
      });
      return newItem;
    },
    addMaterial() {
      this.isDisable = true;
      switch (parseInt(this.activeName)) {
        case 1:
          if (this.txt != "") {
            this.isDisable = false;
            this.$emit("listenChild", this.activeName, this.txt); //
          } else {
            this.isDisable = false;
            this.$message.warning("选择文本");
          }
          break;
        case 2:
          if (this.chooseData != "") {
            this.isDisable = false;
            this.$emit("listenChild", this.activeName, this.chooseData); //
            this.getmelink();
          } else {
            this.isDisable = false;
            this.$message.warning("选择外链图文");
          }
          break;
        case 3:
          if (this.chooseData != "") {
            this.isDisable = false;
            this.$emit("listenChild", this.activeName, this.chooseData); //
            this.getmevoice();
          } else {
            this.isDisable = false;
            this.$message.warning("选择语音");
          }
          break;
        case 4:
          if (this.chooseData != "") {
            this.isDisable = false;
            this.$emit("listenChild", this.activeName, this.chooseData); //
            this.getmeimgtext();
          } else {
            this.isDisable = false;
            this.$message.warning("选择图文");
          }
          break;
        case 5:
          if (this.chooseData != "") {
            this.isDisable = false;
            this.$emit("listenChild", this.activeName, this.chooseData); //
            this.getmevideo();
          } else {
            this.isDisable = false;
            this.$message.warning("选择视频");
          }
          break;
        case 6:
          if (this.chooseData != "") {
            this.isDisable = false;
            this.$emit("listenChild", this.activeName, this.chooseData); //
            this.getmeimg();
          } else {
            this.isDisable = false;
            this.$message.warning("选择图片");
          }
          break;
        case 10:
          if (this.chooseData != "") {
            this.isDisable = false;
            this.$emit("listenChild", this.activeName, this.chooseData); //
            this.getcoupon();
          } else {
            this.isDisable = false;
            this.$message.warning("选择优惠券");
          }
          break;
        case 7:
          this.judegWechatData().then(() => {
            this.chooseData = this.wechatapp;
            this.isDisable = false;
            this.$emit("listenChild", this.activeName, this.chooseData); //
            this.resetWechat();
          });
          break;
        case 11:
          if (this.chooseData != "") {
            this.isDisable = false;
            this.$emit("listenChild", this.activeName, this.chooseData); //
            this.getcoupon();
          } else {
            this.isDisable = false;
            this.$message.warning("选择会员卡");
          }
          break;
        default:
          break;
      }
      this.txt = "";
    }
  }
};
</script>

<style lang='scss' scoped>
.big.video .svg-icon {
  font-size: 40px;
  color: #63d6ff;
}
.big.voice .svg-icon {
  font-size: 40px;
  color: #41d4ae;
}
.imgItem .img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
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
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.imgItem .img .imgClose {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(77, 76, 76, 0.5);
}
.imgItem .img .imgClose i {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 40px;
  color: #fff;
}
.infoPanel {
  width: 160px;
  height: 160px;
  background: #ccc;
  border: 1px solid transparent;
  margin-bottom: 4px;
  position: relative;
  cursor: pointer;
}
.infoPanel.active {
  border: 1px solid #333;
}
.infoPanelPic {
  width: 160px;
  height: 160px;
  overflow: hidden;
  border-radius: 2px;
}
.infoPanelPic img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 2px;
}
.deletePanel {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 25px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  padding-right: 20px;
  color: #fff;
}
.deletePanel i {
  cursor: pointer;
}
.coupon {
  width: 150px;
  height: 90px;
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
  height: auto;
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
  height: 20px;
  background: #fff;
  font-size: 12px;
  padding: 0 10px;
}
.miniArea {
  width: 50%;
  height: 100%;
}
.imgRemark {
  width: 100%;
  text-align: center;
  display: block;
  margin: auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.tips {
  margin-top: 10px;
}
.tips span {
  color: $--color-primary;
  font-weight: bold;
  padding: 0 4px;
}
.time {
  width: 220px;
  display: inline-flex;
  align-items: center;
}
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
  cursor: pointer;
}
.imgItem .img > div {
  width: 100%;
  height: 100%;
}
.imgItem .img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
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
.imgClose {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(77, 76, 76, 0.5);
  color: #fff;
}
.imgClose i {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 40px;
  cursor: pointer;
}
.sumit {
  text-align: right;
  margin-top: 20px;
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
</style>
