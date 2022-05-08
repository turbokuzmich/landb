import get from "lodash/get";
import nodemailer from "nodemailer";
import { withIronSessionApiRoute } from "iron-session/next";
import { items, titles, prices, sessionOptions } from "../../constants";

const route = withIronSessionApiRoute(async function checkout(req, res) {
  const address = get(req.body, "address", "");
  const phone = get(req.body, "phone", "");
  const fio = get(req.body, "fio", "");
  const delivery = get(req.body, "delivery", "");
  const email = get(req.body, "email", "");

  const cart = get(req.session, "cart", {
    oil: 0,
    balm: 0,
    scrub: 0,
  });

  const sum = items.reduce(
    (sum, item) => sum + get(cart, item, 0) * prices[item],
    0
  );

  if (sum > 0 && address.length && phone.length) {
    const lines = [];

    if (fio.length) {
      lines.push(`Заказчик: ${fio}`);
    }
    if (email.length) {
      lines.push(`Почта: ${email}`);
    }

    lines.push(`Телефон: ${phone}`);
    lines.push(`Адрес доставки: ${address}`);

    if (delivery.length) {
      lines.push(`Доставщик: ${delivery}`);
    }

    lines.push("Заказ:");

    items.forEach((item) => {
      if (get(cart, item, 0) > 0) {
        lines.push(`${titles[item]} x ${cart[item]}`);
      }
    });

    lines.push(`Сумма: ${sum}`);

    const transport = nodemailer.createTransport({
      host: "smtp.yandex.ru",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transport.sendMail({
      from: "info@landb.shop",
      to: "info@landb.shop",
      cc: ["office@deluxspa.ru", "dmrtvee@yandex.ru"],
      subject: "Новый заказ на сайте landb.shop",
      text: JSON.stringify(lines.join("\n")),
      html: lines.join("<br />"),
    });
  }

  req.session.cart = { oil: 0, balm: 0, scrub: 0 };

  await req.session.save();

  res.status(200).json({});
}, sessionOptions);

export default route;
