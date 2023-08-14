<template>
  <div class="">
    <form @submit.prevent="onSubmit">
      <fieldset class="from-container">
        <label class="field">
          <input
            type="number"
            :value="price"
            @input="debouncedInput($event.target.value, 'price', $options.INPUT_EVENT)"
          />
          <span>Цена: {{ price }}</span>
        </label>
        <label class="field">
          <input
            type="number"
            :value="qty"
            @input="debouncedInput($event.target.value, 'qty', $options.INPUT_EVENT)"
          />
          <span>Кол-во: {{ qty }}</span>
        </label>
        <label class="field">
          <input
            type="number"
            :value="amount"
            @input="debouncedInput($event.target.value, 'amount', $options.INPUT_EVENT)"
          />
          <span>Сумма: {{ amount }}</span>
        </label>
        <div class="form-footer">
          <button type="submit" :disabled="isSubmit">Отправить</button>
          <span>localStorage: {{ stateLocalStorageData }}</span>
        </div>
        <div>
          <button type="button" @click="resetForm">Очистить форму</button>
        </div>
      </fieldset>
    </form>

    <h2>События:</h2>
    <button type="button" @click="clearEvents">Очистить события</button>
    <button type="button" @click="localClearLocalStorage">Очистить localStorage</button>

    <div class="description-event">
      <template v-for="event in stateEvents">
        <div :key="event.id">
          <h5>{{ event.type }}</h5>
          <p>{{ event.text }}</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import debounce from "lodash.debounce";
import {
  INPUT_EVENT,
  SUBMIT_EVENT,
  RESPONSE_EVENT,
  getDescriptionInputEvent,
  getDescriptionSubmitEvent,
  getDescriptionResponseEvent,
} from "@/shared/services/events";
import { loadStorageItem } from "@/shared/services/storage";
import { mapState, mapActions } from "vuex";
import {
  MODULE_CALCULATION_AMOUNT,
  ADD_EVENT,
  FETCH_DATA,
  CLEAR_LOCAL_STORAGE_DATA,
  CLEAR_EVENTS,
} from "@/store/modules/calculationAmount/calculationAmount.types";
const getLocalStorageData = (name) => {
  return loadStorageItem(name) || JSON.stringify({});
};

const INPUTS_MAP = {
  price: "Цена",
  qty: "Кол-во",
  amount: "Сумма",
};

export default {
  INPUT_EVENT,
  name: "CalculationAmountWithVuex",
  data() {
    return {
      price: "",
      amount: "",
      qty: null,
    };
  },
  watch: {
    qty: {
      handler(newValue) {
        if (this.price) {
          this.amount = this.price * newValue;
        }
      },
    },
    price: {
      handler(newValue) {
        if (this.qty) {
          this.amount = this.qty * newValue;
        }
      },
    },
    amount: {
      handler(newValue) {
        if (this.qty) {
          this.price = newValue / this.qty;
        }
      },
    },
  },
  computed: {
    ...mapState(MODULE_CALCULATION_AMOUNT, {
      stateEvents: (state) => state.events,
      stateLocalStorageData: (state) => state.localStorageData,
    }),
    isSubmit() {
      return !(this.price && this.amount && this.qty);
    },
  },
  methods: {
    ...mapActions(MODULE_CALCULATION_AMOUNT, {
      addEvent: ADD_EVENT,
      fetchData: FETCH_DATA,
      clearLocalStorage: CLEAR_LOCAL_STORAGE_DATA,
      clearEvents: CLEAR_EVENTS,
    }),
    localClearLocalStorage() {
      this.clearLocalStorage({});
    },
    resetForm() {
      this.price = "";
      this.qty = "";
      this.amount = "";
    },
    debouncedInput: debounce(function (value, eventName, type) {
      this[eventName] = value;
      const event = getDescriptionInputEvent({
        name: INPUTS_MAP[eventName],
        type,
        value,
      });
      this.addEvent(event);
    }, 300),
    onSubmit() {
      const { price, qty, amount } = this;
      const event = getDescriptionSubmitEvent({
        type: SUBMIT_EVENT,
        oldData: getLocalStorageData("payload"),
        newData: JSON.stringify({
          price,
          qty,
          amount,
        }),
      });

      this.addEvent(event);

      if (price && qty && amount) {
        return this.fetchData({ price, qty, amount })
          .then((response) => {
            const event = getDescriptionResponseEvent({
              type: RESPONSE_EVENT,
              data: getLocalStorageData("payload"),
              response: JSON.stringify(response),
            });

            this.addEvent(event);
          })
          .catch((error) => {
            const event = getDescriptionResponseEvent({
              type: RESPONSE_EVENT,
              data: getLocalStorageData("payload"),
              response: JSON.stringify(error),
            });

            this.addEvent(event);
          });
      }
    },
  },
};
</script>

<style>
.from-container {
  display: flex;
}

.field {
  display: flex;
  flex-direction: column;
}
.description-event {
  border: 1px solid red;
}
.form-footer {
  display: flex;
  flex-direction: column;
}
</style>
