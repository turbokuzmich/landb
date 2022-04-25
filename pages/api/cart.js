import get from "lodash/get";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions, items } from "../../constants";

async function add(req, res) {
  const cart = get(req.session, "cart", {
    oil: 0,
    balm: 0,
    scrub: 0,
  });

  if (items.includes(req.body.id)) {
    cart[req.body.id] += 1;

    req.session.cart = cart;

    await req.session.save();
  }

  res.status(200).json(cart);
}

async function update(req, res) {
  const cart = get(req.session, "cart", {
    oil: 0,
    balm: 0,
    scrub: 0,
  });

  Object.assign(cart, req.body);

  res.status(200).json(cart);
}

async function remove(req, res) {
  const cart = get(req.session, "cart", {
    oil: 0,
    balm: 0,
    scrub: 0,
  });

  if (items.includes(req.body.id)) {
    cart[req.body.id] = 0;

    req.session.cart = cart;

    await req.session.save();
  }

  res.status(200).json(cart);
}

const route = withIronSessionApiRoute(async function cart(req, res) {
  if (req.method === "POST") {
    await add(req, res);
  } else if (req.method === "PUT") {
    await update(req, res);
  } else if (req.method === "DELETE") {
    await remove(req, res);
  }
}, sessionOptions);

export default route;
