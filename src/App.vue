<template>
  <div class="app-main">
    <top-head class="top-head" ></top-head>
    <transition name="router-fade" mode="out-in">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition name="router-fade" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
    <footer></footer>
  </div>
</template>

<script>
import topHead from './components/header/head.vue'
export default {
  components: {
    topHead
  },
};
</script>

<style lang="scss">
@import "./style/common";
.app-main {
  height: 100%;
  .top-head{
    height: 70px;
  }
}
.router-fade-enter-active,
.router-fade-leave-active {
  transition: opacity 0.3s;
}
.router-fade-enter,
.router-fade-leave-active {
  opacity: 0;
}
</style>
