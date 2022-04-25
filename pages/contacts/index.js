import { Global, css } from "@emotion/react";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Menu from "../../components/menu";
import { sessionOptions } from "../../constants";
import { withIronSessionSsr } from "iron-session/next";
import cart from "../../middleware/cart";
import useCart from "../../hooks/useCart";

export default function About({ cart }) {
  const { sum } = useCart(cart);

  return (
    <>
      <Global
        styles={css`
          html {
            background: url(/images/catalog_background.jpg) no-repeat center
              center fixed;
            background-size: cover;
          }
          body {
            background-color: transparent;
          }
        `}
      />
      <Menu selected="/contacts" sum={sum} />
      <Container>
        <Typography align="center" sx={{ mt: 8, mb: 2 }}>
          Россия, г. Москва, г. Московский, ул. Академика Чумакова, д. 6, оф.
          117
        </Typography>
        <Typography align="center" gutterBottom>
          <Link href="tel:+74956659015">+7 (495) 665 9015</Link>
          <br />
          <Link href="tel:+79263853751">+7 (926) 385 3751</Link>
        </Typography>
      </Container>
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(cart, sessionOptions);
