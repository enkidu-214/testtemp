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
      :style="{ width: '100%', height: '100%' }"
    ></video>
    <div class="video-tools" :style="{ display: displayToolBar }">
      <button class="tool-btn" @click.stop="onStartPlay()">播放</button>
      <button class="tool-btn" @click.stop="onSwitchSource()"
        >切换</button
      >
      <button class="tool-btn" @click.stop="onShowPtz()">云台</button>
      <button class="tool-btn">抓拍</button>
      <button class="tool-btn">录像</button>
    </div>
    <div class="ptz" :style="{ display: displayPtz }">
      <el-row>
        <el-col :span="16">
          <div class="ptz-pan">
            <div>
              <el-button class="ptz-btn">↖</el-button>
              <el-button class="ptz-btn">↑</el-button>
              <el-button class="ptz-btn">↗</el-button>
            </div>
            <div>
              <el-button class="ptz-btn">←</el-button>
              <el-button class="ptz-btn"> </el-button>
              <el-button class="ptz-btn">→</el-button>
            </div>
            <div>
              <el-button class="ptz-btn">↙</el-button>
              <el-button class="ptz-btn">↓</el-button>
              <el-button class="ptz-btn">↘</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="ptz-zoom">
            <el-button class="tool-btn">+</el-button>
            <el-button class="tool-btn">-</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>


<script>
import SignalingChannel from "../../script/sc.websocket.js";
import owt from "../../script/owt.js";
const serverAddress = "http://192.168.110.83:3000";

const signaling = new SignalingChannel();
const p2p = new Owt.P2P.P2PClient(
  {
    audioEncodings: false,
    videoEncodings: [
      {
        codec: {
          name: "h264",
        },
      },
    ],
  },
  signaling
);

export default {
  props: ["resid", "actualWidth", "actualHeight", "offsetX", "offsetY"],
  data: function () {
    return {
      displayStatusBar: "none",
      displayToolBar: "none",
      displayPtz: "none",
      defaultVideoLogo: require("../../assets/logo.png"),
      allowRIDs: [],
      uid: "666", // this maybe only one id with this browser
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
      let self = this;
      this.allowRIDs.push("webrtc" + this.resid);
      p2p.allowedRemoteIds = this.allowRIDs;

      p2p
        .connect({
          host: serverAddress,
          token: this.uid,
        })
        .then(
          () => {
            p2p.addEventListener("streamadded", function (e) {
              // A remote stream is available.
              e.stream.addEventListener("ended", () => {
                console.log("Stream is removed.");
              });

              console.log("Stream added.");

              if (e.stream.source.video === "screen-cast") {
                // FIXME
              } else if (e.stream.source.audio || e.stream.source.video) {
                // self.$refs.video.show();
                self.$refs.video.get(0).srcObject = e.stream.mediaStream;
                // self.$refs.video.get(0).play();
              }
            });
            p2p.addEventListener("messagereceived", function (e) {
              // Received data from datachannel.

              console.log("Recv message:" + e.origin + ": " + e.message);
            });
          },
          (error) => {
            console.log("Failed to connect to the signaling server." + error);
          }
        );
    },
    onSwitchSource() {
      console.log("Send message: 123");
      p2p.send("333", "hello");
      p2p.send("123", "hello");
    },
  },
  mounted() {
    // p2p.addEventListener("streamadded", function (e) {
    //   // A remote stream is available.
    //   e.stream.addEventListener("ended", () => {
    //     console.log("Stream is removed.");
    //   });
    //   console.log("Stream added.");
    //   if (e.stream.source.video === "screen-cast") {
    //     // FIXME
    //   } else if (e.stream.source.audio || e.stream.source.video) {
    //     this.$refs.video.show();
    //     this.$refs.video.get(0).srcObject = e.stream.mediaStream;
    //     this.$refs.video.get(0).play();
    //   }
    // });
    // p2p.addEventListener("messagereceived", function (e) {
    //   // Received data from datachannel.
    //   console.log("Recv message:" + e.origin + ": " + e.message);
    // });
  },
};
</script>

<style lang="scss" scoped>
.play-item {
  position: absolute;
  background-color: rosybrown;
  border: solid, 1px, seagreen;
  padding: 5px;
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
    //align-content: space-between;
    width: 70%;
    left: 15%;
    .ptz-pan {
    }
    .ptz-zoom {
      display: flex;
    }
    .ptz-btn {
      width: 30px;
      height: 30px;
    }
  }
}
</style>