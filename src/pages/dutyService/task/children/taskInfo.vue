<template>
  <div class="container">
    <div class="header"></div>
    <div class="basic-group"></div>
    <div class="basic-content">
      <div class="item">
        <span>作业类型</span>
        <el-select>
          <el-option
            v-for="item in taskTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="item">
        <span>作业名称</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            taskTypes: [{},{}]
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>