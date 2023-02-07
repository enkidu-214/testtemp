<template>
  <div class="container">
    <div class="menu">
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        :collapse="isCollapse"
        background-color="#023459"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
      >
        <el-menu-item
          v-for="sm in menus"
          :key="sm.index"
          :index="sm.index"
          :route="sm.to"
          ><i :class="sm.icon"></i>
          <span slot="title">{{ sm.title }} </span>
        </el-menu-item>
      </el-menu>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      menus: [
        {
          index: "1",
          icon: "el-icon-location",
          title: "执勤监控",
          to: "/dutyService/monitor",
        },
        {
          index: "2",
          icon: "el-icon-location",
          title: "指挥控制",
          to: "control",
        },
        {
          index: "3",
          icon: "el-icon-location",
          title: "路线规划",
          to: "scheduler",
        },
        {
          index: "4",
          icon: "el-icon-location",
          title: "执勤记录",
          to: "record",
        },
        {
          index: "5",
          icon: "el-icon-location",
          title: "作业管理",
          to: "task",
        },
        {
          index: "6",
          icon: "el-icon-location",
          title: "区域服务",
          to: "region",
        },
        {
          index: "7",
          icon: "el-icon-location",
          title: "气象服务",
          to: "weather",
        },
      ],
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  position: absolute;
  bottom: 0px;
  top: 80px;
  .menu {
    background: #023459;
    bottom: 0px;
    top: 0px;
    height: 100%;
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
    }
  }
}
</style>
