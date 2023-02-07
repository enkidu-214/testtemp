<template>
  <div class="footer">footer</div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {
    ...mapState(["geohash"]),
  },
  methods: {
    gotoAddress(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/mixin";

.footer{
  
}

</style>
