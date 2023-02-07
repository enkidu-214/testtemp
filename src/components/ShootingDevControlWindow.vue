<template>
  <div class="shooting_dev_control">
    <div class="top">
      <div class="left">
        <div class="window_title">
          <img src="../assets/Position.png">
          <p class="title">打靶面板</p>
        </div>
        <p class="plan_name">{{planName}}</p>
      </div>
      <div class="right">
        <button class="test_btn" @click="TestBtnClick">测试</button>
        <button class="focus_btn" @click="FocusBtnClick">
          <img src="../assets/聚焦.png">一键聚焦
        </button>
        <button class="close_btn" @click="ColseBtnClick">
          <img src="../assets/B_Close.png">
        </button>
      </div>
    </div>
    <div class="target_panel">
      <button class="left_btn" @click="LeftBtnClick" :disabled="isZoom == false">
        <img src="../assets/Arrow_LeftBlue.png">
      </button>
      <div id="target_panel">
        <table id="panel_table" v-show="isZoom" style="width:100%;height:100%">
        </table> 
        <div class="zoom_page" v-if="isZoom==false">
          <div class="gun_info">
            <div class="change_gunid">
              <div>
                <p class="gun_id">射击序号 {{gunIdx}}</p>
                <button class="last_btn" @click="LastBtnClick">
                  <img src="../assets/Arrow_Up.png">上一枪</button>
                <button class="next_btn" @click="NextBtnClick">
                  <img src="../assets/Arrow_Down.png">下一枪</button>
              </div>
              <div>
                <el-checkbox v-model="isPic" class="setting_check">显示图片</el-checkbox>
                <el-checkbox v-model="isReal" class="setting_check">显示实况</el-checkbox>
                <el-checkbox v-model="isDensity" class="setting_check">散布中心</el-checkbox>
              </div>
            </div>
            <div>
              <p style="color:white;margin:10px;">散布密集度 &nbsp; {{density}}</p>
              <el-slider class="density_slider"
                :min="0" :max="1" :step="0.01" v-model="density">
              </el-slider>
            </div>
            <el-table id="gun_list" class="gun_list"
              :data="zoomShootingResults"
              max-height="350px"
              border>
              <el-table-column type ="index" label="射击序号" align="center" width="60px"></el-table-column>
              <el-table-column prop="code" label="环数" align="center"></el-table-column>
              <el-table-column prop="x" label="X" align="center"></el-table-column>
              <el-table-column prop="y" label="Y" align="center"></el-table-column>
            </el-table>
          </div>
          <div class="zoom_item">
            <target-item id="zoom_item" :shootingInfo="zoomShootingInfo"
             :isZoom="false" :isDensity="isDensity" :density="density"></target-item>
          </div>
          <button class="zoom_back" @click="ZoomBackClick">
            <img src="../assets/B_Return.png">返回</button>
        </div>
        <el-dialog class="target_ctrl_dialog"
          top="0vh"
          width="380px"
          :modal="false"
          :visible.sync="targetCtrlDialog"
          v-dialogDrag>
          <div slot="title" style="display:flex;align-items:center">
            <img src="../assets/Position.png" style="height:30px">
            <p>靶机控制</p>
          </div>
          <div style="display:flex">
            <target-ctrl-panel :shootingPlan="shootingPlan"></target-ctrl-panel>
          </div>
        </el-dialog>
      </div>
      <button class="right_btn" @click="RightBtnClick" :disabled="isZoom == false">
        <img src="../assets/Arrow_RightBlue.png">
      </button>
    </div>
    <div class="target_tool_bar">
      <div class="plan_control">
        <p class="div_title">计划控制</p>
        <el-popover popper-class="plan_list_popover"
          placement="top"
          trigger="click"
          v-model="planListVisible">
          <div
            v-for="(item, index) in planSource"
            :key="index">
            <div class="plan_name_list">
              <p>{{item.name}}</p>
              <button class="start_plan_btn" @click="StartPlan(item)">开始</button>
            </div>
          </div>
          <button class="choose_plan" slot="reference" v-show="isPlan==false">选择计划</button>
        </el-popover>
        <button class="stop_plan" @click="StopPlanClick" v-show="isPlan">结束计划</button>
      </div>
      <div class="round_control" v-show="isPlan">
        <p class="div_title">轮次控制</p>
        <div class="round_control_div">
          <img src="../assets/班次管理.png">
          <p class="round_info">第{{executionRound}}轮 - {{roundCount}}轮</p>
          <button class="next_round" @click="NextRoundClick">下一轮</button>
        </div>
      </div>
      <div class="shooting_gesture">
        <p class="div_title">射击姿态</p>
        <div class="shooting_gesture_div">
          <el-popover popper-class="gesture_popover"
            ref="gesture"
            placement="top"
            trigger="click"
            v-model="shootingGestureVisible">
            <div
              v-for="(item, index) in gestureSource"
              :key="index">
              <button class="gesture_btn" @click="GestureBtnClick(item)">{{item}}</button>
            </div>
          </el-popover>
          <el-popover popper-class="gesture_tooltip"
            ref="gesture"
            placement="bottom-start"
            trigger="hover"
            content="射击姿态"
            :v-model="shootingGestureVisible == false">
            <button class="shooting_gesture_btn" v-popover:gesture slot="reference">
              <img src="../assets/shooting.png"></button>
          </el-popover>
          <p class="gesture_info">{{shootingGesture}}</p>
        </div>
      </div>
      <div class="target_action" v-show="isPlan">
        <p class="div_title">靶机动作</p>
        <div class="target_action_div">
          <button class="play_btn" @click="PlayBtnClick" v-show="isPlay==false"><img src="../assets/Play.png"></button>
          <button class="suspend_btn" @click="SuspendBtnClick" v-show="isPlay"><img src="../assets/Suspend.png"></button>
          <button class="stop_btn" @click="StopBtnClick"><img src="../assets/Stop.png"></button>
          <button class="btn_ctrl" @click="BtnCtrlClick">手动控制</button>
        </div>
      </div>
      <div class="page_layout">
        <p class="div_title">页面布局</p>
        <div class="page_layout_div">
          <el-popover popper-class="layout_popover"
            ref="layout"
            placement="top"
            trigger="click"
            v-model="pageLayoutVisible">
            <div
              v-for="(item, index) in layoutSource"
              :key="index">
              <button class="layout_btn" @click="LayoutBtnClick(item)"
               :disabled="isZoom == false">{{item}}</button>
            </div>
          </el-popover>
          <el-popover popper-class="layout_tooltip"
            ref="layout"
            placement="bottom-start"
            trigger="hover"
            content="布局切换"
            :v-model="pageLayoutVisible == false">
            <button class="page_btn" v-popover:layout slot="reference">
              <img src="../assets/翻页.png"></button>
          </el-popover>
          <p class="page_info">{{currentPage}} / {{maxPage}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TargetItem from './TargetItem.vue'
import Vue from 'vue'
import TargetCtrlPanel from './TargetCtrlPanel.vue'

export default {
  components: { TargetItem, TargetCtrlPanel },
  data(){
    return{
      planName: "",
      executionRound:0,
      roundCount:6,
      targetShootingSource:[],//targetShootingIfo[]
      itemShootingInfos:[],
      shootingPlan:null,
      planSource:[
        {
          id:1,
          name:"2月23日训练计划1",
          executionRound:0,
          roundCount:6,
          targetCount:6,
          bulletNumber:10,
        },
        {
          id:2,
          name:"2月23日训练计划2",
          executionRound:0,
          roundCount:6,
          targetCount:12,
          bulletNumber:8
        },],
      currentPage:1,
      maxPage:1,
      pageCount:0,
      targetItems:[],
      maxTargetCount:10,
      zoomItem:null,
      isZoom:true,
      zoomShootingInfo:null,
      zoomShootingResults:[],
      gunIdx:0,
      isPic:false,
      isReal:false,
      isDensity:true,
      density:0.28,
      itemLayout:'2x5',
      row:1,
      col:1,
      layoutSource:['2x5','1x3','1x2','1x1'],
      planListVisible:false,
      gestureSource:["卧下","半蹲","站立"],
      shootingGesture:"站立",
      shootingGestureVisible:false,
      pageLayoutVisible:false,
      isPlan: false,
      isPlay: false,
      targetCtrlDialog: false,
    }
  },
  created(){
    this.GetPlanSource()
  },
  mounted(){
    
  },
  watch:{
    targetShootingSource:{
      handler(){
        this.ResetLayout()
        // this.PageTurning()
      },
      deep:true
    }
  },
  methods:{
    GetPlanSource(){
      //从服务端获取计划列表

    },
    TestBtnClick(){
      if(!this.shootingPlan){
        return
      }
      if(this.executionRound === 0){
        return
      }
      let targetType = ['Area','Precision','Hit']

      for(let i = 1; i<=this.shootingPlan.targetCount;i++){
        let results = []
        
        for(let j = 1;j<=this.shootingPlan.bulletNumber;j++){
          let shootingResult ={
            planId: this.shootingPlan.id,
            roundIdx: this.shootingPlan.executionRound,
            targetIdx: i,
            targetType: targetType[i%3],
            personId: i,
            shootingIdx: j,
            isHit: Math.round(Math.random()*10)>0,
            code: Math.round(Math.random()*5)+5,
            direction:Math.round(Math.random()*9),
            x:Math.floor(Math.random()*10000)/10000,
            y:Math.floor(Math.random()*10000)/10000,
          }
          
          results.push(shootingResult)
        }
        this.targetShootingSource[i-1].currentResult = results[0]
        this.targetShootingSource[i-1].shootingResults = results
      }
      this.PageTurning()
    },
    FocusBtnClick(){
      //一键聚焦 服务端？？
    },
    ColseBtnClick(){
      //关闭弹窗
    },
    LeftBtnClick(){
      if(this.currentPage===1){
        return
      }else{
        this.currentPage--
        this.PageTurning()
      }
    },
    RightBtnClick(){
      if(this.currentPage===this.maxPage){
        return
      }else{
        this.currentPage++
        this.PageTurning()
      }
    },
    StartPlan(item){
      this.planListVisible = false
      this.isPlan = true
      this.shootingPlan = item
      this.planName = item.name
      this.executionRound = item.executionRound
      this.roundCount = item.roundCount
      //服务端操作计划开始
      //根据currentPlan构造targetShootingSource
      this.targetShootingSource.length = item.targetCount

      this.ResetLayout()
    },
    StopPlanClick(){
      this.isPlan = false
      this.shootingPlan = null
      this.targetShootingSource = []
      this.planName = ""
      this.isZoom = true
      this.ResetLayout()
      //服务端操作计划结束
    },
    NextRoundClick(){
      if(this.executionRound === this.roundCount){
        // 弹窗询问是否停止计划
        this.$confirm("所有轮次都已执行完毕，是否停止计划？", "注意",{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type:'warning',
          center: true
        }).then(()=>{
          this.StopPlanClick()
        }).catch(()=>{})
      }else{
        //结束当前轮 Stop        
        //开始下一轮 StartRound （服务端？
        this.isZoom = true
        //更改targetshootingsource
        if(this.executionRound === 0){
          for(let i = 1; i<=this.shootingPlan.targetCount;i++){
            this.targetShootingSource[i-1]= {
              shootingTarget:{
                id:i,
                name:"第"+i+"靶",
                planId:this.shootingPlan.id,
                targetIdx:i-1,
                targetModelId:i-1,
                model:{

                }
              },
              person:{
                name:"测试"+i,
                personState:"在岗",
                personNum:i,
                sex:"男",
                photoInfo:{
                  index:i,
                  dataType:"人脸",
                  dataPath:"人员_半身.png",
                  personId:i,
                  dataId:1
                },
                targetStateInfo:{
                  bulletCount:100,
                  gotCnt:10,
                  hr:100,
                  dp:80,
                  sp:100,
                  tp:36.1,
                  stp:1,
                  point:{

                  },
                }
              },
              target:{
                //靶机状态
                targetAction:"显靶",
                devState:true,
                isPrepare:true
              },
              car:{},
              isSelect:true,
              isShowRealPic:true,
              isDoubleHit:true,
              shootingCount:10,
              totalScore:100,
              scoreDesc:"9 / 75",
              currentResult:null,
              shootingResults:null,
              targetActions:[
                {
                  time:1,
                  targetIdx:i-1,
                  isActive:true,
                }
              ]
            }
          }
        }else{
          for(let i = 1; i<=this.shootingPlan.targetCount;i++){
            this.targetShootingSource[i-1].currentResult = null
            this.targetShootingSource[i-1].shootingResults = []
          }
        }
        
        // this.targetShootingSource.length = this.shootingPlan.targetCount
        this.executionRound++
        // this.PageTurning()
        this.ResetLayout()
      }
    },
    PlayBtnClick(){
      this.isPlay = true
    },
    SuspendBtnClick(){
      this.isPlay = false
    },
    StopBtnClick(){
      this.isPlay = false
    },
    BtnCtrlClick(){
      //手动控制弹窗
      this.targetCtrlDialog = true
    },
    GestureBtnClick(gesture){
      this.shootingGestureVisible = false
      this.shootingGesture = gesture
    },
    LayoutBtnClick(layout){
      this.pageLayoutVisible = false
      this.itemLayout = layout
      this.ResetLayout()
    },
    ResetLayout(){
      let panelTable = document.getElementById('panel_table')
      //清空table内容
      while(panelTable.rows.length>0){
        panelTable.deleteRow(0)
      }
      this.targetItems.length = 0
      this.maxPage = 1
      this.currentPage = 1

      if(!this.shootingPlan || !this.targetShootingSource)
        return

      this.GetRowColum(this.itemLayout)
      this.pageCount = this.row*this.col
      // this.currentPage = 1
      this.maxPage = Math.ceil(this.targetShootingSource.length / this.pageCount)

      for(let i = 0; i<this.row; i++){
        panelTable.insertRow(0)
      }
      
      for(let i = 0;i<panelTable.rows.length;i++){
        for(let j = 0;j<this.col;j++){
          panelTable.rows[i].insertCell(0)
        }
      }

      let targetItemDiv = document.createElement('div')
      let index = 0
      // let isZoom = this.isZoom

      for(let i = 0; i<this.row; i++){
        for(let j = 0; j<this.col; j++){
          if(index < this.targetShootingSource.length){
            let itemId = "item" + index
            targetItemDiv.id = itemId
            panelTable.rows[i].cells[j].appendChild(targetItemDiv)
            let item = new Vue({
              template: '<TargetItem :id="id" :shootingInfo="shootingInfo" :isShow="isShow" @setZoom="SetZoom"/>',
              components:{
                TargetItem
              },
              data(){
                return{
                  id: itemId,
                  shootingInfo: null,
                  isShow: true,
                  // isZoom: isZoom
                }
              },
              methods:{
                SetZoom(info){
                  this.$emit('setZoom', info)
                }
              }
            })
            
            item.$mount('#'+itemId)
            this.targetItems.push(item)
            item.$on('setZoom',(info)=>this.SetZoom(info))
            index++
          }else{
            this.PageTurning()
            return
          }         
        }
      }
      this.PageTurning()
    },
    SetZoom(info){
      this.isZoom = false
      this.zoomShootingInfo = info
      this.zoomShootingResults = info.shootingResults
      // console.log(info)
      if(!info){
        this.gunIdx = 0
        return
      }
      this.gunIdx = this.zoomShootingInfo.shootingResults.indexOf(this.zoomShootingInfo.currentResult) + 1
    },
    PageTurning(){
      //根据currentPage、maxPage、row、col计算当前显示的item
      let itemCount = (this.currentPage-1)*this.pageCount
      let index = 0
      for(let i=0; i<this.row; i++){
        for(let j=0; j<this.col; j++){
          if(index<this.targetItems.length){
            if(itemCount < this.targetShootingSource.length){
              this.targetItems[index].isShow = true
              this.targetItems[index].shootingInfo = this.targetShootingSource[itemCount++]
            }else{
              this.targetItems[index].isShow = false
            }
            index++
          }
        }
      }
    },
    GetRowColum(layoutStr){
      if(!layoutStr || layoutStr===""){
        this.row = 2
        this.col = 5
      }

      let tmpArr = layoutStr.split("x")
      if(tmpArr.length !== 2){
        this.row = 2
        this.col = 5
      }else{
        this.row = Number(tmpArr[0])
        this.col = Number(tmpArr[1])
      }
    },
    LastBtnClick(){
      //上一枪
      if(!this.zoomShootingInfo || this.gunIdx<=1){
        return
      }else{
        this.gunIdx--
        this.zoomShootingInfo.currentResult = this.zoomShootingInfo.shootingResults[this.gunIdx - 1]
      }
    },
    NextBtnClick(){
      //下一枪
      if(!this.zoomShootingInfo || this.gunIdx>=this.zoomShootingInfo.shootingResults.length){
        return
      }else{
        this.gunIdx++
        this.zoomShootingInfo.currentResult = this.zoomShootingInfo.shootingResults[this.gunIdx - 1]
      }
    },
    ZoomBackClick(){
      //返回
      this.isZoom = true
    }
  }
}
</script>

<style>
.el-popover{
  min-width: 50px;
}
.el-popper .popper__arrow::after{
  border-width: 0;
}
.el-popover.plan_list_popover{
  border: 1px solid #1199FF;
  background-color: #003057;
}
.el-popover.plan_list_popover .popper__arrow::after{
  border-bottom-color: #1199FF;
}
.el-popover.layout_popover,.el-popover.gesture_popover{
  border: 1px solid #1199FF;
  background-color: #003057;
}
.el-popover.layout_tooltip,.el-popover.gesture_tooltip{
  border: 1px solid #1199FF;
  background-color: #003057;
  color:white;
  padding: 5px;
}
.target_ctrl_dialog .el-dialog__header{
  font-size: 17px;
  border: 2px solid #AAE0E0E0;
  border-bottom: none;
  border-radius: 5px 5px 0 0;
  color: white;
  padding: 5px;
  background-color: #214d5c;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.target_ctrl_dialog .el-dialog__header .el-dialog__headerbtn{
  top:15px;
}
.target_ctrl_dialog .el-dialog__header .el-dialog__headerbtn .el-dialog__close{
  color: white;
}
.target_ctrl_dialog .el-dialog__body{
  padding: 0px;
  background-color: #214d5c;
  border: 2px solid #AAE0E0E0;
  border-top: none;
  border-radius: 0 0 5px 5px;
}
#gun_list .el-table__header-wrapper tr th{
  background-color: #042642;
  color:white;
  font-size: 16px;
}
#gun_list .el-table__body tr.el-table__row td {
  background-color: #002d52 !important;
  color: #f0f0f0;
}
#gun_list .el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: #003968 !important;
  color: #f0f0f0;
}
#gun_list .el-table__body tr:hover > td{
  background-color: #385785 !important;
}
.setting_check{
  margin: 15px 0px;
  display: block;
}
.setting_check .el-checkbox__label{
  color: white;
  font-size:17px;
}
.setting_check .el-checkbox__input.is-checked+.el-checkbox__label{
  color: white;
}
</style>

