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
          <span>localStorage: {{ localStorageData }}</span>
        </div>
        <div>
          <button type="button" @click="resetForm">Очистить форму</button>
        </div>
      </fieldset>
    </form>

    <h2>События:</h2>
    <button type="button" @click="events = []">Очистить события</button>
    <button type="button" @click="clearLocalStorage">Очистить localStorage</button>

    <div class="description-event">
      <template v-for="event in events">
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
  SUCCESS,
  UNSUCCESS,
  getDescriptionInputEvent,
  getDescriptionSubmitEvent,
  getDescriptionResponseEvent,
} from "@/shared/services/events";
import { generateNumber } from "@/shared/lib/common";
import { loadStorageItem, saveStorageItem, removeStorageItem } from "@/shared/services/storage";

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
  name: "CalculationAmountWithoutVuex",
  data() {
    return {
      price: "",
      amount: "",
      qty: null,
      events: [],
      localStorageData: {},
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
    isSubmit() {
      return !(this.price && this.amount && this.qty);
    },
  },
  mounted() {
    this.localStorageData = getLocalStorageData("payload");
  },
  methods: {
    clearLocalStorage() {
      removeStorageItem("payload");
      this.localStorageData = getLocalStorageData("payload");
    },
    resetForm() {
      this.price = "";
      this.qty = "";
      this.amount = "";
    },
    addEvent(event) {
      this.events = [event, ...this.events];
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
    fetchData(data) {
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

            this.localStorageData = getLocalStorageData("payload");

            resolve(SUCCESS);
          } else {
            reject(UNSUCCESS);
          }
        }, 1000);
      });
    },
    onSubmit() {
      const { price, qty, amount } = this;
      const submitEvent = getDescriptionSubmitEvent({
        type: SUBMIT_EVENT,
        oldData: getLocalStorageData("payload"),
        newData: JSON.stringify({
          price,
          qty,
          amount,
        }),
      });

      this.addEvent(submitEvent);

      if (price && qty && amount) {
        this.fetchData({ price, qty, amount })
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
