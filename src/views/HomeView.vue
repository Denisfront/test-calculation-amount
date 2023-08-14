<template>
  <div class="home">
    <h1>С Vuex</h1>
    <CalculationAmountWithVuex />
  </div>
</template>

<script>
import CalculationAmountWithVuex from "@/components/CalculationAmountWithVuex.vue";

export default {
  name: "HomeView",
  components: {
    CalculationAmountWithVuex,
  },
};
</script>
