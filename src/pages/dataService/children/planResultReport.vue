<template>
  <div class="plan_result_report">
    <div class="top_panel">
      <div class="time_btns_panel">
        <el-radio-group v-model="timeDimension" @change="ChangeTime">
          <el-radio-button label="本周"></el-radio-button>
          <el-radio-button label="上周"></el-radio-button>
          <el-radio-button label="本月"></el-radio-button>
          <el-radio-button label="上一月"></el-radio-button>
          <el-radio-button label="本年"></el-radio-button>
        </el-radio-group>
      </div>
      <download-excel
        :data='exportData'
        :fields='exportFields'
        :name="exportTitle">
        <button class="export_btn">成绩导出</button>
      </download-excel>
    </div>
    <div class="plan_result">
      <div class="plan_list">
        <el-radio-group v-model="shootingPlan" fill="#3333AA">
          <el-radio-button
            v-for="(item, index) in shootingPlanSource" :key="index"
            @click="ChoosePlan(item)" :label="item">
            <p>{{item.name}}</p>
            <p>{{item.subject.subjectType}} &nbsp; <span style="color:orange">{{item.subject.name}}</span></p>
            <p>靶位:{{item.targetCount}} &nbsp; 轮次:{{item.roundCount}} &nbsp; 弹药:{{item.bulletNumber}}</p>
            <p>{{item.planState}} &nbsp; <span v-show="item.planState">当前轮次:{{item.executionRound}}</span></p>
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="plan_target_panel">
        <div class="pie_panel">
          <div class="pie_div">
            <!-- <p>人员专业分布</p> -->
            <chart-item type="pie" id="position_pie" 
              title="人员专业分布" :chartData="positionSource"
              :legend="positionLegend">
            </chart-item>
            <!-- <p>无数据</p> -->
          </div>
          <div class="pie_div">
            <!-- <p>人员单位分布</p> -->
            <chart-item type="pie" id="org_pie" 
              title="人员单位分布" :chartData="orgSource"
              :legend="orgLegend">
            </chart-item>
            <!-- <p>无数据</p> -->
          </div>
          <div class="pie_div">
            <!-- <p>训练成绩分布</p> -->
            <chart-item type="pie" id="score_pie"
              title="训练成绩分布" :chartData="scoreSource"
              :legend="scoreLegend">
            </chart-item>
            <!-- <p>无数据</p> -->
          </div>
        </div>
        <div class="chart_panel">
          <div class="chart_div">
            <chart-item type="bar" id="person_sum_score_bar"
              title="个人总成绩" :chartData="personSumScoreSource">
            </chart-item>
          </div>
          <div class="chart_div">
            <chart-item type="bar" id="person_ave_score_bar"
              title="个人平均成绩" :chartData="personAveScoreSource">
            </chart-item>
          </div>
          <div class="chart_div">
            <chart-item type="line" id="round_score_line"
              title="每轮成绩趋势" :chartData="roundScoreSource"
              :legend="roundScoreLegend">
            </chart-item>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chartItem from '../component/chartItem.vue'
