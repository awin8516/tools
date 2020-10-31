import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/echarts'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/echarts',
                    name: 'echarts',
                    component: resolve => require(['../components/page/Echarts.vue'], resolve),
                    meta: { title: '概览' },
                },
                //  {
                //      path: '/menugroup',
                //      name: 'menugroup',
                //      component: resolve => require(['../components/menu/MenuGroup.vue'], resolve),
                //      meta: { title: '菜单控制', subTitle: '自定义菜单' }
                //  },
                //   {
                //       path: '/imenus',
                //       name: 'imenus',
                //       component: resolve => require(['../components/menu/imenus.vue'], resolve),
                //       meta: { title: '菜单控制', subTitle: '个性化菜单' }
                //   },
                //  {
                //      path: '/imenugroup',
                //      name: 'imenugroup',
                //      component: resolve => require(['../components/menu/iMenuGroup.vue'], resolve),
                //      meta: { title: '菜单控制', subTitle: '个性化菜单' },
                //  },
                //  {
                //      path: '/keywordreply',
                //      name: 'keywordreply',
                //      component: resolve => require(['../components/reply/KeywordReply.vue'], resolve),
                //      meta: { title: '自动回复', subTitle: '关键词自动回复' },
                //  },
                //  {
                //      path: '/KeywordReplyEdit',
                //      name: 'keywordreply',
                //      component: resolve => require(['../components/reply/KeywordReplyEdit.vue'], resolve),
                //      meta: { title: '自动回复', subTitle: '关键词自动回复编辑' },
                //  },
                //  {
                //      path: '/followreply',
                //      name: 'followreply',
                //      component: resolve => require(['../components/reply/FollowReply.vue'], resolve),
                //      meta: { title: '自动回复', subTitle: '被关注自动回复' },
                //  },
                //  {
                //      path: '/autoreply',
                //      name: 'autoreply',
                //      component: resolve => require(['../components/reply/AutoReply.vue'], resolve),
                //      meta: { title: '自动回复', subTitle: '消息自动回复' },
                //  },
                //   {
                //       path: '/qrcode',
                //       name: "qrcode",
                //       component: resolve => require(['../components/qrcode/QRCode.vue'], resolve),
                //       meta: { title: '推广二维码', subTitle: '生成二维码' },
                //   },
                //   {
                //       path: '/qrcodeEdit',
                //       name: "qrcode",
                //       component: resolve => require(['../components/qrcode/qrcodeEdit.vue'], resolve),
                //       meta: { title: '推广二维码', subTitle: '二维码编辑' },
                //   },
                //   {
                //       path: '/qrcodeData',
                //       name: 'qrcode',
                //       component: resolve => require(['../components/qrcode/qrcodeData.vue'], resolve),
                //       meta: { title: '推广二维码', subTitle: '二维码统计' },
                //   },
                //   {
                //       path: '/qrcoderecord',
                //       name: 'qrcoderecord',
                //       component: resolve => require(['../components/qrcode/QRCodeRecord.vue'], resolve),
                //       meta: { title: '推广二维码', subTitle: '扫码记录' },
                //   },
                //   {
                //       path: '/oauth',
                //       name: 'oauth',
                //       component: resolve => require(['../components/oauth/Oauth.vue'], resolve),
                //       meta: { title: '网页授权' },
                //   },
                //  {
                //      path: '/usertag',
                //      name: 'UserTag',
                //      component: resolve => require(['../components/user/UserTag.vue'], resolve),
                //      meta: { title: '用户管理', subTitle: '微信标签' },
                //  },
                //  {
                //      path: '/UserTagEdit',
                //      name: 'UserTag',
                //      component: resolve => require(['../components/user/UserTagEdit.vue'], resolve),
                //      meta: { title: '用户管理', subTitle: '微信标签编辑' },
                //  },
                //  {
                //      path: '/userinfo',
                //      name: 'UserInfo',
                //      component: resolve => require(['../components/user/UserInfo.vue'], resolve),
                //      meta: { title: '用户管理', subTitle: '用户列表' },
                //  },
                //  {
                //      path: '/UserMessage',
                //      name: 'UserInfo',
                //      component: resolve => require(['../components/user/UserMessage.vue'], resolve),
                //      meta: { title: '用户管理', subTitle: '用户信息互动' },
                //  },
                //  {
                //      path: '/frineds',
                //      name: 'UserInfo',
                //      component: resolve => require(['../components/user/frineds.vue'], resolve),
                //      meta: { title: '用户管理', subTitle: '朋友圈关系网' },
                //  },
                //  {
                //      path: '/fansData',
                //      name: 'fansData',
                //      component: resolve => require(['../components/user/fansData.vue'], resolve),
                //      meta: { title: '用户管理', subTitle: '粉丝自定义资料' },
                //  },
                //  {
                //      path: '/UserPortrait',
                //      name: 'UserInfo',
                //      component: resolve => require(['../components/user/UserPortrait.vue'], resolve),
                //      meta: { title: '用户管理', subTitle: '用户详情' },
                //  },
                //  {
                //      path: '/UserDown',
                //      name: 'UserDown',
                //      component: resolve => require(['../components/user/UserDown.vue'], resolve),
                //      meta: { title: '用户管理', subTitle: '用户下载任务' },
                //  },
                //  {
                //      path: '/userdynamics',
                //      name: 'UserDynamics',
                //      component: resolve => require(['../components/user/UserDynamics.vue'], resolve),
                //      meta: { title: '用户管理', subTitle: '用户动态' },
                //  },
                //  {
                //      path: '/tagroup',
                //      name: 'tagroup',
                //      component: resolve => require(['../components/user/tagroup.vue'], resolve),
                //      meta: { title: '用户管理', subTitle: '自定义标签组列表' },
                //  },
                //  {
                //      path: '/customtag',
                //      name: 'customtag',
                //      component: resolve => require(['../components/user/customtag.vue'], resolve),
                //      meta: { title: '用户管理', subTitle: '自定义标签列表' },
                //  },
                //   {
                //       path: '/newslist',
                //       name: "newslist",
                //       component: resolve => require(['../components/material/NewsList.vue'], resolve),
                //       meta: { title: '素材管理', subTitle: '图文消息' },
                //   },
                //   {
                //       path: '/NewsListEdit',
                //       name: "newslist",
                //       component: resolve => require(['../components/material/NewsListEdit.vue'], resolve),
                //       meta: { title: '素材管理', subTitle: '图文消息编辑' },
                //   },
                //   {
                //       path: '/linknewslist',
                //       name: 'linknewslist',
                //       component: resolve => require(['../components/material/LinkNewsList.vue'], resolve),
                //       meta: { title: '素材管理', subTitle: '外链图文' },
                //   },
                //   {
                //       path: '/linknewslistedit',
                //       name: 'linknewslist',
                //       component: resolve => require(['../components/material/LinkNewsListEdit.vue'], resolve),
                //       meta: { title: '素材管理', subTitle: '外链图文编辑' },
                //   },
                //   {
                //       path: '/images',
                //       name: 'images',
                //       component: resolve => require(['../components/material/Images.vue'], resolve),
                //       meta: { title: '素材管理', subTitle: '图片' },
                //   },
                //   {
                //       path: '/videos',
                //       name: 'videos',
                //       component: resolve => require(['../components/material/videos.vue'], resolve),
                //       meta: { title: '素材管理', subTitle: '视频素材' },
                //   },
                //   {
                //       path: '/musics',
                //       name: 'musics',
                //       component: resolve => require(['../components/material/musics.vue'], resolve),
                //       meta: { title: '素材管理', subTitle: '音频素材' },
                //   },
                //   {
                //       path: '/coupon',
                //       name: 'coupon',
                //       component: resolve => require(['../components/material/coupon.vue'], resolve),
                //       meta: { title: '素材管理', subTitle: '优惠券' },
                //   },

                //   {
                //       path: '/addgoods',
                //       name: 'addgoods',
                //       component: resolve => require(['../components/goods/addGoods.vue'], resolve),
                //       meta: { title: '商品添加' },
                //   },
                //   {
                //       path: '/404',
                //       name: '404',
                //       component: resolve => require(['../components/page/404.vue'], resolve),
                //       meta: { title: '404' }
                //   },
                //   {
                //       path: '/403',
                //       name: '403',
                //       component: resolve => require(['../components/page/403.vue'], resolve),
                //       meta: { title: '403' }
                //   },
                //   {
                //       path: '/goodsuser',
                //       name: 'goodsuser',
                //       component: resolve => require(['../components/goods/goodsuser.vue'], resolve),
                //       meta: { title: 'goodsuser' }
                //   },
                //   {
                //       path: '/goodorderlist',
                //       name: 'goodorderlist',
                //       component: resolve => require(['../components/goods/orderlist.vue'], resolve),
                //       meta: { title: 'goodsuser' }
                //   },
                //   {
                //       path: '/jforders',
                //       name: 'jforders',
                //       component: resolve => require(['../components/dialogs/jforders.vue'], resolve),
                //       meta: { title: '商品物流信息' }
                //   },
                //   {
                //       path: '/integralList',
                //       name: 'IntegralList',
                //       component: resolve => require(['../components/goods/IntegralList.vue'], resolve),
                //       meta: { title: '积分列表' }
                //   },
                //   {
                //       path: '/couponList',
                //       name: 'couponList',
                //       component: resolve => require(['../components/coupon/couponList.vue'], resolve),
                //       meta: { title: '积分列表' }
                //   },
                //   {
                //       path: '/couponListCopy',
                //       name: 'couponListCopy',
                //       component: resolve => require(['../components/dialogs/couponListCopy.vue'], resolve),
                //       meta: { title: '积分列表' }
                //   },
                //   {
                //       path: '/lunbo',
                //       name: 'lunbo',
                //       component: resolve => require(['../components/banner/lunbo.vue'], resolve),
                //       meta: { title: '轮播图管理' }
                //   },
                //   {
                //       path: '/addbanner',
                //       name: 'addBanner',
                //       component: resolve => require(['../components/banner/addBanner.vue'], resolve),
                //       meta: { title: '新增轮播图' }
                //   },
                //   {
                //       path: '/lbs',
                //       name: 'linknewslist',
                //       component: resolve => require(['../components/LBS/lbs.vue'], resolve),
                //       meta: { title: '素材管理', subTitle: '外链图文' },
                //   },
                //   {
                //       path: '/business',
                //       name: 'business',
                //       component: resolve => require(['../components/business/business.vue'], resolve),
                //       meta: { title: '电商信息' }
                //   },
                //   {
                //       path: '/businfo',
                //       name: 'businfo',
                //       component: resolve => require(['../components/business/businfo.vue'], resolve),
                //       meta: { title: '订单详情' }
                //   },
                //   {
                //       path: '/SystemLog',
                //       name: 'SystemLog',
                //       component: resolve => require(['../components/System/SystemLog.vue'], resolve),
                //       meta: { title: '设置', subTitle: '系统操作日志' },
                //   },
                //   {
                //       path: '/ordinarytask',
                //       name: "ordinarytask",
                //       component: resolve => require(['../components/task/OrdinaryTask.vue'], resolve),
                //       meta: { title: '消息群发', subTitle: '普通群发' },
                //   },
                //   {
                //       path: '/advancedtask',
                //       name: "advancedtask",
                //       component: resolve => require(['../components/task/AdvancedTask.vue'], resolve),
                //       meta: { title: '消息群发', subTitle: '消息群发' },
                //   },
                //   {
                //       path: '/tasklist',
                //       name: 'tasklist',
                //       component: resolve => require(['../components/task/TaskList.vue'], resolve),
                //       meta: { title: '消息群发', subTitle: '群发任务列表' },
                //   },
                //   {
                //       path: '/goodslist',
                //       name: 'goodslist',
                //       component: resolve => require(['../components/goods/goodslist.vue'], resolve),
                //       meta: { title: '消息群发', subTitle: '商品管理' },
                //   },
                //   {
                //       path: '/Tempmessage',
                //       name: 'Tempmessage',
                //       component: resolve => require(['../components/Tempmessage/Tempmessage.vue'], resolve),
                //       meta: { title: '消息群发', subTitle: '模板消息' },
                //   },
                //   {
                //       path: '/TempmesEdit',
                //       name: 'Tempmessage',
                //       component: resolve => require(['../components/Tempmessage/TempmesEdit.vue'], resolve),
                //       meta: { title: '消息群发', subTitle: '模板编辑' },
                //   },
                //   {
                //       path: '/TempRecord',
                //       name: 'TempRecord',
                //       component: resolve => require(['../components/Tempmessage/TempRecord.vue'], resolve),
                //       meta: { title: '消息群发', subTitle: '模板消息发送记录' },
                //   },
                //   {
                //       path: '/TempRecordWater',
                //       name: 'TempRecord',
                //       component: resolve => require(['../components/Tempmessage/TempRecordWater.vue'], resolve),
                //       meta: { title: '消息群发', subTitle: '模板消息发送记录流水记录' },
                //   },
                //   {
                //       path: '/SmsList',
                //       name: "SmsList",
                //       component: resolve => require(['../components/SMS/SmsList.vue'], resolve),
                //       meta: { title: '消息群发', subTitle: '签名列表' },
                //   },
                //   {
                //       path: '/SmsAddSign',
                //       name: "SmsList",
                //       component: resolve => require(['../components/SMS/SmsAddSign.vue'], resolve),
                //       meta: { title: '消息群发', subTitle: '签名列表编辑' },
                //   },
                //   {
                //       path: '/SmsTemp',
                //       name: "SmsTemp",
                //       component: resolve => require(['../components/SMS/SmsTemp.vue'], resolve),
                //       meta: { title: '消息群发', subTitle: '短信模板' },
                //   },
                //   {
                //       path: '/SmsAddTemp',
                //       name: "SmsTemp",
                //       component: resolve => require(['../components/SMS/SmsAddTemp.vue'], resolve),
                //       meta: { title: '消息群发', subTitle: '新建短信模板' },
                //   },
                //   {
                //       path: '/SmsTempEdit',
                //       name: "SmsTemp",
                //       component: resolve => require(['../components/SMS/SmsTempEdit.vue'], resolve),
                //       meta: { title: '消息群发', subTitle: '编辑短信模板' },
                //   },
                //   {
                //       path: '/SmsRecord',
                //       name: "SmsRecord",
                //       component: resolve => require(['../components/SMS/SmsRecord.vue'], resolve),
                //       meta: { title: '消息群发', subTitle: '发送记录' },
                //   },
                //   {
                //       path: '/SmsRecordWater',
                //       name: "SmsRecord",
                //       component: resolve => require(['../components/SMS/SmsRecordWater.vue'], resolve),
                //       meta: { title: '消息群发', subTitle: '发送记录流水' },
                //   },
                //   {
                //       path: '/account',
                //       name: "account",
                //       component: resolve => require(['../components/account/account.vue'], resolve),
                //       meta: { title: '子账号管理', subTitle: '子账号管理' },
                //   },
                //   {
                //       path: '/RightsMana',
                //       name: "RightsMana",
                //       component: resolve => require(['../components/account/RightsMana.vue'], resolve),
                //       meta: { title: '子账号管理', subTitle: '权限管理' },
                //   },
                //   {
                //       path: '/ChildOpertion',
                //       name: "ChildOpertion",
                //       component: resolve => require(['../components/account/ChildOpertion.vue'], resolve),
                //       meta: { title: '子账号管理', subTitle: '子账号操作记录' },
                //   },

                //   {
                //       path: '/flowChart',
                //       name: "flowChart",
                //       component: resolve => require(['../components/flowChart/flowChart.vue'], resolve),
                //       meta: { title: '流程图' }
                //   },

                //   {
                //       path: '/flowChartEdit',
                //       name: "flowChart",
                //       component: resolve => require(['../components/flowChart/flowChartEdit.vue'], resolve),
                //       meta: { title: '流程图编辑' }
                //   },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ],
})
