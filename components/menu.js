import { useState, useCallback, useMemo } from "react";
import A from "@mui/material/Link";
import Link from "next/link";
import Container from "@mui/material/Container";
import Price from "./price";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";

const items = [
  { title: "Продукция", link: "/catalog" },
  { title: "О нас", link: "/about" },
  { title: "Контакты", link: "/contacts" },
];

export default function LnBMenu({ selected, cartMenuItemRef, sum = 0 }) {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = useCallback(() => setAnchorEl(null), [setAnchorEl]);

  const handleClick = useCallback(
    (event) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl]
  );

  const clickHandlers = useMemo(
    () =>
      items.reduce(
        (handlers, { link }) => ({
          ...handlers,
          [link]: () => {
            handleClose();
            router.push(link);
          },
        }),
        {}
      ),
    [handleClose, router]
  );

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: {
          xs: "space-between",
          sm: "center",
        },
      }}
    >
      <>
        <IconButton size="large" edge="start" onClick={handleClick}>
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={anchorEl !== null}
          onClose={handleClose}
        >
          {items.map(({ title, link }) => (
            <MenuItem key={link} onClick={clickHandlers[link]}>
              {title}
            </MenuItem>
          ))}
        </Menu>
        {items.map(({ title, link }) => {
          const isSelected = link === selected;

          return (
            <Link key={link} href={link} passHref>
              <A
                underline="none"
                sx={{
                  display: {
                    xs: "none",
                    sm: "initial",
                  },
                  height: 100,
                  fontSize: "20px",
                  textTransform: "uppercase",
                  lineHeight: "100px",
                  mr: 2,
                  color: isSelected ? "text.secondary" : "text.disabled",
                  transition: "color 0.2s ease-out",
                  "&:hover": {
                    color: "text.primary",
                  },
                }}
              >
                {title}
              </A>
            </Link>
          );
        })}
        <Link href="/cart" passHref>
          <A
            ref={cartMenuItemRef}
            underline="none"
            sx={{
              height: {
                xs: 50,
                sm: 100,
              },
              fontSize: {
                xs: "18px",
                sm: "20px",
              },
              lineHeight: {
                xs: "50px",
                sm: "100px",
              },
              color: isMobile
                ? "text.primary"
                : selected === "/cart"
                ? "text.secondary"
                : "text.disabled",
              transition: "color 0.2s ease-out",
              display: "flex",
              ml: 2,
              alignItems: "center",
              "&:hover": {
                color: "text.primary",
              },
            }}
          >
            <ShoppingCartIcon sx={{ mr: "6px" }} />
            <Price sum={sum} />
          </A>
        </Link>
      </>
    </Container>
  );
}
