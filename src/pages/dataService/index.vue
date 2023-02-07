<template>
  <div class="report_page">
    <div class="choose_panel">
      <el-menu class="nor_menu" mode="horizontal" :router="true">
        <el-menu-item index="/dataService/orgResultReport">
          <img src="../../assets/PageIcon_媒体数据记录.png">
          组织成绩报表</el-menu-item>
        <el-menu-item index="/dataService/planResultReport">
          <img src="../../assets/PageIcon_媒体数据记录.png">
          训练计划报表</el-menu-item>
      </el-menu>
    </div>
    <div class="report_div">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="scss">
.nor_menu.el-menu.el-menu--horizontal{
  border-bottom: none;
}
.nor_menu {
  background: #023757;
  top: 0px;
  width: 100%;
  // .el-menu-demo{
  //   height: 30px;
  //   margin: 10px 0px 10px 0px !important;
  // }
  // .el-menu-demo:not(.el-menu--collapse) {
  //   border-bottom: 0;
  //   margin-left: 10px !important;
  // }
  .el-menu-item{
    color:white;
    margin-right: 4px !important;
    height: 30px !important;
    line-height: 30px !important;
    padding-left: 5px !important;
    padding-right: 15px !important;
    border-radius: 5px !important;
    border: #1199FF solid 1px !important;
    background:linear-gradient(#065893,#023757);
    font-weight: 100;
    img{
      width: 20px;
    }
  }
  .el-menu-item:not(.is-disabled):hover{
    color:white;
  }
  .el-menu-item.is-active{
    background:linear-gradient(#facb52,#8f6305) !important;
    color: #f0f0f0 !important;
  }
  // .el-icon-location{
  //   margin-right: 2px !important;
  // }
}
</style>

<style scoped>
.report_page{
  background-color: #003057;
  height:calc(100% - 80px);
}
button{
  background-color: #023661;
  border: 1px solid #1199FF;
  border-radius: 5px;
  color:#F0F0F0;
  display: flex;
  align-items: center;
  padding: 5px 13px;
  margin: 2px;
}
/* button img{
  width: 20px;
} */
button:hover{
  cursor: pointer;
}
.choose_panel{
  background-color: #003057;
  display:flex;
  height:35px;
}
.report_div{
  height: calc(100% - 35px);
}
</style>