<template>
  <el-dialog title="" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="modal">
    <p>注意，您正在进行高危操作！</p>
    <P>操作时间：{{danger_times}}</P>
    <P>操作类型：{{danger_type}}</P>
    <P>操作内容：{{danger_ontent}}</P>
    <div class='sureArea'>
      <p>如确认无误请在下方输入框中填写”BEATS”并点击确认执行此操作</p>
      <div class="inputarea">
        <el-input v-model="input" placeholder="请输入内容"></el-input>
      </div>
      <div class="buttonarea">
        <el-tooltip class="item" effect="dark" content="确定操作" placement="top">
          <el-button type="primary" @click="sure()">确定</el-button>
        </el-tooltip>
        
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props:['danger_type','danger_ontent'],
  data() {
    return {
      modal:false,
      input:"",
      dialogVisible: false,
      danger_times:"",
    }
  },
  created() {
  },
  methods: {
    getTime(){
      // 获取当前日期
      var date = new Date();
      var year = date.getFullYear()
      // 获取当前月份
      var nowMonth = date.getMonth() + 1;
      // 获取当前是几号
      var strDate = date.getDate();
      // 小时
      var hour  =date.getHours();
      // 分钟
      var min = date.getMinutes();
      // 秒钟
      var second = date.getSeconds()
      if(second <10){
        second = "0"+ second
      }
      // 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
      var nowDate = year +"-" + nowMonth +"-" + strDate+" "+hour+":"+min+":"+second;
      this.danger_times = nowDate;
    },
    showDanger() {
      this.input = '';
      this.dialogVisible = true;
      this.getTime()
    },
    sure() {
      if(this.input == 'BEATS'){
        this.input = '';
        this.dialogVisible = false;
        this.$emit('dangerSure');
      }else{
        this.$message.warning("输入有误，请重新输入")
      }
    }
  }
};
</script>

<style scoped>
p{
  margin-bottom:10px;
}
.sureArea{
  margin-top:100px;
}
.inputarea{
  width:100%;
  margin: auto;
}
.buttonarea{
  display:flex;
  margin: auto;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
}
</style>
