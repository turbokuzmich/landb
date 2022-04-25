import { useCallback, useState } from "react";
import { items as ids } from "../constants";
import axios from "axios";

// states: 'initial' | 'checkout' | 'success' | 'error'

export default function useCheckout(updateCart) {
  const [state, setState] = useState("initial");

  const checkout = useCallback(
    async function (form) {
      setState("checkout");

      const { data: items } = await axios.put("/api/checkout", form);

      setState("success");

      setTimeout(() => {
        updateCart(ids.reduce((items, id) => ({ ...items, [id]: 0 }), {}));
        setState("initial");
      }, 3000);
    },
    [state, setState]
  );

  return { state, checkout };
}
