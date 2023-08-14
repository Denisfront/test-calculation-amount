export { INPUT_EVENT, SUBMIT_EVENT, RESPONSE_EVENT, SUCCESS, UNSUCCESS } from "./constants";

export const getDescriptionSubmitEvent = (payload) => {
  const event = {
    type: payload.type,
    text: `Новые данные: ${payload.newData}
           Стырые дынные: ${payload.oldData}
    `,
    id: Math.floor(Math.random() * 255),
  };
  return event;
};

export const getDescriptionResponseEvent = (payload) => {
  const event = {
    type: payload.type,
    response: payload.oldData,
    data: payload.newData,
    text: `Ответ: ${payload.response}
           Данные: ${payload.data}
    `,
    id: Math.floor(Math.random() * 255),
  };
  return event;
};

export const getDescriptionInputEvent = (payload) => {
  const event = {
    type: payload.type,
    text: ` Изменение: ${payload.name} - ${payload.value}`,
    value: payload.value,
    id: Math.floor(Math.random() * 255),
  };
  return event;
};
