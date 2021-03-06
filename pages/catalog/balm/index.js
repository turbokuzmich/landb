import Item from "../../../components/item";
import { sessionOptions } from "../../../constants";
import { withIronSessionSsr } from "iron-session/next";
import cart from "../../../middleware/cart";

const composition = [
  "Масло ши",
  "Масло какао",
  "Диизостеарил малат",
  "Канделильский воск",
  "Микрокристалический воск",
  "Цетиол ультимэйт",
  "Витамин Е",
  "Арома композиция",
];

export default function Oil({ cart }) {
  return (
    <Item id="balm" cart={cart} composition={composition}>
      Создан по&nbsp;уникальной многоэтапной технологии и&nbsp;имеет лучшие
      органолептические свойства и&nbsp;эффективность. Состоит
      из&nbsp;современных комплексных, сверхэффективных косметических добавок,
      натуральных масел и&nbsp;премиальных видов восков, а&nbsp;также уникальных
      компонентов, придающих средству особые восстанавливающие и&nbsp;защитные
      свойства. Бальзам имеет приятный, нежный аромат и&nbsp;великолепно
      наносится на&nbsp;губы. Применяется, как уходовое и&nbsp;восстанавливающее
      средство для ухода за&nbsp;губами и&nbsp;как ночная маска. Одного
      нанесения хватает на&nbsp;несколько часов, а&nbsp;поверхность губ выглядит
      здоровой и&nbsp;ухоженной. Совершенный бальзам для губ от&nbsp;L&amp;B,
      то&nbsp;чего достойны ваши губы!
    </Item>
  );
}

export const getServerSideProps = withIronSessionSsr(cart, sessionOptions);
