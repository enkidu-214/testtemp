<template>
  <div class="PlayItem-container">
    <div class="header-container">
      <!-- stream info 、alarm status、full screen、lock/unlock -->

      <span style="max-width: 130px">
        <span>{{ client.res.resName }}</span>
      </span>
      <span style="float: right">
        <i
          v-show="!client.status.alarm"
          class="el-icon-microphone"
          @click="$emit('showAlarmEvent', client)"
        />
        <i
          v-show="!client.full"
          class="el-icon-microphone"
          @click="$emit('fullEvent', client)"
        />
        <i
          v-show="!client.status.lock"
          class="el-icon-microphone"
          @click="$emit('lockEvent', client)"
        />
        <i
          v-show="client.status.lock"
          class="el-icon-microphone"
          @click="$emit('lockEvent', client)"
        />
      </span>
    </div>
    <div style="background: black">
      <div class="video-container">
        <video
          v-show="client.view"
          autoplay
          :muted.prop="client.muted"
          :srcObject.prop="client.localStream"
          style="height: 100%; width: 100%"
        />
        <i
          v-show="!client.view && !client.muted"
          class="el-icon-mic clientStatus"
        />
        <i
          v-show="!client.view && client.muted"
          class="el-icon-chat-dot-round clientStatus"
        />
        <i
          v-show="!client.view && client.muted"
          class="el-icon-circle-close clientStatus"
        />
      </div>
    </div>
    <div class="console-container">
      <span style="max-width: 130px">
        <i v-if="client.isRoomAdmin" class="el-icon-s-custom" />
        <i v-if="!client.isRoomAdmin" class="el-icon-user" />
        <span>{{ client.nickname }}</span>
        <i
          v-if="client.isSelf"
          class="el-icon-refresh"
          @click="$emit('changeStreamEvent', client.userId)"
        />
      </span>
      <span style="float: right">
        <i
          v-show="client.view"
          class="el-icon-full-screen"
          @click="$emit('fullEvent', client.userId)"
        />
        <svg-icon
          v-show="client.view"
          icon-class="eye-open"
          @click="$emit('viewEvent', client.userId)"
        />
        <svg-icon
          v-show="!client.view"
          icon-class="eye"
          @click="$emit('viewEvent', client.userId)"
        />
        <i
          v-show="client.muted"
          class="el-icon-turn-off-microphone"
          @click="$emit('microEvent', client.userId)"
        />
        <i
          v-show="!client.muted"
          class="el-icon-microphone"
          @click="$emit('microEvent', client.userId)"
        />
        <i
          v-show="!client.isSelf && client.chat"
          class="el-icon-chat-dot-round"
          @click="$emit('banEvent', client.userId)"
        />
        <i
          v-show="!client.isSelf && !client.chat"
          class="el-icon-chat-round"
          @click="$emit('banEvent', client.userId)"
        />

        <i
          v-if="!client.isSelf"
          style="color: #ff4250; horiz-align: right"
          class="el-icon-error"
          @click="$emit('kickEvent', client.userId)"
        />
      </span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PlayItem',
  props: {
    client: {
      type: Object,
      default: null
  }
}
</script>

<style lang="scss" scoped>
.PlayItem-container {
  display: inline-block;
  width: 240px;
  height: 200px;
  margin-right: 3px;
}
.video-container {
  height: 170px;
  background: #939394;
  /*-webkit-mask-image: url("~@/assets/svg/people.svg");*/
  /*mask-image: url("~@/assets/svg/people.svg");*/
  /*mask-repeat: no-repeat;*/
  /*mask-position: center;*/
  text-align: center;
}
.console-container {
  height: 26px;
  background: white;
  line-height: 30px;
}
.console-container i {
  font-size: 22px;
}
.console-container .svg-icon {
  font-size: 22px;
}
.clientStatus {
  font-size: 150px;
  line-height: 170px;
}
</style>
