import Vue from "vue";
import Vuex from "vuex";
import calculationAmount from "./modules/calculationAmount/calculationAmount";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    calculationAmount,
  },
});