<style scoped>
.shooting_dev_control{
  box-sizing: content-box;
  width: 1300px;
  height: 750px;
  border: 3px solid #AAE0E0E0;
  border-radius: 10px;
  background-color: #153652;
}
.top{
  border-radius: 8px;
  height: 35px;
  display: flex;
  justify-content: space-between;
  background-color: #214d5ca4;
}
.top img{
  height: 80%;
  vertical-align: middle;
  margin: 5px;
}
.left{
  display: flex;
  align-items: center;
}
.window_title{
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 19px;
}
.title{
  color:#F0F0F0;
}
.plan_name{
  color: orange;
  font-size: 19px;
  margin: auto 20px;
}
.right{
  display: flex;
  justify-content: space-between;
  width: 220px;
}
.test_btn{
  border: 1px solid #1199FF;
  border-radius: 5px;
  color:#F0F0F0;
  background-color: #153652;
  margin: 2px;
}
.focus_btn{
  border: 0px;
  color:#F0F0F0;
  border-radius: 5px;
  background-color: #214d5c00;
}
.close_btn{
  border: 0px;
  border-radius: 10px;
  background-color: #214d5c00;
}
.target_panel{
  display: flex;
  justify-content: space-between;
  height: 645px;
}
#target_panel{
  width: 1190px;
  position: relative;
}
.left_btn, .right_btn{
  border: 0px;
  width: 45px;
  margin: 5px;
  background-color: #153652;
  border-radius: 5px;
}
.target_tool_bar{
  background-color: #003057;
  height:70px;
  border-radius: 10px;
  align-items: center;
  text-align: center;
  display: flex;
  position:relative;
}
.target_tool_bar img{
  width: 30px;
  height: 30px;
  vertical-align: middle;
}
.div_title{
  font-size:12px;
  color:#F0F0F0;
}
.target_tool_bar button{
  height: 40px;
  width: 70px;
  border: 1px solid #1199FF;
  border-radius: 5px;
  color:#F0F0F0;
}
.plan_control{
  background-color: #33006600;
  position: absolute;
  left: 10px;
  width: 100px;
  border-radius: 5px;
  background-color: #214d5ca4;
  padding: 3px;
}
.choose_plan{
  background-color: #008844;
}
.stop_plan{
  background-color:#AA3333;
}
.plan_name_list{
  display: flex;
  align-items: center;
  color:#F0F0F0;
  padding: 5px;
}
.start_plan_btn{
  background-color: #153652;
  height: 40px;
  width: 70px;
  border: 1px solid #1199FF;
  border-radius: 5px;
  color:#F0F0F0;
  margin-left: 10px;
}
.round_control{
  background-color: #33666600;
  position: absolute;
  left: 135px;
  width: 250px;
  border-radius: 5px;
  background-color: #214d5ca4;
  padding: 3px;
}
.round_control_div{
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.round_info{
  color: orange;
  font-size: 19px;
}
.next_round{
  background-color: #003057;
}
.shooting_gesture{
  position: absolute;
  left:400px;
}
.gesture_info{
  color: white;
  margin: 10px;
}
.shooting_gesture_btn img{
  width: 30px;
  height: auto;
}
.shooting_gesture_div button{
  width: 40px;
  border: 0px;
  background-color: #09155c00;
}
.target_action{
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  width: 240px;
  border-radius: 5px;
  background-color: #09155c86;
  padding: 3px;
}
.target_action_div{
  display: flex;
  justify-content: space-around;
}
.play_btn{
  background-color: #008844;
}
.suspend_btn{
  background-color: #336677;
}
.stop_btn{
  background-color: #AA3333;
}
.btn_ctrl{
  background-color: #996633;
}
.page_layout{
  position: absolute;
  right: 10px;
  width: 130px;
  border-radius: 5px;
  background-color: #09155c86;
  padding: 3px;
}
.page_layout_div,.shooting_gesture_div{
  display: flex;
  justify-content: center;
  align-items: center;
  font-size:18px;
}
.page_layout_div button{
  width: 40px;
  border: 0px;
  background-color: #09155c00;
}
.layout_btn,.gesture_btn{
  display: block;
  background-color: #153652;
  height: 40px;
  width: 70px;
  border: 1px solid #1199FF;
  border-radius: 5px;
  color:#F0F0F0;
  margin: 5px;
}
.page_info{
  color:#F0F0F0;
  margin: 0px 15px;
}
p{
  margin:0;
}
button{
  box-sizing: border-box;
}
button:hover{
  cursor: pointer;
  border: 1px solid white;
}
.left_btn:hover,.right_btn:hover,.focus_btn:hover,.page_btn:hover,.shooting_gesture_btn:hover{
  background-color: rgba(255, 255, 255, 0.075);
  border: none;
}
.zoom_page{
  position: relative;
  height: 645px;
  width: 1190px;
  align-items: center;
  display: flex;
  /* justify-content: space-around; */
}
.zoom_item{
  height: 645px;
  width: 65%;
}
.zoom_page button{
  color:#F0F0F0;
  font-size: 17px;
  padding:4px 7px;
  display: flex;
  align-items: center;
}
.zoom_page button img{
  width:24px;
  margin: 2px;
}
.gun_info{
  margin: 80px;
  max-height: 90%;
  width:35%;
}
.change_gunid{
  align-items: center;
  display: flex;
  justify-content: space-around;
}
.gun_id{
  margin:10px;
  color:#F0F0F0;
  display: flex;
  justify-content: center;
}
.last_btn,.next_btn{
  margin:10px;
  background-color: #003057;
  border: 1px solid #1199FF;
  border-radius: 5px;
}
.zoom_back{
  position:absolute;
  right: -3%;
  top: 2%;
  border: 1px solid #1199FF;
  border-radius: 5px;
  background-color: #AA3333;
}
</style>