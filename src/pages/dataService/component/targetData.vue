<template>
  <div :id="id" class="target_data">
    <img class="target_img" src="../../../assets/靶纸.png" width="100%"
      @load="InitCanvas">
    <canvas class="target_data_canvas"></canvas>
    <canvas class="target_density_canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'TargetData',
  props:{
    id:{
      //容器id，每个TargetItem唯一
      type: String,
      default: ''
    },
    density:{
      type:Number,
      default:0.28
    },
    isDensity:{
      type:Boolean,
      default:true
    },
    shootingResultRecord:{
      //根据shootingRoundRecord.roundIdx服务端接口查找得到
      type: Array
    },
    shootingIdx:{
      type:Number,
      default:0
    },
    shootingRoundRecord:{
      type: Object
    }
  },
  data(){
    return{
      targetData:null,
      canvas:null,
      densityCanvas:null,
      ctx:null,
      densityCtx:null,
      lineWidth:2,
      pointR:5,
      x0:0,
      y0:0,
      a:0,
      centerX:0.5,
      centerY:0.6,
      // density:0.28,
      points:[],  //可能的散布中心集合
      selectIndex:-1,
    }
  },
  watch:{
    shootingRoundRecord:{
      handler(){
        //this.SetData()
        if(this.shootingRoundRecord){
          if(!this.shootingIdx){
            this.DrawResults()
          }else{
            this.DrawResult(this.shootingResultRecord[this.shootingIdx-1])
          }
        }
      },
    },
    shootingIdx:{
      handler(){
        this.DrawResult(this.shootingResultRecord[this.shootingIdx-1])
      }
    },
    density:{
      handler(){
        if(this.shootingRoundRecord){
          this.RefreshDisCenter()
        }
      }
    },
    isDensity:{
      handler(){
        this.DrawDisCenter(this.shootingRoundRecord,this.points,this.selectIndex)
      }
    }
  },
  mounted(){
    this.targetData = document.getElementById(this.id)
    window.addEventListener("resize", ()=>{this.InitCanvas()})
  },
  methods:{
    InitCanvas(){
      this.canvas = this.targetData.getElementsByClassName('target_data_canvas')[0]
      this.densityCanvas = this.targetData.getElementsByClassName('target_density_canvas')[0]
      let targetImg = this.targetData.getElementsByClassName('target_img')[0]
      this.canvas.width = targetImg.offsetWidth
      this.canvas.height = targetImg.offsetHeight
      this.densityCanvas.width = targetImg.offsetWidth
      this.densityCanvas.height = targetImg.offsetHeight

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
      if(this.shootingResultRecord){
        if(!this.shootingIdx){
          this.DrawResults()
        }else{
          this.RefreshDisCenter()
          this.DrawResult(this.shootingResultRecord[this.shootingIdx-1])
        }
      }
    },
    SelectPoints(){
      this.points = []

      //筛选打靶结果点
      let results = this.shootingResultRecord.filter(result => result.isHit)
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
    RefreshRoundRecord(record,results){
      record.disCenterX = this.Average(results, 'x')
      record.disCenterY = this.Average(results, 'y')
      record.disCode = this.CoordinateToCode(record.disCenterX, record.disCenterY)
      record.disDirecion = this.CoordinateToDisDirection(record.disCenterX, record.disCenterY)
    },
    RefreshDisCenter(){
      let results = this.SelectPoints()
      if(!Array.isArray(results) || !results.length){
        return
      }
      let selectResults = results.filter(value => value.isSelect)
      this.RefreshRoundRecord(this.shootingRoundRecord,selectResults)
      this.DrawDisCenter(this.shootingRoundRecord,this.points,this.selectIndex)
      return results
    },
    DrawResults(){
      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
      if(this.shootingResultRecord[0].targetType === "Hit"){
        this.DrawHitResult(this.shootingResultRecord)
      }else{
        let results = this.RefreshDisCenter()
        results.forEach(result => {
          if(result.isHit){
            if(result.targetType === "Area"){
              this.DrawArea(result)
            }else if(result.targetType === "Precision"){
              this.DrawPrecision(result)
            }
          }
        });
      }
    },
    DrawResult(result){
      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
      if(result.targetType==="Area"){
        this.DrawArea(result)
      }else if(result.targetType==="Precision"){
        this.DrawPrecision(result)
      }else if(result.targetType==="Hit"){
        this.DrawHit(result)
      }
    },
    DrawHitResult(results){
      let text = results.filter(value => value.isHit).length + " / " + results.length

      let fontSize = this.canvas.width / 8
      this.ctx.font = fontSize + "px Arial"
      this.ctx.fillStyle = "red"
      this.ctx.textAlign = "center"
      this.ctx.fillText(text, this.x0+this.a/2, this.y0+this.a/2)
    },
    DrawHit(result){
      //命中靶
      let text = result.isHit ? "命 中" : "未命中"
      let fontSize = this.canvas.width / 8
      this.ctx.font = fontSize + "px Arial"
      this.ctx.fillStyle = result.isHit ? "red" : "grey"
      this.ctx.textAlign = "center"
      this.ctx.fillText(text, this.x0+this.a/2, this.y0+this.a/2)
    },
    DrawPrecision(result){
      //精度靶 
      this.ctx.beginPath()
      this.ctx.arc(this.x0 + result.x*this.a, this.y0 + result.y*this.a, this.pointR, 0, 2*Math.PI)
      this.ctx.fillStyle = result.isSelect? "yellow" : "red"
      this.ctx.fill()
      this.ctx.closePath()

      // this.ctx.beginPath()
      // this.ctx.arc(this.x0 + result.x*this.a, this.y0 + result.y*this.a, this.density*this.a / 2, 0, 2*Math.PI)
      // this.ctx.strokeStyle = "green"
      // this.ctx.stroke()
      // this.ctx.closePath()
    },
    DrawArea(result){
      //区域靶
      let step = this.a/10
      let centerX = this.x0 + this.centerX*this.a
      let centerY = this.y0 + this.centerY*this.a
      if(result.code === 10){
        this.ctx.beginPath()
        this.ctx.arc(centerX, centerY, step, 0, 2*Math.PI)
        this.ctx.fillStyle = "red"
        this.ctx.fill()
        this.ctx.closePath()
      }else{
        let anglePart = Math.PI / 4
        let r0 = (11 - result.code) * step
        let r1 = (10 - result.code) * step  //内圈
        let angle = (result.direction+5)%8 * anglePart
        let angle0 = angle - anglePart/2
        let angle1 = angle + anglePart/2

        this.ctx.beginPath()
        this.ctx.arc(centerX, centerY, r1, angle0, angle1) //内圈
        this.ctx.lineTo(centerX + Math.cos(angle1)*r0, centerY+Math.sin(angle1)*r0)
        this.ctx.arc(centerX, centerY, r0, angle1, angle0, true)
        this.ctx.lineTo(centerX + Math.cos(angle0)*r1, centerY+Math.sin(angle0)*r1)
        this.ctx.fillStyle = 'rgba(255,0,0,0.5)'
        this.ctx.fill()
        this.ctx.closePath()
      }  
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

<style scoped>
.target_data{
  height: 100%;
  width:100%;
  position: relative;
  display: flex;
}
/* .target_data_div{
  border: 1px solid;
  border-radius: 5px;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  display: flex;
  align-items: center;
} */
img{
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
canvas{
  position:absolute;
}

</style>