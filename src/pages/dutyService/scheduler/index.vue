<template>
  <div class="control-container">
    <el-amap
      vid="amapDemo"
      ref="amap"
      :center="center"
      :zoom="zoom"
      class="amap-demo"
      :style="{ width: '1920px', height: '900px', padding: '0px', margin: '0px' }"
      style="light"
      :plugin="plugin"
      :events="events"
      :layers="layers"
      dragEnable: false
    >
      <el-amap-marker
        v-for="marker in markers"
        :position="marker.position"
        :key="marker.index"
        :angle="marker.angle"
        :draggable="marker.draggable"
        :events="marker.events"
        :content="marker.content"
        :extData="marker.extData"
      >
      <div class="mark-pin">
        <svg-icon class="mark-pin-img"
            :icon-class="marker.isSelected ?  marker.selectedIcon : marker.icon" />
        <p class="mark-pin-content" v-if="marker.type != 0">{{marker.index}}</p>
        <button class="mark-pin-close" v-if="marker.type != 0" @click="deleteMark(marker)">x</button>
      </div>
      </el-amap-marker>
      <el-amap-polygon
        v-for="polygon in polygons"
        :key="polygon.index"
        :visible="polygon.visible"
        :path="polygon.path"
        :editable="polygon.editable"
        :strokeColor="polygon.strokeColor"
        :draggable="polygon.draggable"
        :fillColor="polygon.fillColor"
        :extData="polygon.extData"
        zIndex=110
      ></el-amap-polygon>
      <el-amap-polyline
        v-for="polyline in polylines"
        :key="polyline.index"
        :visible="polyline.visible"
        :path="polyline.path"
        :editable="polyline.editable"
        :outlineColor="polyline.outlineColor"
        :strokeColor="polyline.strokeColor"
        :strokeWeight="polyline.strokeWeight"
        :strokeStyle="polyline.strokeStyle"
        :isOutline="polyline.isOutline"
        :lineJoin="polyline.lineJoin"
        :strokeDasharray="polyline.strokeDasharray"
        :extData="polyline.extData"
        zIndex=120
        :fillColor="polyline.fillColor">
      </el-amap-polyline>
      <el-amap-bezier-curve 
        v-for="curve in bezierLines" 
         zIndex=130
        :key="curve.index"
        :events="curve.events" 
        :path="curve.path" 
        :stroke-color="curve.strokeColor" 
        :stroke-style="curve.strokeStyle" 
        :stroke-opacity="curve.strokeOpacity"
        :extData="curve.extData">
      </el-amap-bezier-curve>
      <el-amap-info-window
        v-if="window"
        :position="window.position"
        :visible="window.visible"
        :content="window.content"
      ></el-amap-info-window>
    </el-amap>
    <line-schedule-panel
      class="panel"
      :lines="lines"
      @onChangePointType="changePointType"
      @onSaveLine="saveLine"
      @setAddMode="setMode"
      @onOpenLayer="openLayer"
      @onMesure="mesure"
      @onApplyTask="applyTask"
    ></line-schedule-panel>
    <line-points
      class="points"
      :points="markers"
      @movePointUpEvent="movePointUp"
      @movePointDownEvent="movePointDown"
      @deletePointEvent="deleteMark"
    ></line-points>
  </div>
</template>

<script>
import lineSchedulePanel from "./component/lineSchedulePanel.vue";
import linePoints from "./component/linePoints.vue";
import amap from "../../../components/amap/index.vue";
import SvgIcon from "../../../components/SvgIcon/SvgIcon.vue";

