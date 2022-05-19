import { useCallback, useMemo, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Layout from "../../components/layout";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Menu from "../../components/menu";
import A from "@mui/material/Link";
import Link from "next/link";
import Price from "../../components/price";
import { withIronSessionSsr } from "iron-session/next";
import { Formik, Field, Form } from "formik";
import { TextField } from "formik-material-ui";
import cart from "../../middleware/cart";
import useCart from "../../hooks/useCart";
import debounce from "lodash/debounce";
import useCheckout from "../../hooks/useCheckout";
import { styled } from "@mui/material/styles";
import { cartSchema } from "../../helpers/validation";
import { deliveryTypes } from "../../helpers/cart";
import {
  items as ids,
  prices,
  titles,
  subtitles,
  sessionOptions,
} from "../../constants";

const Img = styled("img")``;

const initialFormValues = {
  phone: "",
  fio: "",
  address: "",
  email: "",
  delivery: "pickpoint",
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
    [setItemsCopy, updateCartDebounced]
  );

  useEffect(() => {
    setItemsCopy({ ...items });
  }, [items]);

  return (
    <Layout>
      <Menu selected="/cart" sum={sum} />
      <Container maxWidth="md">
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

export const getServerSideProps = withIronSessionSsr(cart, sessionOptions);

function FullCart({ ids, items, sum, itemStatus, updateCart, deleteFromCart }) {
  const { state } = useCheckout(updateCart);

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
    <CartContainer>
      {["initial", "checkout"].includes(state) ? (
        <>
          <CartItemsContainer>
            {ids.map((id) => (
              <CartItem
                key={id}
                id={id}
                items={items}
                itemStatus={itemStatus}
                callbacks={callbacks}
              />
            ))}
            <Typography textAlign="right" variant="h5" sx={{ mt: 4 }}>
              Итого: <Price sum={sum} />
            </Typography>
          </CartItemsContainer>
          <CheckoutForm sum={sum} updateCart={updateCart} />
        </>
      ) : (
        <Typography textAlign="center">
          Заказ оформлен. В ближайшее время мы свяжемся с Вами.
        </Typography>
      )}
    </CartContainer>
  );
}

function CheckoutForm({ sum, updateCart }) {
  const { checkout } = useCheckout(updateCart);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" textAlign="center" sx={{ mb: 2 }}>
        Доставка
      </Typography>
      <Typography
        textAlign="center"
        sx={{
          display: sum >= 1500 ? "none" : "block",
        }}
      >
        Стоимость доставки по Москве и МО — <Price sum={150} />. В регионы —{" "}
        <Price sum={300} />.<br />
        При заказе от <Price sum={1500} /> доставка бесплатна.
      </Typography>
      <Formik
        initialValues={initialFormValues}
        validationSchema={cartSchema}
        onSubmit={checkout}
      >
        {({ isSubmitting }) => (
          <Form autoComplete="off" noValidate>
            <Field
              component={TextField}
              name="phone"
              label="Телефон"
              variant="outlined"
              autoComplete="off"
              margin="normal"
              fullWidth
              required
            />
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
            <Field
              component={TextField}
              name="address"
              label="Адрес доставки"
              variant="outlined"
              autoComplete="off"
              margin="normal"
              fullWidth
              required
            />
            <Field
              component={TextField}
              name="fio"
              label="ФИО"
              variant="outlined"
              autoComplete="off"
              margin="normal"
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
            />
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
  );
}

function CartItem({ id, items, callbacks }) {
  return (
    <Box
      key={id}
      sx={{
        height: {
          xs: 150,
          md: "auto",
        },
        display: "flex",
        position: "relative",
        gap: 4,
        pb: 4,
        pt: 4,
        "&::after": {
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)",
          position: "absolute",
          content: "''",
          bottom: 0,
          height: "1px",
          left: 0,
          right: 0,
        },
      }}
    >
      <Box
        sx={{
          display: {
            xs: "none",
            sm: "flex",
          },
          width: "150px",
          flexGrow: 0,
          flexShrink: 0,
        }}
      >
        <Link href={`/catalog/${id}`} passHref>
          <A
            sx={{
              "& .image": {
                transition: "filter 0.2s ease-out",
                filter: "drop-shadow(0 0 4px rgba(255, 255, 255, 0))",
              },
              "&:hover .image": {
                filter: "drop-shadow(0 0 4px rgba(255, 255, 255, 1))",
              },
            }}
          >
            <Img
              className="image"
              src={`/images/photo_${id}.png`}
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
          pt: {
            md: 1,
          },
          pb: {
            md: 1,
          },
          flexGrow: 1,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Link href={`/catalog/${id}`} passHref>
            <A
              variant="h6"
              color="text.primary"
              sx={{
                lineHeight: 1.2,
                textTransform: "uppercase",
                textDecorationColor: "rgba(255, 255, 255, 0.4)",
              }}
            >
              {titles[id]}
            </A>
          </Link>
          <Typography variant="subtitle1" color="text.secondary">
            {subtitles[id]}
          </Typography>
        </Box>
        <Box sx={{ display: "flex" }}>
          <CountSwitcher id={id} items={items} callbacks={callbacks} />
          <Typography
            sx={{
              ml: "1em",
              lineHeight: "31px",
              whiteSpace: "nowrap",
            }}
          >
            <Typography component="span" color="text.secondary">
              x
            </Typography>{" "}
            <Price sum={prices[id]} />
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          pt: {
            md: 1,
          },
          pb: {
            md: 1,
          },
          display: "flex",
          alignItems: "end",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">
          <Price sum={items[id] * prices[id]} />
        </Typography>
        <Button
          variant="outlined"
          onClick={callbacks[id].del}
          sx={{
            color: "text.primary",
            lineHeight: "29px",
            p: "0 15px",
            borderColor: "rgba(255, 255, 255, 0.3)",
            backgroundColor: "rgba(255, 255, 255, 0)",
            "&:hover": {
              borderColor: "text.primary",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            },
          }}
        >
          Удалить
        </Button>
      </Box>
    </Box>
  );
}

function CountSwitcher({ id, items, callbacks }) {
  const isLeftDisabled = items[id] === 1;
  const qty = items[id];

  const [isLeftHovered, setIsLeftHovered] = useState(false);
  const [isRightHovered, setIsRightHovered] = useState(false);

  const onLeftMouseEnter = useCallback(
    () => setIsLeftHovered(true),
    [setIsLeftHovered]
  );
  const onLeftMouseLeave = useCallback(
    () => setIsLeftHovered(false),
    [setIsLeftHovered]
  );
  const onRightMouseEnter = useCallback(
    () => setIsRightHovered(true),
    [setIsRightHovered]
  );
  const onRightMouseLeave = useCallback(
    () => setIsRightHovered(false),
    [setIsRightHovered]
  );

  useEffect(() => {
    if (isLeftHovered && items[id] === 1) {
      setIsLeftHovered(false);
    }
  }, [qty, id, items, isLeftHovered, setIsLeftHovered]);

  const gradient = [
    `rgba(255,255,255,${
      isLeftDisabled ? "0.1" : isLeftHovered ? "1.0" : "0.4"
    }) 0%`,
    "rgba(255,255,255,0.5) 50%",
    `rgba(255,255,255,${isRightHovered ? "1.0" : "0.4"}) 100%`,
  ].join(", ");

  return (
    <Box
      sx={{
        display: "inline-flex",
        position: "relative",
        justifyContent: "start",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          background: `linear-gradient(90deg, ${gradient})`,
          mask: "url(/images/cart_button_mask.svg)",
          p: "1px",
        }}
      />
      <Button
        disabled={isLeftDisabled}
        onMouseEnter={onLeftMouseEnter}
        onMouseLeave={onLeftMouseLeave}
        onClick={callbacks[id].dec}
        sx={{
          p: 0,
          pb: "3px",
          fontSize: "1rem",
          width: 32,
          minWidth: 0,
          "&:hover": {
            backgroundColor: "transparent",
          },
        }}
      >
        &ndash;
      </Button>
      <Typography
        sx={{
          lineHeight: "31px",
          width: 28,
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        {items[id]}
      </Typography>
      <Button
        onMouseEnter={onRightMouseEnter}
        onMouseLeave={onRightMouseLeave}
        onClick={callbacks[id].inc}
        sx={{
          p: 0,
          pb: "3px",
          fontSize: "1rem",
          width: 32,
          minWidth: 0,
          "&:hover": {
            backgroundColor: "transparent",
          },
        }}
      >
        +
      </Button>
    </Box>
  );
}

function CartItemsContainer({ children }) {
  return (
    <>
      <Typography variant="h4" textAlign="center" sx={{ mb: 2 }}>
        Корзина
      </Typography>
      {children}
    </>
  );
}

function CartContainer({ children }) {
  return (
    <Box
      sx={{
        pt: {
          xs: 2,
          md: 8,
        },
        pb: 4,
      }}
    >
      {children}
    </Box>
  );
}
