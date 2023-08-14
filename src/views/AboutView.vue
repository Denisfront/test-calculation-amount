<template>
  <div class="about">
    <h1>Бeз Vuex</h1>
    <CalculationAmountWithoutVuex />
  </div>
</template>

<script>
import CalculationAmountWithoutVuex from "@/components/CalculationAmountWithoutVuex.vue";

export default {
  name: "AboutView",
  components: {
    CalculationAmountWithoutVuex,
  },
};
</script>
