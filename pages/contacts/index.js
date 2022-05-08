import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import Layout from "../../components/layout";
import Typography from "@mui/material/Typography";
import Menu from "../../components/menu";
import { sessionOptions } from "../../constants";
import { withIronSessionSsr } from "iron-session/next";
import cart from "../../middleware/cart";
import useCart from "../../hooks/useCart";

export default function About({ cart }) {
  const { sum } = useCart(cart);

  return (
    <Layout>
      <Menu selected="/contacts" sum={sum} />
      <Container>
        <Typography align="center" gutterBottom>
          Россия, г. Москва, г. Московский, ул. Академика Чумакова, д. 6, оф.
          117
        </Typography>
        <Typography
          component="div"
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <Link href="mailto:info@landb.shop">info@landbshop</Link>
          <Link href="tel:+74956659015">+7 (495) 665 9015</Link>
          <Link href="tel:+79263853751">+7 (926) 385 3751</Link>
        </Typography>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withIronSessionSsr(cart, sessionOptions);
