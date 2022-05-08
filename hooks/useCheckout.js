import { useCallback, useState } from "react";
import { items as ids } from "../constants";
import axios from "axios";

// states: 'initial' | 'checkout' | 'success' | 'error'

function reset(updateCart, setState) {
  return new Promise((resolve) => {
    setTimeout(() => {
      updateCart(ids.reduce((items, id) => ({ ...items, [id]: 0 }), {}));
      setState("initial");
    }, 3000);
  });
}

export default function useCheckout(updateCart) {
  const [state, setState] = useState("initial");

  const checkout = useCallback(
    async function (form) {
      setState("checkout");

      await axios.put("/api/checkout", form);

      setState("success");

      await reset(updateCart, setState);
    },
    [state, setState]
  );

  return { state, checkout };
}
