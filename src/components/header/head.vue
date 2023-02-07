<template>
  <div class="head-top flex-c-e" :style="{ height: '80px' }">
    <div class="app-info">
      <div class="logo">
        <img class="avator" :src="useravatarUrl" />
      </div>
      <div class="title">
        <span class="title_text">{{ title }}</span>
      </div>
    </div>
    <div class="menu">
      <!-- menu -->
      <headmenu class="menu-item" :menus="menus"></headmenu>
    </div>
    <div class="other-info">
      <!-- weather -->
      <div class="weather-info">
        <div>{{ city }}</div>
        <div>{{ weather }}</div>
        <div>{{ temp }}</div>
      </div>
      <!-- user -->
      <div class="user-info">
        <el-image class="avator" :src="useravatarUrl"  />
        <div>
          <p class="info">{{ role }}</p>
          <p class="info">{{ username }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Headmenu from "./component/headmenu.vue";

export default {
  data() {
    return {
      menus: [
        {
          id: 1,
          menuName: "数据看板",
          link: "/dataService",
          hasPriority: true,
          isSelected: true,
        },
        {
          id: 2,
          menuName: "执勤服务",
          link: "/dutyService",
          hasPriority: true,
          isSelected: false,
        },
        {
          id: 3,
          menuName: "人员定位服务",
          link: "/searchService",
          hasPriority: true,
          isSelected: false,
        },
        {
          id: 4,
          menuName: "用户/设备管理",
          link: "/resourceService",
          hasPriority: true,
          isSelected: false,
        },
        {
          id: 5,
          menuName: "问题反馈",
          link: "/feedback",
          hasPriority: true,
          isSelected: false,
        },
      ],
      title: "移动执勤",
      city: "杭州",
      weather: "晴",
      temp: "13-20℃",
      username: "张三",
      role: "管理员",
      useravatarUrl: require("../../assets/logo.png"),
    };
  },
  components: {
    Headmenu,
  },
  mounted() {
    //获取用户信息
    this.getUserInfo();

    // TODO: get user menus
  },
  props: ["signinUp", "goBack"],
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    ...mapActions(["getUserInfo"]),
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/mixin";

.head-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #023459;
  .app-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: auto;
    min-width: 200px;
    .logo {
      width: 20%;
      margin: 5px;
      .avator {
        width: 80%;
      }
    }
    .title {
      width: 80%;
      .title_head {
        //@include center;
        text-align: center;
        align-items: center;
        width: 50%;
        color: #fff;
        text-align: left;
        .title_text {
          @include sc(0.8rem, #fff);
          text-align: center;
          font-weight: bold;
        }
      }
    }
  }
  .menu {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    margin-right: 20px;
    .menu-item{
      color: #B2A59F;
    }
  }
  .other-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: auto;
    min-width: 200px;
    .weather-info {
      display: flex;
      width: 50%;
    }
    .user-info {
      display: flex;
      width: 50%;
      .avator {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .info{
        padding: 0px;
        margin: 0px;
      }
    }
  }
}
</style>
