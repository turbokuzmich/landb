import A from "@mui/material/Link";
import Link from "next/link";
import Container from "@mui/material/Container";

export default function Menu({ selected }) {
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
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
                height: 50,
                fontSize: "20px",
                lineHeight: "50px",
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
    </Container>
  );
}
