<template>
  <div>
    <el-tooltip class="item" effect="dark" content="播放视频" placement="top-start">
      <!-- <i class="el-icon-video-camera-solid big"  @click="handlePlay(replyContent)"></i> -->
      <div class="big" @click="handlePlay(replyContent)">
         <svg-icon icon-class="video" ></svg-icon>
         <span>{{replyContent.title || replyContent.video_title}}</span>
      </div>
    </el-tooltip>

    <el-dialog title="播放视频" style="100%" :visible.sync="dialogVisible_play" center @closed='handleClose()'>
      <div class="videoPanel">
        <video-player
          class="vjs-custom-skin"
          ref="videoPlayer"
          :options="playerOptions"
          :playsinline="true"
        ></video-player>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";
import BaseView from "../components/common/BaseView";
export default {
  extends: BaseView,
  components: {
    videoPlayer
  },
  props: ["replyContent"],
  data(){
    return {
      dialogVisible_play:false,
      playerOptions: {
        height: "360",
        autoplay: false,
        muted: true,
        language: "en",
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [
          {
            type: "video/mp4",
            // mp4
            src: "http://vjs.zencdn.net/v/oceans.mp4"
            // webm
            // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
          }
        ],
        controlBar: {
          timeDivider: true,
          durationDisplay: true
        },
        poster: "",
        is_upload: true
      }
    }
  },
  watch: {
    replyContent: {
      handler(newValue, oldValue) {
        this.playerOptions.sources[0].src = this.replyContent.url;
      },
      deep: true
    }
  },
  methods:{
    handleClose(){
      this.dialogVisible_play = false;
      this.playerOptions.sources[0].src = 'http://vjs.zencdn.net/v/oceans.mp4';
    },
    handlePlay() {
      this.dialogVisible_play = true;
      console.log(this.replyContent)
      this.playerOptions.sources[0].src = this.replyContent.url || this.replyContent.video_url;
    },
  }
};
</script>

<style>
.vjs-custom-skin > .video-js .vjs-big-play-button {
  top: 50%;
  left: 50%;
  margin-left: -1.5em;
  margin-top: -1em;
  background-color: rgba(0, 0, 0, 0.45);
  font-size: 3.5em;
  height: 2em !important;
  line-height: 2em !important;
  margin-top: -1em !important;
}
.videoPanel {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
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
  color: #63d6ff;
  flex-shrink: 0;
}
</style>