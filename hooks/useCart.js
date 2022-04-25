import axios from "axios";
import { useState, useMemo, useCallback } from "react";
import { prices, items as ids } from "../constants";

// item status: 'initial' | 'changing' | 'success' | 'error'

export default function useCart(initialCart) {
  const [items, setItems] = useState(initialCart);

  const [itemStatus, setItemStatus] = useState({
    oil: "initial",
    balm: "initial",
    scrub: "initial",
  });

  const sum = useMemo(
    () => ids.reduce((sum, id) => sum + items[id] * prices[id], 0),
    [items]
  );

  const addToCart = useCallback(
    async function (id) {
      if (itemStatus[id] !== "initial") {
        return;
      }

      setItemStatus({ ...itemStatus, [id]: "changing" });

      const { data: newItems } = await axios.post("/api/cart", { id });

      setItems(newItems);
      setItemStatus({ ...itemStatus, [id]: "success" });

      setTimeout(() => setItemStatus({ ...itemStatus, [id]: "initial" }), 2000);
    },
    [itemStatus, setItemStatus]
  );

  const updateCart = useCallback(
    async function (items) {
      if (ids.some((id) => itemStatus[id] !== "initial")) {
        return;
      }

      setItemStatus(
        ids.reduce((statuses, id) => ({ ...statuses, [id]: "changing" }), {})
      );

      const { data: newItems } = await axios.put("/api/cart", items);

      setItems(newItems);

      setItemStatus(
        ids.reduce((statuses, id) => ({ ...statuses, [id]: "initial" }), {})
      );
    },
    [itemStatus, setItemStatus]
  );

  const deleteFromCart = useCallback(
    async function (id) {
      if (itemStatus[id] !== "initial") {
        return;
      }

      setItemStatus({ ...itemStatus, [id]: "changing" });

      const { data: newItems } = await axios.delete("/api/cart", {
        data: { id },
      });

      setItems(newItems);
      setItemStatus({ ...itemStatus, [id]: "success" });
    },
    [itemStatus, setItemStatus]
  );

  return { items, itemStatus, sum, addToCart, updateCart, deleteFromCart };
}
