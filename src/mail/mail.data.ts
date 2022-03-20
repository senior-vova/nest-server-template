export enum MessagesTypesEnum {
  CODE = "Activation code",
  AUTH = "Successful registration",
  successPayment = "successPayment",
  failPayment = "successPayment",
}

export const MailMessages = [
  {
    type: MessagesTypesEnum.successPayment,
    html: (msg: string) => `Your payment was successful`,
  },
  {
    type: MessagesTypesEnum.failPayment,
    html: (msg: string) => `Your payment was declined`,
  },
];
