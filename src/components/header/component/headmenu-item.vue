<template>
  <div class="menu-item" :class="{ selected: item.isSelected }">
    <router-link :to="item.link" class="menu-name hover-menu-name">{{
      item.menuName
    }}</router-link>
    <div class="selected-menu"></div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
};
</script>

<style lang="scss" scoped>
.selected {
  border: 2px solid white;
}
.menu-item {
  margin: 0px 5px;
  padding: 10px;
  border-bottom: 3px solid #b2a59f;
  border-left: 0;
  border-right: 0;
  border-top: 0;
  .menu-name {
    position: relative;
    font-size: 16px;
    font-weight: normal;
    color: #b2a59f;
  }
  .menu-name:hover {
    font-weight: bold;
    color: green;
  }
  .selected-menu {
    position: relative;
    background-color: green;
  }
}
</style>