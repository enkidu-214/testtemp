<template>
  <div :id="id" class="chart_item" style="width:100%;height:100%;">
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  props:{
    id:{
      //容器id，每个图表唯一
      type: String,
      default: ''
    },
    refreshTime:{
      type: Number,
      default: 60000
    },
    type:{
      //图表类型，当前可选bar、line、pie、radar，默认折线图
      type: String,
      default: 'line',
      validator: function(value){
        return ['line', 'bar', 'pie', 'radar'].indexOf(value) !== -1
      }
    },
    title:{
      //图表标题
      type: String,
      default: ''
    },
    titlePosition:{
      //标题位置，可选center、left、right
      type: String,
      default: 'center',
      validator: function(value){
        return ['center', 'left', 'right'].indexOf(value) !== -1
      }
    },
    legend:{
      //图例
      type: Array,
      default: ()=>[]
    },
    legendPosition:{
      //图例位置，可选top、bottom、left、right
      type: String,
      default: 'bottom',
      validator: function(value){
        return ['top', 'bottom', 'left', 'right'].indexOf(value) !== -1
      }
    },
    dimension:{
      //维度，默认x，可选x或y
      type: String,
      default: 'x',
      validator: function(value){
        return ['x', 'y', 'X', 'Y'].indexOf(value) !== -1
      }
    },
    doubleAxis:{
      type: Boolean,
      default: false
    },
    dataZoom:{
      type: Boolean,
      default:false
    },
    chartData:{
      //图表数据，二维数组，默认第一行为横坐标，其后为数据数组，一组数据对应一个系列
      //对于radar，默认第一行为坐标系标题，第二行为对应最大值，其后为数据数组
      type: Array,
      default: ()=>[]
    },
    color:{
      //色盘
      type:Array,
      default:()=>['#3EA2F4','#FE594D','#FEC007','#4CAE50','#FF0097','#6473C8','#CCDB39','#00AEA9','#DA532C','#5A7380','#DE51E1']
    },
    pieRadius: {
      type: String | Array | Number,
      default: "50%"
    },
    radarchoose:{
      type:Boolean,
      default: true
    }
  },
  data(){
    return{
      myChart: null
    }
  },
  methods:{
    setPie(myChart){
      var series = []
      var data = []

      var option = {
        color: this.color,
        title: {
          text: this.title,
          left: this.titlePosition,
          textStyle:{
            color:'white',
            fontWeight:"normal"
          }
        },
        tooltip: {
          
        },
        legend: {
          textStyle:{
            color:'white'
          },
          data: this.legend,
          orient: this.legendPosition === 'left' || this.legendPosition === 'right' ? 'vertical' : 'horizontal',
          top: this.legendPosition === 'left' || this.legendPosition === 'right' ? 'center' : this.legendPosition,
          left: this.legendPosition === 'top' || this.legendPosition === 'bottom' ? 'center' : this.legendPosition,
        },
        series: series
      }

      if(this.chartData){
        if(this.chartData.length>1){
          for(var i=0;i<this.chartData[1].length;i++){
            data.push({
              name: this.chartData[0][i],
              value: this.chartData[1][i],
            })
          }
        }
      }

      series.push({
        type: this.type,
        data: data,
        radius: this.pieRadius,
        label:{
          show:true,
          formatter:'{d}%',
          position:'inside',
          textStyle:{
            color:'white'
          }
        }
      })

      myChart.setOption(option);
    },
    setRadar(myChart){
      var series = []
      var indicator = []

      var option ={
        color: this.color,
        title: {
          text: this.title,
          left: this.titlePosition,
          textStyle:{
            color:'white',
            fontWeight:"normal"
          }
        },
        tooltip: {
          
        },
        radar:{
          indicator:indicator,
          radius:this.pieRadius,
          shape: this.radarchoose===true ? 'circle':'polygon',
          name:{
            textStyle:{
              color:'white'
            }
          },
          axisLine:{
            lineStyle:{
              color:'#FFFFFF99',
              type:[5,5],
            }
          },
          splitLine:{
            lineStyle:{
              color:'#3EA2F4',
              width:'2'
            }
          },
          splitArea:{
            show:false
          }
        },
        legend: {
          textStyle:{
            color:'white'
          },
          data: this.legend,
          orient: this.legendPosition === 'left' || this.legendPosition === 'right' ? 'vertical' : 'horizontal',
          top: this.legendPosition === 'left' || this.legendPosition === 'right' ? 'center' : this.legendPosition,
          left: this.legendPosition === 'top' || this.legendPosition === 'bottom' ? 'center' : this.legendPosition,
        },
        series: series
      }

      if(this.chartData){
        if(this.chartData.length>1){
          for(var i=0;i<this.chartData[0].length;i++){
            indicator.push({
              name:this.chartData[0][i],
              max:this.chartData[1][i]
            })
          }
          
          for(var i=2;i<this.chartData.length;i++){
            option.series.push({
              type: 'radar',
              symbolSize:1,
              data:[
                {
                  value: this.chartData[i],
                  areaStyle:{
                    color:"#FFFFFF55"
                  }
                }
              ]
            })
          }
        }
      }

      myChart.setOption(option);
    },
    setLineOrBar(myChart){
      var series = []
    
      var option = {
        color: this.color,
        title: {
          text: this.title,
          left: this.titlePosition,
          textStyle:{
            color:'white',
            fontWeight:"normal"
          }
        },
        tooltip: {
          
        },
        legend: {
          textStyle:{
            color:'white'
          },
          data: this.legend,
          orient: this.legendPosition === 'left' || this.legendPosition === 'right' ? 'vertical' : 'horizontal',
          top: this.legendPosition === 'left' || this.legendPosition === 'right' ? 'center' : this.legendPosition,
          left: this.legendPosition === 'top' || this.legendPosition === 'bottom' ? 'center' : this.legendPosition,
        },
        xAxis: {
          data: this.dimension === 'x' ? this.chartData[0] : null,
          axisLabel:{
            textStyle:{
              color:'white'
            },
          },
          axisLine:{
            lineStyle:{
              color:'#3EA2F455',
              width:'2'
            }
          },
          splitLine:{
            lineStyle:{
              color:'#3EA2F455',
              width:'2'
            }
          }
        },
        yAxis: {
          data: this.dimension === 'y' ? this.chartData[0] : null,
          axisLabel:{
            textStyle:{
              color:'white'
            },
          },
          axisLine:{
            lineStyle:{
              color:'#3EA2F455',
              width:'2'
            }
          },
          splitLine:{
            lineStyle:{
              color:'#3EA2F455',
              width:'2'
            }
          }
        },
        dataZoom:[],
        series: series,
      }
      
      if(this.chartData){
        for(var i=1;i<this.chartData.length;i++){
          series.push({
            name: this.legend[i-1],
            type: this.type,
            data: this.chartData[i],
            barGap: '0%',
            barCategoryGap: '60%',
            label:{
              
              show:this.type==="line"? false:true,
              position:this.dimension==='x'?'top':'right',
              textStyle:{
                color:'white'
              }
              
            }
          })
        }
      }

      if(this.doubleAxis){
        if(this.dimension === 'x'){
          option.yAxis = [
            {
              type:'value',
              name:this.legend[0],
            },
            {
              type:'value',
              name:this.legend[1],
            }
          ]
          option.series[1].yAxisIndex = 1
        }else{
          option.xAxis = [
            {
              type:'value',
              name:this.legend[0],
            },
            {
              type:'value',
              name:this.legend[1],
            }
          ]
          option.series[1].xAxisIndex = 1
        }
      }

      if(this.dataZoom){
        if(this.dimension === 'x'){
          option.dataZoom.push(
            {
              type:'slider',
              show: true,
              xAxisIndex: 0,
              showDetail:false,
              height: 0
            },
            {
            type:'inside',
            xAxisIndex: 0
            }
          )
        }else{
          option.dataZoom.push(
            {
              type:'slider',
              show: true,
              yAxisIndex: 0,
              showDetail:false,
              left:"0%",
              right:"100%"
            },
            {
              type:'inside',
              yAxisIndex: 0
            }
          )
        }
      }
      myChart.setOption(option);
    },
    setData(myChart){
      //添加数据
      if(this.type === 'pie'){
        this.setPie(myChart)
      }else if(this.type === "radar"){
        this.setRadar(myChart)
      } else {
        this.setLineOrBar(myChart)
      } 
    },
  },
  watch: {
    chartData:{
      deep: true,
      handler (val) {
        this.setData(this.myChart)
      },
      // immediate: true
    },
    legend:{
      handler (val) {
        this.setData(this.myChart)
      },
    }
  },
  mounted () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById(this.id));
    this.myChart = myChart

    // 使用指定的配置项和数据显示图表。     
    this.setData(myChart)

    window.addEventListener("resize", function(){
      if(myChart){
        myChart.resize()
      }
    })
  }
}
</script>

<style scoped>

</style>