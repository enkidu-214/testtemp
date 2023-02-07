<template>
  <div class="line-panel">
    <div class="switch">
      <el-button class="switch-btn" @click="showList = true"
        >路线列表</el-button
      >
      <el-button class="switch-btn" @click="showList = false"
        >新增路线</el-button
      >
    </div>
    <el-table v-show="showList" :data="lines" border style="width: 100%">
      <el-table-column prop="index" label="序号" width="50"> </el-table-column>
      <el-table-column prop="name" label="路线名称" width="120">
      </el-table-column>
      <el-table-column prop="taskType" label="任务性质" width="60">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleViewLine(scope.row)" type="text" size="small"
            ><svg-icon icon-class="edit"
          /></el-button>
          <el-button
            @click="handleUploadLine(scope.row)"
            type="text"
            size="small"
            ><svg-icon icon-class="edit" /></el-button
          ><br />
          <el-button @click="handleEditLine(scope.row)" type="text" size="small"
            ><svg-icon icon-class="edit"
          /></el-button>
          <el-button
            @click="handleDeleteLine(scope.row)"
            type="text"
            size="small"
            ><svg-icon icon-class="edit"
          /></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!showList" class="edit-line-panel">
      <div class="line-statistic">
        <div class="line-statistic-info">
          <p>路线长度</p>
          <p>{{ lenght }}</p>
        </div>
        <div class="line-statistic-info">
          <p>预计路线用时</p>
          <p>{{ totalTime }}</p>
        </div>
      </div>
      <div class="line-edit">
        <el-button class="img-btn" @click="pointSelect">
          <svg-icon class="img" icon-class="user" /><br />
          <span class="imt-btn-content">执勤点选择</span>
        </el-button>
        <el-button class="img-btn" @click="setReturnPoint">
          <svg-icon class="img" icon-class="user" /><br />
          <span class="imt-btn-content">返执勤点</span>
        </el-button>
        <el-button class="img-btn" @click="setBackPoint">
          <svg-icon class="img" icon-class="user" /><br />
          <span class="imt-btn-content">备降点</span>
        </el-button>
        <el-button class="img-btn" @click="saveLine">
          <svg-icon class="img" icon-class="user" /><br />
          <span class="imt-btn-content">保存</span>
        </el-button>
      </div>
      <div class="line-edit">
        <el-button class="img-btn" @click="openFileDialog">
          <svg-icon class="img" icon-class="user" /><br />
          <span class="imt-btn-content">打开文件</span>
        </el-button>
        <el-button class="img-btn" @click="downloadLine">
          <svg-icon class="img" icon-class="user" /><br />
          <span class="imt-btn-content">下载</span>
        </el-button>
        <el-button class="img-btn" @click="uploadLine">
          <svg-icon class="img" icon-class="user" /><br />
          <span class="imt-btn-content">上传</span>
        </el-button>
        <el-button class="img-btn" @click="mesure">
          <svg-icon class="img" icon-class="user" /><br />
          <span class="imt-btn-content">测距</span>
        </el-button>
      </div>
      <div class="point-info">
        <div class="point-info-list">
          <div class="info-item">
            <span class="info-header">路线名称:</span>
            <el-input class="info-content-full" v-model="name"></el-input>
          </div>
          <div class="info-item">
            <span class="info-header">高度: </span>
            <el-input class="info-content" v-model="height"></el-input>
            <span class="info-content-unit">m</span>
          </div>
          <div class="info-item">
            <span class="info-header">水平速度:</span>
            <el-input class="info-content" v-model="horSpeed"></el-input>
            <span class="info-content-unit">m/s</span>
          </div>
        </div>
        <div class="point-info-list">
          <div class="info-item">
            <span class="info-header">任务性质:</span>
            <el-select
              class="info-content-full"
              v-model="taskName"
              placeholder="请选择"
            >
              <el-option
                v-for="item in tasks"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="info-item">
            <span class="info-header">上升速度:</span>
            <el-input class="info-content" v-model="upSpeed"></el-input>
            <span class="info-content-unit">m/s</span>
          </div>
          <div class="info-item">
            <span class="info-header">下降速度:</span>
            <el-input class="info-content" v-model="downSpeed"></el-input>
            <span class="info-content-unit">m/s</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from "../../../../components/SvgIcon/SvgIcon.vue";

export default {
  name: "line-schedule-panel",
  components: { SvgIcon },
  props: ["lines", "line"],
  data() {
    return {
      showList: true,
      lenght: 12345,
      totalTime: "11:23:45",
      tasks: [
        {
          label: "任务1",
          value: 1,
        },
        {
          label: "任务2",
          value: 2,
        },
        {
          label: "任务3",
          value: 3,
        },
      ],
      name: "",
      height: 0.0,
      horSpeed: 0.0,
      taskName: "",
      upSpeed: 0.0,
      downSpeed: 0.0,
    };
  },
  methods: {
    pointSelect(){
      // 选择执勤点

      this.$emit("onChangePointType", 0);
    },
    setReturnPoint(){
      // 设置返执勤点
      this.$emit("onChangePointType", 1);
    },
    setBackPoint(){
      // 设置备降点
      this.$emit("onChangePointType", 2);
    },
    saveLine(){
      // 保存路线
      this.$emit("onSaveLine", this.line);
    },
    openFileDialog(){
      // 打开文件
    },
    uploadLine(){
      // 上传
    },
    downloadLine(){
      // 下载
    },
    mesure(){
      // 测量
    },
    handleViewLine(idx) {
      this.$emit("onViewLine", idx);
    },
    handleUploadLine(idx) {
      this.$emit("onUploadLine", idx);
    },
    handleEditLine(idx) {
      this.$emit("onEditLine", idx);
    },
    handleDeleteLine(idx) {
      this.$emit("onDeleteLine", idx);
    },
  },
};
</script>

<style lang="scss" scoped>
.line-panel {
  font-size: 12px;
  width: 360px;
  .switch {
    display: flex;
    justify-content: space-between;
  }
  .switch-btn {
    width: 50%;
    padding: 0px;
    margin: 0px;
    border: 0px;
    height: 40px;
  }
  .edit-line-panel {
    .line-statistic {
      display: flex;
      width: 100%;
      justify-content: space-between;
      font-size: 14px;
      .line-statistic-info {
        border: 1px solid gray;
        text-align: center;
        margin: 10px;
        width: 40%;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
      }
    }
    .line-edit {
      display: flex;
      justify-content: space-between;
      .img-btn {
        border: 1px solid gray;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        width: 20%;
        margin: 5px;
        padding: 10px;
        justify-content: center;
        .img {
          width: 20px;
          height: 20px;
        }
      }
    }
    .point-info {
      width: 100%;
      display: flex;
      .point-info-list {
        width: 50%;
        padding: 5px;
        .info-item {
          display: flex;
          padding: 0px;
          margin: 5px;
          height: 40px;
          .info-header {
            width: 40%;
            padding: 0px;
            margin: 0px;
            align-self: center;
          }
          .info-content {
            width: 50%;
            padding: 0px;
          }
          .info-content-unit {
            width: 10%;
            padding: 0px;
            align-self: center;
          }
          .info-content-full {
            width: 60%;
            padding: 0px;
          }
        }
      }
    }
  }
}
</style>