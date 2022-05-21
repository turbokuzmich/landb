import { useRef, useEffect, useState, useMemo } from "react";
import Head from "next/head";
import { styled, useTheme } from "@mui/material/styles";
import Link from "next/link";
import A from "@mui/material/Link";
import Menu from "./menu";
import Layout from "./layout";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartCheckout";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Popper from "@mui/material/Popper";
import Price from "./price";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { items, prices, titles, subtitles } from "../constants";
import useCart from "../hooks/useCart";

const Img = styled("img")``;

export default function Item({ id, cart, composition, children }) {
  const cartMenuItemRef = useRef();

  const auxIds = useMemo(() => items.filter((item) => item !== id), [id]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { sum, itemStatus, addToCart } = useCart(cart);

  const [isCartDialogOpen, setIsCartDialogOpen] = useState(false);

  const add = () => addToCart(id);

  const close = () => setIsCartDialogOpen(false);

  useEffect(() => {
    if (itemStatus[id] === "success") {
      setIsCartDialogOpen(true);
    }
  }, [itemStatus[id], setIsCartDialogOpen]);

  return (
    <Layout>
      <Head>
        <title key="title">LandB — {subtitles[id]}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Menu selected="/catalog" sum={sum} cartMenuItemRef={cartMenuItemRef} />
      <ClickAwayListener onClickAway={close}>
        <Popper
          open={isCartDialogOpen}
          anchorEl={cartMenuItemRef.current}
          placement="bottom-end"
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [16, isMobile ? -51 : -76],
              },
            },
          ]}
          keepMounted
        >
          <Box
            sx={{
              width: {
                xs: 300,
                sm: 350,
              },
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "18px",
                  sm: "20px",
                },
                pr: 2,
                pl: 2,
                borderTop: "solid 1px rgba(255, 255, 255, 0.5)",
                backgroundColor: "grey.900",
                lineHeight: "50px",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ShoppingCartIcon sx={{ mr: "6px" }} />
              <Price sum={sum} />
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "grey.900",
              display: "flex",
              flexDirection: "column",
              p: 2,
              gap: 2,
              width: {
                sx: 300,
                sm: 350,
              },
            }}
          >
            <Button
              onClick={close}
              variant="outlined"
              size="large"
              sx={{
                color: "#ffffff",
                borderColor: "#ffffff",
                backgroundColor: "rgba(255, 255, 255, 0)",
                "&:hover": {
                  borderColor: "#ffffff",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
              }}
            >
              Продолжить покупки
            </Button>
            <Button href="/cart" variant="contained" size="large">
              Заказать доставку
            </Button>
          </Box>
        </Popper>
      </ClickAwayListener>
      <Container
        sx={{
          pt: {
            xs: 2,
            md: 8,
          },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: "common.white",
            textShadow: "0 0 6px #fff",
            textTransform: "uppercase",
          }}
        >
          {titles[id]}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{
            mb: {
              xs: 2,
              md: 4,
            },
          }}
        >
          ({subtitles[id]})
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: {
              xs: 2,
              md: 8,
            },
            alignItems: "center",
            maxWidth: 800,
            mb: {
              xs: 2,
              md: 4,
            },
          }}
        >
          <Box
            sx={{
              position: "relative",
              lineHeight: 0,
            }}
          >
            <Img
              src={`/images/photo_${id}.png`}
              sx={{
                maxWidth: "100%",
                pointerEvents: "none",
                position: "relative",
                zIndex: 1,
              }}
            />
          </Box>
          <Box
            sx={{
              flexShrink: 0,
              flexGrow: 0,
              width: 300,
            }}
          >
            <CartBlock
              id={id}
              add={add}
              itemStatus={itemStatus}
              sx={{
                justifyContent: "center",
                display: isMobile ? "flex" : "none",
                mb: 4,
              }}
            />
            <Typography variant="h6" paragraph>
              Состав:
            </Typography>
            <Typography
              component="ul"
              sx={{
                listStyleType: "none",
                listStylePosition: "outside",
                pl: 0,
                mb: {
                  xs: 0,
                  sm: 4,
                },
                "& li": {
                  position: "relative",
                  "&:after": {
                    content: "'—'",
                    position: "absolute",
                    left: -22,
                    top: 0,
                  },
                },
                "& li:not(:last-child)": {
                  mb: 1,
                },
              }}
            >
              {composition.map((text) => (
                <Typography key={text} component="li">
                  {text}
                </Typography>
              ))}
            </Typography>
            <CartBlock
              id={id}
              add={add}
              itemStatus={itemStatus}
              sx={{
                display: isMobile ? "none" : "flex",
              }}
            />
          </Box>
        </Box>
        <Typography
          sx={{
            textAlign: {
              xs: "left",
              sm: "center",
            },
            maxWidth: 800,
          }}
          paragraph
        >
          {children}
        </Typography>
        <Typography variant="h5" paragraph>
          Обратите внимание
        </Typography>
        <Box
          sx={{
            width: "100%",
            justifyContent: "center",
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: {
              xs: 1,
              md: 4,
            },
            mb: {
              xs: 2,
              md: 4,
            },
          }}
        >
          {auxIds.map((id) => (
            <Link key={id} href={`/catalog/${id}`} passHref>
              <A
                underline="none"
                sx={{
                  gap: 2,
                  height: 70,
                  display: "flex",
                  "&:hover": {
                    color: "#ffffff",
                  },
                  "&:hover .auxImage": {
                    filter: "grayscale(0)",
                  },
                }}
              >
                <Img
                  className="auxImage"
                  src={`/images/photo_${id}.png`}
                  sx={{
                    height: 70,
                    filter: "grayscale(0.2)",
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Typography sx={{ textTransform: "uppercase" }}>
                    {titles[id]}
                  </Typography>
                  <Typography variant="body2">{subtitles[id]}</Typography>
                </Box>
              </A>
            </Link>
          ))}
        </Box>
      </Container>
    </Layout>
  );
}

function CartBlock({ id, add, itemStatus, sx = {} }) {
  return (
    <Box
      sx={{
        gap: 2,
        display: "flex",
        alignItems: "center",
        ...sx,
      }}
    >
      <Typography variant="h4">
        <Price sum={prices[id]} />
      </Typography>
      <Button
        startIcon={<ShoppingBasketIcon />}
        onClick={add}
        variant="outlined"
        size="large"
        disabled={itemStatus[id] !== "initial"}
        sx={{
          color: "#ffffff",
          borderColor: "#ffffff",
          backgroundColor: "rgba(255, 255, 255, 0)",
          "&:hover": {
            borderColor: "#ffffff",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
        }}
      >
        {itemStatus[id] === "success" ? "Добавлено!" : "В корзину"}
      </Button>
    </Box>
  );
}
