<template>
  <div :id="id" class="target_item">
    <div class="target_item_div" v-show="isShow">
      <div class="target_div">
        <div class="top_div">
          <div class="target_action_div">
            <img src="../assets/动作.png" v-show="isTargetAction">
            <p>{{targetAction}}</p>
          </div>
          <p class="target_name">{{targetName}}</p>
          <p class="is_prepare" v-show="isNotPrepare">未准备</p>
          <div v-show="isZoom">
            <button class="zoom_button" @click="ZoomBtnClick">
              详情
            </button>
          </div>
        </div>
        <div class="center_div">
          <div class="score_desc_div">
            <img src="../assets/打靶.png">
            <p class="score_desc">{{scoreDesc}}</p>
          </div>
          <div class="is_double_hit" v-show="isDoubleHit">
            <p>连发</p>
          </div>
          <img class="target_pic" src="../assets/靶纸.png" width="100%"
            @load="InitCanvas">
          <canvas class="target_item_canvas"></canvas>
          <canvas class="target_density_canvas"></canvas>
        </div>
      </div>
      <div class="person_div">
        <div class="person_photo" v-show="isPerson">
          <img :src="personPhotoSource">
        </div>
        <div class="person_info" v-show="isPerson">
          <div class="name_bullet">
            <div class="person_name">
              <p>{{personName}}</p>
            </div>
            <div class="info_text" style="width:40%">
              <img src="../assets/SupplyBullet.png" >
              <p><span class="bullet_count">{{bulletCount}}</span> / {{gotCnt}}</p>
            </div>
          </div>
          <div class="body_info">
            <div class="info_text" style="width:24%">
              <img src="../assets/心率.png">
              <p>{{heartRate}}</p>
            </div>
            <div class="info_text" style="width:26%">
              <img src="../assets/体温.png">
              <p>{{bodyTemperature}}</p>
            </div>
            <div class="info_text" style="width:40%">
              <img src="../assets/血压.png">
              <p>{{dp}}-{{sp}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TargetItem',
  props:{
    id:{
      //容器id，每个TargetItem唯一
      type: String,
      default: ''
    },
    shootingInfo:{
      type: Object
    },
    isZoom:{
      type: Boolean,
      default: true
    },
    isShow:{
      type: Boolean,
      default: true
    },
    isDensity:{
      type:Boolean,
      default:false
    },
    density:{
      type:Number,
      default:0.28
    },
  },
  data () {
    return {
      targetItem: null,
      canvas:null,
      densityCanvas:null,
      ctx:null,
      densityCtx:null,
      x0:0,
      y0:0,
      a:0,
      targetName:"",
      targetAction:"",
      scoreDesc:"",
      personPhotoSource: require("../assets/人员_半身.png"),
      personName:"",
      bulletCount: 0,
      gotCnt:0,
      heartRate:0,
      bodyTemperature: 0,
      dp:0,//舒张压
      sp:0,//收缩压
      targetType:"",
      code:0,
      direction:0,
      pointX:0,
      pointY:0,
      isHit:true,
      devState:0,
      isNotPrepare:false,
      isTargetAction:false,
      isDoubleHit:false,
      // isTarget:true,
      isPerson:false,
      disCenterInfo:{
        disCenterX:0,
        disCenterY:0,
        disCode:0,
        disDirecion:0,
      },
      points:[],
      lineWidth:2,
      pointR:5,
    }
  },
  watch:{
    shootingInfo:{
      handler(){
        this.SetData()
        this.DrawResult()
      },
      deep:true
    },
    density:{
      handler(){
        this.RefreshDisCenter()
      }
    },
    isDensity:{
      handler(){
        this.DrawDisCenter(this.disCenterInfo,this.points,this.selectIndex)
      }
    }
  },
  mounted(){
    this.InitTargetItem()
    this.SetData()
    this.InitCanvas()
    // this.DrawResult()
  },
  methods:{
    InitTargetItem(){
      this.targetItem = document.getElementById(this.id)
      let targetItemDiv = this.targetItem.getElementsByClassName('target_item_div')[0]
      
      if(this.targetItem.offsetHeight<1.3*this.targetItem.offsetWidth){
        targetItemDiv.style.height = this.targetItem.offsetHeight + "px"
        targetItemDiv.style.width = this.targetItem.offsetHeight/1.3 + "px"
        // console.log(targetItemDiv.style.height)
      }else{
        targetItemDiv.style.width = this.targetItem.offsetWidth + "px"
        targetItemDiv.style.height = this.targetItem.offsetWidth * 1.3 + "px"
      }
      
      this.SetFontSize()
    },
    SetFontSize(){
      let topDiv = this.targetItem.getElementsByClassName('top_div')[0]
      let targetName = this.targetItem.getElementsByClassName('target_name')[0]
      let targetActionDiv = this.targetItem.getElementsByClassName('target_action_div')[0]
      let isNotPrepare = this.targetItem.getElementsByClassName('is_prepare')[0]
      let zoomBtn = this.targetItem.getElementsByClassName('zoom_button')[0]

      let baseSize = topDiv.offsetHeight
      targetName.style.fontSize = baseSize/2.1 + "px"
      targetActionDiv.style.fontSize = baseSize/3.1 + "px"
      isNotPrepare.style.fontSize = baseSize/3.1+ "px"
      zoomBtn.style.fontSize = baseSize/4.1 + "px"

      let centerDiv = this.targetItem.getElementsByClassName('center_div')[0]
      centerDiv.style.fontSize = topDiv.offsetHeight/3 + "px"

      let personDiv = this.targetItem.getElementsByClassName('person_div')[0]
      personDiv.style.fontSize = topDiv.offsetHeight/3.2 + "px"
    },
    SetData(){
      if(this.shootingInfo){
        if(this.shootingInfo.target){
          this.targetAction = this.shootingInfo.target.targetAction
          this.devState = this.shootingInfo.target.devState
          this.isNotPrepare = !this.shootingInfo.target.isPrepare
          let targetActionDiv = this.targetItem.getElementsByClassName('target_action_div')[0]
          if(this.targetAction === "显靶"){
            targetActionDiv.style.color = "#1199FF"
          }else if(this.targetAction === "隐靶"){
            targetActionDiv.style.color = "#336677"
          }
        }

        if(!this.shootingInfo.person){
          this.isPerson = false
        }else{
          this.isPerson = true
          this.personPhotoSource = require("../assets/"+this.shootingInfo.person.photoInfo.dataPath)
          this.personName = this.shootingInfo.person.name
          this.bulletCount = this.shootingInfo.person.targetStateInfo.bulletCount
          this.gotCnt = this.shootingInfo.person.targetStateInfo.gotCnt
          this.heartRate = this.shootingInfo.person.targetStateInfo.hr
          this.bodyTemperature = this.shootingInfo.person.targetStateInfo.tp
          this.dp = this.shootingInfo.person.targetStateInfo.dp
          this.sp = this.shootingInfo.person.targetStateInfo.sp
        }

        this.targetName = this.shootingInfo.shootingTarget.name
        let targetName = this.targetItem.getElementsByClassName('target_name')[0]
        targetName.style.backgroundColor = this.isNotPrepare ? "#0a233d" : "#008844"
        targetName.style.color = this.devState ? "#1199FF" : "#AAAAAA"
                
        if(this.shootingInfo.currentResult){
          this.targetType = this.shootingInfo.currentResult.targetType
          this.code = this.shootingInfo.currentResult.code
          this.direction = this.shootingInfo.currentResult.direction
          this.pointX = this.shootingInfo.currentResult.x
          this.pointY = this.shootingInfo.currentResult.y
          this.isHit = this.shootingInfo.currentResult.isHit
        }
        
        this.scoreDesc = this.shootingInfo.scoreDesc
        this.isDoubleHit = this.shootingInfo.isDoubleHit
        this.isTargetAction = this.shootingInfo.targetActions.length ? true:false
      }else{
        this.isPerson = false
      }
    },
    InitCanvas(){
      this.canvas = this.targetItem.getElementsByClassName('target_item_canvas')[0]
      this.densityCanvas = this.targetItem.getElementsByClassName('target_density_canvas')[0]
      let targetPic = this.targetItem.getElementsByClassName('target_pic')[0]

      this.canvas.width = targetPic.width
      this.canvas.height = targetPic.height
      this.densityCanvas.width = targetPic.width
      this.densityCanvas.height = targetPic.height
      // console.log(canvas.height)
      if(this.canvas.width > this.canvas.height){
        this.a = this.canvas.height
        this.x0 = (this.canvas.width - this.a)/2
        this.y0 = 0
      }else{
        this.a = this.canvas.width
        this.y0 = (this.canvas.height - this.a)/2
        this.x0 = 0
      }
      
      this.lineWidth = this.a/200 > 1.5? this.a/200 : 1.5
      this.pointR = this.lineWidth>2? this.lineWidth*2 : 4

      this.ctx = this.canvas.getContext('2d')
      this.densityCtx = this.densityCanvas.getContext('2d')
      this.DrawResult()
    },
    DrawPrecision(){
      //精度靶 
      this.ctx.beginPath()
      this.ctx.arc(this.x0 + this.pointX*this.a, this.y0 + this.pointY*this.a, 5, 0, 2*Math.PI)
      this.ctx.fillStyle = "red"
      this.ctx.fill()
    },
    DrawArea(){
      //区域靶
      let step = this.a/10
      let centerX = this.x0 + 0.5*this.a
      let centerY = this.y0 + 0.6*this.a
      if(this.code === 10){
        this.ctx.beginPath()
        this.ctx.arc(centerX, centerY, step, 0, 2*Math.PI)
        this.ctx.fillStyle = "red"
        this.ctx.fill()
      }else{
        var anglePart = Math.PI / 4
        var r0 = (11 - this.code) * step
        var r1 = (10 - this.code) * step  //内圈
        var angle = (this.direction+5)%8 * anglePart
        var angle0 = angle - anglePart/2
        var angle1 = angle + anglePart/2

        this.ctx.beginPath()
        this.ctx.arc(centerX, centerY, r1, angle0, angle1) //内圈
        this.ctx.lineTo(centerX + Math.cos(angle1)*r0, centerY+Math.sin(angle1)*r0)
        this.ctx.arc(centerX, centerY, r0, angle1, angle0, true)
        this.ctx.lineTo(centerX + Math.cos(angle0)*r1, centerY+Math.sin(angle0)*r1)
        this.ctx.fillStyle = "red"
        this.ctx.fill()
      }  
    },
    DrawHit(){
      //命中靶
      let text = this.isHit ? "命 中" : "未命中"
      let fontSize = this.canvas.width / 8
      this.ctx.font = fontSize + "px Arial"
      this.ctx.fillStyle = this.isHit ? "red" : "grey"
      this.ctx.textAlign = "center"
      this.ctx.fillText(text, this.x0+this.a/2, this.y0+this.a/2)
    },
    DrawResult(){
      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
      if(this.targetType==="Area"){
        this.DrawArea()
      }else if(this.targetType==="Precision"){
        this.DrawPrecision()
      }else if(this.targetType==="Hit"){
        this.DrawHit()
      }
      if(this.isDensity){
        this.RefreshDisCenter()
      }
    },
    ZoomBtnClick(){
      //跳出放大后的新窗口
      // this.isZoom = false
      this.$emit('setZoom',this.shootingInfo)
    },
    SelectPoints(){
      this.points = []

      //筛选打靶结果点
      let results = this.shootingInfo.shootingResults.filter(result => result.isHit)
      if(!Array.isArray(results) || !results.length){
        this.selectIndex = -1
        return null
      }
      let d = this.density  //打靶成绩密集度Density
      let n = results.length
      let r = d / 2
      let ipCoverMax = [] //IntersectPoint类型

      for(let i = 0; i < n; i++){
        let ipList = [] //IntersectPoint类型,交点集合
        for(let j = 0; j < n; j++){
          if(i===j){
            continue
          }

          let dis = this.GetDistance(results[i].x, results[i].y, results[j].x, results[j].y)
          //两点间距大于d则无交点
          if(dis>d){
            continue
          }

          let theta = Math.atan2(results[j].y - results[i].y, results[j].x - results[i].x);
          let alpha = Math.acos(dis / 2 / r);

          let a = dis / 2;
          let h = Math.sqrt(r * r - a * a);

          let x1 = (results[j].x - results[i].x) * a / dis + results[i].x + h * (results[j].y - results[i].y) / dis;
          let y1 = (results[j].y - results[i].y) * a / dis + results[i].y - h * (results[j].x - results[i].x) / dis;

          let x2 = (results[j].x - results[i].x) * a / dis + results[i].x - h * (results[j].y - results[i].y) / dis;
          let y2 = (results[j].y - results[i].y) * a / dis + results[i].y + h * (results[j].x - results[i].x) / dis;

          ipList.push({
            id1: i, 
            id2: j, 
            coverIds: [],
            angle: theta - alpha, 
            flag: 1, 
            sum: 0,
            x: x1, 
            y: y1
          },
          {
            id1: i, 
            id2: j, 
            coverIds: [],
            angle: theta + alpha, 
            flag: -1, 
            sum: 0,
            x: x2, 
            y: y2
          })
        }

        if(!Array.isArray(ipList) || !ipList.length){
          continue
        }

        let ipListOrder = ipList.sort(function(a, b){
          return a.angle - b.angle  //从小到大排序
        })

        let sum = 1
        let tempIdList = [i]
        for(let j = 0; j < ipListOrder.length; j++){
          if(ipListOrder[j].flag === 1){
            tempIdList.push(ipListOrder[j].id2)
          }else{
            let index = tempIdList.indexOf(ipListOrder[j].id2)
            if(index !== -1){
              tempIdList.splice(index, 1)
            }           
          }
          sum += ipListOrder[j].flag

          ipListOrder[j].sum = sum
          ipListOrder[j].coverIds = tempIdList.slice(0,tempIdList.length)
        }

        let maxSum = ipListOrder.sort(function(a, b){
          return b.sum - a.sum
        })[0].sum
        let addRange = ipListOrder.filter(value => value.sum === maxSum)
        addRange.forEach(value => ipCoverMax.push(value)) //包含单轮最大Sum的所有点
      }

      let max = 0
      if(ipCoverMax.length){
        max = ipCoverMax.sort(function(a, b){
          return b.sum -a.sum //从大到小排序
        })[0].sum
      }

      let resultList = ipCoverMax.filter(value => value.sum === max)  //筛选出Sum=最大值的全部点
      if(!resultList.length){
        this.selectIndex = -1
        return null
      }

      let tempCoverIds = [resultList[0].coverIds] //符合条件的coverIds集合
      if(resultList.length > max){
        //存在多种可能
        resultList.forEach(result => {
          let coverIds = tempCoverIds.filter(value => this.CompareIntArray(value, result.coverIds))[0]
          if(!coverIds || !coverIds.length){
            tempCoverIds.push(result.coverIds)
          }
        })
      }

      let maxDistance = []
      //求每种情况的最大点距
      tempCoverIds.forEach(t => {
        let tempList = resultList.filter(value => this.CompareIntArray(value.coverIds, t))

        this.points.push({
          x: this.Average(tempList, 'x'),
          y: this.Average(tempList, 'y')
        })

        let tempRecordsIsSelect = []
        t.forEach(index => tempRecordsIsSelect.push(results[index]))

        let disCenterX = this.Average(tempRecordsIsSelect,'x')
        let disCenterY = this.Average(tempRecordsIsSelect,'y')
        
        let maxDis = 0
        tempRecordsIsSelect.forEach(temp =>{
          let dis = this.GetDistance(disCenterX, disCenterY, temp.x, temp.y)
          maxDis = dis > maxDis ? dis : maxDis
        })
        maxDistance.push(maxDis)
      })

      let minDis = maxDistance[0]
      //挑选最大点距最小的即最密集的为最终结果
      this.selectIndex = 0
      for(let i = 0; i < maxDistance.length; i++){
        if(maxDistance[i]<minDis){
          this.selectIndex = i
        }
      }

      for(let i = 0; i < n; i++){
        if(tempCoverIds[this.selectIndex].indexOf(i) !== -1){
          results[i].isSelect = true
        }else{
          results[i].isSelect = false
        }
      }
      return results
    },
    GetDistance(x1,y1,x2,y2){
      return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    },
    GetAngle(x1,y1,x2,y2){
      return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    },
    CoordinateToCode(x,y){
      let r = this.GetDistance(this.centerX,this.centerY,x,y)
      if(r<0.1){
        return 10
      }
      return 10 + 1 - r / 0.1
    },
    CoordinateToDisDirection(x,y){
      let a = this.GetAngle(this.centerX,this.centerY,x,y)
      a+=90
      if(a<0){
        a+=360
      }
      return a
    },
    CompareIntArray(arr1, arr2){
      if(arr1.length !== arr2.length){
        console.log("false")
        return false
      }
      for(let i=0; i<arr2.length; i++){
        if(arr1.indexOf(arr2[i]) === -1){
          return false
        }
      }
      return true
    },
    Average(arr, key){
      let len = arr.length
      if(!len){
        return 0
      }

      let sum = 0
      arr.forEach(a => {
        sum += a[key]
      })
      return sum / len
    },
    // RefreshDisCenter(results){
    //   this.disCenterInfo.disCenterX = this.Average(results, 'x')
    //   this.disCenterInfo.disCenterY = this.Average(results, 'y')
    //   this.disCenterInfo.disCode = this.CoordinateToCode(record.disCenterX, record.disCenterY)
    //   this.disCenterInfo.disDirecion = this.CoordinateToDisDirection(record.disCenterX, record.disCenterY)
    // },
    RefreshDisCenter(){
      let results = this.SelectPoints()
      if(!Array.isArray(results) || !results.length){
        return
      }
      let selectResults = results.filter(value => value.isSelect)
      this.disCenterInfo.disCenterX = this.Average(selectResults, 'x')
      this.disCenterInfo.disCenterY = this.Average(selectResults, 'y')
      this.disCenterInfo.disCode = this.CoordinateToCode(this.disCenterInfo.disCenterX, this.disCenterInfo.disCenterY)
      this.disCenterInfo.disDirecion = this.CoordinateToDisDirection(this.disCenterInfo.disCenterX, this.disCenterInfo.disCenterY)
      this.DrawDisCenter(this.disCenterInfo,this.points,this.selectIndex)
      return results
    },
    DrawDisCenter(result,points,selectIndex){
      this.densityCtx.clearRect(0,0,this.densityCanvas.width,this.densityCanvas.height)

      if(!this.isDensity){
        return
      }
      
      //绘制散布中心
      let disCenterX = this.a * result.disCenterX
      let disCenterY = this.a * result.disCenterY

      this.densityCtx.beginPath()
      this.densityCtx.arc(this.x0+disCenterX, this.y0+disCenterY, this.pointR, 0, 2*Math.PI)
      this.densityCtx.fillStyle = "DarkOrange"
      this.densityCtx.fill()
      this.densityCtx.closePath()

      if(points.length){
        for(let i = 0; i<points.length; i++){
          let centerX1 = points[i].x * this.a
          let centerY1 = points[i].y * this.a

          this.densityCtx.beginPath()
          this.densityCtx.arc(this.x0+centerX1, this.y0+centerY1, this.density*this.a / 2, 0, 2*Math.PI)
          this.densityCtx.strokeStyle = i===selectIndex ? "DarkOrange" : "DarkGreen"
          this.densityCtx.lineWidth = this.lineWidth
          this.densityCtx.stroke()
          this.densityCtx.closePath()
        }
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.target_item{
  /* box-sizing: border-box; */
  height: 100%;
  width:100%;
  position: relative;
}
.target_item_div{
  border-radius: 5px;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  background-color: #336677;
}
p{
  margin:0;
}
img{
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
button:hover{
  cursor: pointer;
  border: 1px solid white;
}
.target_div{
  box-sizing: border-box;
  height: 82%;
  position: relative;
  background-color: #003057;
  border: 2px solid #AAE0E0E0;
  border-radius: 5px;
  z-index: 999;
}
.top_div{
  height: 15%;
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid gray;
  border-radius: 5px;
  background-color: #0a233d;
}
.center_div{
  height: 85%;
  position: relative;
  display: flex;
  align-items: center;
  background-color: #003057;
  border-radius: 5px;
}
.target_action_div{
  height: 70%;
  display: flex;
  align-items: center;
  position: absolute;
  left: 1%;
  color: #336677;
  opacity: 0.9;
}
.target_name{
  position:absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%,-50%);
  color: #1199FF;
  border-radius: 5px;
  padding: 4px 10px;
  opacity: 0.9;
}
.is_prepare{
  color: #CC5533;
  position: absolute;
  right: 17%;
}
.zoom_button{
  /* height: 80%; */
  /* width: 12%; */
  position: absolute;
  right: 1%;
  top: 50%;
  transform: translate(0,-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0a233d;
  border: none;
  border-radius: 5px;
  padding: 5px;
  color:#F0F0F099
}
.score_desc_div{
  display: flex;
  align-items: center;
  height: 10%;
  position:absolute;
  top: 5%;
  left: 3%;
  background-color: rgba(56, 56, 56, 0.5);
  border: 1px solid #38dddd54;
  border-radius: 5px;
  padding: 3px 8px;
}
.score_desc{
  color: orange;
  padding: 1px;
}
.is_double_hit{
  position:absolute;
  /* height: 10%; */
  top: 5%;
  right: 3%;
  background-color: orange;
  border: 2px solid rgb(119, 120, 121);
  border-radius: 5px;
  color: #EEE8CD;
  /* display: flex;
  align-items: center; */
  padding: 3px 8px;
}
.person_div{
  box-sizing: border-box;
  height: 18%;
  position: relative;
  /* border: 1px solid gray; */
  border-radius: 5px;
  display: flex;
  /* justify-content: space-around; */
  align-items: center;
  background-color: #336677;
  color:white;
  padding: 5px;
}
.person_photo{
  height: 90%;
  /* width: 20%; */
  border: 2px solid #1199FF;
  border-radius: 5px;
  /* position: absolute;
  left: 0%;
  top: 50%;
  transform: translate(0,-50%); */
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2px;
}
.person_info{
  height: 100%;
  width: 80%;
  overflow: hidden;
  /* display: flex; */
  /* align-content: space-between; */
  /* position: absolute;
  right: 0%; */
  /* top: 50%;
  transform: translate(0,-50%); */
}
.person_info img{
  height: 80%;
}
.person_name{
  margin: 5px;
}
.bullet_count{
  color: orange;
}
.name_bullet{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50%;
}
.body_info{
  display: flex;
  height: 50%;
  justify-content: space-between;
  align-items: center;
}
.info_text{
  display: flex;
  align-items: center;
  /* justify-content: center; */
  background-color: #0a233d;
  border-radius: 5px;
  height: 80%;
  margin: 2px;
  padding: 0px 3px;
  /* flex-shrink: 0; */
}
canvas{
  position:absolute;
}
</style>
