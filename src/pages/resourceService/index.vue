<template>
  <div>

  </div>
</template>

<script>
import user from "./children/user.vue";
import syscfg from "./children/syscfg.vue";
import team from "./children/team.vue";
import sentry from "./children/sentry.vue";
import nacelle from './children/nacelle.vue'

export default {
  data() {
    return {
      activeName: "first",
    };
  },
  components: {
    user,
    team,
    sentry,
    nacelle,
    syscfg,
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>