<template>
  <div class="target_ctrl_panel">
    <div class="flex_div">
      <button @click="BtnClick" style="background-color: #008844;">显靶</button>
      <button @click="BtnClick" style="background-color: #AA3333;">隐靶</button>
    </div>
    <hr/>
    <div class="light_div">
      <p class="light_action">{{lightAction}}</p>
      <el-slider class="light_slider" @change="SliderChange"
        :min="0" :max="5" :step="1" v-model="selBrightness">
      </el-slider>
    </div>
    <hr/>
    <div class="flex_div">
      <div>
        <div>
          <button @click="BtnClick" style="background-color: #008844;">一档启动</button>
        </div>
        <div>
          <button @click="BtnClick" style="background-color: #008844;">二档启动</button>
        </div>
      </div>
      <button @click="BtnClick" style="background-color: orange;">靶车后退</button>
    </div>
    <div class="flex_div">
      <div>   
        <div>
          <button @click="BtnClick" style="background-color: #008844;">三档启动</button>
        </div>
        <div>
          <button @click="BtnClick" style="background-color: #008844;">四档启动</button>
        </div>
      </div>
      <button @click="BtnClick" style="background-color: #AA3333;">靶车停止</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TargetCtrlPanel',
  props:{
    shootingPlan:null,
  },
  data(){
    return{
      selBrightness:0,
      lightAction: "灭灯",
    }
  },
  methods:{
    SliderChange(val){
      this.selBrightness = val
      this.lightAction = val == 0?"灭灯":"开灯亮度"+val
    },
    BtnClick(){

    }
  }
}
</script>

<style scoped>
button{
  height: 60px;
  width: 120px;
  border: 1px solid #1199FF;
  border-radius: 5px;
  color:#F0F0F0;
  font-size: 15px;
  margin:1px;
}
button:hover{
  cursor: pointer;
  border: 1px solid white;
}
.target_ctrl_panel{
  width: 380px;
  background-color: #003057;
  border: 1px solid #1199FF;
  border-radius: 5px;
  padding: 10px;
  box-sizing: border-box;
}
.flex_div{
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.light_div{
  align-items: center;
  text-align: center;
  position: relative;
}
.light_action{
  color: white;
}
.light_slider{
  padding: 0px 30px;
}
</style>