<template>
  <div class="inner-menu">
      <el-col :span="40" v-for="(item, index) in menus" :key="index">
        <headmenu-item :item="item" />
      </el-col>
  </div>
</template>

<script>
import HeadmenuItem from "./headmenu-item.vue";

export default {
  props: {
    menus: [],
  },
  components: {
    HeadmenuItem,
  },
};
</script>

<style lang="scss" scoped>
@import "../../../style/mixin";
.inner-menu {
  display: inline-flex;
  align-items: right;
  justify-content: flex-end;
  color: #B2A59F;
}
</style>
