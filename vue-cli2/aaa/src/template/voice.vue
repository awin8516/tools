<template>
  <div>
    <el-tooltip class="item" effect="dark" content="播放音频" placement="top-start">
      <!-- <i class="el-icon-microphone big" @click="handlePlay(replyContent)"></i> -->
      <div class="big" @click="handlePlay()">
        <svg-icon icon-class="voice"></svg-icon>
         <span>{{replyContent.real_name}}</span>
      </div>
    </el-tooltip>
    <el-dialog title="播放音频" style="30%" :visible.sync="dialogVisible_play" center>
      <div class="voicePanel" v-if="flag">
        <aplayer :music="musicList" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Aplayer from "vue-aplayer";
export default {
  name: "vVoice",
  props: ["replyContent"],
  components: {
    Aplayer
  },
  data() {
    return {
      musicList: {
        title: "音频",
        author: localStorage.getItem("name"),
        src: this.GLOBAL.BASE_URL.MUSIC
      },
      dialogVisible_play: false,
      flag: false
    };
  },
  watch: {
    replyContent: {
      handler(newValue, oldValue) {
        this.musicList = {
          title: "音频",
          author: localStorage.getItem("name"),
          src: ''
        };
      },
      deep: true
    }
  },
  methods: {
    handlePlay(item) {
      if(this.replyContent == ''){
        this.$message.warning("音频正在获取中，请稍后播放")
        return false
      }
      this.musicList = {
        title: "音频",
        author: localStorage.getItem("name"),
        src: this.replyContent.url || this.replyContent.vocie_url
      };
      this.flag = true;
      this.dialogVisible_play = true;
    }
  }
};
</script>

<style scoped>
.big{
  width: auto;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.item{
}
.big .svg-icon{
  font-size: 40px;;
  color: #41d4ae;
  flex-shrink: 0;
}
</style>