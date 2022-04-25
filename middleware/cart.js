import get from "lodash/get";

export default function cartMiddleware(ctx) {
  const cart = get(ctx.req.session, "cart", {
    oil: 0,
    balm: 0,
    scrub: 0,
  });

  return { props: { cart } };
}
