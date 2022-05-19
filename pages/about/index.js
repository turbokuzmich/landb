import Head from "next/head";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Layout from "../../components/layout";
import Menu from "../../components/menu";
import { sessionOptions } from "../../constants";
import { withIronSessionSsr } from "iron-session/next";
import cart from "../../middleware/cart";
import useCart from "../../hooks/useCart";

export default function About({ cart }) {
  const { sum } = useCart(cart);

  return (
    <Layout>
      <Head>
        <title key="title">LandB — контакты</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Menu selected="/about" sum={sum} />
      <Container
        sx={{
          mt: {
            xs: 2,
            md: 8,
          },
          pb: 4,
        }}
      >
        <Paragraph>
          Что является важнейшим критерием в&nbsp;выборе косметических средств?
          Ответ на&nbsp;поверхности&nbsp;&mdash; косметика должна быть полезной
          и&nbsp;эффективной. Удобные объёмы и&nbsp;качество нашей продукции
          приятно удивят прекрасных Леди.
        </Paragraph>

        <Paragraph>
          Наша миссия&nbsp;&mdash; дарить женщинам улыбки и&nbsp;уникальные,
          эффективные косметические продукты.
        </Paragraph>

        <Paragraph>
          Вас приветствует компания по&nbsp;производству косметических средств
          DeLuxSPA Ltd. Наши специалисты-технологи разработали для Вас
          экологичные косметические средства с&nbsp;максимальным содержанием
          натуральных органических компонентов.
        </Paragraph>

        <Paragraph>
          LandB (L&amp;B)&nbsp;&mdash; марка косметических продуктов, созданных
          специально для мастеров перманента, бровистов и&nbsp;женщин, уделяющих
          особое внимание области губ и&nbsp;бровей. Представленная линейка
          средств универсальна и&nbsp;может применяться для различных целей,
          но&nbsp;об&nbsp;этом&nbsp;Вы сможете подробнее узнать в&nbsp;разделе
          &laquo;Продукция&raquo;, не&nbsp;покидая наш сайт.
        </Paragraph>

        <Paragraph>
          Не&nbsp;забудьте связаться с&nbsp;нами и&nbsp;узнать условия
          взаимовыгодного сотрудничества.
        </Paragraph>

        <Paragraph>С&nbsp;уважением, LandB.</Paragraph>
      </Container>
    </Layout>
  );
}

function Paragraph({ children }) {
  return (
    <Typography
      sx={{
        fontSize: {
          xs: "1em",
          md: "1.2em",
          lg: "1.3em",
        },
      }}
      paragraph
    >
      {children}
    </Typography>
  );
}

export const getServerSideProps = withIronSessionSsr(cart, sessionOptions);
