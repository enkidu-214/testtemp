<template>
  <div class="container">
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          v-for="item in subAddrs"
          :key="item.id"
          :to="{ path: item.to }"
          >{{ item.name }}</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <div class="info">
      <current class="current" :allInfo="doday"></current>
      <forecast class="forcast"></forecast>
    </div>
    <div class="map">
      <el-amap
        vid="amapDemo"
        ref="amap"
        :center="center"
        :zoom="zoom"
        class="amap-demo"
        :style="{ width: actualWidth, height: actualHeight }"
        style="light"
        :plugin="plugin"
        :events="events"
        :layers="layers"
      >
        <el-amap-marker
          v-for="marker in markers"
          :position="marker.position"
          :key="marker.index"
          :template="marker.template"
          :angle="marker.angle"
        ></el-amap-marker
      ></el-amap>
    </div>
    <div>图标类型</div>
    <div>区域</div>
  </div>
</template>

<script>
import current from "./component/current.vue";
import forecast from "./component/forecast.vue";

export default {
  components: {
    current,
    forecast,
  },
  data() {
    return {
      subAddrs: [
        {
          name: "广东省",
          to: "",
          id: 0,
        },
        {
          name: "珠海市",
          to: "",
          id: 1,
        },
        {
          name: "香洲区",
          to: "",
          id: 2,
        },
      ],
      doday: {
        temp: "10℃",
        humi: "20%",
      },
      over15Days: [{ key1: "", key2: "", key3: {}, key4: [] }, {}],
      markers: [
        {
          position: [1, 2],
          index: 0,
          tempalate: {},
          angle: 10,
        },
      ],
    };
  },
  mounted() {
    // TODO
  },
  methods: {
    add(a, b) {
      return a + b;
    },
    query(){
        let datas = [];
        for (let i =0; i < datas.length; ++i){
            this.markers.push_back({
                position: datas[i].position,
                index: datas[i].index
            })
        }
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  .info {
    display: flex;
    height: 260px;
    .current {
      width: 40%;
    }
    .forecast {
      width: 60%;
    }
  }
  .map {
    height: 100%;
  }
}
</style>