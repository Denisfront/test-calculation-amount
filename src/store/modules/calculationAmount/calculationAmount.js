import * as moduleTypes from "@/store/modules/calculationAmount/calculationAmount.types";
import { generateNumber } from "@/shared/lib/common";
import { saveStorageItem, loadStorageItem, removeStorageItem } from "@/shared/services/storage";

export default {
  namespaced: true,

  state: {
    localStorageData: loadStorageItem("payload") || {},
    events: [],
  },
  getters: {},
  mutations: {
    [moduleTypes.CHANGE_EVENT]: (state, event) => {
      state.events = [event, ...state.events];
    },
    [moduleTypes.CHANGE_EVENTS]: (state, data) => {
      state.events = data;
    },
    [moduleTypes.CHANGE_LOCAL_STORAGE_DATA]: (state, data) => {
      state.localStorageData = data;
    },
  },
  actions: {
    [moduleTypes.ADD_EVENT]({ commit }, event) {
      commit(moduleTypes.CHANGE_EVENT, event);
    },
    [moduleTypes.CLEAR_EVENTS]({ commit }) {
      commit(moduleTypes.CHANGE_EVENTS, []);
    },
    [moduleTypes.CLEAR_LOCAL_STORAGE_DATA]({ commit }, data) {
      commit(moduleTypes.CHANGE_LOCAL_STORAGE_DATA, data);
      removeStorageItem("payload");
    },
    [moduleTypes.FETCH_DATA]({ commit }, data) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const { price, qty, amount } = data;

          if (amount % 2 === 0) {
            saveStorageItem(
              "payload",
              JSON.stringify({
                price,
                qty,
                amount,
                nonce: generateNumber(),
              })
            );

            commit(moduleTypes.CHANGE_LOCAL_STORAGE_DATA, data);

            resolve({ success: true });
          } else {
            reject({ success: false });
          }
        }, 1000);
      });
    },
  },
};
