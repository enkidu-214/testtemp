<template>
    <div class="tool-container">
        <svg-icon  icon-class='people' @click="emitAreaClick" ></svg-icon>
        <svg-icon  icon-class='peoples' @click="emitLengthClick" ></svg-icon>
    </div>
</template>
<script>
import SvgIcon from '../../SvgIcon/SvgIcon.vue'
export default {
  components: { SvgIcon },
    
}
</script>

<style lang="scss" scoped>
.tool-container{
    border: 2px, solid, cornflowerblue;
    background-color: rgba($color: #000000, $alpha: 0.6);
}
</style>