import { useCallback, useMemo, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Layout from "../../components/layout";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "../../components/menu";
import A from "@mui/material/Link";
import Link from "next/link";
import { items as ids, prices, titles, sessionOptions } from "../../constants";
import { withIronSessionSsr } from "iron-session/next";
import { Formik, Field, Form } from "formik";
import { TextField } from "formik-material-ui";
import cart from "../../middleware/cart";
import useCart from "../../hooks/useCart";
import debounce from "lodash/debounce";
import property from "lodash/property";
import useCheckout from "../../hooks/useCheckout";
import * as yup from "yup";
import { styled } from "@mui/material/styles";

const Img = styled("img")``;

const paymentTypes = [
  {
    value: "cash",
    label: "Наличными",
  },
  {
    value: "card",
    label: "Картой онлайн",
  },
];

const deliveryTypes = [
  {
    value: "pickpoint",
    label: "PickPoint",
  },
  {
    value: "Boxberry",
    label: "boxberry",
  },
  {
    value: "sdek",
    label: "СДЭК",
  },
];

const schema = yup.object().shape({
  fio: yup
    .string()
    .trim()
    .min(2, "Пожалуйста, укажите ФИО")
    .required("Пожалуйста, укажите ФИО"),
  email: yup
    .string()
    .email("Пожалуйста, укажите правильный адрес электронной почты")
    .required("Пожалуйста, укажите адрес электронной почты"),
  pay: yup
    .mixed()
    .oneOf(
      paymentTypes.map(property("value")),
      "Пожалуйста, выберите тип оплаты"
    )
    .required("Пожалуйста, выберите тип оплаты"),
  delivery: yup
    .mixed()
    .oneOf(
      deliveryTypes.map(property("value")),
      "Пожалуйста, выберите тип доставки"
    )
    .required("Пожалуйста, выберите тип доставки"),
});

const initialFormValues = {
  fio: "",
  email: "",
  pay: "cash",
  delivery: "pickup",
};

export default function Cart(props) {
  const { cart } = props;

  const {
    items,
    sum,
    itemStatus,
    updateCart: update,
    deleteFromCart,
  } = useCart(cart);

  const [itemsCopy, setItemsCopy] = useState({ ...items });

  const idsInCart = useMemo(
    () => ids.filter((id) => Boolean(itemsCopy[id])),
    [itemsCopy]
  );

  const updateCartDebounced = useMemo(() => debounce(update, 300), [update]);
  const updateCart = useCallback(
    (items) => {
      setItemsCopy(items);
      updateCartDebounced(items);
    },
    [itemsCopy, updateCartDebounced]
  );

  useEffect(() => {
    setItemsCopy({ ...items });
  }, [items]);

  return (
    <Layout>
      <Menu selected="/cart" sum={sum} />
      <Container sx={{ mt: 8, mb: 2 }}>
        {idsInCart.length === 0 ? (
          <Typography textAlign="center">В корзине пусто</Typography>
        ) : (
          <FullCart
            ids={idsInCart}
            items={itemsCopy}
            sum={sum}
            itemStatus={itemStatus}
            deleteFromCart={deleteFromCart}
            updateCart={updateCart}
          />
        )}
      </Container>
    </Layout>
  );
}

function FullCart({ ids, items, sum, itemStatus, updateCart, deleteFromCart }) {
  const { checkout } = useCheckout();

  const callbacks = useMemo(
    () =>
      ids.reduce(
        (callbacks, id) => ({
          ...callbacks,
          [id]: {
            dec: () => {
              updateCart({ ...items, [id]: items[id] - 1 });
            },
            inc: () => {
              updateCart({ ...items, [id]: items[id] + 1 });
            },
            del: () => {
              deleteFromCart(id);
            },
          },
        }),
        {}
      ),
    [ids, items, updateCart, deleteFromCart]
  );

  return (
    <Box
      sx={{
        display: "flex",
        gap: 4,
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          flexShrink: 1,
          gap: 4,
        }}
      >
        {ids.map((id) => (
          <Box key={id} sx={{ display: "flex", gap: 4 }}>
            <Box
              sx={{
                width: "150px",
                flexGrow: 0,
                flexShrink: 0,
              }}
            >
              <Link href={`/catalog/${id}`} passHref>
                <A>
                  <Img
                    className="image"
                    src={`/images/${id}.png`}
                    alt={titles[id]}
                    sx={{
                      position: "relative",
                      pointerEvents: "none",
                      display: "block",
                      maxWidth: "100%",
                    }}
                  />
                </A>
              </Link>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography paragraph>
                <Link href={`/catalog/${id}`} passHref>
                  <A
                    variant="h6"
                    sx={{
                      color: "text.primary",
                      textDecorationColor: "rgba(255, 255, 255, 0.4)",
                    }}
                  >
                    {titles[id]}
                  </A>
                </Link>
              </Typography>
              <Typography>
                {prices[id]} ₽
                <Box
                  onClick={callbacks[id].del}
                  component="span"
                  sx={{
                    ml: 1,
                    cursor: "pointer",
                    textDecoration: "underline",
                    textDecorationColor: "rgba(255, 255, 255, 0.4)",
                    textTransform: "uppercase",
                    "&:hover": {
                      textDecorationColor: "#ffffff",
                    },
                  }}
                >
                  удалить
                </Box>
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "nowrap",
                alignItems: "start",
                pt: "46px",
                userSelect: "none",
              }}
            >
              <Button
                variant="outlined"
                disabled={items[id] === 1 || itemStatus[id] !== "initial"}
                onClick={callbacks[id].dec}
                sx={{
                  color: "text.primary",
                  borderColor: "text.secondary",
                  backgroundColor: "rgba(255, 255, 255, 0)",
                  display: "inline-block",
                  fontSize: "1rem",
                  height: "24px",
                  lineHeight: "22px",
                  padding: 0,
                  "&:hover": {
                    borderColor: "text.primary",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                }}
              >
                &ndash;
              </Button>
              <Box sx={{ minWidth: 28, textAlign: "center", ml: 1, mr: 1 }}>
                {items[id]}
              </Box>
              <Button
                variant="outlined"
                disabled={itemStatus[id] !== "initial"}
                onClick={callbacks[id].inc}
                sx={{
                  color: "text.primary",
                  borderColor: "text.secondary",
                  backgroundColor: "rgba(255, 255, 255, 0)",
                  display: "inline-block",
                  fontSize: "1rem",
                  height: "24px",
                  lineHeight: "22px",
                  padding: 0,
                  "&:hover": {
                    borderColor: "text.primary",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                }}
              >
                +
              </Button>
            </Box>
          </Box>
        ))}
        <Box sx={{ ml: "182px" }}>
          <Typography variant="h5">{sum} ₽</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          width: 400,
          flexGrow: 0,
          flexShrink: 0,
          pt: "46px",
        }}
      >
        <Formik
          initialValues={initialFormValues}
          validationSchema={schema}
          onSubmit={checkout}
        >
          {({ isSubmitting }) => (
            <Form autoComplete="off" noValidate>
              <Field
                component={TextField}
                name="fio"
                label="ФИО"
                variant="outlined"
                autoComplete="off"
                fullWidth
                required
              />
              <Field
                component={TextField}
                name="email"
                label="Почта"
                variant="outlined"
                autoComplete="off"
                margin="normal"
                fullWidth
                required
              />
              <Field
                component={TextField}
                name="pay"
                label="Тип оплаты"
                variant="outlined"
                autoComplete="off"
                margin="normal"
                fullWidth
                required
                select
              >
                {paymentTypes.map((option) => (
                  <MenuItem key={option.label} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field>
              <Field
                component={TextField}
                name="delivery"
                label="Тип доставки"
                variant="outlined"
                autoComplete="off"
                margin="normal"
                fullWidth
                required
                select
              >
                {deliveryTypes.map((option) => (
                  <MenuItem key={option.label} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field>
              <Button
                type="submit"
                size="large"
                variant="outlined"
                disabled={isSubmitting}
                sx={{
                  mt: 2,
                  color: "text.primary",
                  borderColor: "text.secondary",
                  backgroundColor: "rgba(255, 255, 255, 0)",
                  "&:hover": {
                    borderColor: "text.primary",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                }}
              >
                Заказать
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}

export const getServerSideProps = withIronSessionSsr(cart, sessionOptions);
