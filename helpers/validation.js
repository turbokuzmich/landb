import { paymentTypes, deliveryTypes } from "./cart";
import property from "lodash/property";
import * as yup from "yup";

export const cartSchema = yup.object().shape({
  phone: yup.string().trim().required("Пожалуйста, укажите номер телефона"),
  fio: yup
    .string()
    .trim()
    .min(2, "Пожалуйста, укажите ФИО")
    .required("Пожалуйста, укажите ФИО"),
  address: yup.string().trim().required("Пожалуйста, укажите адрес доставки"),
  email: yup
    .string()
    .email("Пожалуйста, укажите правильный адрес электронной почты"),
  delivery: yup
    .mixed()
    .oneOf(
      deliveryTypes.map(property("value")),
      "Пожалуйста, выберите тип доставки"
    )
    .required("Пожалуйста, выберите тип доставки"),
});
