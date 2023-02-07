<template>
  <div class="person_target_report">
    <div class="pie_panel">
      <div class="pie_div">
        <!-- <p>训练科目分布</p> -->
        <chart-item
          type="pie"
          id="person_subject_pie"
          title="训练科目分布"
          :chartData="subjectSource"
          :legend="subjectLegend"
          pieRadius="70%"
        ></chart-item>
        <!-- <p>无数据</p> -->
      </div>
      <div class="person_info_div">
        <p class="title">人员基本信息</p>
        <img class="person_photo" src="../../../assets/人员_半身.png" />
        <p class="title" style="color: orange">{{ person.name }}</p>
        <p class="person_info">编号：{{ person.personNum }}</p>
        <p class="person_info">单位：{{ person.organization }}</p>
        <p class="person_info">专业：{{ person.position }}</p>
        <p class="person_info">军衔：{{ person.militaryRank }}</p>
      </div>
    </div>
    <div class="chart_panel">
      <div class="show_pic_div" v-if="showPic">
        <div class="top_div">
          <p class="plan_title">{{ selectPlan }}</p>
          <button class="back_btn" @click="BackBtnClick">
            <img
              src="../../../assets/B_Return.png"
              style="width: 24px; height: 24px"
            />返回
          </button>
        </div>
        <div class="round_btns">
          <el-radio-group v-model="selectRound">
            <el-radio-button
              class="round_btn"
              v-for="(item, index) in roundSelectSource"
              :key="index"
              @click="ChooseRound(item)"
              :label="item"
              >{{ item }}
            </el-radio-button>
          </el-radio-group>
        </div>
        <div class="pointing_jitter_div" style="">
          <chart-item
            type="bar"
            id="person_pointing_jitter"
            title="射击稳定度"
            :titlePosition="center"
            :chartData="pointingSource"
            :legend="pointingLegend"
          ></chart-item>
        </div>
        <div class="pic_div">
          <div class="setting_panel">
            <div class="setting_div">
              <p class="gun_id">射击序号 &nbsp; {{ gunIdx }}</p>
              <button class="last_btn" @click="LastBtnClick">
                <img src="../../../assets/Arrow_Up.png" />上一枪
              </button>
              <button class="next_btn" @click="NextBtnClick">
                <img src="../../../assets/Arrow_Down.png" />下一枪
              </button>
              <el-checkbox v-model="isPic" class="setting_check"
                >显示图片</el-checkbox
              >
              <el-checkbox v-model="isDensity" class="setting_check"
                >散布中心</el-checkbox
              >
              <p>散布密集度 &nbsp; {{ density }}</p>
              <el-slider
                class="density_slider"
                :min="0"
                :max="1"
                :step="0.01"
                v-model="density"
              >
              </el-slider>
            </div>
          </div>
          <div class="target_panel">
            <img class="real_Pic" v-if="isPic" />
            <target-data
              id="target_data2"
              v-else
              :density="density"
              :isDensity="isDensity"
              :shootingResultRecord="shootingResults"
              :shootingIdx="gunIdx"
              :shootingRoundRecord="shootingRoundRecord"
            ></target-data>
          </div>
        </div>
      </div>
      <div class="charts" v-else>
        <div class="subject_div">
          训练科目：
          <el-radio-group v-model="selectSubject">
            <el-radio-button
              class="subject_btn"
              v-for="(item, index) in subjectSelectSource"
              :key="index"
              @click="ChooseSubject(item)"
              :label="item"
              >{{ item }}
            </el-radio-button>
          </el-radio-group>
        </div>
        <div class="chart_div" style="background-color: #1198ff3a">
          <div style="width: calc(100% / 2)">
            <div class="person_average_score_history_div">
              <chart-item
                type="bar"
                id="person_average_score_history_bar"
                title="科目平均环数历史趋势图"
                :chartData="averageScoreHistory"
              ></chart-item>
            </div>
            <div class="plan_btns">
              <el-radio-group v-model="selectPlan">
                <el-radio-button
                  class="plan_btn"
                  v-for="(item, index) in planSelectSource"
                  :key="index"
                  @click="ChoosePlan(item)"
                  :label="item"
                  >{{ item }}
                </el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div style="width: calc(100% / 4)">
            <chart-item
              type="radar"
              id="person_score_radar"
              title="科目成绩"
              :chartData="personScoreAreaSource"
            ></chart-item>
          </div>
          <div class="seprarte_div"></div>
          <div class="weather_div">
            <div class="weather_title_div">
              <img
                class="weather_title"
                src="../../../assets/PageIcon_天气情况记录.png"
              />
              气象信息
            </div>
            <div class="weather_air_div">
              <img
                class="weather_air"
                src="../../../assets/AirPressure_Normal.png"
              />
              气压：998 hPa
            </div>
            <div class="weather_humidity_div">
              <img
                class="weather_humidity"
                src="../../../assets/Humidity2_Normal.png"
              />
              湿度：94 %
            </div>
            <div class="weather_temp_div">
              <img
                class="weather_temp"
                src="../../../assets/Temp2_Normal.png"
              />
              温度：15 ℃
            </div>
            <div class="weather_winddirect_div">
              <img
                class="weather_winddirect"
                src="../../../assets/WindDirection_Normal.png"
              />
              风向：西北风
            </div>
            <div class="weather_windspeed_div">
              <img
                class="weather_windspeed"
                src="../../../assets/WindSpeed_Normal.png"
              />
              风速：4.2 m/s
            </div>
          </div>
        </div>
        <div class="chart_div">
          <div style="width: calc(2 * 100% / 4)">
            <div class="round_score_div">
              <chart-item
                type="bar"
                id="round_score_bar"
                title="每轮环数趋势图"
                :chartData="roundSource"
              ></chart-item>
            </div>
            <div class="round_btns">
              <el-radio-group v-model="selectRound">
                <el-radio-button
                  class="round_btn"
                  v-for="(item, index) in roundSelectSource"
                  :key="index"
                  @click="ChooseRound(item)"
                  :label="item"
                  >{{ item }}
                </el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div style="width: calc(100% / 4)">
            <chart-item
              type="radar"
              id="plan_score_area_radar"
              title="选中训练计划成绩"
              :chartData="planScoreAreaSource"
            ></chart-item>
          </div>
          <div style="width: calc(100% / 4)">
            <chart-item
              type="radar"
              :radarchoose="false"
              id="shooter-ability-table"
              title="射手能力表"
              :chartData="shooterAbilitySource"
            ></chart-item>
          </div>
        </div>
        <div class="chart_div" style="background-color: #1198ff3a">
          <div style="width: 25%">
            <p class="title">靶面数据和射击稳定度</p>
            <button class="target_data_btn" @click="ShowPicClick">
              <target-data
                id="target_data1"
                :shootingResultRecord="shootingResults"
                :shootingRoundRecord="shootingRoundRecord"
              ></target-data>
            </button>
          </div>
          <div style="width: 50%">
            <chart-item
              type="line"
              id="person_body_line"
              title="人员生理数据"
              :chartData="personBodySource"
              :legend="personBodyLegend"
            ></chart-item>
          </div>
          <div style="width: 25%">
            <p class="title">训练结果</p>
            <div class="train_result">
              {{ resultDesc1 }}<br>{{resultDesc2}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import targetData from "../component/targetData.vue";
import chartItem from "../component/chartItem.vue";
export default {
  components: { targetData, chartItem },
  props: {
    person: null,
    startTime: "",
    endTime: "",
  },
  data() {
    return {
      showPic: false,
      gunIdx: 1,
      isPic: false,
      isDensity: true,
      density: 0.28,
      subjectSource: [["精度射击"], [1]],
      subjectLegend: [],
      subjectSelectSource: ["精度射击"],
      selectSubject: null,
      averageScoreHistory: [
        ["训练计划1", "训练计划2", "训练计划3"],
        [8.1, 6.5, 4.0],
      ],
      planSelectSource: ["训练计划1", "训练计划2", "训练计划3"],
      selectPlan: null,
      personScoreAreaSource: [
        ["命中率", "得分率", "参训率", "合格率", "优秀率"],
        [1, 1, 1, 1, 1],
        [1, 0.8, 0.4, 0.2, 0],
      ],
      roundSource: [
        ["第1轮", "第2轮", "第3轮"],
        [22, 61, 10],
      ],
      roundSelectSource: ["第1轮", "第2轮", "第3轮"],
      selectRound: null,
      pointingSource: [
        ["第一枪", "第二枪", "第三枪", "第四枪", "第五枪", "第六枪"],
        [3.7, 3.9, 3.8, 4.2, 4.0, 3.8, 4.3],
        [27.6, 26.6, 25.7, 24.1, 27.3, 26.4],
      ],
      pointingLegend: ["射击前", "射击后"],
      planScoreAreaSource: [
        ["命中率", "得分率", "参训率", "合格率", "优秀率"],
        [10, 10, 10, 10, 10],
        [1, 8, 4, 2, 0],
      ],
      shooterAbilitySource: [
        ["射击得分率", "持枪稳定性", "成绩稳定性", "弹孔集中度", "身体状态"],
        [100, 100, 100, 100, 100],
        [82, 78, 72, 63, 85],
      ],
      personBodySource: [
        ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"],
        [73, 75, 78, 81, 112, 119, 115, 108, 97, 96],
        [36.4, 36.5, 36.5, 36.8, 36.8, 36.7, 36.6, 36.5, 36.6, 36.5],
        [72, 73, 74, 77, 75, 80, 81, 82, 79, 78],
        [100, 101, 98, 103, 110, 111, 108, 106, 105, 103],
      ],
      personBodyLegend: ["心率", "体温", "舒张压", "收缩压"],
      resultDesc1:
        "本轮次射击结果：散布中心环数为6.5环，散布方向为90。" +
        "平均环数为8.0环，最高环数为10.0环，最低环数为6.5环。命中率为100.0%，综合评分为合格。",
      resultDesc2:
        "生理信息：正常",
      shootingRoundRecord: {
        id: 1,
        planId: 1,
        planName: "",
        subjectId: 1,
        targetIdx: 1,
        targetType: "Precision",
        targetModelId: 1,
        roundIdx: 1,
        personId: 1,
        personName: "测试1",
        orgId: 1,
        shootCount: 10,
        hitCount: 10,
        code: 100,
        aveCode: 10,
        disCenterX: 0.5,
        disCenterY: 0.5,
        disCode: 10,
        disDirection: 8,
        density: 0.28,
        densityBd: 0.49,
        picPath: "",
      },
      shootingResults: [
        {
          id: 1,
          planId: 1,
          roundIdx: 1,
          targetIdx: 1,
          targetType: "Precision",
          personId: 1,
          shootingGesture: "",
          shootingIdx: 1,
          isHit: true,
          isSelect: false,
          code: 8,
          direction: 6,
          x: 0.6392,
          y: 0.7387,
        },
        {
          id: 1,
          planId: 1,
          roundIdx: 1,
          targetIdx: 1,
          targetType: "Precision",
          personId: 1,
          shootingGesture: "",
          shootingIdx: 1,
          isHit: true,
          isSelect: false,
          code: 8,
          direction: 2,
          x: 0.1203,
          y: 0.3391,
        },
        {
          id: 1,
          planId: 1,
          roundIdx: 1,
          targetIdx: 1,
          targetType: "Precision",
          personId: 1,
          shootingGesture: "",
          shootingIdx: 1,
          isHit: true,
          isSelect: false,
          code: 9,
          direction: 1,
          x: 0.5,
          y: 0.3999,
        },
        {
          id: 1,
          planId: 1,
          roundIdx: 1,
          targetIdx: 1,
          targetType: "Precision",
          personId: 1,
          shootingGesture: "",
          shootingIdx: 1,
          isHit: true,
          isSelect: false,
          code: 10,
          direction: 8,
          x: 0.5,
          y: 0.6,
        },
        {
          id: 1,
          planId: 1,
          roundIdx: 1,
          targetIdx: 1,
          targetType: "Precision",
          personId: 1,
          shootingGesture: "",
          shootingIdx: 1,
          isHit: true,
          isSelect: false,
          code: 7,
          direction: 8,
          x: 0.9057,
          y: 0.243,
        },
        {
          id: 1,
          planId: 1,
          roundIdx: 1,
          targetIdx: 1,
          targetType: "Precision",
          personId: 1,
          shootingGesture: "",
          shootingIdx: 1,
          isHit: true,
          isSelect: false,
          code: 7,
          direction: 4,
          x: 0.915,
          y: 0.834,
        },
      ],
    };
  },
  computed: {
    timeRange() {
      const { startTime, endTime } = this;
      return {
        startTime,
        endTime,
      };
    },
  },
  watch: {
    timeRange(val) {
      this.QueryData();
    },
  },
  mounted() {
    this.QueryData();
  },
  methods: {
    QueryData() {
      //根据时间查询数据
      this.selectSubject = this.subjectSelectSource[0];
      this.selectPlan = this.planSelectSource[0];
      this.selectRound = this.roundSelectSource[0];
      this.subjectLegend = this.subjectSource[0];
    },
    ChooseSubject(item) {
      this.selectSubject = item;
      this.RefreshSubjectData(item);
    },
    RefreshSubjectData(item) {
      //切换训练科目后刷新数据
    },
    ChoosePlan(item) {
      this.selectPlan = item;
    },
    RefreshSelectPlan() {
      //切换所选计划后刷新数据
    },
    ChooseRound(item) {
      this.selectRound = item;
    },
    RefreshSelectRound() {
      //切换所选轮次后刷新数据
    },
    ShowPicClick() {
      this.showPic = true;
    },
    BackBtnClick() {
      this.showPic = false;
    },
    LastBtnClick() {
      //上一枪
      if (!this.shootingResults || this.gunIdx <= 1) {
        return;
      } else {
        this.gunIdx--;
      }
    },
    NextBtnClick() {
      //下一枪
      if (!this.shootingResults || this.gunIdx >= this.shootingResults.length) {
        return;
      } else {
        this.gunIdx++;
      }
    },
  },
};
</script>

<style>
.setting_check {
  margin: 15px 0px;
  display: block;
}
.setting_check .el-checkbox__label {
  color: white;
  font-size: 17px;
}
.setting_check .el-checkbox__input.is-checked + .el-checkbox__label {
  color: white;
}
.person_target_report .el-radio-button__inner {
  width: auto;
  height: 30px;
  color: white;
  border-radius: 5px !important;
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
.person_target_report {
  display: flex;
  height: 100%;
  width: 100%;
  color: white;
  background-color: #153652;
}
.pie_panel {
  width: 300px;
  border-right: 2px solid #e0e0e03f;
  height: 100%;
}
.chart_panel {
  width: calc(100% - 300px);
  height: 100%;
}
.pie_div {
  text-align: center;
  align-items: center;
  width: calc(100% - 20px);
  height: calc((100% - 30px) / 2);
  border: 2px solid #3ea2f4b0;
  margin: 10px;
  padding: 10px;
}
.seprarte_div {
  width: 5%;
}
.weather_div {
  text-align: center;
  align-items: center;
  background-color: #031824;
  border: 2px solid #3ea2f4b0;
  border-radius: 8px;
  margin: 0px 10px 0px 10px;
  width: 15%;
}
.weather_title_div {
  background-color: #2b405f;
  padding: 5px;
  border-radius: 5px;
}
.weather_title {
  width: 12%;
  vertical-align: middle;
}
.weather_air_div{
  text-align:left;
  padding: 12px 5px 6px 20px;
}
.weather_air{
  width: 9%;
  vertical-align: middle;
}
.weather_humidity_div{
  text-align:left;
  padding: 6px 5px 6px 20px;
}
.weather_humidity{
  width: 12%;
  vertical-align: middle;
}
.weather_temp_div{
  text-align:left;
  padding: 6px 5px 6px 20px;
}
.weather_temp{
  width: 12%;
  vertical-align: middle;
}
.weather_winddirect_div{
  text-align:left;
  padding: 6px 5px 6px 20px;
}
.weather_winddirect{
  width: 12%;
  vertical-align: middle;
}
.weather_windspeed_div{
  text-align:left;
  padding: 6px 5px 6px 20px;
}
.weather_windspeed{
  width: 12%;
  vertical-align: middle;
}
.person_info_div {
  overflow: scroll;
  text-align: center;
  align-items: center;
  width: calc(100% - 20px);
  height: calc((100% - 30px) / 2);
  border: 2px solid #3ea2f4b0;
  margin: 10px;
  padding: 10px;
}
.person_info {
  font-size: 16px;
  margin: 10px;
}
.person_photo {
  width: 50%;
  border: 1px solid #3ea2f4b0;
  border-radius: 2px;
  margin: 5px;
}
.charts {
  width: 100%;
  height: 100%;
}
.subject_div {
  width: 100%;
  height: 40px;
  padding: 10px;
  display: flex;
  align-items: center;
}
.chart_div {
  display: flex;
  width: 100%;
  height: calc((100% - 40px) / 3);
  padding: 10px;
}
.plan_btns,
.round_btns {
  width: 100%;
  height: 40px;
  border: 1px solid #1199ff;
  border-radius: 5px;
  background-color: #03182493;
  display: flex;
  align-items: center;
  padding: 10px;
  overflow: scroll;
}
.person_average_score_history_div {
  height: calc(100% - 40px);
}
.round_score_div {
  height: calc(100% - 40px);
}
.target_data_btn {
  width: 100%;
  height: calc(100% - 40px);
  background-color: #00000000;
  border: 2px solid #1198ff8a;
}
.train_result {
  width: 100%;
  height: calc(100% - 40px);
  border: 2px solid #1198ff8a;
  border-radius: 5px;
  background-color: #03182493;
  padding: 10px;
  line-height: 1.5em;
  overflow: scroll;
  text-align: left;
  word-break: break-all;
  white-space: normal;
  word-wrap: break-word;
}
.title {
  font-size: 19px;
}
button:hover {
  cursor: pointer;
}
p {
  text-align: center;
  margin: 5px;
}
.show_pic_div {
  width: 100%;
  height: 100%;
}
.top_div {
  width: 100%;
  height: 60px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.plan_title {
  font-size: 20px;
}
.back_btn {
  position: absolute;
  right: 1%;
  border: 1px solid #1199ff;
  border-radius: 5px;
  background-color: #aa3333;
}
.show_pic_div button {
  color: #f0f0f0;
  font-size: 17px;
  padding: 4px 7px;
  display: flex;
  align-items: center;
}
.show_pic_div button img {
  width: 24px;
  margin: 2px;
}
.pointing_jitter_div {
  height: 30%;
  width: 100%;
  margin: 15px 0px 0px 0px;
}
.pic_div {
  height: calc(70% - 115px);
  width: 100%;
  display: flex;
}
.setting_panel {
  width: 35%;
  height: 100%;
  position: relative;
}
.setting_div {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: left;
}
.setting_div p {
  text-align: left;
  margin: 15px 0px;
}
.last_btn,
.next_btn {
  margin: 10px 0px;
  width: 130px;
  background-color: #003057;
  border: 1px solid #1199ff;
  border-radius: 5px;
  justify-content: center;
}
.target_panel {
  width: 65%;
  height: 100%;
  align-items: center;
  padding: 20px;
}
</style>