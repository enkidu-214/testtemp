<template>
  <div class="container">
    <div class="header">
      <span>作业列表</span>
      <div class="operate">
        <i class="el-icon-search"></i>
        <el-button class="crud-button" @click="handleAdd">新增作业</el-button>
        <el-button class="crud-button" @click="handleBatchDownload"
          >作业批量下发</el-button
        >
        <el-button class="crud-button" @click="handleBatchDelete"
          >批量删除</el-button
        >
      </div>
    </div>
    <el-table :data="tasks" :row-class-name="tableRowClassName" stripe>
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="index" label="序号" width="50"> </el-table-column>
      <el-table-column prop="name" label="作业名称" width="120">
      </el-table-column>
      <el-table-column
        prop="taskType"
        label="作业类型"
        width="120"
      ></el-table-column>
      <el-table-column prop="sentryType" label="哨位型号" width="120">
      </el-table-column>
      <el-table-column prop="routeName" label="路线名称" width="150">
      </el-table-column>
      <el-table-column prop="applyTime" label="申请时间" width="150">
      </el-table-column>
      <el-table-column prop="applyUser" label="申请人" width="100">
      </el-table-column>
      <el-table-column prop="approveStatus" label="状态" width="80">
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button @click="handleView(scope.row)" type="text" size="small"
            ><i class="el-icon-view"></i
          ></el-button>
          <el-button @click="handleEdit(scope.row)" type="text" size="small"
            ><i class="el-icon-edit"></i
          ></el-button>
          <el-button @click="handleDownload(scope.row)" size="mini" type="text"
            ><i class="el-icon-download"></i
          ></el-button>
          <el-button @click="handleDelete(scope.row)" size="mini" type="text"
            ><i class="el-icon-delete"></i
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import SvgIcon from "../../../components/SvgIcon/SvgIcon.vue";

export default {
  components: {
    SvgIcon,
  },
  data() {
    return {
      tasks: [
        {
          index: 1,
          name: "巡逻",
          taskType: "常规作业",
          sentryType: "穿越者1号",
          routeName: "自由飞",
          applyTime: "2020-1-1",
          applyUser: "zhangsan",
          approveStatus: "待审核",
        },
        {
          index: 2,
          name: "巡逻",
          taskType: "常规作业",
          sentryType: "穿越者1号",
          routeName: "自由飞",
          applyTime: "2020-1-1",
          applyUser: "zhangsan",
          approveStatus: "待审核",
        },
        {
          index: 3,
          name: "巡逻",
          taskType: "常规作业",
          sentryType: "穿越者1号",
          routeName: "自由飞",
          applyTime: "2020-1-1",
          applyUser: "zhangsan",
          approveStatus: "待审核",
        },
        {
          index: 4,
          name: "巡逻",
          taskType: "常规作业",
          sentryType: "穿越者1号",
          routeName: "自由飞",
          applyTime: "2020-1-1",
          applyUser: "zhangsan",
          approveStatus: "待审核",
        },
      ],
    };
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    handleAdd(task) {
      // TODO: goto task page
    },
    handleView(task) {
      // TODO: goto task page
    },
    handleEdit(task) {
      // TODO: goto task page
    },
    handleDownload(task) {
      // TODO: send current task to sentry
    },
    handleBatchDownload() {},
    handleDelete(task) {
      // TODO: give commit message
    },
    handleBatchDelete() {
      // TODO: give commit message
    },
  },
  created() {
    // TODO: call api to query tasks
  },
};
</script>

<style lang="scss" scoped>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.container {
  width: 100%;
  height: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    .operate {
      .crud-button {
        color: white;
        background-color: #0d4d73;
      }
    }
  }
}
</style>