export default {
  components: { chartItem },
  mounted(){
    this.RefreshData()
  },
  watch:{
    shootingPlanSource:{
      deep:true,
      handler(val){
        this.RefreshData()
      }
    }
  },
  data(){
    return{
      exportData:[
        {"plan":100}
      ],
      exportFields:{
        "计划":"plan"
      },
      exportTitle:"计划.xls",
      timeDimension:"本周",
      startTime:"",
      endTime:"",
      shootingPlanSource:[
        {
          id:1,
          name:"2月23日训练计划1",
          executionRound:0,
          roundCount:6,
          targetCount:6,
          bulletNumber:10,
          subject:{
            subjectType:"精准步枪",
            name: "精度射击"
          },
          planState:true
        },
        {
          id:2,
          name:"2月23日训练计划2",
          executionRound:0,
          roundCount:6,
          targetCount:12,
          bulletNumber:8,
          subject:{
            subjectType:"精准步枪",
            name: "精度射击"
          },
          planState:false
        },
        {
          id:2,
          name:"2月23日训练计划3",
          executionRound:0,
          roundCount:6,
          targetCount:12,
          bulletNumber:8,
          subject:{
            subjectType:"精准步枪",
            name: "精度射击"
          },
          planState:false
        },
        {
          id:2,
          name:"2月23日训练计划4",
          executionRound:0,
          roundCount:6,
          targetCount:12,
          bulletNumber:8,
          subject:{
            subjectType:"精准步枪",
            name: "精度射击"
          },
          planState:false
        },
        {
          id:2,
          name:"2月23日训练计划5",
          executionRound:0,
          roundCount:6,
          targetCount:12,
          bulletNumber:8,
          subject:{
            subjectType:"精准步枪",
            name: "精度射击"
          },
          planState:false
        },
        {
          id:2,
          name:"2月23日训练计划6",
          executionRound:0,
          roundCount:6,
          targetCount:12,
          bulletNumber:8,
          subject:{
            subjectType:"精准步枪",
            name: "精度射击"
          },
          planState:false
        },
        {
          id:2,
          name:"2月23日训练计划7",
          executionRound:0,
          roundCount:6,
          targetCount:12,
          bulletNumber:8,
          subject:{
            subjectType:"精准步枪",
            name: "精度射击"
          },
          planState:false
        },
      ],
      shootingPlan:null,
      positionSource:[
        ['步枪手'],
        [1]
      ],
      positionLegend:[],
      orgSource:[
        ['本级组织'],
        [1]
      ],
      orgLegend:[],
      scoreSource:[
        ['优秀','合格','不合格'],
        [70,39,88]
      ],
      scoreLegend:[],
      personSumScoreSource:[
        ['测试人员1','测试人员2','测试人员3','测试人员4','测试人员5','测试人员6'],
        [452,550,426,412,555,423]
      ],
      personAveScoreSource:[
        ['测试人员1','测试人员2','测试人员3','测试人员4','测试人员5','测试人员6'],
        [7.5,9.2,7.1,6.9,9.2,7]
      ],
      roundScoreSource:[
        ['第1轮','第2轮','第3轮','第4轮','第5轮','第6轮'],
        [452,550,426,412,555,423],
        [452,426,550,555,412,423],
        [426,452,550,412,423,555],
        [555,452,550,412,423,426],
        [550,452,412,555,423,426],
        [412,452,550,426,555,423],
      ],
      roundScoreLegend:['测试人员1','测试人员2','测试人员3','测试人员4','测试人员5','测试人员6']
    }
  },
  methods:{
    GetPlanSource(){
      //查询时间内计划列表
    },
    ChoosePlan(plan){
      this.shootingPlan = plan
      this.RefreshData()
    },
    ExportReport(){
      this.exportTitle = this.shootingPlan.name +".xls"
      // let fileSaver = require('file-saver')
      // let blob = new Blob(["Hello world"],{type:"text/plain;charset=utf-8"})
      // fileSaver.saveAs(blob,"hello world.txt")
    },
    ClearData(){

    },
    RefreshData(){
      this.ClearData()
      //根据plan查询、构造图表数据
      this.positionLegend = this.positionSource[0]
      this.orgLegend = this.orgSource[0]
      this.scoreLegend = this.scoreSource[0]
      
      this.shootingPlan = this.shootingPlanSource[0]
    },
    ChangeTime(){
      this.GetStartTime()
      this.GetEndTime()
      this.RefreshData()
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
.time_btns_panel .el-radio-button__inner{
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
.plan_list .el-radio-button{
  width: 90%;
  margin: 5px; 
}
/* .plan_list .el-radio-button__inner.is-active{
  background-color: #3333AA!important;
  border: 3px solid #1199FF;
} */
.plan_list .el-radio-button__inner{
  font-size:14px;
  text-align: left;
  padding: 5px;
  /* margin: 5px; */
  width: 100%;
  border-radius: 5px!important;
  background-color: #153652;
  color: white;
  border: 1px solid #1199FF;
  border-left: 1px solid #1199FF;
}
</style>

<style scoped>
.plan_result_report{
  height: 100%;
  color:white;
}
.top_panel{
  display: flex;
  justify-content: space-between;
  height: 45px;
  border: 1px solid #1199FF;
  border-radius: 5px;
}
.time_btns_panel{
  display: flex;
  align-items: center;
}
.export_btn{
  width: 100px;
  height: 30px;
  border: 1px solid #1199FF;
  border-radius: 5px;
  margin: 5px;
  background-color: #023661;
  color: white;
  padding: 0px 20px;
}
.plan_list{
  text-align: center;
  width:220px;
  height: 100%;
  overflow:scroll;
  border: 1px solid #1199FF;
  border-radius: 5px;
  background-color: #0a173b;
}
/* .plan_btn{
  font-size:14px;
  text-align: left;
  padding: 5px;
  margin: 2px;
  width: 90%;
  border-radius: 5px;
  background-color: #153652;
  color: white;
  border: 1px solid #1199FF;
} */
.plan_list p{
  margin: 10px;
  text-align: left;
}
.plan_result{
  display: flex;
  height: calc(100% - 45px);
}
.plan_target_panel{
  display: flex;
  width: calc(100% - 220px);
  background-color: #153652;
}
.pie_panel{
  width: 300px;
  border-right: 2px solid #e0e0e03f;
}
.pie_div{
  margin: 10px;
  height: calc((100% - 40px) / 3);
  border: 2px solid #3ea2f4b0;
  margin: 10px;
  padding: 10px;
}
.chart_panel{
  width: calc(100% - 300px);
}
.chart_div{
  margin: 10px;
  height: 30%;
  height: calc((100% - 40px) / 3);
  padding: 10px;
}
button:hover{
  cursor: pointer;
}

</style>