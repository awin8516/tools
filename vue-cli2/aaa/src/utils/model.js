const model = {
  assign(data, judge = true) {
      let a = {};
      switch (data.node_executor) {
          case 'play':
              a = new model.Play(data, judge);
              break;
      }
      return a;
  },
  //流程图数据
  flowchartData(obj) {
      this.appid = obj.appid || '';
      
      this.process_status = obj.process_status || '';
      this.remark = obj.remark || '';
      this.process_id = obj.process_id || '';
      this.updated_at = obj.updated_at || '';
      this.created_at = obj.created_at || '';
      this._id = obj._id || '';
  },
  Play(obj, judge) {
      this.trigger_condition = obj.trigger_condition || '';
      this.trigger_value = obj.trigger_value || '';
      this.process_name = obj.process_name || '';
      if (judge) {
          this.filter_condition = {};
          if (obj.peopleSelect == 'diytag') {
              this.filter_condition.diy_tag_id = obj.tags;
          } else if (obj.peopleSelect == 'wechattag') {
              this.filter_condition.tag_id = obj.tags;
          }
      } else {
          this.node_label = obj.node_label || '';
          this.node_type = 'action';
          this.node_executor = 'play';
          if (obj.filter_condition.tag_id && obj.filter_condition.tag_id.length) {
              this.peopleSelect = 'wechattag';
              this.tags = obj.filter_condition.tag_id;
          } else if (obj.filter_condition.diy_tag_id && obj.filter_condition.diy_tag_id.length) {
              this.peopleSelect = 'diytag';
              this.tags = obj.filter_condition.diy_tag_id;
          } else {
              this.peopleSelect = 'all';
          }

      }

  },
  Blank() {
      this.node_label = '';
      this.node_executor = 'blank';
      this.node_name = "节点添加";
      this.position = {};
  },
  Userattribute() {
      this.node_name = "属性判断";
      this.node_label = {};
      this.node_type = "condition_controller";
      this.node_executor = "userattribute";
      this.judgement = {
          branchs: [{
                  branch_name: "是",
                  process_nodes: [],
                  condition_group: {
                      logic_op: "and",
                      condition_items: [{
                              logic_op: "and",
                              condition_child_items: [{
                                      item_name: 'customer.name',
                                      judge_op: 'equal',
                                      item_value: ''
                                  },
                                  {
                                      item_name: 'customer.name',
                                      judge_op: 'equal',
                                      item_value: ''
                                  }
                              ]
                          }

                      ]
                  }

              },
              {
                  branch_name: "否",
                  process_nodes: []
              },

          ]
      }
  },
  End() {
      this.node_executor = "ending_controller";
      this.node_label = {};
      this.node_name = "结束";
      this.node_type = "process_controller";
  },
  Wait() {
      this.action_parameter = {
          wait_type: 'wait_after',
          wait_value: 0,
      };
      this.node_label = {};
      this.node_name = "等待";
      this.node_type = 'process_controller';
      this.node_executor = 'wait_controller'
  },
  Diytag() {
      this.action_parameter = {
          action: "add",
          tag_id: []
      };
      this.node_executor = 'diytag';
      this.node_label = {};
      this.node_name = "自定义标签";
      this.node_type = 'action';
  },
  Wechattag() {
      this.action_parameter = {
          action: "add",
          tag_id: []
      };
      this.node_executor = 'wechattag';
      this.node_label = {};
      this.node_name = "微信标签";
      this.node_type = 'action';
  },
  Smsreply() {
      this.action_parameter = {
          sms_template_id: "",
          sms_sign_id: "",
          sms_content: {}
      };
      this.node_executor = 'smsreply';
      this.node_label = {};
      this.node_name = "短信";
      this.node_type = 'action';
  },
  Templatenewsreply() {
      this.action_parameter = {
          template_id: "",
          url: "",
          appid: "",
          page: "",
          data: {

          }
      };
      this.node_executor = 'templatenewsreply';
      this.node_label = {};
      this.node_name = "模板消息";
      this.node_type = 'action';
  },
  Wechatreply() {
      this.action_parameter = {
          reply_type: '',
          reply_content: {
              value: '',
              midia_id: '',
              url: '',
              name: '',
              id: ''
          }
      };
      this.node_executor = 'wechatreply';
      this.node_label = {};
      this.node_name = "微信回复";
      this.node_type = 'action';
  },
  UserattrMbController() {
      this.node_name = "属性多分支判断",
          this.node_label = {},
          this.node_type = "condition_controller",
          this.node_executor = "userattr_mb_controller",
          this.judgement = {
              branchs: [{
                      branch_name: "分支1",
                      process_nodes: [],
                      condition_item: {
                          item_name: "customer.name",
                          judge_op: "equal",
                          item_value: ""
                      }
                  },
                  {
                      branch_name: "其他",
                      process_nodes: [],
                      condition_item: {
                          item_name: "",
                          judge_op: "",
                          item_value: "其他"
                      }
                  }
              ]
          }
  },
  DiytagMbController() {
      this.node_name = "自定义标签多分支",
          this.node_label = {},
          this.node_type = "condition_controller",
          this.node_executor = "diytag_mb_controller",
          this.judgement = {
              branchs: [{
                      branch_name: "分支1",
                      process_nodes: [],
                      condition_item: {
                          item_value: [] //标签ID数组
                      }
                  },
                  {
                      branch_name: "其他",
                      process_nodes: [],
                      condition_item: {
                          item_value: '其他' //标签ID数组
                      }
                  }
              ]
          }
  },
  WechattagMbController() {
      this.node_name = "微信标签多分支",
          this.node_label = {},
          this.node_type = "condition_controller",
          this.node_executor = "wechattag_mb_controller",
          this.judgement = {
              branchs: [{
                      branch_name: "分支1",
                      process_nodes: [],
                      condition_item: {
                          item_value: '其他' //标签ID数组
                      }
                  },
                  {
                      branch_name: "其他",
                      process_nodes: [],
                      condition_item: {
                          item_value: '其他' //标签ID数组
                      }
                  }
              ]
          }
  },
  TimeController() {
      this.node_name = "时间分支",
          this.node_label = {},
          this.node_type = "condition_controller",
          this.node_executor = "time_controller",
          this.judgement = {
              branchs: [{
                      branch_name: "是",
                      process_nodes: [],
                      condition_item: {
                          judge_op: "gt",
                          item_value: ''
                      }
                  },
                  {
                      branch_name: "否",
                      process_nodes: [],
                  }
              ]
          }
  },
  EventController() {
      this.node_name = "事件判断";
      this.node_label = {};
      this.node_type = "condition_controller";
      this.node_executor = "event_controller";
      this.judgement = {
          branchs: [{
                  branch_name: "是",
                  process_nodes: [],
                  condition_group: {
                      logic_op: "and",
                      condition_items: [{
                              logic_op: "and",
                              condition_child_items: [{
                                      item_name: 'wechat_event.subscribe',
                                  },
                                  {
                                      item_name: 'wechat_event.subscribe',
                                  }
                              ]
                          }

                      ]
                  }

              },
              {
                  branch_name: "否",
                  process_nodes: []
              },

          ]
      }
  }
}

export default model;