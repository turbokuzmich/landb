import A from "@mui/material/Link";
import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function Menu({ selected, sum = 0 }) {
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <>
        {[
          { title: "Продукция", link: "/catalog" },
          { title: "О нас", link: "/about" },
          { title: "Контакты", link: "/contacts" },
        ].map(({ title, link }) => {
          const isSelected = link === selected;

          return (
            <Link key={link} href={link} passHref>
              <A
                underline="none"
                sx={{
                  height: 100,
                  fontSize: {
                    xs: "18px",
                    sm: "20px",
                  },
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
            underline="none"
            sx={{
              height: 100,
              fontSize: {
                xs: "18px",
                sm: "20px",
              },
              lineHeight: "100px",
              color: selected === "/cart" ? "text.secondary" : "text.disabled",
              transition: "color 0.2s ease-out",
              display: "flex",
              ml: 2,
              alignItems: "center",
              "&:hover": {
                color: "text.primary",
              },
            }}
          >
            <ShoppingCartIcon sx={{ mr: "4px" }} />
            {sum} ₽
          </A>
        </Link>
      </>
    </Container>
  );
}
