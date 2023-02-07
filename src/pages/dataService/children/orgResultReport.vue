<template>
  <div class="org_result_report">
    <div class="tree_panel">
      <el-tree class="org_tree"
        node-key="name"
        :current-node-key="selectOrg"
        highlight-current
        :data="orgTagList"
        :props="defaultProps"
        :render-content="RenderContent"
        :expand-on-click-node="false"
        ref="orgTree"
        @node-click="HandleNodeClick">
      </el-tree>
    </div>
    <div class="result_panel">
      <div class="time_btns">
        <el-radio-group v-model="timeDimension" @change="ChangeTime">
          <el-radio-button label="本周"></el-radio-button>
          <el-radio-button label="上周"></el-radio-button>
          <el-radio-button label="本月"></el-radio-button>
          <el-radio-button label="上一月"></el-radio-button>
          <el-radio-button label="本年"></el-radio-button>
        </el-radio-group>
      </div>
      <div class="target_report">
        <org-target-report v-if="isOrg"
         :org="selectOrg"
         :startTime="startTime"
         :endTime="endTime"></org-target-report>
        <person-target-report v-else
         :person="selectPerson"
         :startTime="startTime"
         :endTime="endTime"></person-target-report>
      </div>
    </div>
  </div>
</template>

<script>
import orgTargetReport from './orgTargetReport.vue'
import personTargetReport from './personTargetReport.vue'
export default {
  components: { orgTargetReport, personTargetReport },
  data(){
    return{
      timeDimension:"本周",
      startTime:"",
      endTime:"",
      isOrg: true,
      currentNode:"",
      selectOrg:null,
      selectPerson:null,
      orgTagList:[{
        photo:require('../../../assets/Organize.png'),
        name:'本级组织',
        id:1,
        isOrg:true,
        children:[{
          isOrg:false,
          name: '测试1',
          photo:require('../../../assets/人员_半身.png'),
          position:"步枪手",
          personNum:1001,
          organization:"本级组织",
          militaryRank:"列兵"
        }]
      }],
      defaultProps:{
        children: 'children',
        label:'name'
      }
    }
  },
  mounted(){
    this.$nextTick(function(){
      this.$refs.orgTree.setCurrentKey(this.currentNode)
    })
    this.CreateOrgTree()

  },
  methods:{
    CreateOrgTree(){
      //构造组织结构树
      let orgList = this.$client
      this.currentNode = this.orgTagList[0].name
      
    },
    RenderContent(h,{node,data,store}){
      return (
        <span style="display:flex;align-items:center">
          <img src={data.photo} style="width:18px"></img>
          <span>{data.name}</span> &nbsp; &nbsp;
          <span style="color:orange">{data.position}</span>
        </span>
      )
    },
    HandleNodeClick(data){
      this.isOrg = data.isOrg
      if(data.isOrg){
        //获取组织数据
        this.selectOrg = data
        this.selectPerson = null
      }else{
        //获取个人数据
        this.selectOrg = null
        this.selectPerson = data
      }
      this.currentNode = data.name
    },
    ChangeTime(){
      this.GetStartTime()
      this.GetEndTime()
    },
    GetStartTime(){
      let dt = new Date()
      let year = dt.getFullYear()
      let month = dt.getMonth()
      let date = dt.getDate()

      if(this.timeDimension === "本周"){
        let dayOfweek = dt.getDay()
        dt = dt.getTime() - (dayOfweek-1)*24*60*60*1000
        dt = new Date(dt)
        year = dt.getFullYear()
        month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1
        date = dt.getDate() < 10 ? '0' + (dt.getDate()) : dt.getDate()
      }else if(this.timeDimension === "上周"){
        let dayOfweek = dt.getDay()
        dt = dt.getTime() - (dayOfweek+6)*24*60*60*1000
        dt = new Date(dt)
        year = dt.getFullYear()
        month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1
        date = dt.getDate() < 10 ? '0' + (dt.getDate()) : dt.getDate()
      }else if(this.timeDimension === "本月"){
        date = "01"
      }else if(this.timeDimension === "上一月"){
        if(month===0){
          month = "12"
        }else{
          month = month < 10 ? '0' + month : month
        }
        date = "01"
      }else if(this.timeDimension === "本年"){
        month = "01"
        date = "01"
      }

      return year + '/' + month + '/' + date + ' 00:00'
    },
    GetEndTime(){
      let dt = new Date()
      let year = dt.getFullYear()
      let month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1
      let date = dt.getDate() < 10 ? '0' + (dt.getDate()) : dt.getDate()
      let hour = dt.getHours() < 10 ? '0' + (dt.getHours()) : dt.getHours()
      let minute = dt.getMinutes() < 10 ? '0' + (dt.getMinutes()) : dt.getMinutes()

      if(this.timeDimension === "上周"){
        let dayOfweek = dt.getDay()
        dt = dt.getTime() - (dayOfweek-1)*24*60*60*1000
        dt = new Date(dt)
        year = dt.getFullYear()
        month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1
        date = dt.getDate() < 10 ? '0' + (dt.getDate()) : dt.getDate()
        hour = "00"
        minute = "00"
      }else if(this.timeDimension === "上一月"){
        date = "01"
        hour = "00"
        minute = "00"
      }

      return year + '/' + month + '/' + date + ' ' + hour + ':' + minute
    }
  }
}
</script>

<style>
.org_tree{
  color: #f0f0f0;
  background-color: #00000000;
}
.org_tree .el-tree-node.is-current>.el-tree-node__content{
  background-color: #3399FFFF !important;
}
.org_tree .el-tree-node__content:hover{
  background-color: #225a74;
}
.org_tree .el-tree-node:focus>.el-tree-node__content{
  background-color: unset;
}
.time_btns .el-radio-button__inner{
  width: 60px;
  height: 30px;
  color: white;
  border-radius: 5px!important;
  background-color: #023661;
  margin: 3px;
  border: 1px solid #031824;
  border-top: 1px solid white;
  border-left: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<style scoped>
.org_result_report{
  display: flex;
  height: 100%;
  /* border: 1px solid #1199FF; */
}
.tree_panel{
  width: 240px;
  height: 100%;
  background-color: #031824;
}
.result_panel{
  width: calc(100% - 240px);
  height: 100%;
  /* border: 1px solid #1199FF; */
}
.time_btns{
  display: flex;
  align-items: center;
  height: 40px;
  border: 1px solid #1199FF;
  border-radius: 5px;
  background-color: #003057;
}
.target_report{
  height: calc(100% - 40px);
  /* border: 1px solid #1199FF; */
}
button:hover{
  cursor: pointer;
}
</style>