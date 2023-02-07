<template>
  <div
    class="play-item"
    @click="onShowToolBar()"
    :style="{
      position: 'absolute',
      width: actualWidth,
      height: actualHeight,
      left: offsetX,
      top: offsetY,
    }"
  >
    <img class="video-logo" :src="defaultVideoLogo" />
    <video
      ref="video"
      class="video"
      controls
      autoplay
      :style="{ width: actualWidth, height: actualHeight, padding: '2px' }"
    ></video>
    <div class="video-tools" :style="{ display: displayToolBar }">
      <button class="tool-btn" @click.stop="onStartPlay()">播放</button>
      <button class="tool-btn" @click.stop="onSwitchSource()">切换</button>
      <button class="tool-btn" @click.stop="onShowPtz()">云台</button>
      <button class="tool-btn">抓拍</button>
      <button class="tool-btn">录像</button>
    </div>
    <div class="ptz" :style="{ display: displayPtz }">
      <div class="ptz-pan">
        <div>
          <button class="ptz-btn">↖</button>
          <button class="ptz-btn">↑</button>
          <button class="ptz-btn">↗</button>
        </div>
        <div>
          <button class="ptz-btn">←</button>
          <button class="ptz-btn"></button>
          <button class="ptz-btn">→</button>
        </div>
        <div>
          <button class="ptz-btn">↙</button>
          <button class="ptz-btn">↓</button>
          <button class="ptz-btn">↘</button>
        </div>
      </div>
      <div class="ptz-zoom">
        <button class="tool-btn">+</button>
        <button class="tool-btn">-</button>
      </div>
    </div>
  </div>
</template>


<script>
// import rtcStreamSchedule from '../../rtcStreamSchedule.js'
// let sc = new rtcStreamSchedule();
import streamSchedule from '../../streamSchedule'

export default {
  props: ["resid", "actualWidth", "actualHeight", "offsetX", "offsetY"],
  data: function () {
    return {
      displayStatusBar: "none",
      displayToolBar: "none",
      displayPtz: "none",
      defaultVideoLogo: require("../../assets/logo.png"),
    };
  },
  methods: {
    onShowToolBar() {
      this.displayToolBar = this.displayToolBar === "none" ? "block" : "none";
      this.displayPtz =
        this.displayToolBar === "none" ? "none" : this.displayPtz;
    },
    onShowPtz() {
      this.displayPtz = this.displayPtz === "none" ? "block" : "none";
    },
    onStartPlay() {
      debugger;
      // sc.init();
      // sc.startPlay(this.resid, (stream)=>{
      //     self.$refs.video.srcObject = stream;
      // })

      streamSchedule.getInstance().startPlay(this.resid, (stream)=>{
           self.$refs.video.srcObject = stream;
       })
    },
    onStopPlay(){
        streamSchedule.getInstance().stopPlay(this.resid);
    },
    onSwitchSource() {
        
    },
  },
  mounted() {
    
  },
};
</script>

<style lang="scss" scoped>
.play-item {
  position: absolute;
  background-color: rosybrown;
  border: solid, 1px, seagreen;
  padding: 0px;
  .video {
    // TODO: set video element style
  }
  .video-logo {
    position: absolute;
    left: 40%;
    top: 25%;
  }
  .video-tools {
    height: 30px;
    position: absolute;
    bottom: 0px;
    width: 100%;
    background: rgba($color: #000000, $alpha: 0.3);
  }
  .ptz {
    position: absolute;
    bottom: 30px;
    background: rgba($color: #000000, $alpha: 0.3);
    display: flex;
    align-content: space-between;
  }
}
</style>