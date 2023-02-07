<template>
  <div class="line-panel">
    <div class="switch">
        新增路线
    </div>
    <div class="edit-line-panel">
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
          <i class="el-icon-map-location" /><br />
          <span class="imt-btn-content">执勤点选择</span>
        </el-button>
        <el-button class="img-btn" @click="setReturnPoint">
          <svg-icon class="img" icon-class="user" /><br />
          <span class="imt-btn-content">返回点</span>
        </el-button>
        <el-button class="img-btn" @click="setBackPoint">
          <svg-icon class="img" icon-class="user" /><br />
          <span class="imt-btn-content">备用点</span>
        </el-button>
        <el-button class="img-btn" @click="mesure">
          <svg-icon class="img" icon-class="user" /><br />
          <span class="imt-btn-content">测距</span>
        </el-button>
      </div>
      <div class="line-edit">
        <el-button class="img-btn" @click="openFileDialog">
          <i class="el-icon-folder-opened" /><br />
          <span class="imt-btn-content">打开文件</span>
        </el-button>
        <el-button class="img-btn" @click="applyTask">
          <i class="el-icon-notebook-2" /><br />
          <span class="imt-btn-content">作业申请</span>
        </el-button>
        <el-button class="img-btn" @click="saveLine">
          <svg-icon class="img" icon-class="user" /><br />
          <span class="imt-btn-content">保存</span>
        </el-button>
      </div>
      <div class="point-info">
        <div class="point-info-list">
          <div class="info-item">
            <span class="info-header">路线名称:</span>
            <el-input class="info-content-full" v-model="name"></el-input>
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
      mesureFlag: false,
    };
  },
  methods: {
    pointSelect(){
      // 选择执勤点
      this.$emit("setAddMode");
    },
    setReturnPoint(){
      // 设置返回点
      this.$emit("onChangePointType", 1);
    },
    setBackPoint(){
      // 设置备用点
      this.$emit("onChangePointType", 2);
    },
    saveLine(){
      // 保存路线
      this.$emit("onSaveLine", this.line);
    },
    openFileDialog(){
      // 打开文件
      this.$emit("onOpenLayer");
    },
    applyTask(){
      // 作业申请
      this.$emit("onApplyTask", this.line);
    },
    mesure(){
      // 测量
      mesureFlag = !mesureFlag;
      this.$emit("onMesure", this.mesureFlag);
    },
  },
};
</script>

<style lang="scss" scoped>
.line-panel {
  font-size: 10px;
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
      font-size: 12px;
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