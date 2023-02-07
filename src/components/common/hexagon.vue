<template>
  <div>
    <div
      :style="{
        position: 'absolute',
        '--color': fillColor,
      }"
      class="hexagon"
      :class="{ one: rotate, two: !rotate }"
    ></div>

    <div
      class="content"
      :style="{
        '--color': contentColor,
      }"
    >
      {{ header }}<br />
      {{ content }}
    </div>
  </div>
</template>

<script>
export default {
  props: ["fillColor", "header", "contentColor", "content", "rotate"],
};
</script>

<style lang="scss" scoped>
.one {
  transition: all 2s;
}
.two {
  transform: rotate(180deg);
  transition: all 2s;
}

$six-side-len: 30px;
$six-cross-len: 51.96px; // width * sin (60) * 2
$six-side-half-len: 15px;
$six-cross-half-len: 25.88px;

.hexagon {
  position: relative;
  width: $six-side-len;
  height: $six-cross-len;
  margin: $six-side-len auto;
  background-color: var(--color);
}
.hexagon:before {
  content: "";
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  right: $six-side-len;
  border-width: $six-cross-half-len $six-side-half-len;
  border-style: solid;
  border-color: transparent var(--color) transparent transparent;
}
.hexagon:after {
  content: "";
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  left: $six-side-len;
  border-width: $six-cross-half-len $six-side-half-len;
  border-style: solid;
  border-color: transparent transparent transparent var(--color);
  top: 0;
}

.content {
  position: absolute;
  width: 30px;
  font-size: 10px;
  margin: 45px 0px;
  color: var(--color);
}
</style>