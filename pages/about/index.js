import { Global, css } from "@emotion/react";
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
      <Menu selected="/about" sum={sum} />
      <Container
        sx={{
          mt: {
            xs: 2,
            md: 8,
          },
        }}
      >
        <Paragraph>
          Что является важнейшим критерием в&nbsp;выборе косметических средств?
          Ответ на&nbsp;поверхности&nbsp;&mdash; конечно безопастность
          и&nbsp;эффективность, а&nbsp;если потребитель получает эффективный,
          многоцелевой продукт по&nbsp;приятной стоимости&nbsp;&mdash; это
          приятно вдойне.
        </Paragraph>
        <Paragraph>
          Наша миссия&nbsp;&mdash; подарить прекрасной половине человечества
          возможность получить в&nbsp;работу и&nbsp;в&nbsp;домашний уход
          уникальные и&nbsp;эффективные косметические продукты. Сделать
          качественную косметику доступной и&nbsp;радовать приятными ценами.
        </Paragraph>
        <Paragraph>
          Вас привествует компания по&nbsp;производству косметических средств
          DeLux SPA Ltd. Наша компания работает на&nbsp;рынке с&nbsp;2014 года
          и&nbsp;выпускает косметическую продукцию в&nbsp;том числе
          и&nbsp;на&nbsp;профессиональный рынок косметологии.
          Специалисты-технологи и&nbsp;профессиональные косметологи
          разрабатывают технологичные продукты с&nbsp;максимальным присутсвием
          натуральых органических и&nbsp;высокотехнологичных компонентов для
          получения эффективных составов с&nbsp;высокими органолептическими
          показателями и&nbsp;результативнстью применения.
        </Paragraph>
        <Paragraph>
          LandB (L&amp;B)&nbsp;&mdash; марка косметических продуктов, созданных
          специально для мастеров перманента, бровистов и&nbsp;женщин, уделящих
          особое внимание области губ и&nbsp;бровей. Представленная линейка
          средств универсальна и&nbsp;может применяться для различных целей,
          но&nbsp;об&nbsp;этом&nbsp;Вы сможете подробнее узнать в&nbsp;разделе
          &laquo;Продукция&raquo;, не&nbsp;покидая наш сайт.
        </Paragraph>
        <Paragraph>
          Мы&nbsp;рады знакомству с&nbsp;Вами и&nbsp;надеемся,что наша продукция
          будет радовать Вас и&nbsp;ваших клиентов.
        </Paragraph>
        <Paragraph>С&nbsp;уважением, команда DeluxSPA.</Paragraph>
      </Container>
    </>
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