export default {
  components: {
    lineSchedulePanel,
    linePoints,
    amap,
    SvgIcon,
  },
  data() {
    const self = this;
    return {
      zoom: 10,
      center: [121.59996, 31.197646],

      window: "",
      searchOption: {
        city: "上海",
        citylimit: true,
      },
      linePoints: [],
      lng: 0,
      lat: 0,
      // map mark op mode
      mode: 1,
      layers: [],

      // mark index
      nodeIdx: 0,

      mapConfigVisibal: "none",
      mapLayerVisibal: "none",
      mapToolVisibal: "none",
      mapSearchVisibal: "none",
      plugin: [
        "AMap.Autocomplete",
        "AMap.PlaceSearch",
        "AMap.Scale",
        "AMap.OverView",
        //"AMap.ToolBar",
        "AMap.MapType",
        "AMap.PolyEditor",
        "AMap.CircleEditor",
        "Geocoder",
      ],
      events: {
        click(e) {
          console.log("Enter click event, mode = " + self.mode);
          if (self.mode === 0) return;

          let { lng, lat } = e.lnglat;
          self.lng = lng;
          self.lat = lat;

          if (self.mode === 1) {
            // add tool points
            console.log("linePoints length = " + self.linePoints.length);
            let type = self.nodeIdx === 0 ? 0 : 1;
            self.markers.push({
              index: self.nodeIdx,
              // display attrs
              position: [lng, lat],
              draggable: true,
              raiseOnDrag: true,
              icon: self.nodeIdx === 0 ? "eye" : "edit",
              selectedIcon: self.nodeIdx === 0 ? "edit" : "eye",
              extData: self.nodeIdx++,
              type: type,
              isSelected: false,
              // db attrs

              events: {
                dragend(m) {
                  // find market and update market's position
                  let mark = self.getMarkByExtData(self, m.target.getExtData());

                  if (mark === null || m === "undefined") return;

                  mark.position = [m.lnglat.lng, m.lnglat.lat];

                  // redraw line
                  self.updatePolyLineByMark(self, mark);
                },
                click(m) {
                  if (self.mode === 2) {
                    // TODO: update marker's isSelected flag

                    let mark = self.getMarkByExtData(
                      self,
                      m.target.getExtData()
                    );
                    mark.isSelected = !mark.isSelected;
                  }
                },
              },
            });

            self.genPolyLineByAllMark(self);
          }
        },
        rightclick(e) {
          // cancel add point
          self.mode = 0;
        },
      },
      // mark list
      markers: [],
      // poligon list
      polygons: [],
      // poliline list
      polylines: [],
      // bezier-curve line
      bezierLines: [],

      // all lines, type is AirRoute
      lines: [
        {
          index: 1,
          name: "线路1",
          taskType: "检修",
        },
        {
          index: 2,
          name: "线路2",
          taskType: "检修",
        },
        {
          index: 3,
          name: "线路3",
          taskType: "检修",
        },
        {
          index: 4,
          name: "线路4",
          taskType: "检修",
        },
      ],
      // current edit line
      line: {},
      // current line points list, type is AirPointInfo[]
      points: [],
      // current edit point, type is AirPointInfo
      point: {},
      // sentry return point
      returnPoint: {},
    };
  },
  updated() {
    // when mark added or moved, update length and area
    this.updateMaskCaculate();
  },
  methods: {
    // map mark edit
    deleteMark(mark) {
      //remove mark from list

      let newIdx = 0;
      for (let pos in this.markers) {
        if (this.markers[pos].index === mark.index) {
          this.markers.splice(pos, 1);
          break;
        }
      }

      for (let pos in this.markers) {
        this.markers[pos].index = newIdx++;
      }

      this.nodeIdx = this.markers.length;

      this.markers.sort((a, b) => a.index - b.index);

      // redraw line
      this.genPolyLineByAllMark(this);
    },
    getMarkByExtData(self, extData) {
      for (let m of self.markers) {
        if (m.extData === extData) return m;
      }

      return null;
    },
    genPolyLine(type, idx, start, end) {
      let line = {
        index: idx,
        visible: true,
        editable: false,
        path: [start.position, end.position],
        strokeColor: "green",
        strokeWeight: 3,
        strokeStyle: "solid",
        extData: idx,
        start: start,
        end: end,
      };

      if (type === "flag") {
        line.strokeColor = "red";
        line.strokeStyle = "dashed";
      }

      return line;
    },
    genBeaizlPoints(s, e) {
      /*
            贝塞尔曲线表示方式：
            [
                [ [lng,lat] ],//起点0
                [ [lng,lat] , [lng,lat] ],//控制点、途经点1
                [ [lng,lat] , [lng,lat] , [lng,lat]],//控制点、控制点、途经点2
                [ [lng,lat] , [lng,lat] ]//控制点、途经点3
            ]
            所有贝塞尔添加点都向着向量的右侧添加，基于此原理，添加贝塞尔曲线控制点时存在四种情况
            令起点为(x1, y1), 终点为(x2, y2)
            若x2 > x1 && y2 > y1, 向量角度在第一象限，控制点为(x1, y2)
            若x2 > x1 && y2 < y1, 向量角度在第二象限，控制点为(x2, y1)
            若x2 < x1 && y2 < y1, 向量角度在第三象限，控制点为(x1, y2)
            若x2 < x1 && y2 > y1, 向量角度在第四象限，控制点为(x2, y1)
        */
      if ((e[0] > s[0] && e[1] > s[1]) || (e[0] < s[0] && e[1] < s[1])) {
        return [[s], [[s[0], e[1]], e]];
      } else {
        return [s, [[e[0], s[1]], e]];
      }
    },
    genBezialLine(self, type, idx, start, end) {
      let points = self.genBeaizlPoints(start.position, end.position);

      let line = {
        index: idx,
        visible: true,
        path: points,
        strokeColor: "green",
        strokeWeight: 3,
        strokeStyle: "solid",
        extData: idx,
        start: start,
        end: end,
      };

      if (type === "flag") {
        line.strokeColor = "red";
        line.strokeStyle = "dashed";
      }

      return line;
    },
    updatePolyLineByMark(self, mark) {
      self.polylines.splice(0, self.polylines.length);

      // FIXME: find witch lines is use this mark
      self.genPolyLineByAllMark(self);
    },
    genPolyLineByAllMark(self) {
      if (self.markers.length > 1) {
        self.polylines.splice(0, self.polylines.length);
        self.bezierLines.splice(0, self.bezierLines.length);

        // draw line
        let dashLine = false;
        let lastM = {};
        let idx = 0;
        let points = [];

        for (let m of self.markers) {
          if (idx === 0) {
            dashLine = true;
            lastM = m;
            idx++;
            continue;
          }

          // add all point to draw line
          points.push(m.position);

          if (dashLine) {
            // add first line
            self.polylines.push(self.genPolyLine("flag", idx, lastM, m));
            dashLine = false;
          } else {
            // add inner line
            // self.polylines.push(self.genPolyLine("pin", idx, lastM, m));
            // add bezierl line
            self.bezierLines.push(
              self.genBezialLine(self, "pin", idx, lastM, m)
            );
          }
          lastM = m;
          idx++;
        }

        // close the line
        if (idx > 1) {
          self.polylines.push(
            self.genPolyLine("flag", idx, lastM, self.markers[0])
          );
        }
      }
    },
    updateMaskCaculate() {
      // 1、获取所有覆盖物，记录索引对应的类型
      // this.$refs.amap.$$getInstance().getAllOverlays()
      // CLASS_NAME: "AMap.Polyline" /  "AMap.Polygen" / "AMap.Marker" / "AMap.BezierCurve"

      // 2、根据overlay的序号查询this.$refs.amap.$children的extdata，匹配到对应的覆盖物，获取其长度或者面积

      let overlays = this.$refs.amap.$$getInstance().getAllOverlays();
      for (let ovIdx in overlays) {
        if (overlays[ovIdx].CLASS_NAME === "AMap.Polyline") {
          let extData = this.$refs.amap.$children[ovIdx]
            .$$getInstance()
            .getExtData();
          let length = this.$refs.amap.$children[ovIdx]
            .$$getInstance()
            .getLength();
          console.log("Got polyline " + ovIdx + ", length =" + length);

          // update Polyline's length param
          for (let line of this.polylines) {
            if (extData === line.extData) {
              line.length = length;
            }
          }
        } else if (overlays[ovIdx].CLASS_NAME === "AMap.polygon") {
          let extData = this.$refs.amap.$children[ovIdx]
            .$$getInstance()
            .getExtData();
          let area = this.$refs.amap.$children[ovIdx].$$getInstance().getArea();
          console.log("Got polygon " + ovIdx + ", length =" + length);
          // update Polygen's area param
          for (let gon of this.polygons) {
            if (extData === gon.extData) {
              gon.area = length;
            }
          }
        } else if (overlays[ovIdx].CLASS_NAME === "AMap.BezierCurve") {
          let extData = this.$refs.amap.$children[ovIdx]
            .$$getInstance()
            .getExtData();
          let length = this.$refs.amap.$children[ovIdx]
            .$$getInstance()
            .getLength();
          console.log("Got BezierCurve " + ovIdx + ", length =" + length);
          // update BezierCurve's length param
          for (let bez of this.bezierLines) {
            if (extData === bez.extData) {
              bez.length = length;
            }
          }
        }
      }
    },
    // end map mark edit

    // begin air line edit
    movePointUp(point) {
      for (let p in this.markers) {
        if (this.markers[p].index === point.index) {
          // move first point up, do nothing
          if (p === 0) return;
          this.markers[p - 1].index = p;
          this.markers[p].index = p - 1;
        }
      }
      this.markers.sort((a, b) => a.index - b.index);

      this.genPolyLineByAllMark(this);
    },
    movePointDown(point) {
      for (let p in this.markers) {
        if (this.markers[p].index === point.index) {
          // move last point down, do nothing
          if (p === this.markers.length) return;
          this.markers[parseInt(p) + 1].index = p;
          this.markers[p].index = p + 1;
        }
      }
      this.markers.sort((a, b) => a.index - b.index);

      this.genPolyLineByAllMark(this);
    },
    changePointType(type) {
      // TODO: change current node type
    },
    saveLine(line) {
      console.log("Save this line");
      // TODO: save current line
    },
    setMode() {
      if (this.mode === 1){
        this.mode = 2;
      }
      else if (this.mode === 2){
        this.mode = 1;
      }
    },
    applyTask(line) {
      // TODO: goto task page
      debugger
      this.$router.push('/dutyService/task')
    },
    mesure(flag) {
      if (flag) {
        // begin mesure
      } else {
        // end mesure
      }
    },
    openLayer() {
      // TODO: open map layer
    },
    // end air line edit
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
.control-container {
  display: flex;
  position: absolute;
  left: 200px;
  .panel {
    position: absolute;
    float: left;
    left: 1px;
    top: 1px;
    background-color: white;
    border: 1px wheat solid;
  }
  .points {
    position: absolute;
    width: 50%;
    bottom: 70px;
    left: 25%;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    border: 1px wheat solid;
  }
}

.mark-pin {
  display: flex;
  position: absolute;
  .mark-pin-img {
    width: 40px;
    height: 50px;
  }
  .mark-pin-content {
    position: absolute;
    top: 5px;
    left: 10px;
    margin: 0px;
    color: red;
  }
  .mark-pin-close {
    position: absolute;
    top: 1px;
    right: 1px;
    margin: 0px;
    color: red;
    padding: 0px;
  }
}
</style>
