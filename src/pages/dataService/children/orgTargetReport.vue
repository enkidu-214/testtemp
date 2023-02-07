<template>
  <div class="org_target_report">
    <div class="pie_panel">
      <div class="pie_div">
        <!-- <p>训练科目分布</p> -->
        <chart-item type="pie" id="org_subject_pie"
         title="训练科目分布" :chartData="subjectSource"
         :legend="subjectLegend"></chart-item>
        <!-- <p>无数据</p> -->
      </div>
      <div class="pie_div">
        <!-- <p>人员专业分布</p> -->
        <chart-item type="pie" id="person_type_pie"
         title="人员专业分布" :chartData="personTypeSource"
         :legend="personTypeLegend"></chart-item>
        <!-- <p>无数据</p> -->
      </div>
    </div>
    <div class="chart_panel">
      <div class="subject_div">训练科目：
        <el-radio-group v-model="selectSubject">
          <el-radio-button class="subject_btn"
            v-for="(item, index) in subjectSelectSource" :key="index"
            @click="ChooseSubject(item)" :label="item">{{item}}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="chart_div">
        <div>
          <chart-item type="bar" id="org_total_score_history_bar"
            title="科目总环数历史趋势图" :chartData="totalScoreHistory"></chart-item>
        </div>
        <div>
          <chart-item type="bar" id="org_average_score_history_bar"
            title="科目平均环数历史趋势图" :chartData="averageScoreHistory"></chart-item>
        </div>
      </div>
      <div class="chart_div">
        <div>
          <chart-item type="bar" id="person_total_score_rank_bar" dimension="y"
            title="个人总环数前6名" :chartData="personTotalScoreRank"></chart-item>
        </div>
        <div>
          <chart-item type="bar" id="person_ave_score_rank_bar" dimension="y"
            title="个人平均环数前6名" :chartData="personAverageScoreRank"></chart-item>
        </div>
      </div>
      <div class="chart_div">
        <div>
          <chart-item type="bar" id="org_total_score_bar"
            title="各单位总环数统计" :chartData="orgTotalScoreSource"></chart-item>
        </div>
        <div>
          <chart-item type="bar" id="org_ave_score_bar"
            title="各单位平均环数统计" :chartData="orgAverageScoreSource"></chart-item>
        </div>
        <chart-item type="bar" id="person_score_bar" v-show="false"
          :chartData="personScoreSource" :legend="personScoreLegend"></chart-item>
      </div>
    </div>
  </div>
</template>

<script>
import chartItem from '../component/chartItem.vue'
export default {
  components: { chartItem },
  props:{
    org:null,
    startTime:"",
    endTime:"",
  },
  data(){
    return{
      subjectSource:[
        ["精度射击"],
        [1]
      ],
      subjectLegend:[],
      subjectSelectSource:["精度射击"],
      selectSubject:null,
      personTypeSource:[
        ['步枪手'],
        [1]
      ],
      personTypeLegend:[],
      totalScoreHistory:[
        ['训练计划1','训练计划2','训练计划3'],
        [2815,665,12]
      ],
      averageScoreHistory:[
        ['训练计划1','训练计划2','训练计划3'],
        [2815,665,1288]
      ],
      personTotalScoreRank:[
        ['测试人员1','测试人员2','测试人员3','测试人员4','测试人员5','测试人员6'],
        [452,550,426,412,555,423]
      ],
      personAverageScoreRank:[
        ['测试人员1','测试人员2','测试人员3','测试人员4','测试人员5','测试人员6'],
        [7.5,9.2,7.1,6.9,9.2,7]
      ],
      orgTotalScoreSource:[
        ['本级组织','一排','二排','三排','四排'],
        [666,521,2015,0,0,0,0]
      ],
      orgAverageScoreSource:[
        ['本级组织','一排','二排','三排','四排'],
        [111,86,210,0,0,0,0]
      ],
      personScoreSource:[],
      personScoreLegend:['得分率','命中率','及格率','优秀率']
    }
  },
  computed:{
    timeRange(){
      const {startTime, endTime} = this
      return {
        startTime,
        endTime
      }
    }
  },
  watch:{
    timeRange(val){
      this.QueryData()
    }
  },
  mounted(){
    this.QueryData()
  },
  methods:{
    QueryData(){
      //根据时间查询数据
      this.selectSubject = this.subjectSelectSource[0]
      this.subjectLegend = this.subjectSource[0]
      this.personTypeLegend = this.personTypeSource[0]
    },
    ChooseSubject(item){
      this.selectSubject = item
      this.RefreshSubjectData(item)
    },
    RefreshSubjectData(item){
      //切换训练科目后刷新数据
    }
  }
}
</script>

<style>
.subject_div .el-radio-button__inner{
  width: auto;
  height: 30px;
  color: white;
  border-radius: 5px!important;
  background-color: #023661;
  margin: 1px;
  border: 1px solid #031824;
  border-top: 1px solid white;
  border-left: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<style scoped>
.org_target_report{
  display: flex;
  height: 100%;
  width: 100%;
  color:white;
  background-color: #153652;
}
.pie_panel{
  width: 300px;
  border-right: 2px solid #e0e0e03f;
  height: 100%;
}
.chart_panel{
  width: calc(100% - 300px);
  height: 100%;
}
.pie_div{
  align-items: center;
  width: calc(100% - 20px);
  height: calc((100% - 30px) / 2);
  border: 2px solid #3ea2f4b0;
  margin: 10px;
  padding: 10px;
}
.subject_div{
  width:100%;
  height: 40px;
  padding: 10px;
  display: flex;
  align-items: center;
}
.subject_btn{
  width: auto;
  height: 30px;
  color: white;
  border-radius: 5px;
  /* border: 1px solid #031824; */
  background-color: #023661;
  margin: 3px;
}
.chart_div{
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: calc((100% - 40px) / 3);
  border-top: 2px solid #e0e0e03f;
  padding: 10px;
}
.chart_div > div{
  width: 50%;
}
button:hover{
  cursor: pointer;
}
p{
  text-align: center;
}
</style>