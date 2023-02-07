<template>
  <div class="point-list">
    <div class="point-list-header">
      <span class="header-text">执勤点信息</span>
      <svg-icon :icon-class="icon" @click="showPanel"></svg-icon>
    </div>
    <el-table v-show="tableVisible" :data="points" height="250" border>
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="index" label="序号" width="50"> </el-table-column>
      <el-table-column prop="command" label="命令" width="50">
      </el-table-column>
      <el-table-column label="延时" width="50">
        <el-table-column prop="delay1" label="" width="30"> </el-table-column>
        <el-table-column prop="delay2" label="" width="30"> </el-table-column>
        <el-table-column prop="delay3" label="" width="30"> </el-table-column>
        <el-table-column prop="delay4" label="" width="30"> </el-table-column>
      </el-table-column>
      <el-table-column prop="position[1]" label="纬度" width="80">
      </el-table-column>
      <el-table-column prop="position[0]" label="经度" width="80">
      </el-table-column>
      <el-table-column prop="height" label="高度" width="50"> </el-table-column>
      <el-table-column prop="mgrs" label="MGRS" width="70"> </el-table-column>
      <el-table-column
        prop="slope"
        label="坡度(%)"
        width="70"
      ></el-table-column>
      <el-table-column
        prop="slopeAngle"
        label="坡脚(°)"
        width="65"
      ></el-table-column>
      <el-table-column prop="sail" label="路程" width="80"></el-table-column>
      <el-table-column
        prop="angle"
        label="方向(°)"
        width="65"
      ></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="handleMoveUp(scope.row)" type="text" size="small"
            ><i class="el-icon-top"></i></el-button
          >
          <el-button @click="handleMoveDown(scope.row)" type="text" size="small"
            ><i class="el-icon-bottom"></i></el-button
          >
          <el-button @click="handleDelete(scope.row)" size="mini" type="danger"
            ><i class="el-icon-delete"></i></el-button
          >
        </template>
      </el-table-column>
      ></el-table
    >
  </div>
</template>

<script>
import SvgIcon from "../../../../components/SvgIcon/SvgIcon.vue";
export default {
  components: { SvgIcon },
  name: "line-points",
  props: ["points"],
  data() {
    return {
      tableVisible: true,
      icon: "eye",
    };
  },
  methods: {
    showPanel() {
      if (this.tableVisible) {
        this.icon = "user ";
        this.tableVisible = false;
      } else {
        this.icon = "eye";
        this.tableVisible = true;
      }
    },
    handleDelete(p) {
      this.$emit("deletePointEvent", p);
    },
    handleMoveUp(p) {
      this.$emit("movePointUpEvent", p);
    },
    handleMoveDown(p) {
      this.$emit("movePointDownEvent", p);
    },
  },
};
</script>

<style lang="scss" scoped>
.point-list {
  .point-list-header {
    display: flex;
    justify-content: center;
    .header-text {
      text-align: center;
      align-content: center;
      justify-content: center;
    }
  }
}
</style>
